import { useContext, useEffect, useState } from 'react';
import './Stats.css';
import { AppContext } from '../App';

type StatsProps = {
    selection: any[];
};

export const Stats = ({ selection }: StatsProps) => {
    const { maxCalories, maxOunces } = useContext(AppContext);

    const [progress, setProgress] = useState({
        calories: 0,
        ounces: 0
    });

    const [total, setTotal] = useState({
        calories: 0,
        ounces: 0
    });

    useEffect(() => {
        const newTotals = selection.reduce(
            (result, s) => {
                result.calories += s.calories;
                result.ounces += s.ounces;
                return result;
            },
            { calories: 0, ounces: 0 }
        );

        setTotal({
            calories: newTotals.calories.toLocaleString(),
            ounces: newTotals.ounces.toLocaleString()
        });

        setProgress({
            calories: Math.round((newTotals.calories / maxCalories) * 100),
            ounces: Math.round((newTotals.ounces / maxOunces) * 100)
        });
    }, [selection, maxCalories, maxOunces]);

    return (
        <div id="stats">
            {/* CALORIES */}
            <div className="progress-bar-container calories">
                <span style={{ color: 'var(--calories)' }}>
                    {total.calories} cal
                </span>
                <div
                    className="progress-bar"
                    title={`${total.calories.toLocaleString()} / ${maxCalories.toLocaleString()} calories (${
                        progress.calories
                    }%)`}
                >
                    <div
                        className="progress-bar-fill"
                        style={{
                            width: `${progress.calories}%`,
                            backgroundColor: 'var(--calories)'
                        }}
                    />
                </div>
            </div>

            <div className="progress-bar-container ounces">
                <span style={{ color: 'var(--ounces)' }}>
                    {total.ounces} oz
                </span>
                <div
                    className="progress-bar"
                    title={`${total.ounces.toLocaleString()} / ${maxOunces.toLocaleString()} oz (${
                        progress.ounces
                    }%)`}
                >
                    <div
                        className="progress-bar-fill"
                        style={{
                            width: `${progress.ounces}%`,
                            backgroundColor: 'var(--ounces)'
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
