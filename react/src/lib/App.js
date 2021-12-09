import React, { createContext, useEffect, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { getUser } from 'api';
import Login from 'pages/login/Login';
import Pantry from 'pages/pantry/Pantry';
import AuthRoute from 'lib/AuthRoute';

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
                height: '100vh'
            }}>
            <AppContext.Provider value={{ user, theme, setTheme }}>
                <Switch>
                    <Route exact path="/login">
                        <Login />
                    </Route>
                    <AuthRoute exact path="/">
                        <Pantry />
                    </AuthRoute>
                </Switch>
            </AppContext.Provider>
        </div>
    );
}

export default App;
