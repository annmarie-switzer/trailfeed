import React from 'react';
import './Login.css';
import GoogleIcon from 'components/icons/GoogleIcon';

function Login() {
    const navigate = () => {
        window.location.href = "https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=604221561004-1c4rk34opibu8f52qrgmob6t30794e53.apps.googleusercontent.com&scope=openid%20profile%20email&redirect_uri=http%3A//localhost:5000/callback&state=changeme&nonce=changemetoo&prompt=select_account";
    }
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
    )
}
export default Login;