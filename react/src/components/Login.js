import React from 'react';
import './Login.css';
import GoogleIcon from 'components/icons/GoogleIcon';

function Login() {
    const navigate = () => {
        window.location.href =
            `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${process.env.REACT_APP_CLIENT_ID}&scope=openid%20profile%20email&redirect_uri=${process.env.REACT_APP_URL}/callback&state=changeme&nonce=changemetoo&prompt=select_account`;
    };

    return (
        <div id="login">
            <h1>Welcome to Trailfeed.</h1>

            <button type="button" onClick={navigate}>
                <span className="icon">
                    <GoogleIcon />
                </span>
                Login with Google
            </button>
        </div>
    );
}
export default Login;
