import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import session from 'express-session';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import createMemoryStore from 'memorystore';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const MemoryStore = createMemoryStore(session);

const app = express();

const serverUrl = process.env.SERVER_URL || process.env.URL;
const clientUrl = process.env.CLIENT_URL || process.env.URL;
const esUrl = process.env.ES_URL;

app.use(express.json());

app.use(
    session({
        cookie: {
            domain: process.env.DOMAIN,
            httpOnly: true,
            sameSite: true,
            // TODO - why is this required for prod
            secure: false
        },
        store: new MemoryStore({
            checkPeriod: 86400000 // prune expired entries every 24h
        }),
        resave: false,
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET,
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

app.get('/callback', async (req, res) => {
    const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            code: req.query.code,
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            redirect_uri: `${serverUrl}/callback`,
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

    res.redirect(clientUrl);
});

app.get('/guest-login', async (req, res) => {
    req.session.profile = {
        guestId: uuidv4()
    };

    res.status(201).json(req.session.profile);
});

app.post('/api/logout', async (req, res) => {
    req.session.destroy(() => res.status(204).end());
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

app.post('/api/es/add-doc', async (req, res) => {
    const headers = { 'Content-Type': 'application/json' };

    try {
        const esRes = await (
            await fetch(`${esUrl}/${req.body.index}/_doc?refresh=true`, {
                method: 'POST',
                body: JSON.stringify(req.body.newDoc),
                headers
            })
        ).json();

        if (esRes.code) {
            res.status(esRes.code).send({
                'Request to cluster failed': esRes.message
            });
        } else if (esRes.error) {
            res.status(esRes.status).send({
                'Bad request': esRes.error.reason
            });
        } else {
            res.status(200).json(esRes);
        }
    } catch (e) {
        res.status(500).send(e);
    }
});

app.post('/api/es/bulk-upload', async (req, res) => {
    const data = req.body;
    const header = { create: {} };
    const ndJson = data
        .flatMap((d) => [header, d])
        .map((d) => JSON.stringify(d))
        .join('\n')
        .concat('\n');

    const headers = { 'Content-Type': 'application/json' };

    try {
        const esRes = await (
            await fetch(`${esUrl}/meals/_bulk`, {
                method: 'POST',
                body: ndJson,
                headers
            })
        ).json();

        if (esRes.code) {
            res.status(esRes.code).send({
                'Request to cluster failed': esRes.message
            });
        } else if (esRes.error) {
            res.status(esRes.status).send({
                'Bad request': esRes.error.reason
            });
        } else {
            res.status(200).send('Upload succeeded.');
        }
    } catch (e) {
        res.status(500).send(e);
    }
});

app.post('/api/es/search', async (req, res) => {
    const headers = { 'Content-Type': 'application/json' };

    try {
        const esRes = await (
            await fetch(`${esUrl}/${req.body.index}/_search`, {
                method: 'POST',
                body: JSON.stringify(req.body.query),
                headers
            })
        ).json();

        if (esRes.code) {
            res.status(esRes.code).send({
                'Request to cluster failed': esRes.message
            });
        } else if (esRes.error) {
            res.status(esRes.status).send({
                'Bad request': esRes.error.reason
            });
        } else {
            res.status(200).json(esRes);
        }
    } catch (e) {
        res.status(500).send(e);
    }
});

app.post('/api/es/update-rating', async (req, res) => {
    const headers = { 'Content-Type': 'application/json' };

    try {
        const esRes = await (
            await fetch(
                `${esUrl}/ratings/_update/${req.body.docId}?refresh=true`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        script: `ctx._source.rating = ${req.body.rating}`
                    }),
                    headers
                }
            )
        ).json();

        if (esRes.code) {
            res.status(esRes.code).send({
                'Request to cluster failed': esRes.message
            });
        } else if (esRes.error) {
            res.status(esRes.status).send({
                'Bad request': esRes.error.reason
            });
        } else {
            res.status(200).json(esRes);
        }
    } catch (e) {
        res.status(500).send(e);
    }
});

// Serve UI
if (process.env.NODE_ENV === 'production') {
    app.get('/*', (req, res) => {
        res.sendFile(path.join(__dirname, 'react/build', 'index.html'));
    });
}

// 404 catch-all
app.all('*', (req, res) => {
    res.status(404).end();
});

// serve
try {
    await fetch(`${esUrl}`);
    app.listen(process.env.PORT, async () => {
        console.log(`~ Server is running at ${serverUrl} ~`);
    });
} catch (_) {
    console.log("Couldn't start server: Elasticsearch could not be reached.");
}
