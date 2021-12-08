import React, { useContext, useEffect, useState } from 'react';
import { search } from 'api';
import { AppContext } from 'lib/App';
import CheckboxList from 'lib/CheckboxList';
import CustomSlider from 'lib/CustomSlider';
import { FileText, Search, Sliders } from 'react-feather';
import BackpackIcon from 'lib/icons/BackpackIcon';

function Toolbar(props) {
    const { setQuery, packOpen, setPackOpen, selection } = props;

    const { user } = useContext(AppContext);

    const [filtersOpen, setFiltersOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

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
                                        term: {
                                            user: user.email
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
        <div id="toolbar">
            <div className="search-bar">
                <div className="input-wrapper">
                    <span className="icon">
                        <Search />
                    </span>
                    <input
                        type="text"
                        id="search-input"
                        placeholder="Search by name, ingredients, or brand"
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
                <button
                    type="button"
                    title="Create Custom Meal"
                    onClick={() => setModalOpen(true)}>
                    <FileText color="currentColor" />
                </button>
                <button
                    type="button"
                    id="pack-button"
                    className={packOpen ? 'open' : ''}
                    title={packOpen ? 'Close Pack' : 'Open Pack'}
                    onClick={() => setPackOpen(!packOpen)}>
                    <div>
                        <BackpackIcon size={28} />
                        {selection.length > 0 ? (
                            <span className="badge">{selection.length}</span>
                        ) : null}
                    </div>
                </button>
                
            </div>

            <div className={filtersOpen ? 'filters open' : 'filters'}>
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

export default Toolbar;
