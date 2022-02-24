import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import session from 'express-session';
import cors from 'cors';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();

const port = process.env.PORT;
const serverUrl = process.env.SERVER_URL;
const clientUrl = process.env.CLIENT_URL;
const esUrl = process.env.ES_URL;
const authString = Buffer.from(
    `${process.env.ES_USER}:${process.env.ES_PW}`
).toString('base64');

app.use(express.json());

app.use(
    cors({
        origin: clientUrl,
        credentials: true,
        optionsSuccessStatus: 200
    })
);

app.use(
    session({
        cookie: {
            domain: process.env.DOMAIN,
            httpOnly: true,
            sameSite: true,
            secure: process.env.NODE_ENV === 'production'
        },
        resave: false,
        saveUninitialized: false,
        // TODO
        secret: 'changeme',
        unset: 'destroy'
    })
);

// TODO - secure `bulk-upload`
app.use((req, res, next) => {
    if (
        req.session['profile'] ||
        req.path.includes('callback') ||
        req.path.includes('bulk-upload')
    ) {
        next();
    } else {
        res.status(401).end();
    }
});

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
        req.session['profile'] = jwt.verify(id_token, cert);
    } catch (err) {
        console.error(`Validation Error: ${err}`);
    }

    res.redirect(clientUrl);
});

app.post('/logout', async (req, res) => {
    req.session.destroy(() => res.status(204).end());
});

app.get('/user', async (req, res) => {
    res.json({
        email: req.session['profile']['email'],
        familyName: req.session['profile']['family_name'],
        givenName: req.session['profile']['given_name'],
        locale: req.session['profile']['locale'],
        name: req.session['profile']['name'],
        picture: req.session['profile']['picture']
    });
});

app.post('/bulk-upload', async (req, res) => {
    const data = req.body;
    const header = { create: {} };
    const ndJson = data
        .flatMap((d) => [header, d])
        .map((d) => JSON.stringify(d))
        .join('\n')
        .concat('\n');

    const esRes = await (
        await fetch(`${esUrl}/meals/_bulk`, {
            method: 'POST',
            body: ndJson,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Basic ${authString}`
            }
        })
    ).json();

    if (esRes.error) {
        res.status(400).send({ 'Bulk upload failed ': esRes });
    } else {
        res.status(200).end();
    }
});

app.post('/search', async (req, res) => {
    const esRes = await fetch(`${esUrl}/${req.body.index}/_search`, {
        method: 'POST',
        body: JSON.stringify(req.body.query),
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${authString}`
        }
    });

    res.json(await esRes.json());
});

app.post('/update-rating', async (req, res) => {
    const esRes = await fetch(`${esUrl}/ratings/_update/${req.body.docId}?refresh=true`, {
        method: 'POST',
        body: JSON.stringify({
            script: `ctx._source.rating = ${req.body.rating}`
        }),
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${authString}`
        }
    });

    res.json(await esRes.json());
});

app.post('/add-doc', async (req, res) => {
    const esRes = await fetch(`${esUrl}/${req.body.index}/_doc?refresh=true`, {
        method: 'POST',
        body: JSON.stringify(req.body.newDoc),
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${authString}`
        }
    });

    const resJson = await esRes.json();

    if (resJson.error) {
        res.status(400).json(resJson);
    } else {
        res.json(resJson);
    }

});

app.all('*', (req, res) => {
    res.status(404).end();
});

try {
    await fetch(`${esUrl}`);
    app.listen(port, async () => {
        console.log(`~ Server is running at ${serverUrl} ~`);
    });
} catch (_) {
    console.log("Couldn't start server: Elasticsearch could not be reached.");
}
