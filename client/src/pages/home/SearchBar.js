import React, { useContext, useEffect, useState } from 'react';
import { search } from 'api';
import SearchIcon from 'static/icons/SearchIcon';
import SlidersIcon from 'static/icons/SlidersIcon';
import { AppContext } from 'shared/App';
import CheckboxList from './CheckboxList';
import CustomSlider from './CustomSlider';

function SearchBar(props) {
    const user = useContext(AppContext);

    const [open, setOpen] = useState(false);
    const [mealTypes, setMealTypes] = useState([]);
    const [waterTemps, setWaterTemps] = useState([]);
    const [allergens, setAllergens] = useState([]);
    const [special, setSpecial] = useState([]);

    const [calories, setCalories] = useState({ min: 0, max: 0, range: [] });
    const [minutes, setMinutes] = useState({ min: 0, max: 0, range: [] });
    const [waterMl, setWaterMl] = useState({ min: 0, max: 0, range: [] });

    const [inputValue, setInputValue] = useState('');
    const [filters, setFilters] = useState([]); // term and range filters

    const handleFilter = (filterObj) => {
        // create the new filter
        let newFilter;

        if (filterObj.type === 'terms') {
            newFilter = {
                "terms": {
                    [filterObj.name]: filterObj.values
                }
            }
        }

        if (filterObj.type === 'range') {
            newFilter = {
                "range": {
                    [filterObj.name]: {
                        "gte": filterObj.values[0],
                        "lte": filterObj.values[1]
                    }
                }
            }
        }

        // remove any existing filters with the same name
        const filtered = filters.filter(f => {
            const firstKey = Object.keys(f)[0];
            return !(filterObj.name in f[firstKey])
        });

        // add new filter
        setFilters([...filtered, newFilter]);
    }

    const handleInput = (event) => {
        setTimeout(() => {
            if (event.key === 'Enter' || event.target.value === '') {
                setInputValue(event.target.value);
            }
        }, 1);
    }

    // search
    useEffect(() => {
        const query = {
            "query": {
                "bool": {
                    "must": [
                        {
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
                    ]
                }
            },
            "size": 10000
        }

        if (inputValue && inputValue !== '') {
            query.query.bool.must.push({
                "bool": {
                    "should": [
                        {
                            "match_bool_prefix": {
                                "name": inputValue
                            }
                        },
                        {
                            "match_bool_prefix": {
                                "brand": inputValue
                            }
                        },
                        {
                            "match_bool_prefix": {
                                "ingredients": inputValue
                            }
                        }
                    ]
                }
            })
        } else {
            query.query.bool.must.push({
                "match_all": {}
            })
        }

        filters.forEach(filter => query.query.bool.must.push(filter));

        search(query).then(res => props.searchRes(res));
    }, [inputValue, filters])

    // init
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
                },
                "max_calories": {
                    "max": {
                        "field": "calories"
                    }
                },
                "min_calories": {
                    "min": {
                        "field": "calories"
                    }
                },
                "max_minutes": {
                    "max": {
                        "field": "minutes"
                    }
                },
                "min_minutes": {
                    "min": {
                        "field": "minutes"
                    }
                },
                "max_water_ml": {
                    "max": {
                        "field": "water_ml"
                    }
                },
                "min_water_ml": {
                    "min": {
                        "field": "water_ml"
                    }
                }
            },
            "size": 0
        }

        search(q).then(res => {
            setMealTypes(res.aggregations.meal_types.buckets);
            setWaterTemps(res.aggregations.water_temps.buckets);
            setAllergens(res.aggregations.allergens.buckets);
            setSpecial(res.aggregations.special.buckets);

            setCalories({
                min: res.aggregations.min_calories.value,
                max: res.aggregations.max_calories.value,
                range: [res.aggregations.min_calories.value, res.aggregations.max_calories.value]
            });
            setMinutes({
                min: res.aggregations.min_minutes.value,
                max: res.aggregations.max_minutes.value,
                range: [res.aggregations.min_minutes.value, res.aggregations.max_minutes.value]
            });
            setWaterMl({
                min: res.aggregations.min_water_ml.value,
                max: res.aggregations.max_water_ml.value,
                range: [res.aggregations.min_water_ml.value, res.aggregations.max_water_ml.value]
            });
        });
    }, [])

    return (
        <div id="search-container">

            {/* INPUT */}
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
                    id="search-input"
                    placeholder="Search"
                    onKeyDown={handleInput} />
            </div>

            {/* FILTERS */}
            <div className={open ? 'filter-drawer open' : 'filter-drawer'}>
                <div className="sliders">
                    <div className="filter-group">
                        <span>Calories</span>
                        <CustomSlider
                            name="calories"
                            min={calories.min}
                            max={calories.max}
                            setRange={handleFilter} />
                    </div>
                    <div className="filter-group">
                        <span>Cook Time (minutes)</span>
                        <CustomSlider
                            name="minutes"
                            min={minutes.min}
                            max={minutes.max}
                            setRange={handleFilter} />
                    </div>
                    <div className="filter-group">
                        <span>Water Needed (mL)</span>
                        <CustomSlider
                            name="waterMl"
                            min={waterMl.min}
                            max={waterMl.max}
                            setRange={handleFilter} />
                    </div>
                </div>
                <div className="checkboxes">
                    <div className="filter-group">
                        <span className="title">Meal Type</span>
                        <CheckboxList
                            buckets={mealTypes}
                            name="meal_type"
                            setSelection={handleFilter} />
                    </div>
                    <div className="filter-group">
                        <span className="title">Water Temps</span>
                        <CheckboxList
                            buckets={waterTemps}
                            name="water_temp"
                            setSelection={handleFilter} />
                    </div>
                    <div className="filter-group">
                        <span className="title">Allergens</span>
                        <CheckboxList
                            buckets={allergens}
                            name="allergens"
                            setSelection={handleFilter} />
                    </div>
                    <div className="filter-group">
                        <span className="title">Special</span>
                        <CheckboxList
                            buckets={special}
                            name="special"
                            setSelection={handleFilter} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SearchBar;