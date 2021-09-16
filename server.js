import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { data } from './data.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.get('/get', (req, res) => {
    res.json(data);
});

app.get('/es', async (req, res) => {
    const response = await fetch('http://localhost:9200');
    const data = await response.json();
    res.json(data);
});

app.get('/callback', async (req, res) => {
    const resFromGoogle = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            code: req.query.code,
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            redirect_uri: 'http://localhost:5000/callback',
            grant_type: 'authorization_code'
        })
    });

    const {access_token, id_token} = (await resFromGoogle.json());

    // TODO - redirect to UI with tokens
})

app.all('*', (req, res) => {
    res.status(404).json({ message: 'Not found' });
});

app.listen(port, () => {
    console.log(`~ Server is running at http://127.0.0.1:${port} ~`);
});
