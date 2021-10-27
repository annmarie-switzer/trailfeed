import React, { createContext, useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import Login from 'pages/login/Login';
import AuthRoute from 'shared/AuthRoute';
import { getUser } from 'api';
import Home from 'pages/home/Home';
import ThemeSwitcher from "./ThemeSwitcher";
import { logout } from "api";

export const AppContext = createContext(null);

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
            <AppContext.Provider value={user}>
                <Switch>
                    <Route exact path="/login">
                        <Login />
                    </Route>
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
            </AppContext.Provider>
        </div>
    );
}

export default App;
