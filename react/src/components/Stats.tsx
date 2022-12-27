import { useContext, useEffect, useState } from 'react';
import './Stats.css';
import { AppContext } from '../App';
import { MealDoc } from '../type';
import { Tooltip } from './Tooltip';

type StatsProps = {
    selection: MealDoc[];
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
            calories: newTotals.calories,
            ounces: newTotals.ounces
        });

        setProgress({
            calories: Math.round((newTotals.calories / maxCalories) * 100),
            ounces: Math.round((newTotals.ounces / maxOunces) * 100)
        });
    }, [selection, maxCalories, maxOunces]);

    return (
        <div id="stats">
            <div className="progress-bar-container calories">
                <span style={{ color: 'var(--calories)' }}>
                    {total.calories.toLocaleString()} cal
                </span>

                <Tooltip
                    text={`${total.calories.toLocaleString()} / ${maxCalories.toLocaleString()} calories (${
                        progress.calories
                    }%)`}
                    position="top"
                    width={125}
                >
                    <div className="progress-bar">
                        <div
                            className="progress-bar-fill"
                            style={{
                                width: `${progress.calories}%`,
                                backgroundColor: 'var(--calories)'
                            }}
                        />
                    </div>
                </Tooltip>
            </div>

            <div className="progress-bar-container ounces">
                <span style={{ color: 'var(--ounces)' }}>
                    {total.ounces.toLocaleString()} oz
                </span>

                <Tooltip
                    text={`${total.ounces.toLocaleString()} / ${maxOunces.toLocaleString()} oz (${
                        progress.ounces
                    }%)`}
                    position="top"
                    width={125}
                >
                    <div className="progress-bar">
                        <div
                            className="progress-bar-fill"
                            style={{
                                width: `${progress.ounces}%`,
                                backgroundColor: 'var(--ounces)'
                            }}
                        />
                    </div>
                </Tooltip>
            </div>
        </div>
    );
};
