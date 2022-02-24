import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from 'components/App';
import './Card.css';
import Checkbox from './Checkbox';
import Stars from './Stars';
import MealName from './MealName';
import {
    Activity,
    AlertTriangle,
    Award,
    Coffee,
    Droplet,
    MoreVertical,
    Thermometer,
    Watch
} from 'react-feather';

function Card({ hit, selection, handleSelection }) {
    const { setModalData } = useContext(AppContext);
    const [ids, setIds] = useState([]);

    useEffect(() => {
        setIds(selection.map((s) => s.id));
    }, [selection]);

    return (
        <div className="card">
            <div className="card-header">
                <div className="name-container">
                    <MealName name={hit.name} link={hit.link} />
                    <span
                        title={
                            ids.includes(hit.id)
                                ? 'Remove from pack'
                                : 'Add to pack'
                        }>
                        <Checkbox
                            onChange={() => handleSelection(hit)}
                        />
                    </span>
                </div>
                <span className="brand">
                    {hit.brand === 'TRAILFEED_USER_CUSTOM'
                        ? 'You made this!'
                        : hit.brand}
                </span>
                <Stars mealId={hit.id} />
            </div>
            <div className="card-content">
                <div className="list">
                    <div className="list-item" title="Calories">
                        <Activity size={20} />
                        <span>{hit.calories} Cal</span>
                    </div>
                    <div className="list-item" title="Water required (mL)">
                        <Droplet size={20} />
                        <span>{hit.water_ml} mL</span>
                    </div>
                    <div className="list-item" title="Minutes to prepare">
                        <Watch size={20} />
                        <span>{hit.minutes} min</span>
                    </div>
                    <div className="list-item" title="Meal type">
                        <Coffee size={20} />
                        <span>{hit.meal_type}</span>
                    </div>
                    <div className="list-item" title="Required water temp">
                        <Thermometer size={20} />
                        <span>{hit.water_temp}</span>
                    </div>

                    {hit.allergens.length > 0 ? (
                        <div className="list-item" title="Allergens">
                            <AlertTriangle size={20} />
                            <div>
                                {hit.allergens.map((a, i) => (
                                    <span key={i}>
                                        {i > 0 ? ', ' : null}
                                        {a.replace('_', ' ')}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    {hit.special.length > 0 ? (
                        <div className="list-item" title="Special Diet">
                            <Award size={20} />
                            <div>
                                {hit.special.map((s, i) => (
                                    <span key={i}>
                                        {i > 0 ? ', ' : null}
                                        {s.replace('_', ' ')}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
            <div className="card-footer">
                <button
                    type="button"
                    title="Show ingredient list"
                    onClick={() => setModalData(hit)}>
                    <MoreVertical />
                </button>
            </div>
        </div>
    );
}

export default Card;
