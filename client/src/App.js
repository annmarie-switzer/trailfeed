import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import Login from 'pages/Login';
import AuthRoute from 'components/AuthRoute';
import { getUser } from 'api';
import Data from 'pages/Data';
import Home from 'pages/Home';
import ThemeSwitcher from "./components/ThemeSwitcher";
import { logout } from "api";

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        getUser()
            .catch(() => setUser({}))
            .then(res => setUser(res));

    }, []);

    if (user === null) {
        return null
    }

    return (
        <div id="app">
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
                {user ?
                    <button
                        id="logout-button"
                        className="tooltip-trigger"
                        type="button"
                        onClick={logout}>
                        <span>{user.email}</span>
                        <span className="tooltip above">Logout</span>
                    </button>
                    : null
                }
                <ThemeSwitcher />
            </div>
        </div>
    );
}

export default App;
