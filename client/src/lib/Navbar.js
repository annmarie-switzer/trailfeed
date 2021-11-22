import React from 'react';
import { logout } from 'api';
import ThemeSwitcher from './ThemeSwitcher';
import { LogOut, Database } from 'react-feather';
import BackpackIcon from 'static/icons/BackpackIcon';

function Navbar(props) {
    const { theme, user } = props;

    return (
        <div id="navbar">
            <ThemeSwitcher theme={theme} />

            <button type="button" id="pack-button">
                <BackpackIcon />
                <span>View Pack</span>
            </button>

            <button type="button" id="logout" title="Logout" onClick={logout}>
                <span>{props.user.email}</span>
                <LogOut stroke="currentColor" />
            </button>
        </div>
    );
}

export default Navbar;
