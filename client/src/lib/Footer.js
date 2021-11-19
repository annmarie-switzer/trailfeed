import React from 'react';
import { logout } from 'api';
import ThemeSwitcher from './ThemeSwitcher';
import LogoutIcon from './icons/LogoutIcon';

function Footer(props) {
    const { theme, user } = props;

    return (
        <div id="footer">
            {user ? (
                <button
                    type="button"
                    id="logout"
                    title="Logout"
                    onClick={logout}>
                    <LogoutIcon
                        width={24}
                        height={24}
                        stroke="currentColor"
                        style={{ transform: 'scaleX(-1)' }}
                    />
                    <span>{props.user.email}</span>
                </button>
            ) : null}
            <ThemeSwitcher theme={theme} />
        </div>
    );
}

export default Footer;
