import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { data } from './data.js';
import session from 'express-session';
import cors from 'cors';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const serverUrl = 'http://localhost:5000';
const clientUrl = 'http://localhost:3000';

app.use(cors({
    origin: clientUrl,
    credentials: true,
    optionsSuccessStatus: 200
}))

app.use(session({
    cookie: {
        domain: 'localhost',
        httpOnly: true,
        sameSite: true,
        secure: process.env.NODE_ENV === 'production',
    },
    resave: false,
    saveUninitialized: false,
    secret: 'changeme',
    unset: 'destroy'
}))

app.use((req, res, next) => {
    if (req.session['profile'] || req.path.includes('callback')) {
        next();
    } else {
        res.status(401).end(); 
    }
})

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
})

app.post('/logout', async (req, res) => {
    req.session.destroy(() => res.status(204).end());
})

app.get('/data', async (req, res) => {
    res.json(data);
})

app.all('*', (req, res) => {
    res.status(404).end();
})

app.listen(port, () => {
    console.log(`~ Server is running at http://127.0.0.1:${port} ~`);
})



// REFERENCE

// // The /userinfo endpoint can be used to validate an access token.
// // If the token is valid, returns 200 with user profile info.
// // Otherwise, returns 401.
// app.get('/userinfo', async (req, res) => {
//     const accessToken = req.session['accessToken'];
//     console.log('accessToken => ', accessToken);

//     const userInfoRes = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
//         headers: { 'Authorization': `Bearer ${accessToken}` }
//     });

//     console.log('status => ', userInfoRes.status);
//     console.log('status text => ', userInfoRes.statusText);
//     console.log('body => ', await userInfoRes.json());
// })

// // Revokes an access token.
// app.get('/revoke', async (req, res) => {
//     const accessToken = req.session['accessToken'];
//     const revokeUrl = `https://oauth2.googleapis.com/revoke?token=${accessToken}`;

//     const revokeRes = await fetch(revokeUrl, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
//     });

//     console.log(revokeRes.status);
// })
