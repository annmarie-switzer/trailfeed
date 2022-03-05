import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import session from 'express-session';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import createMemoryStore from 'memorystore';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const MemoryStore = createMemoryStore(session);

const app = express();

const url = process.env.URL;
const esUrl = process.env.ES_URL;

const authString = Buffer.from(
    `${process.env.ES_USER}:${process.env.ES_PW}`
).toString('base64');

app.use(express.json());

app.use(
    session({
        cookie: {
            domain: process.env.DOMAIN,
            httpOnly: true,
            sameSite: true,
            // TODO
            secure: false
        },
        store: new MemoryStore({
            checkPeriod: 86400000 // prune expired entries every 24h
        }),
        resave: false,
        saveUninitialized: false,
        // TODO
        secret: 'changeme',
        unset: 'destroy'
    })
);

app.use('/api/*', (req, res, next) => {
    if (
        req.session.profile ||
        req.headers.authorization === process.env.API_KEY
    ) {
        next();
    } else {
        res.status(401).end();
    }
});

app.use(express.static(path.join(__dirname, 'react/build')));

// Google OAuth
app.get('/callback', async (req, res) => {
    const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            code: req.query.code,
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            redirect_uri: `${url}/callback`,
            grant_type: 'authorization_code'
        })
    });

    const { access_token, id_token } = await response.json();

    const headerEncoded = id_token.split('.')[0];
    const buff = Buffer.from(headerEncoded, 'base64').toString('binary');
    const kid = JSON.parse(buff).kid;
    const certRes = await fetch('https://www.googleapis.com/oauth2/v1/certs');
    const cert = (await certRes.json())[kid];

    try {
        req.session.profile = jwt.verify(id_token, cert);
    } catch (err) {
        console.error(`Validation Error: ${err}`);
    }

    res.redirect(url);
});

app.post('/api/add-doc', async (req, res) => {
    const headers = { 'Content-Type': 'application/json' };

    if (process.env.NODE !== 'production') {
        headers['Authorization'] = `Basic ${authString}`;
    }

    const esRes = await fetch(`${esUrl}/${req.body.index}/_doc?refresh=true`, {
        method: 'POST',
        body: JSON.stringify(req.body.newDoc),
        headers
    });

    const resJson = await esRes.json();

    if (resJson.error) {
        res.status(400).json(resJson);
    } else {
        res.json(resJson);
    }
});

app.post('/api/bulk-upload', async (req, res) => {
    const data = req.body;
    const header = { create: {} };
    const ndJson = data
        .flatMap((d) => [header, d])
        .map((d) => JSON.stringify(d))
        .join('\n')
        .concat('\n');

    try {
        const headers = { 'Content-Type': 'application/json' };

        console.log('NODE => ', process.env.NODE);

        if (process.env.NODE !== 'production') {
            headers['Authorization'] = `Basic ${authString}`;
        }

        console.log('headers => ', headers);

        const esRes = await (
            await fetch(`${esUrl}/meals/_bulk`, {
                method: 'POST',
                body: ndJson,
                headers
            })
        ).json();

        if (esRes.code && esRes.code === 401) {
            res.status(esRes.code).send({
                'Request to cluster failed': esRes.message
            });
        } else if (esRes.error) {
            res.status(400).send({ 'Bad request': esRes });
        } else {
            res.status(200).send('Upload succeeded.');
        }
    } catch (e) {
        res.status(500).send(e);
    }
});

app.post('/api/logout', async (req, res) => {
    req.session.destroy(() => res.status(204).end());
});

app.post('/api/search', async (req, res) => {
    const headers = { 'Content-Type': 'application/json' };

    if (process.env.NODE !== 'production') {
        headers['Authorization'] = `Basic ${authString}`;
    }

    const esRes = await fetch(`${esUrl}/${req.body.index}/_search`, {
        method: 'POST',
        body: JSON.stringify(req.body.query),
        headers
    });

    res.json(await esRes.json());
});

app.post('/api/update-rating', async (req, res) => {
    const headers = { 'Content-Type': 'application/json' };

    if (process.env.NODE !== 'production') {
        headers['Authorization'] = `Basic ${authString}`;
    }

    const esRes = await fetch(
        `${esUrl}/ratings/_update/${req.body.docId}?refresh=true`,
        {
            method: 'POST',
            body: JSON.stringify({
                script: `ctx._source.rating = ${req.body.rating}`
            }),
            headers
        }
    );

    res.json(await esRes.json());
});

app.get('/api/user', async (req, res) => {
    if (req.session.profile) {
        res.json({
            email: req.session.profile.email,
            familyName: req.session.profile.family_name,
            givenName: req.session.profile.given_name,
            locale: req.session.profile.locale,
            name: req.session.profile.name,
            picture: req.session.profile.picture
        });
    } else {
        res.status(401).end();
    }
});

// Serve UI
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'react/build', 'index.html'));
});

// 404 catch-all
app.all('*', (req, res) => {
    res.status(404).end();
});

// serve
try {
    await fetch(`${esUrl}`);
    app.listen(process.env.PORT, async () => {
        console.log(`~ Server is running at ${url} ~`);
    });
} catch (_) {
    console.log("Couldn't start server: Elasticsearch could not be reached.");
}
