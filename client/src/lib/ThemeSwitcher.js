import React, { useContext } from 'react';
import { AppContext } from 'lib/App';
import SunIcon from 'lib/icons/SunIcon';
import MoonIcon from 'lib/icons/MoonIcon';

function ThemeSwitcher(props) {
    const { theme, setTheme } = useContext(AppContext);

    const selectTheme = (t) => {
        setTheme(t);
        localStorage.setItem('theme', t);
        document.body.dataset.theme = t;
    };

    return (
        <div id="theme-switcher">
            {theme === 'light' ? (
                <button
                    type="button"
                    className={theme === 'light' ? 'selected' : ''}
                    onClick={() => selectTheme('dark')}>
                    <MoonIcon width={24} height={24} stroke="var(--fg4)" />
                </button>
            ) : (
                <button
                    type="button"
                    className={theme === 'dark' ? 'selected' : ''}
                    onClick={() => selectTheme('light')}>
                    <SunIcon width={24} height={24} stroke="var(--fg4)" />
                </button>
            )}
        </div>
    );
}

export default ThemeSwitcher;
