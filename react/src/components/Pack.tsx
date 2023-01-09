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
    Droplet,
    Feather,
    Hash,
    Watch
} from 'react-feather';
import { Tooltip } from './Tooltip';

export const Pack = () => {
    const { maxCalories, maxOunces, selection } = useContext(AppContext);

    const { calories, ounces, water_ml, minutes } = calculatedTotals(selection);
    const calsPerOunce =
        calories > 0 && ounces > 0 ? (calories / ounces).toFixed(2) : 0;

    const notEnoughCalories = calories < maxCalories;
    const tooHeavy = ounces > maxOunces;

    return (
        <div id="pack">
            <div className="summary">
                <div className="grid-item">
                    <Hash size={16} />
                    {selection.reduce((sum, item) => (sum += item.count), 0)}
                </div>
                <div className="grid-item">
                    <Activity size={16} />
                    <span>{calories} cals</span>
                </div>
                <div className="grid-item">
                    <Feather size={16} />
                    <span>{ounces.toFixed(1)} oz</span>
                </div>
                <div className="grid-item">
                    <BarChart2 size={16} />
                    <span>{calsPerOunce} cal/oz</span>
                </div>
                <div className="grid-item">
                    <Droplet size={16} />
                    <span>{water_ml} mL</span>
                </div>
                <div className="grid-item">
                    <Watch size={16} />
                    <span>{minutes} min</span>
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
