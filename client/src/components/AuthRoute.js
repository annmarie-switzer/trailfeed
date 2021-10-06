import React from 'react';
import PropTypes from "prop-types";
import { Route, Redirect } from 'react-router-dom';

AuthRoute.propTypes = {
    component: PropTypes.any,
    user: PropTypes.any,
    children: PropTypes.any
}

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