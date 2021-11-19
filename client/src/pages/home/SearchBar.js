import React, { useContext, useEffect, useState } from 'react';
import { search } from 'api';
import SearchIcon from 'lib/icons/SearchIcon';
import SlidersIcon from 'lib/icons/SlidersIcon';
import { AppContext } from 'lib/App';
import CheckboxList from 'lib/CheckboxList';
import CustomSlider from 'lib/CustomSlider';

function SearchBar(props) {
    const { user } = useContext(AppContext);

    const [open, setOpen] = useState(false);
    const [mealTypes, setMealTypes] = useState([]);
    const [waterTemps, setWaterTemps] = useState([]);
    const [allergens, setAllergens] = useState([]);
    const [special, setSpecial] = useState([]);
    const [calories, setCalories] = useState({ min: 0, max: 0 });
    const [minutes, setMinutes] = useState({ min: 0, max: 0 });
    const [waterMl, setWaterMl] = useState({ min: 0, max: 0 });
    const [inputValue, setInputValue] = useState('');
    const [filters, setFilters] = useState([]);

    const handleFilter = (filterObj) => {
        // remove any existing filters with the same name
        const filtered = filters.filter((f) => f.name !== filterObj.name);

        // If the filter has values, normalize it and add it to the filters array
        if (filterObj.values.length > 0) {
            let newFilter = {
                name: filterObj.name,
                query: {}
            };

            if (filterObj.type === 'terms') {
                const termsQuery = {
                    terms: {
                        [filterObj.name]: filterObj.values
                    }
                };

                if (filterObj.name === 'allergens.keyword') {
                    newFilter.query = {
                        bool: {
                            must_not: [termsQuery]
                        }
                    };
                } else {
                    newFilter.query = termsQuery;
                }
            }

            if (filterObj.type === 'range') {
                newFilter.query = {
                    range: {
                        [filterObj.name]: {
                            gte: filterObj.values[0],
                            lte: filterObj.values[1]
                        }
                    }
                };
            }

            setFilters([...filtered, newFilter]);
        } else {
            setFilters(filtered);
        }
    };

    const handleInput = (event) => {
        setTimeout(() => {
            if (event.key === 'Enter' || event.target.value === '') {
                setInputValue(event.target.value);
            }
        }, 1);
    };

    // search
    useEffect(() => {
        const query = {
            query: {
                bool: {
                    must: [
                        {
                            bool: {
                                should: [
                                    {
                                        term: {
                                            'user.keyword': user.email
                                        }
                                    },
                                    {
                                        bool: {
                                            must_not: {
                                                exists: {
                                                    field: 'user'
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
            size: 10000
        };

        if (inputValue && inputValue !== '') {
            query.query.bool.must.push({
                bool: {
                    should: [
                        {
                            match_bool_prefix: {
                                name: inputValue
                            }
                        },
                        {
                            match_bool_prefix: {
                                brand: inputValue
                            }
                        },
                        {
                            match_bool_prefix: {
                                ingredients: inputValue
                            }
                        }
                    ]
                }
            });
        } else {
            query.query.bool.must.push({
                match_all: {}
            });
        }

        filters.forEach((filter) => query.query.bool.must.push(filter.query));

        search(query).then((res) => props.searchRes(res));
    }, [inputValue, filters]);

    // on mount
    useEffect(() => {
        const q = {
            aggs: {
                meal_types: {
                    terms: {
                        field: 'meal_type.keyword',
                        size: 10000
                    }
                },
                water_temps: {
                    terms: {
                        field: 'water_temp.keyword',
                        size: 10000
                    }
                },
                allergens: {
                    terms: {
                        field: 'allergens.keyword',
                        size: 10000
                    }
                },
                special: {
                    terms: {
                        field: 'special.keyword',
                        size: 10000
                    }
                },
                max_calories: {
                    max: {
                        field: 'calories'
                    }
                },
                min_calories: {
                    min: {
                        field: 'calories'
                    }
                },
                max_minutes: {
                    max: {
                        field: 'minutes'
                    }
                },
                min_minutes: {
                    min: {
                        field: 'minutes'
                    }
                },
                max_water_ml: {
                    max: {
                        field: 'water_ml'
                    }
                },
                min_water_ml: {
                    min: {
                        field: 'water_ml'
                    }
                }
            },
            size: 0
        };

        search(q).then((res) => {
            setMealTypes(res.aggregations.meal_types.buckets);
            setWaterTemps(res.aggregations.water_temps.buckets);
            setAllergens(res.aggregations.allergens.buckets);
            setSpecial(res.aggregations.special.buckets);

            setCalories({
                min: res.aggregations.min_calories.value,
                max: res.aggregations.max_calories.value
            });
            setMinutes({
                min: res.aggregations.min_minutes.value,
                max: res.aggregations.max_minutes.value
            });
            setWaterMl({
                min: res.aggregations.min_water_ml.value,
                max: res.aggregations.max_water_ml.value
            });
        });
    }, []);

    return (
        <div id="search-container">
            {/* INPUT */}
            <div className="searchbar">
                <span className="icon">
                    <SearchIcon width={24} height={24} />
                </span>
                <input
                    type="text"
                    id="search-input"
                    placeholder="Search by name or brand"
                    onKeyDown={handleInput}
                />
                <button
                    type="button"
                    style={{
                        backgroundColor: open ? 'var(--accent)' : '',
                        color: open ? 'var(--bg)' : 'var(--accent)'
                    }}
                    onClick={() => setOpen(!open)}>
                    <SlidersIcon width={24} height={24} stroke="currentColor" />
                </button>
            </div>

            {/* FILTERS */}
            <div className={open ? 'filter-drawer open' : 'filter-drawer'}>
                <div className="sliders">
                    <div className="filter-group">
                        <CustomSlider
                            name="calories"
                            label="Calories"
                            min={calories.min}
                            max={calories.max}
                            setRange={handleFilter}
                        />
                    </div>
                    <div className="filter-group">
                        <CustomSlider
                            name="minutes"
                            label="Cook Time (min)"
                            min={minutes.min}
                            max={minutes.max}
                            setRange={handleFilter}
                        />
                    </div>
                    <div className="filter-group">
                        <CustomSlider
                            name="waterMl"
                            label="Water Needed (mL)"
                            min={waterMl.min}
                            max={waterMl.max}
                            setRange={handleFilter}
                        />
                    </div>
                </div>
                <div className="checkboxes">
                    <div className="filter-group">
                        <span className="title">Meal Type</span>
                        <CheckboxList
                            buckets={mealTypes}
                            group="meal_type"
                            setSelection={handleFilter}
                        />
                    </div>
                    <div className="filter-group">
                        <span className="title">Water Temps</span>
                        <CheckboxList
                            buckets={waterTemps}
                            group="water_temp"
                            setSelection={handleFilter}
                        />
                    </div>
                    <div className="filter-group">
                        <span className="title">Allergens</span>
                        <CheckboxList
                            buckets={allergens}
                            group="allergens"
                            setSelection={handleFilter}
                        />
                    </div>
                    <div className="filter-group">
                        <span className="title">Special</span>
                        <CheckboxList
                            buckets={special}
                            group="special"
                            setSelection={handleFilter}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SearchBar;
