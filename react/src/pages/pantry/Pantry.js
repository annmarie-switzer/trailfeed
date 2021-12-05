import React, { useContext, useState } from 'react';
import { AppContext } from 'lib/App';
import { Plus } from 'react-feather';
import Toolbar from 'pages/pantry/Toolbar';
import Card from 'pages/pantry/Card';

function Pantry() {
    // const { selection, setSelection } = useContext(AppContext);
    const [cards, setCards] = useState([]);
    const [selection, setSelection] = useState(['a', 'b', 'c']);

    const handleSearchRes = (res) => {
        console.log(res.hits.total.value);

        const cards = res.hits.hits.map((h, i) => {
            h = { ...h._source, id: h._id };
            return (
                <Card
                    hit={h}
                    key={i}
                    selection={selection}
                    handleSelection={handleSelection}
                />
            );
        });

        setCards(cards);
    };

    const handleSelection = (id) => {
        let newSelection = selection;
        newSelection.push(id);

        // let newSelection = [...selection, id];

        console.log(newSelection);

        setSelection(
            newSelection
            // selection.includes(id)
            //     ? selection.filter((s) => s !== id)
            //     : [...selection, id]
        );
    };

    return (
        <div id="pantry">
            <pre>{JSON.stringify(selection, null, 2)}</pre>
            <Toolbar handleSearchRes={handleSearchRes} />
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
