import React from 'react';

function Card(props) {
    const { hit, key } = props;

    return (
        <div className="card" key={key}>
            <div className="card-header">
                <span>{hit.name}</span>
            </div>
            <div className="card-content">
                {Object.entries(hit).map((entry, i) => (
                    <div key={i} className="prop">
                        {entry[0]} : {entry[1]}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Card;
