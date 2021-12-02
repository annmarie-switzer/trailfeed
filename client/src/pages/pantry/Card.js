import React, { useState } from 'react';
import {
    Activity,
    Award,
    CheckCircle,
    Coffee,
    Droplet,
    Frown,
    Thermometer,
    Watch
} from 'react-feather';

function Card(props) {
    const { hit } = props;
    const [selected, setSelected] = useState([]);

    const toggle = (id) => {
        setSelected(
            selected.includes(id)
                ? selected.filter((s) => s !== id)
                : [...selected, id]
        );
    };

    return (
        <div className="card">
            <div className="card-header">
                <div>
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
                    <button
                        type="button"
                        title={
                            selected.includes(hit.id)
                                ? 'Remove from pack'
                                : 'Add to pack'
                        }
                        onClick={() => toggle(hit.id)}>
                        <CheckCircle
                            color={
                                selected.includes(hit.id)
                                    ? 'var(--success)'
                                    : 'currentColor'
                            }
                        />
                    </button>
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
                        <Coffee />
                        <span>{hit.meal_type}</span>
                    </div>
                    <div className="list-item">
                        <Activity />
                        <span>{hit.calories} kCal</span>
                    </div>
                    <div className="list-item">
                        <Droplet />
                        <span>{hit.water_ml} mL</span>
                    </div>
                    <div className="list-item">
                        <Thermometer />
                        <span>{hit.water_temp}</span>
                    </div>
                    <div className="list-item">
                        <Watch />
                        <span>{hit.minutes} min.</span>
                    </div>
                    <div className="list-item">
                        <Frown />
                        <span>{hit.allergens}</span>
                    </div>
                    <div className="list-item">
                        <Award />
                        <span>{hit.special}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Card;
