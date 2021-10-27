import React, { useContext, useEffect, useState } from 'react';
import { search } from 'api';
import SearchIcon from 'static/icons/SearchIcon';
import SlidersIcon from 'static/icons/SlidersIcon';
import { AppContext } from 'shared/App';
import CheckboxList from './CheckboxList';
// import CheckboxList from './CheckboxList';

function SearchBar(props) {
    const user = useContext(AppContext);
    const [open, setOpen] = useState(false);
    const [mealTypes, setMealTypes] = useState([]);
    const [waterTemps, setWaterTemps] = useState([]);
    const [allergens, setAllergens] = useState([]);
    const [special, setSpecial] = useState([]);

    const submit = async (event) => {
        if (event.key === 'Enter') {
            const query = {
                "query": {
                    "bool": {
                        "should": [
                            {
                                "match_bool_prefix": {
                                    "name": event.target.value
                                }
                            },
                            {
                                "match_bool_prefix": {
                                    "brand": event.target.value
                                }
                            },
                            {
                                "match_bool_prefix": {
                                    "ingredients": event.target.value
                                }
                            }
                        ]
                    }
                },
                "post_filter": {
                    "bool": {
                        "should": [
                            {
                                "term": {
                                    "user.keyword": user.email
                                }
                            },
                            {
                                "bool": {
                                    "must_not": {
                                        "exists": {
                                            "field": "user"
                                        }
                                    }
                                }
                            }
                        ]
                    }
                }
            }

            const res = await search(query);
            props.searchRes(res);
        }
    }

    useEffect(() => {
        const q = {
            "aggs": {
                "meal_types": {
                    "terms": {
                        "field": "meal_type.keyword",
                        "size": 10000
                    }
                },
                "water_temps": {
                    "terms": {
                        "field": "water_temp.keyword",
                        "size": 10000
                    }
                },
                "allergens": {
                    "terms": {
                        "field": "allergens.keyword",
                        "size": 10000
                    }
                },
                "special": {
                    "terms": {
                        "field": "special.keyword",
                        "size": 10000
                    }
                }
            },
            "size": 0
        }

        search(q).then(res => {
            setMealTypes(res.aggregations.meal_types.buckets);
            setWaterTemps(res.aggregations.water_temps.buckets)
            setAllergens(res.aggregations.allergens.buckets)
            setSpecial(res.aggregations.special.buckets)
        });
    }, [])

    return (
        <div id="search-container">
            <div className="searchbar">
                <span className="icon">
                    <SearchIcon width={20} height={20} />
                </span>
                <span className="icon" onClick={() => setOpen(!open)}>
                    <SlidersIcon
                        width={20}
                        height={20}
                        stroke={open ? 'var(--primary)' : 'var(--fg)'} />
                </span>
                <input
                    type="text"
                    placeholder="Search"
                    onKeyDown={submit} />
            </div>
            <div className={open ? 'filters open' : 'filters'}>
                <div className="filters-content">
                    <div className="form-group">
                        <span className="title">Meal Type</span>
                        <CheckboxList buckets={mealTypes} />
                    </div>
                    <div className="form-group">
                        <span className="title">Water Temps</span>
                        <CheckboxList buckets={waterTemps} />
                    </div>
                    <div className="form-group">
                        <span className="title">Allergens</span>
                        <CheckboxList buckets={allergens} />
                    </div>
                    <div className="form-group">
                        <span className="title">Special</span>
                        <CheckboxList buckets={special} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SearchBar;