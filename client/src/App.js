import React, { useEffect, useState } from 'react';
import Clock from './Clock';

function App() {
    const storedTheme = localStorage.getItem('theme') ?
        localStorage.getItem('theme') : 
        'dark';
    const themes = ['light', 'dark'];
    const [theme, setTheme] = useState(storedTheme);

    const buttons = themes.map((t, i) => (
        <button
            key={i}
            type="button"
            className={theme == t ? 'selected' : ''}
            onClick={() => setTheme(t)}>
            {t.toUpperCase()}
        </button>
    ));

    useEffect(() => {
        localStorage.setItem('theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
    });

    const getUser = async () => {
        const res = await fetch ('http://localhost:5000/user', { credentials: 'include' });
        console.log(await res.json());
    }

    const logout = async () => {
        const res = await fetch ('http://localhost:5000/logout', { method: 'POST', credentials: 'include' });
        console.log(res.status);
    }

    return (
        <div className='App'>
            <div className="toggle-buttons">
                {buttons}
            </div>

            <Clock date={new Date()} />

            <a href="https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=604221561004-1c4rk34opibu8f52qrgmob6t30794e53.apps.googleusercontent.com&scope=openid%20profile%20email&redirect_uri=http%3A//localhost:5000/callback&state=changeme&nonce=changemetoo&prompt=select_account">
                Login with Google
            </a>

            <button type="button" onClick={getUser}>Who am I?</button>

            <button type="button" onClick={logout}>Logout</button>
        </div>
    );
}

export default App;
