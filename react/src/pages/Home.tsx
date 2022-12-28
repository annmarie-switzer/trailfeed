import { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '../App';
import './Home.css';
import { search } from '../api';
import { SearchBar } from '../components/SearchBar';
import { Card } from '../components/Card';
import { Pack } from '../components/Pack';
import { Toolbar } from '../components/Toolbar';
import { MealDoc, MealSource, RatingDoc } from '../type';

export const Home = () => {
    const [page, setPage] = useState(0);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [query, setQuery] = useState<any>(null);
    const [hits, setHits] = useState<MealSource[]>([]);
    const [totalHits, setTotalHits] = useState(0);
    const [packOpen, setPackOpen] = useState(true);

    const { user, selection, setSelection } = useContext(AppContext);

    const handleSelection = (hit: MealSource) => {
        const ids: string[] = selection.map((s) => s.id);
        setSelection(
            ids.includes(hit.id)
                ? selection.filter((s) => s.id !== hit.id)
                : [...selection, { ...hit, count: 1 }]
        );
    };

    const getData = async (page: number) => {
        const q = {
            ...query,
            from: page * 20
        };

        const mealsRes = await search({ query: q, index: 'meals' });

        setTotalHits(mealsRes.hits.total.value);

        const newHits = mealsRes.hits.hits.map((h: MealDoc) => ({
            ...h._source,
            id: h._id
        }));

        if (user.email) {
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
                                    meal_id: mealsRes.hits.hits.map(
                                        (h: MealDoc) => h._id
                                    )
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

            const ratings = ratingsRes.hits.hits.reduce(
                (acc: Record<string, RatingDoc>, doc: RatingDoc) => ({
                    ...acc,
                    [doc._source.meal_id]: doc
                }),
                {}
            );

            newHits.forEach((hit: MealSource) => {
                hit.ratingDoc = ratings[hit.id];
            });
        }

        if (page === 0) {
            setPage(0);
            setHits(newHits);
        } else {
            setHits([...hits, ...newHits]);
        }
    };

    useEffect(() => {
        if (query) {
            getData(0);
        }
    }, [query]);

    // INIFINTE SCROLL
    const ref = useRef(null);

    const onScroll = () => {
        if (ref.current) {
            const { scrollTop, scrollHeight, clientHeight } = ref.current;
            if (scrollTop + clientHeight >= scrollHeight) {
                setPage(page + 1);
            }
        }
    };

    useEffect(() => {
        if (page !== 0) {
            getData(page);
        }
    }, [page]);

    // PACK RESIZE
    const drawer = document.querySelector('.drawer') as HTMLElement;
    const main = document.querySelector('.main') as HTMLElement;

    const onMouseMove = (e: MouseEvent) => {
        main.style.cssText = `width: ${e.pageX}px`;
        drawer.style.cssText = `width: ${window.innerWidth - e.pageX}px`;
    };

    const onMouseDown = () => {
        document.addEventListener('mousemove', onMouseMove);
    };

    const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
    };

    document.addEventListener('mouseup', onMouseUp);

    return (
        <div id="home">
            <div className="drawer-wrapper">
                <div
                    className="main"
                    onScroll={onScroll}
                    onMouseUp={onMouseUp}
                    ref={ref}
                >
                    <SearchBar setQuery={setQuery} totalHits={totalHits} />
                    <div className="cards">
                        {hits.map((h, i) => (
                            <Card
                                key={i}
                                hit={h}
                                handleSelection={handleSelection}
                                handleDelete={() => getData(page)}
                            />
                        ))}
                    </div>
                </div>
                <div className={packOpen ? 'drawer open' : 'drawer'}>
                    <div
                        className="dragholder"
                        onMouseDown={onMouseDown}
                        onMouseUp={onMouseUp}
                    />
                    <Pack />
                </div>
            </div>
            <Toolbar packOpen={packOpen} setPackOpen={setPackOpen} />
        </div>
    );
};
