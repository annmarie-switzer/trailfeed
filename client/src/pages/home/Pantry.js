import Toolbar from 'pages/home/Toolbar';
import React, { useEffect, useState } from 'react';
import { Plus } from 'react-feather';

function Pantry() {
    const [cards, setCards] = useState([]);

    const handleRes = (res) => {
        console.log(res.hits.total.value);
        const hits = res.hits.hits.map((h) => h._source);

        const cards = hits.map((hit, i) => {
            return (
                <div className="card" key={i}>
                    <div className="card-header">{hit.name}</div>
                    <div className="card-content">
                        {Object.entries(hit).map((entry, i) => (
                            <div key={i} className="prop">
                                {entry[0]} : {entry[1]}
                            </div>
                        ))}
                    </div>
                </div>
            );
        });

        setCards(cards);
    };

    return (
        <div id="pantry">
            <Toolbar searchRes={handleRes} />
            <div className="cards">
                <div className="card custom">
                    <div className="card-content">
                        <Plus />
                        <span>Custom Meal</span>
                    </div>
                </div>
                {cards}
            </div>
        </div>
    );
}

export default Pantry;
