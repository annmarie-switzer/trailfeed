import React, { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from './App';
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
    const ref = useRef();
    const { user } = useContext(AppContext);

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

        const ratingsQuery = {
            query: {
                bool: {
                    must: [
                        {
                            term: {
                                user: {
                                    value: user.email
                                }
                            }
                        },
                        {
                            terms: {
                                meal_id: mealsRes.hits.hits.map((h) => h._id)
                            }
                        }
                    ]
                }
            }
        };

        const ratingsRes = await search({
            query: ratingsQuery,
            index: 'ratings'
        });

        const ratings = ratingsRes.hits.hits.reduce((acc, doc) => {
            return { ...acc, [doc._source.meal_id]: doc };
        }, {});

        const newHits = mealsRes.hits.hits.map((h) => ({
            ...h._source,
            id: h._id,
            ratingDoc: ratings[h._id]
        }));

        setHits(newHits);
    };

    useEffect(() => {
        if (query) {
            getData();
        }
    }, [query]);

    // const onScroll = () => {
    //     if (ref.current) {
    //         const { scrollTop, scrollHeight, clientHeight } = ref.current;
    //         if (scrollTop + clientHeight === scrollHeight) {
    //             const newPage = page + 1;
    //             const q = {
    //                 ...query,
    //                 from: newPage * 16
    //             };

    //             setQuery(q);
    //             setPage(newPage);
    //         }
    //     }
    // };

    return (
        <div id="home">
            <div className="drawer-wrapper">
                <div className="main" onScroll={() => {}} ref={ref}>
                    <SearchBar setQuery={setQuery} />
                    <div className="cards">
                        {hits.map((h, i) => (
                            <Card
                                key={i}
                                hit={h}
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
