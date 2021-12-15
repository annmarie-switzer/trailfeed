import React, { useContext, useEffect, useState } from 'react';
import { Plus } from 'react-feather';
import SearchBar from 'pages/pantry/SearchBar';
import Card from 'lib/Card';
import { search } from 'api';
import Pack from './Pack';
import Toolbar from 'pages/pantry/Toolbar';

function Pantry() {
    const [query, setQuery] = useState(null);
    const [res, setRes] = useState([]);
    const [packOpen, setPackOpen] = useState(false);
    const [selection, setSelection] = useState([]);

    const handleSelection = (hit) => {
        const ids = selection.map((s) => s.id);
        setSelection(
            ids.includes(hit.id)
                ? selection.filter((s) => s.id !== hit.id)
                : [...selection, hit]
        );
    };

    useEffect(() => {
        if (query) {
            search(query).then((res) => {
                console.log(res.hits.total.value);
                setRes(res);
            });
        }
    }, [query]);

    return (
        <div id="pantry">
            <div className="drawer-wrapper">
                <div className="main">
                    <SearchBar setQuery={setQuery} />
                    <div className="cards">
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
                <div className={packOpen ? 'drawer open' : 'drawer'}>
                    <Pack selection={selection} setSelection={setSelection} />
                </div>
            </div>
            <Toolbar
                packOpen={packOpen}
                setPackOpen={setPackOpen}
                selection={selection}
            />
        </div>
    );
}

export default Pantry;
