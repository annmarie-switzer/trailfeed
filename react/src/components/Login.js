import React, { useContext, useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { AppContext } from 'components/App';
import GoogleIcon from 'components/icons/GoogleIcon';
import { User } from 'react-feather';

function Login() {
    const navigate = useNavigate();
    const { setUser } = useContext(AppContext);

    const [showTooltip, setShowTooltip] = useState(false);

    const googleLogin = () => {
        window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${process.env.REACT_APP_CLIENT_ID}&scope=openid%20profile%20email&redirect_uri=${process.env.REACT_APP_URL}/callback&state=changeme&nonce=changemetoo&prompt=select_account`;
    };

    const guestLogin = async () => {
        const res = await fetch('/guest-login');
        if (res.status === 201) {
            setUser(res);
            navigate('/');
        } else {
            // TODO
            console.log("That didn't work");
        }
    };

    return (
        <div id="login">
            <h1>Welcome to Trailfeed.</h1>

            <div id="buttons">
                <button type="button" onClick={googleLogin}>
                    <GoogleIcon />
                    Login with Google
                </button>

                <div
                    id="guest-button-container"
                    onMouseOver={() => {
                        setTimeout(() => {
                            setShowTooltip(true)
                        }, 750);
                    }}
                    onMouseOut={() => setShowTooltip(false)}>
                    <button type="button" onClick={guestLogin}>
                        <User />
                        Login as Guest
                    </button>
                    <div id="tooltip" className={showTooltip ? 'show' : ''}>
                        As a guest, you can search and add meals to your pack, but you
                        can not rate or make custom meals.
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Login;
