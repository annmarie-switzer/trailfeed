import React, { useEffect, useState } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import Login from 'components/Login';
import AuthRoute from 'components/AuthRoute';
import { getUser } from 'api';
import Data from 'pages/Data';
import Home from 'pages/Home';
import Toolbar from 'components/Toolbar';

function App() {
    const [user, setUser] = useState(null);
    const location = useLocation();
    
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
            
                {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}

                { location.pathname !== '/login' ? <Toolbar /> : null }

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
            
        </div>
    );
}

export default App;
