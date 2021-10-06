import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import Login from 'components/Login';
import AuthRoute from 'components/AuthRoute';
import { getUser } from 'api';
import Data from 'pages/Data';
import Home from 'pages/Home';
import Logout from 'components/Logout';

function App() {
    const storedTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : 'dark';
    const [theme, setTheme] = useState(storedTheme);
    const [user, setUser] = useState(null);

    useEffect(() => {
        localStorage.setItem('theme', theme);
        document.documentElement.setAttribute('data-theme', theme);

        getUser()
            .catch(() => setUser({}))
            .then(res => setUser(res));

    }, [theme]);

    if (user === null) {
        return null
    }

    return (
        <div id="app">
            <BrowserRouter>
                <div id="toolbar">
                    <div className="toggle-buttons">
                        <button
                            key="light"
                            type="button"
                            className={theme == 'light' ? 'selected' : ''}
                            onClick={() => setTheme('light')}>
                            Light
                        </button>
                        <button
                            key="dark"
                            type="button"
                            className={theme == 'dark' ? 'selected' : ''}
                            onClick={() => setTheme('dark')}>
                            Dark
                        </button>
                    </div>
                </div>

                <pre>{JSON.stringify(user, null, 2)}</pre>

                <nav>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/data">Data</Link></li>
                    </ul>
                </nav>

                <Switch>
                    <Route exact path="/login">
                        <Login />
                    </Route>
                    <AuthRoute exact user={user} path='/data'>
                        <Data />
                    </AuthRoute>
                    <AuthRoute exact user={user} path='/'>
                        <Home />
                    </AuthRoute>
                </Switch>

                <div id="footer">
                    <Logout />
                </div>
            </BrowserRouter>
        </div>
    );
}

export default App;
