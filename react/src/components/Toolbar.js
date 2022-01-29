import React from 'react';
import './Toolbar.css';
import { useNavigate } from 'react-router-dom';
import { logout } from 'api';
import ThemeSwitcher from '../components/ThemeSwitcher';
import Stats from '../components/Stats';
import { FileText, LogOut } from 'react-feather';
import BackpackIcon from 'components/icons/BackpackIcon';

function Toolbar({ packOpen, setPackOpen, selection }) {
    const navigate = useNavigate();

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
                        title="Create Custom Meal"
                        onClick={() => navigate('/new-meal')}>
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
