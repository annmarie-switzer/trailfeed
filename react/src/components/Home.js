import React, { useEffect, useState } from 'react';
import './Home.css';
import SearchBar from 'components/SearchBar';
import Card from 'components/Card';
import { search } from 'api';
import Pack from './Pack';
import Toolbar from 'components/Toolbar';

function Home() {
    const [query, setQuery] = useState(null);
    const [hits, setHits] = useState([]);
    const [packOpen, setPackOpen] = useState(true);
    const [selection, setSelection] = useState([]);

    const handleSelection = (hit) => {
        const ids = selection.map((s) => s.id);
        setSelection(
            ids.includes(hit.id)
                ? selection.filter((s) => s.id !== hit.id)
                : [...selection, hit]
        );
    };

    const getData = async () => {
        const mealsRes = await search({ query, index: 'meals' });

        const hits = mealsRes.hits.hits.map((h) => ({
            ...h._source,
            id: h._id
        }));

        setHits(hits);
    };

    useEffect(() => {
        if (query) {
            getData();
        }
    }, [query]);

    return (
        <div id="home">
            <div className="drawer-wrapper">
                <div className="main">
                    <SearchBar setQuery={setQuery} />
                    <div className="cards">
                        {hits.map((h, i) => (
                            <Card
                                hit={h}
                                key={i}
                                selection={selection}
                                handleSelection={handleSelection}
                            />
                        ))}
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

export default Home;
