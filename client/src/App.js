import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from 'Home';
import Data from 'Data';

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
        const res = await fetch('http://localhost:5000/user', { credentials: 'include' });
        console.log(await res.json());
    }

    const logout = async () => {
        const res = await fetch('http://localhost:5000/logout', { method: 'POST', credentials: 'include' });
        console.log(res.status);
    }

    return (
        <div id="app">
            <div id="toolbar">
                <div className="toggle-buttons">
                    {buttons}
                </div>
            </div>

            <BrowserRouter>
                <Switch>
                    <Route path="/data">
                        <Data />
                    </Route>
                    <Route path="/">
                        <Home />
                    </Route>
                </Switch>
            </BrowserRouter>

            <div id="footer">
                <button type="button" onClick={getUser}>Who am I?</button>
                <button type="button" onClick={logout}>Logout</button>
            </div>
        </div>
    );
}

export default App;
