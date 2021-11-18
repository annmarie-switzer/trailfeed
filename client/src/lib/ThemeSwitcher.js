import React, { useState } from 'react';
import SunIcon from 'lib/icons/SunIcon';
import MoonIcon from 'lib/icons/MoonIcon';

function ThemeSwitcher() {
    const storedTheme = localStorage.getItem('theme')
        ? localStorage.getItem('theme')
        : 'dark';

    const [theme, setTheme] = useState(storedTheme);

    const selectTheme = (t) => {
        setTheme(t);
        localStorage.setItem('theme', t);
        document.body.setAttribute('data-theme', t);
    };

    return (
        <div id="theme-switcher">
            {theme == 'light' ? (
                <button
                    type="button"
                    className={theme == 'light' ? 'selected' : ''}
                    onClick={() => selectTheme('dark')}>
                    <MoonIcon stroke="var(--fg4)" />
                </button>
            ) : (
                <button
                    type="button"
                    className={theme == 'dark' ? 'selected' : ''}
                    onClick={() => selectTheme('light')}>
                    <SunIcon stroke="var(--fg4)" />
                </button>
            )}
        </div>
    );
}

export default ThemeSwitcher;
