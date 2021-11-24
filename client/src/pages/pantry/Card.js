import React, { useContext } from 'react';
import { AppContext } from 'lib/App';
import {
    Activity,
    Award,
    Coffee,
    Droplet,
    Frown,
    Smile,
    Thermometer,
    Watch
} from 'react-feather';

function Card(props) {
    const { user } = useContext(AppContext);

    const { hit } = props;

    return (
        <div className="card">
            <div className="card-header">
                {hit.link ? (
                    <>
                        <a
                            href={hit.link}
                            target="_blank"
                            rel="noreferrer"
                            className="name">
                            {hit.name}
                        </a>
                        <span className="brand">{hit.brand}</span>
                    </>
                ) : (
                    <>
                        <span className="name">{hit.name}</span>
                        <span className="brand">{`${user.name}'s Kitchen`}</span>
                    </>
                )}
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
