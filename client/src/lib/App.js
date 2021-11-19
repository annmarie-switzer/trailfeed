import React, { createContext, useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import Login from 'pages/login/Login';
import AuthRoute from 'lib/AuthRoute';
import { getUser } from 'api';
import Home from 'pages/home/Home';
import Footer from './Footer';

export const AppContext = createContext(null);

function App() {
    const [user, setUser] = useState(null);
    const [theme, setTheme] = useState(
        localStorage.getItem('theme') ? localStorage.getItem('theme') : 'dark'
    );

    useEffect(() => {
        document.body.dataset.theme = theme;

        getUser()
            .catch(() => setUser(null))
            .then((res) => setUser(res));
    }, []);

    if (user === null) {
        return null;
    }

    return (
        <div
            id="app"
            style={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                boxSizing: 'border-box'
            }}>
            <AppContext.Provider value={{ user, theme, setTheme }}>
                <Switch>
                    <Route exact path="/login">
                        <Login />
                    </Route>
                    <AuthRoute exact user={user} path="/">
                        <Home />
                    </AuthRoute>
                </Switch>

                <Footer user={user} />
            </AppContext.Provider>
        </div>
    );
}

export default App;
