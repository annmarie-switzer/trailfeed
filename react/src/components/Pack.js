import React from 'react';
import { AppContext } from 'components/App';
import Stats from '../components/Stats';
import { CheckCircle, X } from 'react-feather';
import Checkbox from 'components/Checkbox';
import Gauge from 'components/Gauge';
import MealName from 'components/MealName';

function Pack({ selection, setSelection }) {
    const deselect = (meal) => {
        setSelection(selection.filter((s) => s.id !== meal.id));
    };

    return (
        <div id="pack">
            <Gauge selection={selection} />

            <div className="list">
                {selection.length === 0 ? (
                    <div>Nothing selected.</div>
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
                                    }}>
                                    <MealName name={meal.name} link={meal.link} />
                                </div>
                                <div className="detail-row">{meal.brand}</div>
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
                                        Time: {meal.minutes.toLocaleString()}{' '}
                                        min
                                    </span>
                                </div>
                            </div>
                            <div
                                className="icon"
                                title="Remove from pack"
                                onClick={() => deselect(meal)}>
                                <X />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Pack;