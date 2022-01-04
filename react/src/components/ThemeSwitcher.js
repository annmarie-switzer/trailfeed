import React, { useContext } from 'react';
import { AppContext } from 'components/App';
import { Moon, Sun } from 'react-feather';

function ThemeSwitcher() {
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
            title={
                theme === 'dark'
                    ? 'Switch to light theme'
                    : 'Switch to dark theme'
            }
            className={theme}
            onClick={() => selectTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'light' ? <Moon /> : <Sun />}
        </button>
    );
}

export default ThemeSwitcher;
