import React, { useEffect, useState } from 'react';
import './Stats.css';

function Stats({ selection }) {
    const [totals, setTotals] = useState({ totalCalories: 0, totalOunces: 0 });

    useEffect(() => {
        console.log('calculating');
        setTotals(
            selection.reduce(
                (result, s) => {
                    result.totalCalories += s.calories;
                    result.totalOunces += s.ounces;
                    return result;
                },
                { totalCalories: 0, totalOunces: 0 }
                // TODO - these need to be a percentage of the goal
            )
        );
    }, [selection]);

    return (
        <div id="stats">
            <div className="progress-bar">
                <div
                    className="progress-bar-fill calories"
                    style={{ width: totals.totalCalories }}
                />
            </div>
            <div className="progress-bar">
                <div
                    className="progress-bar-fill ounces"
                    style={{ width: totals.totalOunces }}
                />
            </div>
        </div>
    );
}

export default Stats;
