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
        <button
            id="theme-switcher"
            type="button"
            className={theme}
            onClick={() => selectTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'light' ? (
                <MoonIcon width={24} height={24} stroke="var(--fg4)" />
            ) : (
                <SunIcon width={24} height={24} stroke="var(--fg4)" />
            )}
        </button>
    );
}

export default ThemeSwitcher;
