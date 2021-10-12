import GoogleIcon from 'icons/GoogleIcon';
import React from 'react';

function Login() {
    return (
        <div id="login">
            <button type="button">
                <span className="icon">
                    <GoogleIcon />
                </span>
                <a href="https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=604221561004-1c4rk34opibu8f52qrgmob6t30794e53.apps.googleusercontent.com&scope=openid%20profile%20email&redirect_uri=http%3A//localhost:5000/callback&state=changeme&nonce=changemetoo&prompt=select_account">
                    Login with Google
                </a>
            </button>
        </div>
    )
}
export default Login;