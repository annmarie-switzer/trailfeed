import React from "react";
import { Link } from "react-router-dom";
import ThemeSwitcher from "./ThemeSwitcher";
import Logout from 'components/Logout';

function Toolbar() {
    return (
        <div id="toolbar">
            <nav>
                <Link className="nav-link" to="/">Home</Link>
                <Link className="nav-link" to="/data">Data</Link>
            </nav>
            <ThemeSwitcher />

            <Logout />
        </div>
    )
}

export default Toolbar;