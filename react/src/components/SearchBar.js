import React, { useContext, useEffect, useState } from 'react';
import './SearchBar.css';
import { search } from 'api';
import { AppContext } from 'components/App';
import CheckboxList from 'components/CheckboxList';
import RangeSlider from 'components/forms/RangeSlider';
import { Search, Sliders } from 'react-feather';

function SearchBar(props) {
    const { setQuery } = props;

    const { user } = useContext(AppContext);

    const [filtersOpen, setFiltersOpen] = useState(false);

    const [mealTypes, setMealTypes] = useState([]);
    const [waterTemps, setWaterTemps] = useState([]);
    const [allergens, setAllergens] = useState([]);
    const [special, setSpecial] = useState([]);
    const [calories, setCalories] = useState({ min: 0, max: 0 });
    const [minutes, setMinutes] = useState({ min: 0, max: 0 });
    const [waterMl, setWaterMl] = useState({ min: 0, max: 0 });
    const [ounces, setOunces] = useState({ min: 0, max: 0 });

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

                if (filterObj.name === 'allergens') {
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
            size: 20
        };

        if (user.email) {
            query.query.bool.must[0].bool.should.push({
                term: {
                    user: user.email
                }
            });
        }

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

        setQuery(query);
    }, [inputValue, filters]);

    // on mount
    useEffect(() => {
        const q = {
            aggs: {
                meal_types: {
                    terms: {
                        field: 'meal_type',
                        size: 10000
                    }
                },
                water_temps: {
                    terms: {
                        field: 'water_temp',
                        size: 10000
                    }
                },
                allergens: {
                    terms: {
                        field: 'allergens',
                        size: 10000
                    }
                },
                special: {
                    terms: {
                        field: 'special',
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
                },
                max_ounces: {
                    max: {
                        field: 'ounces'
                    }
                },
                min_ounces: {
                    min: {
                        field: 'ounces'
                    }
                }
            },
            size: 0
        };

        search({ query: q, index: 'meals' }).then((res) => {
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

            setOunces({
                min: parseFloat(res.aggregations.min_ounces.value.toFixed(1)),
                max: parseFloat(res.aggregations.max_ounces.value.toFixed(1))
            });
        });
    }, []);

    return (
        <div id="searchbar">
            <div className="top-bar">
                <div className="input-wrapper">
                    <span className="icon">
                        <Search />
                    </span>
                    <input
                        type="text"
                        id="search-input"
                        placeholder="Search by name, ingredients, or brand"
                        autoComplete="off"
                        onKeyDown={handleInput}
                    />
                </div>
                <button
                    type="button"
                    className={filtersOpen ? 'open' : ''}
                    title={filtersOpen ? 'Hide Filters' : 'Show Filters'}
                    onClick={() => setFiltersOpen(!filtersOpen)}>
                    <Sliders color="currentColor" />
                </button>
            </div>

            <div className={filtersOpen ? 'filters open' : 'filters'}>
                <div className="sliders">
                    <div className="filter-group">
                        <RangeSlider
                            name="calories"
                            label="Calories"
                            min={calories.min}
                            max={calories.max}
                            setRange={handleFilter}
                        />
                    </div>
                    <div className="filter-group">
                        <RangeSlider
                            name="minutes"
                            label="Cook Time (min)"
                            min={minutes.min}
                            max={minutes.max}
                            setRange={handleFilter}
                        />
                    </div>
                    <div className="filter-group">
                        <RangeSlider
                            name="waterMl"
                            label="Water Needed (mL)"
                            min={waterMl.min}
                            max={waterMl.max}
                            setRange={handleFilter}
                        />
                    </div>
                    <div className="filter-group">
                        <RangeSlider
                            name="ounces"
                            label="Net Weight (oz)"
                            min={ounces.min}
                            max={ounces.max}
                            step={0.1}
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
