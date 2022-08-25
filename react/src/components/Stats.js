import React, { useEffect, useState } from 'react';
import { Activity, Feather } from 'react-feather';
import './Stats.css';

function Stats({ selection }) {
    const [progress, setProgress] = useState({
        calories: 0,
        ounces: 0
    });

    const [maxCalories, setMaxCalories] = useState(
        Number(localStorage?.getItem('trailfeedMaxCals')) || 9000
    );

    const [maxOunces, setMaxOunces] = useState(
        Number(localStorage?.getItem('trailfeedMaxOunces')) || 96
    );

    useEffect(() => {
        const newTotals = selection.reduce(
            (result, s) => {
                result.calories += s.calories;
                result.ounces += s.ounces;
                return result;
            },
            { calories: 0, ounces: 0 }
        );

        setProgress({
            calories: Math.round((newTotals.calories / maxCalories) * 100),
            ounces: Math.round((newTotals.ounces / maxOunces) * 100)
        });
    }, [selection]);

    return (
        <div id="stats">
            <div className="progress-bar-container">
                <Activity />
                <div className="progress-bar">
                    <div
                        className="progress-bar-fill calories"
                        style={{ width: `${progress.calories}%` }}
                    />
                </div>
                <pre>{progress.calories}</pre>
            </div>
            <div className="progress-bar-container">
                <Feather />
                <div className="progress-bar">
                    <div
                        className="progress-bar-fill ounces"
                        style={{ width: `${progress.ounces}%` }}
                    />
                </div>
                <pre>{progress.ounces}</pre>
            </div>
        </div>
    );
}

export default Stats;
