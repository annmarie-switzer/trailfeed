import React, { useEffect, useState } from 'react';
import Checkbox from './Checkbox';
import {
    Activity,
    Award,
    CheckSquare,
    Coffee,
    Droplet,
    Frown,
    Square,
    Star,
    Thermometer,
    Watch
} from 'react-feather';

function Card(props) {
    const { hit, selection, handleSelection } = props;

    const [ids, setIds] = useState([]);

    useEffect(() => {
        setIds(selection.map((s) => s.id));
    }, [selection]);

    return (
        <div className="card">
            <div className="card-header">
                <div className="name-container">
                    {hit.link ? (
                        <a
                            href={hit.link}
                            target="_blank"
                            rel="noreferrer"
                            className="name">
                            {hit.name}
                        </a>
                    ) : (
                        <span className="name">{hit.name}</span>
                    )}
                    <span className="sporks">
                        <Star />
                        <Star />
                        <Star />
                        <Star />
                    </span>
                </div>
                <span className="brand">
                    {hit.brand === 'TRAILFEED_USER_CUSTOM'
                        ? 'You made this!'
                        : hit.brand}
                </span>
            </div>
            <div className="card-content">
                <div className="list">
                    <div className="list-item">
                        <Coffee size={20} />
                        <span>{hit.meal_type}</span>
                    </div>
                    <div className="list-item">
                        <Activity size={20} />
                        <span>{hit.calories} Cal</span>
                    </div>
                    <div className="list-item">
                        <Droplet size={20} />
                        <span>{hit.water_ml} mL</span>
                    </div>
                    <div className="list-item">
                        <Thermometer size={20} />
                        <span>{hit.water_temp}</span>
                    </div>
                    <div className="list-item">
                        <Watch size={20} />
                        <span>{hit.minutes} min</span>
                    </div>
                    <div className="list-item">
                        <Frown size={20} />
                        <span>{hit.allergens}</span>
                    </div>
                    <div className="list-item">
                        <Award size={20} />
                        <span>{hit.special}</span>
                    </div>
                </div>
            </div>
            <div className="card-footer">
                <span
                    title={
                        ids.includes(hit.id)
                            ? 'Remove from pack'
                            : 'Add to pack'
                    }>
                    <Checkbox
                        color="var(--success)"
                        onChange={() => handleSelection(hit)}
                    />
                </span>
            </div>
        </div>
    );
}

export default Card;
