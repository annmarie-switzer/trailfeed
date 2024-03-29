import { ChangeEvent, useContext, useEffect, useState } from 'react';
import './Stats.css';
import { AppContext } from '../App';
import { calculatedTotals } from '../utils';
import { Activity, Feather } from 'react-feather';

export const Stats = () => {
    const { maxCalories, setMaxCalories, maxOunces, setMaxOunces, selection } =
        useContext(AppContext);

    const [progress, setProgress] = useState({
        calories: 0,
        ounces: 0
    });

    const [total, setTotal] = useState({
        calories: 0,
        ounces: 0
    });

    useEffect(() => {
        const { calories, ounces } = calculatedTotals(selection);

        setTotal({ calories, ounces });

        setProgress({
            calories: Math.round((calories / maxCalories) * 100),
            ounces: Math.round((ounces / maxOunces) * 100)
        });
    }, [selection, maxCalories, maxOunces]);

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        localStorage.setItem(name, value);
        e.target.name === 'trailfeedMaxCalories'
            ? setMaxCalories(Number(value))
            : setMaxOunces(Number(value));
    };

    return (
        <div id="stats">
            <div className="progress-bar-container calories">
                <div className="label">
                    <Activity />
                    <span>{total.calories.toLocaleString()}</span>
                </div>
                <div className="progress-bar">
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${progress.calories}%` }}
                    />
                </div>
                <div className="input-container">
                    <input
                        type="number"
                        name="trailfeedMaxCalories"
                        min="1"
                        defaultValue={maxCalories}
                        onChange={onChange}
                    />
                    <span className="suffix">cal</span>
                </div>
            </div>

            <div className="progress-bar-container ounces">
                <div className="label">
                    <Feather />
                    <span>{total.ounces.toFixed(1)}</span>
                </div>
                <div className="progress-bar">
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${progress.ounces}%` }}
                    />
                </div>
                <div className="input-container">
                    <input
                        type="number"
                        min="1"
                        defaultValue={maxOunces}
                        onChange={(e) => setMaxOunces(Number(e.target.value))}
                    />
                    <span className="suffix">oz</span>
                </div>
            </div>
        </div>
    );
};
