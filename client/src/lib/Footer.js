import React from 'react';
import { logout } from 'api';
import ThemeSwitcher from './ThemeSwitcher';
import PowerIcon from './icons/PowerIcon';

function Footer(props) {
    return (
        <div id="footer">
            {props.user ? (
                <div id="logout" title="Logout">
                    <button type="button" onClick={logout}>
                        <PowerIcon
                            width={24}
                            height={24}
                            stroke="currentColor"
                        />
                    </button>
                    <span>{props.user.email}</span>
                </div>
            ) : null}
            <ThemeSwitcher />
        </div>
    );
}

export default Footer;
