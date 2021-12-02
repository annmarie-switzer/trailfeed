import React, { useState } from 'react';
import { Plus } from 'react-feather';
import Toolbar from 'pages/pantry/Toolbar';
import Card from 'pages/pantry/Card';

function Pantry() {
    const [cards, setCards] = useState([]);

    const handleRes = (res) => {
        console.log(res.hits.total.value);

        const cards = res.hits.hits.map((h, i) => {
            h = { ...h._source, id: h._id };
            return <Card hit={h} key={i} />;
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
