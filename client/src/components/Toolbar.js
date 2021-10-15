import React from "react";
// import { Link } from "react-router-dom";
import ThemeSwitcher from "./ThemeSwitcher";
import { logout } from "api";
import PowerIcon from "icons/PowerIcon";

function Toolbar(props) {
    console.log(props.user);

    return (
        <div id="toolbar">
            {/* <nav>
                <Link className="nav-link" to="/">Home</Link>
                <Link className="nav-link" to="/data">Data</Link>
            </nav> */}
            <button id="logout-button" type="button" onClick={logout}>
                <span>{props.user.email}</span>
                <span className="icon">
                    <PowerIcon width={20} height={20}/>
                </span>
            </button>
            <ThemeSwitcher />
        </div>
    )
}

export default Toolbar;