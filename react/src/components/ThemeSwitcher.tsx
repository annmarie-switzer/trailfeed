import { useContext } from 'react';
import './ThemeSwitcher.css';
import { Moon, Sun } from 'react-feather';
import { AppContext } from './App';

export const ThemeSwitcher = () => {
    const { theme, setTheme } = useContext(AppContext);

    const selectTheme = (t: string) => {
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
