import { ChangeEvent, useContext } from 'react';
import './Pack.css';
import { AppContext } from '../App';
import { Activity, Feather } from 'react-feather';
import { PackItem } from './PackItem';

export const Pack = () => {
    const { maxCalories, setMaxCalories, maxOunces, setMaxOunces, selection } =
        useContext(AppContext);

    const handleTargetChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newVal = Number(event.target.value.replace(',', ''));
        const name = event.target.name;

        localStorage.setItem(name, String(newVal));

        name === 'trailfeedMaxCals'
            ? setMaxCalories(newVal)
            : setMaxOunces(newVal);
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
                        onChange={handleTargetChange}
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
                        onChange={handleTargetChange}
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
                        <PackItem key={i} meal={meal} idx={i} />
                    ))
                )}
            </div>
        </div>
    );
};
