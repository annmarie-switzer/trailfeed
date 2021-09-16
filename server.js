import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { data } from './data.js';
import session from 'express-session';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use(session({
    resave: true,
    saveUninitialized: false, // this should be ok for authenticated users
    secret: 'changeme',
    cookie: {
        httpOnly: true,
        secure: false, // change for production
        sameSite: true,
        domain: 'localhost',
        maxAge: 86400000 // 24 hours
    }
}));



// endpoints
app.get('/get', (req, res) => {
    console.log(req.session.id);
    res.json(data);
});

app.get('/callback', async (req, res) => {
    const resFromGoogle = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            code: req.query.code,
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            redirect_uri: 'http://localhost:5000/callback',
            grant_type: 'authorization_code'
        })
    });

    // TODO - set up a store so we can save these token with the session id
    // - when authenticated user makes a request, we should be able to use their session id to get their tokens
    // - access token can be used to check with Google if the user is still "valid".
    // - id token can be parsed to provide info like name, email, etc.
    const { access_token, id_token } = await resFromGoogle.json();

    res.redirect(`http://localhost:3000`);
})

app.all('*', (req, res) => {
    res.status(404).json({ message: 'Not found' });
});



// server
app.listen(port, () => {
    console.log(`~ Server is running at http://127.0.0.1:${port} ~`);
});
