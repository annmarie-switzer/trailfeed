import React, { useContext, useEffect, useState } from 'react';
import { search } from 'api';
import SearchIcon from 'static/icons/SearchIcon';
import SlidersIcon from 'static/icons/SlidersIcon';
import { AppContext } from 'shared/App';
import CheckboxList from './CheckboxList';
import Slider from '@mui/material/Slider';

function SearchBar(props) {
    const user = useContext(AppContext);

    const [open, setOpen] = useState(false);
    const [mealTypes, setMealTypes] = useState([]);
    const [waterTemps, setWaterTemps] = useState([]);
    const [allergens, setAllergens] = useState([]);
    const [special, setSpecial] = useState([]);
    const [calories, setCalories] = useState({min: 0, max: 0, range: []});
    
    const [inputValue, setInputValue] = useState('');
    const [filters, setFilters] = useState([]); // array of terms queries
    
    const onFilter = (selectionObj) => {
        const exists = filters.find(f => selectionObj.name in f.terms);

        if (exists) {
            if (selectionObj.values.length > 0) {
                const existingVals = exists.terms[selectionObj.name];
                const filteredVals = existingVals.filter(val => selectionObj.values.includes(val))

                exists.terms[selectionObj.name] = [...new Set([...filteredVals, ...selectionObj.values])];

                setFilters([...filters]);
            } else {
                setFilters([...filters.filter(f => !(selectionObj.name in f.terms))])
            }
        } else {
            const termsQuery = {
                "terms": {
                    [selectionObj.name]: selectionObj.values
                }
            }
            setFilters([...filters, termsQuery])
        }
    }

    const onInput = (event) => {
        setTimeout(() => {
            if (event.key === 'Enter' || event.target.value === '') {
                setInputValue(event.target.value);
            }
        }, 1);
    }

    // search
    useEffect(() => {
        console.log('searching')
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleCalories = (event) => {
        setCalories({...calories, range: event.target.value})
    }

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
                    id="search-input"
                    placeholder="Search"
                    onKeyDown={onInput} />
            </div>
            <div className={open ? 'filters open' : 'filters'}>
                <div className="filters-content">

                    <div className="form-group">
                        <Slider
                            min={calories.min}
                            max={calories.max}
                            value={calories.range}
                            onChange={handleCalories}
                            valueLabelDisplay="auto"
                        />
                    </div>

                    <div className="form-group">
                        <span className="title">Meal Type</span>
                        <CheckboxList buckets={mealTypes} name="meal_type" setSelection={onFilter} />
                    </div>
                    <div className="form-group">
                        <span className="title">Water Temps</span>
                        <CheckboxList buckets={waterTemps} name="water_temp" setSelection={onFilter} />
                    </div>
                    <div className="form-group">
                        <span className="title">Allergens</span>
                        <CheckboxList buckets={allergens} name="allergens" setSelection={onFilter} />
                    </div>
                    <div className="form-group">
                        <span className="title">Special</span>
                        <CheckboxList buckets={special} name="special" setSelection={onFilter} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SearchBar;