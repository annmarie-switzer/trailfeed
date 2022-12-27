import { Dispatch, SetStateAction, useContext } from 'react';
import { AppContext } from '../App';
import './Pack.css';
// import Gauge from 'components/Gauge';
import { MealName } from './MealName';
import { Activity, Feather, X } from 'react-feather';
import { MealDoc } from '../type';

type PackProps = {
    selection: MealDoc[];
    setSelection: Dispatch<SetStateAction<MealDoc[]>>;
};

export const Pack = ({ selection, setSelection }: PackProps) => {
    const { maxCalories, setMaxCalories, maxOunces, setMaxOunces } =
        useContext(AppContext);

    const handleChange = (event: any) => {
        console.log('handle change event => ', event);
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
                        <div key={i} className="list-item">
                            <div className="content">
                                <div
                                    className="title-row"
                                    style={{
                                        color: meal.link
                                            ? 'var(--meal-name-link)'
                                            : 'var(--meal-name-custom)'
                                    }}
                                >
                                    {/* TODO - instead of this, clicking the link should scroll to the meal card */}
                                    <MealName
                                        name={meal.name}
                                        link={meal.link}
                                    />
                                </div>
                                {/* <div className="detail-row">{meal.brand}</div> */}
                                <div className="detail-row">
                                    <span>
                                        Calories:{' '}
                                        {meal.calories.toLocaleString()}
                                    </span>
                                    <span>
                                        Water: {meal.water_ml.toLocaleString()}{' '}
                                        mL
                                    </span>
                                    <span>
                                        Weight: {meal.ounces.toLocaleString()}{' '}
                                        oz
                                    </span>
                                </div>
                            </div>
                            <div
                                className="icon"
                                title="Remove from pack"
                                onClick={() => deselect(meal)}
                            >
                                <X />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
