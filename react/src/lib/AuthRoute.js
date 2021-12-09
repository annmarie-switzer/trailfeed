import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AppContext } from 'lib/App';

function AuthRoute({ children, ...rest }) {
    const { user } = useContext(AppContext);
    return (
        <Route
            {...rest}
            render={() => {
                return user ? children : <Redirect to="/login" />;
            }}
        />
    );
}

export default AuthRoute;
