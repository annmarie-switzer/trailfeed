import { Dispatch, SetStateAction, useContext } from 'react';
import './Toolbar.css';
import { useNavigate } from 'react-router-dom';
import { logout } from '../api';
import { ThemeSwitcher } from './ThemeSwitcher';
import { Stats } from './Stats';
import { FileText, LogOut } from 'react-feather';
import { AppContext } from './App';
import { BackpackIcon } from './icons/BackpackIcon';

type ToolbarProps = {
    packOpen: boolean;
    setPackOpen: Dispatch<SetStateAction<boolean>>;
    selection: any[];
};

export const Toolbar = ({ packOpen, setPackOpen, selection }: ToolbarProps) => {
    const navigate = useNavigate();
    const { user } = useContext(AppContext);

    return (
        <div id="toolbar">
            <div className="left">
                <button
                    type="button"
                    id="logout"
                    title="Logout"
                    onClick={logout}
                >
                    <LogOut style={{ transform: 'scaleX(-1)' }} />
                </button>
                <ThemeSwitcher />
            </div>

            <Stats selection={selection} />

            <div className="right">
                <button
                    type="button"
                    className={!user.email ? 'disabled' : ''}
                    title={
                        user.email
                            ? 'Create custom meal'
                            : 'You must log in to create custom meals.'
                    }
                    onClick={() => (user.email ? navigate('/new-meal') : null)}
                >
                    <FileText />
                </button>

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
};
