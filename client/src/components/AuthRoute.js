import React from 'react';
import { Route, Redirect } from 'react-router-dom';

function AuthRoute({ children, user, ...rest }) {
    return (
        <Route {...rest} render={() => {
            return user
                ? children
                : <Redirect to='/login' />
        }} />
    )
}

export default AuthRoute;