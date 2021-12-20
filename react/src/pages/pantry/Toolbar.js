import React, { useEffect, useContext, useState } from 'react';
import { AppContext } from 'lib/App';
import { logout } from 'api';
import ThemeSwitcher from '../../lib/ThemeSwitcher';
import Stats from '../../lib/Stats';
import { FileText, LogOut, Settings } from 'react-feather';
import BackpackIcon from 'lib/icons/BackpackIcon';

function Toolbar({ packOpen, setPackOpen, selection }) {
    const { user } = useContext(AppContext);

    const [menuOpen, setMenuOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <div id="toolbar">
            <div className="wrapper">
                <div className="left">
                    <button
                        type="button"
                        className={
                            menuOpen ? 'menu-trigger open' : 'menu-trigger'
                        }
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <Settings />
                        {menuOpen ? (
                            <div className="menu">
                                <ThemeSwitcher />

                                <button
                                    type="button"
                                    id="logout"
                                    title="Logout"
                                    onClick={logout}
                                >
                                    <span>{user.email}</span>
                                    <LogOut color="currentColor" />
                                </button>
                            </div>
                        ) : null}
                    </button>
                    <button
                        type="button"
                        title="Create Custom Meal"
                        onClick={() => setModalOpen(true)}
                    >
                        <FileText color="currentColor" />
                    </button>
                </div>

                <div className="stat-container">
                    <Stats selection={selection} />
                </div>

                <button
                    type="button"
                    id="pack-button"
                    className={packOpen ? 'open' : ''}
                    title={packOpen ? 'Close Pack' : 'Open Pack'}
                    onClick={() => setPackOpen(!packOpen)}
                >
                    <div>
                        <BackpackIcon size={28} />
                        {selection.length > 0 ? (
                            <span className="badge">{selection.length}</span>
                        ) : null}
                    </div>
                </button>
            </div>
        </div>
    );
}

export default Toolbar;
