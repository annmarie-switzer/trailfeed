import React, { useContext } from 'react';
import './Toolbar.css';
import { useNavigate } from 'react-router-dom';
import { logout } from 'api';
import ThemeSwitcher from '../components/ThemeSwitcher';
import Stats from '../components/Stats';
import { FileText, LogOut } from 'react-feather';
import BackpackIcon from 'components/icons/BackpackIcon';
import { AppContext } from './App';

function Toolbar({ packOpen, setPackOpen, selection }) {
    const navigate = useNavigate();
    const { user } = useContext(AppContext);

    return (
        <div id="toolbar">
            <div className="wrapper">
                <div className="left">
                    <button
                        type="button"
                        id="logout"
                        title="Logout"
                        onClick={logout}>
                        <LogOut style={{ transform: 'scaleX(-1)' }} />
                    </button>
                    <ThemeSwitcher />
                </div>

                <div className="stat-container">
                    <Stats selection={selection} />
                </div>

                <div className="right">
                    <button
                        type="button"
                        className={!user.email ? 'disabled' : ''}
                        title={
                            user.email
                                ? 'Create custom meal'
                                : 'You must log in to create custom meals.'
                        }
                        onClick={() =>
                            user.email ? navigate('/new-meal') : null
                        }>
                        <FileText />
                    </button>

                    <button
                        type="button"
                        id="pack-button"
                        className={packOpen ? 'open' : ''}
                        title={packOpen ? 'Close Pack' : 'Open Pack'}
                        onClick={() => setPackOpen(!packOpen)}>
                        <div>
                            <BackpackIcon size={28} />
                            {selection.length > 0 ? (
                                <span className="badge">
                                    {selection.length}
                                </span>
                            ) : null}
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Toolbar;
