import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import Login from 'components/Login';
import AuthRoute from 'components/AuthRoute';
import { getUser } from 'api';
import Data from 'pages/Data';
import Home from 'pages/Home';
import Logout from 'components/Logout';
import Toolbar from 'components/Toolbar';

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        getUser()
            .catch(() => setUser({}))
            .then(res => setUser(res));

    }, []);

    // Don't render anything until `getUser()` has completed
    if (user === null) {
        return null
    }

    return (
        <div id="app">
            <Toolbar />

            <BrowserRouter>
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
