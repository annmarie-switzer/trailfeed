import React from 'react';
import './MealName.css';

function MealName({ name, link }) {
    return (
        <>
            {link ? (
                <a
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    className="meal-name">
                    {name}
                </a>
            ) : (
                <span className="meal-name">{name}</span>
            )}
        </>
    );
}

export default MealName;
