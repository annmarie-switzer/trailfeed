import React from 'react';
import { logout } from 'api';
import ThemeSwitcher from './ThemeSwitcher';
import LogoutIcon from './icons/LogoutIcon';

function Navbar(props) {
    const { theme, user } = props;

    return (
        <div id="navbar">
            <ThemeSwitcher theme={theme} />

            {user ? (
                <>
                    <div className="vr"></div>
                    <button
                        type="button"
                        id="logout"
                        title="Logout"
                        onClick={logout}>
                        <LogoutIcon
                            width={24}
                            height={24}
                            stroke="currentColor"
                            // style={{ transform: 'scaleX(-1)' }}
                        />
                        {/* <span>{props.user.email}</span> */}
                    </button>
                </>
            ) : null}
        </div>
    );
}

export default Navbar;
