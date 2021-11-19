import SearchBar from 'pages/home/SearchBar';
import React, { useEffect, useState } from 'react';

function Home() {
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
        <div id="home">
            <SearchBar searchRes={handleRes} />
            <div className="cards">{cards}</div>
        </div>
    );
}

export default Home;
