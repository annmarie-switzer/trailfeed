import React, { useEffect, useContext, useState } from 'react';
import { logout } from 'api';
import ThemeSwitcher from '../../lib/ThemeSwitcher';
import {
    Activity,
    Droplet,
    FileText,
    LogOut,
    Settings,
    Watch
} from 'react-feather';
import { AppContext } from 'lib/App';
import BackpackIcon from 'lib/icons/BackpackIcon';

function Toolbar(props) {
    const { packOpen, setPackOpen, selection } = props;

    const { user } = useContext(AppContext);

    const [menuOpen, setMenuOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    const [totalCalories, setTotalCalories] = useState(0);
    const [totalWater, setTotalWater] = useState(0);
    const [totalTime, setTotalTime] = useState(0);

    const [currentStat, setStat] = useState(0);
    const stats = [
        {
            name: 'Calories',
            val: totalCalories,
            suffix: '',
            icon: <Activity color="var(--ct-orange)" />
        },
        {
            name: 'Water',
            val: totalWater,
            suffix: 'mL',
            icon: <Droplet color="var(--blue)" />
        },
        {
            name: 'Time',
            val: totalTime,
            suffix: 'minutes',
            icon: <Watch color="var(--green)" />
        }
    ];

    const cycleStats = () => {
        if (currentStat == stats.length - 1) {
            setStat(0);
        } else {
            setStat(currentStat + 1);
        }
    };

    useEffect(() => {
        setTotalCalories(
            selection
                .map((s) => s.calories)
                .reduce((total, next) => total + next, 0)
        );

        setTotalWater(
            selection
                .map((s) => s.water_ml)
                .reduce((total, next) => total + next, 0)
        );

        setTotalTime(
            selection
                .map((s) => s.minutes)
                .reduce((total, next) => total + next, 0)
        );
    }, [selection]);

    return (
        <div id="toolbar">
            <div className="wrapper">
                <div className="left">
                    <button
                        type="button"
                        className={
                            menuOpen ? 'menu-trigger open' : 'menu-trigger'
                        }
                        onClick={() => setMenuOpen(!menuOpen)}>
                        <Settings />
                        {menuOpen ? (
                            <div className="menu">
                                <ThemeSwitcher />

                                <button
                                    type="button"
                                    id="logout"
                                    title="Logout"
                                    onClick={logout}>
                                    <span>{user.email}</span>
                                    <LogOut color="currentColor" />
                                </button>
                            </div>
                        ) : null}
                    </button>
                    <button
                        type="button"
                        title="Create Custom Meal"
                        onClick={() => setModalOpen(true)}>
                        <FileText color="currentColor" />
                    </button>
                </div>

                <div className="stat-counter">
                    <div className="stat-clicker" onClick={cycleStats}>
                        {stats[currentStat].icon}
                    </div>
                    <span>
                        Total {stats[currentStat].name}
                        :&nbsp;{stats[currentStat].val.toLocaleString()}&nbsp;
                        {stats[currentStat].suffix}
                    </span>
                </div>

                <button
                    type="button"
                    id="pack-button"
                    className={packOpen ? 'open' : ''}
                    title={packOpen ? 'Close Pack' : 'Open Pack'}
                    onClick={() => setPackOpen(!packOpen)}>
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
