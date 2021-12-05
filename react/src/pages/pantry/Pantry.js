import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from 'lib/App';
import { Plus } from 'react-feather';
import Toolbar from 'pages/pantry/Toolbar';
import Card from 'pages/pantry/Card';
import { search } from 'api';

function Pantry() {
    const { selection, setSelection } = useContext(AppContext);
    
    const [query, setQuery] = useState({});
    const [res, setRes] = useState([]);

    const handleSelection = (id) => {
        setSelection(
            selection.includes(id)
                ? selection.filter((s) => s !== id)
                : [...selection, id]
        );
    };

    useEffect(() => {
        search(query).then((res) => {
            console.log(res.hits.total.value);
            setRes(res);
        });
    }, [query]);

    return (
        <div id="pantry">
            <pre>{JSON.stringify(selection, null, 2)}</pre>

            <Toolbar setQuery={setQuery} />

            <div className="cards">
                <div className="card custom">
                    <div className="card-content">
                        <Plus />
                        <span>Custom Meal</span>
                    </div>
                </div>
                {res.hits?.hits.map((h, i) => {
                    h = { ...h._source, id: h._id };
                    return (
                        <Card
                            hit={h}
                            key={i}
                            selection={selection}
                            handleSelection={handleSelection}
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default Pantry;
