import React, { useContext } from 'react';
import { AppContext } from 'lib/App';
import { Moon, Sun } from 'react-feather';

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
                <Moon width={24} height={24} stroke="var(--fg0)" />
            ) : (
                <Sun width={24} height={24} stroke="var(--fg0)" />
            )}
        </button>
    );
}

export default ThemeSwitcher;
