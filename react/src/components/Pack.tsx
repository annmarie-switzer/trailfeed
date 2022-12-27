import { ChangeEvent, Dispatch, SetStateAction, useContext, useState } from 'react';
import { AppContext } from '../App';
import './Pack.css';
// import Gauge from 'components/Gauge';
import { MealName } from './MealName';
import { Activity, Feather, Minus, Plus, Trash } from 'react-feather';
import { MealDoc } from '../type';
import { Input } from './forms/Input';

type PackProps = {
    selection: MealDoc[];
    setSelection: Dispatch<SetStateAction<MealDoc[]>>;
};

export const Pack = ({ selection, setSelection }: PackProps) => {
    const { maxCalories, setMaxCalories, maxOunces, setMaxOunces } =
        useContext(AppContext);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newVal = Number(event.target.value.replace(',', ''));
        const name = event.target.name;

        localStorage.setItem(name, String(newVal));

        name === 'trailfeedMaxCals'
            ? setMaxCalories(newVal)
            : setMaxOunces(newVal);
    };

    const deselect = (meal: MealDoc) => {
        setSelection(selection.filter((s) => s.id !== meal.id));
    };

    const [count, setCount] = useState(1);

    return (
        <div id="pack">
            <div className="inputs">
                <div className="input-container calories">
                    <label htmlFor="calorie-input">
                        <Activity />
                        <span>Calorie Target</span>
                    </label>
                    <input
                        id="calorie-input"
                        type="text"
                        value={maxCalories.toLocaleString()}
                        onChange={handleChange}
                        name="trailfeedMaxCals"
                    />
                </div>
                <div className="input-container ounces">
                    <label htmlFor="ounce-input">
                        <Feather />
                        <span>Weight Target (oz)</span>
                    </label>
                    <input
                        id="ounce-input"
                        type="text"
                        onChange={handleChange}
                        value={maxOunces.toLocaleString()}
                        name="trailfeedMaxOunces"
                    />
                </div>
            </div>

            <div className="list">
                {selection.length === 0 ? (
                    <div style={{ margin: '2rem auto' }}>Nothing selected.</div>
                ) : (
                    selection.map((meal, i) => (
                        <div
                            key={i}
                            className={
                                i % 2 === 0 ? 'list-item even' : 'list-item'
                            }
                        >
                            <div className="count">
                                <input
                                    type="number"
                                    min="1"
                                    value={count}
                                />
                                <Minus
                                    size={14}
                                    color="currentColor"
                                    onClick={() => setCount((curr) => curr - 1)}
                                    className="button decrement"
                                />
                                <Plus
                                    size={14}
                                    color="currentColor"
                                    onClick={() => setCount((curr) => curr + 1)}
                                    className="button increment"
                                />
                            </div>

                            <div className="data">
                                <div>{meal.name}</div>
                                <div className="detail-row">
                                    <span>{meal.brand}</span>|
                                    <span>
                                        {meal.calories.toLocaleString()} cal
                                    </span>
                                    |
                                    <span>
                                        {meal.ounces.toLocaleString()} oz
                                    </span>
                                </div>
                            </div>
                            <div
                                className="icon"
                                title="Remove from pack"
                                onClick={() => deselect(meal)}
                            >
                                <Trash size={18} />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
