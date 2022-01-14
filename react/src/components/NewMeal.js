import React, { useEffect, useState } from 'react';
import { addDoc } from 'api';
import { ArrowLeft, FileText } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import Select from './Select';
import Text from './Text';
import ThemeSwitcher from './ThemeSwitcher';

function NewMeal() {
    const navigate = useNavigate();

    const [valid, setValid] = useState(false);
    const [newDoc, setNewDoc] = useState({
        name: null,
        ingredients: null,
        meal_type: null,
        water_temp: null,
        allergens: null,
        special: null,
        calories: null,
        water_ml: null,
        minutes: null
    });

    const submit = async () => {
        await addDoc({
            index: 'meals',
            newDoc
        });
    };

    const updateDoc = (id, val) => {
        newDoc[id] = val;
        setNewDoc({ ...newDoc });
    };

    useEffect(() => {
        console.log(newDoc);

        const entries = Object.entries(newDoc);

        // all fields required except ingredients, allergens, and special
        const values = entries
            .filter(
                (e) =>
                    e[0] !== 'ingredients' &&
                    e[0] !== 'allergens' &&
                    e[0] !== 'special'
            )
            .map((e) => e[1]);

        const valid = values.every(
            (v) =>
                v !== null &&
                v !== undefined &&
                v !== '' &&
                (Array.isArray(v) ? v.length > 0 : true) &&
                (typeof v === 'number' ? v >= 0 : true)
        );

        setValid(valid);
    }, [newDoc]);

    return (
        <div id="new-meal">
            <div className="main">
                <div className="form-header">
                    <div>Create a New Meal</div>
                    <button
                        type="button"
                        disabled={!valid}
                        onClick={() => submit()}>
                        <FileText />
                        Submit
                    </button>
                </div>

                <div className="form-container">
                    <form>
                        {/* NAME */}
                        <div className="form-field">
                            <Text
                                type="text"
                                label="Name"
                                id="name"
                                onChange={(val) => updateDoc('name', val)}
                            />
                        </div>

                        {/* MEAL TYPE */}
                        <div className="form-field">
                            <Select
                                label="Meal Type"
                                options={['breakfast', 'dessert', 'entree']}
                                onChange={(val) => updateDoc('meal_type', val)}
                            />
                        </div>

                        {/* CALORIES */}
                        <div className="form-field">
                            <Text
                                type="number"
                                label="Calories"
                                onChange={(val) => updateDoc('calories', val)}
                            />
                        </div>

                        {/* WATER TEMP */}
                        <div className="form-field">
                            <Select
                                label="Water Temp."
                                options={['boiling', 'cold', 'any', 'none']}
                                onChange={(val) => updateDoc('water_temp', val)}
                            />
                        </div>

                        {/* WATER ML */}
                        <div className="form-field">
                            <Text
                                type="number"
                                label="Water mL"
                                onChange={(val) => updateDoc('water_ml', val)}
                            />
                        </div>

                        {/* MINUTES */}
                        <div className="form-field">
                            <Text
                                type="number"
                                label="Minutes"
                                onChange={(val) => updateDoc('minutes', val)}
                            />
                        </div>

                        <div className="optional">
                            <div className="hr"></div>
                            <div>Optional</div>
                            <div className="hr"></div>
                        </div>

                        {/* INGREDIENTS */}
                        <div className="form-field">
                            <Text
                                textarea={true}
                                label="Ingredients"
                                onChange={(val) =>
                                    updateDoc('ingredients', val)
                                }
                            />
                            <div className="hint">
                                Please use a comma-separated list.
                            </div>
                        </div>

                        {/* ALLERGENS */}
                        <div className="form-field">
                            <Select
                                multi={true}
                                label="Allergens"
                                options={[
                                    'almond',
                                    'coconut',
                                    'egg',
                                    'gluten',
                                    'milk',
                                    'peanut',
                                    'soy',
                                    'tree nut',
                                    'wheat'
                                ]}
                                onChange={(val) => updateDoc('allergens', val)}
                            />
                        </div>

                        {/* SPECIAL */}
                        <div className="form-field">
                            <Select
                                multi={true}
                                label="Special Diet"
                                options={['vegan', 'vegetarian', 'gluten_free']}
                                onChange={(val) => updateDoc('special', val)}
                            />
                        </div>
                    </form>
                </div>
            </div>

            <div className="toolbar">
                <button type="button" onClick={() => navigate('/')}>
                    <ArrowLeft />
                    <span>Back</span>
                </button>
                <ThemeSwitcher />
            </div>
        </div>
    );
}

export default NewMeal;
