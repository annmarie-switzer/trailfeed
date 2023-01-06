import { useContext } from 'react';
import './Pack.css';
import { AppContext } from '../App';
import { PackItem } from './PackItem';
import { calculatedTotals } from '../utils';
import {
    Activity,
    ArrowDown,
    ArrowUp,
    BarChart2,
    Feather
} from 'react-feather';
import { Tooltip } from './Tooltip';

export const Pack = () => {
    const { maxCalories, maxOunces, selection } = useContext(AppContext);

    const { calories, ounces } = calculatedTotals(selection);
    const calsPerOunce =
        calories > 0 && ounces > 0 ? (calories / ounces).toFixed(2) : 0;

    const notEnoughCalories = calories < maxCalories;
    const tooHeavy = ounces > maxOunces;

    return (
        <div id="pack">
            <div className="stats-container">
                <div className="stat calories">
                    <Activity />
                    <span>{calories.toLocaleString()}</span>
                    {notEnoughCalories && (
                        <Tooltip text="You're below your calorie target. Add more food to your pack.">
                            <ArrowUp color="var(--fg)" />
                        </Tooltip>
                    )}
                </div>

                <div className="stat ounces">
                    <Feather />
                    <span>{ounces.toLocaleString()}</span>
                    {tooHeavy && (
                        <Tooltip text="You've exceeded your target weight. Try swapping out meals for more calorie dense options.">
                            <ArrowDown color="var(--fg)" />
                        </Tooltip>
                    )}
                </div>

                <div className="stat calsPerOunce">
                    <BarChart2 />
                    <span>{calsPerOunce}</span>
                </div>
            </div>

            <div className="list">
                {selection.length === 0 ? (
                    <div style={{ margin: '2rem auto' }}>Nothing selected.</div>
                ) : (
                    selection.map((meal, i) => (
                        <PackItem key={i} meal={meal} idx={i} />
                    ))
                )}
            </div>
        </div>
    );
};
