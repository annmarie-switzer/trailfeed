import React from 'react';
import { logout } from 'api';
import ThemeSwitcher from './ThemeSwitcher';
import { LogOut } from 'react-feather';

function Navbar(props) {
    const { theme } = props;

    return (
        <div id="navbar">
            <ThemeSwitcher theme={theme} />

            <button type="button" id="logout" title="Logout" onClick={logout}>
                <span>{props.user.email}</span>
                <LogOut stroke="currentColor" />
            </button>
        </div>
    );
}

export default Navbar;
