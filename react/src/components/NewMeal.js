import React, { useState } from 'react';
import { newDoc } from 'api';
import { ArrowLeft } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import Select from './Select';
import ThemeSwitcher from './ThemeSwitcher';

function NewMeal() {
    const navigate = useNavigate();
    const [name, setName] = useState(null);
    const [ingredients, setIngredients] = useState(null);
    const [meal_type, setMealType] = useState(null);
    const [water_temp, setWaterTemp] = useState(null);
    const [allergens, setAllergens] = useState(null);
    const [special, setSpecial] = useState(null);
    const [calories, setCalories] = useState(null);
    const [water_ml, setWaterMl] = useState(null);
    const [minutes, setMinutes] = useState(null);

    const submit = async () => {
        await newDoc({
            index: 'ratings',
            newDoc: {
                name,
                ingredients,
                meal_type,
                water_temp,
                allergens,
                special,
                calories,
                water_ml,
                minutes
            }
        });
    };

    return (
        <div id="new-meal">
            <div className="main">
                <div className="form-header">Create a New Meal</div>

                <div className="form-container">
                    <form>
                        {/* NAME */}
                        <div className="form-field">
                            <label htmlFor="name">Meal Name</label>
                            <input
                                type="text"
                                id="name"
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        {/* INGREDIENTS */}
                        <div className="form-field">
                            <label htmlFor="ingredients">Ingredients</label>
                            <textarea
                                id="ingredients"
                                onChange={(e) => setIngredients(e.target.value)}
                            />
                        </div>

                        {/* MEAL TYPE */}
                        <div className="form-field">
                            <label htmlFor="meal-type">Meal Type</label>
                            <Select
                                options={['breakfast', 'dessert', 'entree']}
                                onChange={setMealType}
                            />
                        </div>

                        {/* WATER TEMP */}
                        <div className="form-field">
                            <label htmlFor="water-temp">Water Temp</label>
                            <select
                                id="water-temp"
                                onChange={(e) => setWaterTemp(e.target.value)}>
                                <option value="boiling">boiling</option>
                                <option value="any">any</option>
                                <option value="cold">cold</option>
                                <option value="none">none</option>
                            </select>
                        </div>

                        {/* ALLERGENS */}
                        <div className="form-field">
                            <label htmlFor="allergens">Allergens</label>
                            <select
                                id="allergens"
                                onChange={(e) => setAllergens(e.target.value)}>
                                <option value="milk">milk</option>
                                <option value="wheat">wheat</option>
                                <option value="egg">egg</option>
                                <option value="soy">soy</option>
                                <option value="gluten">gluten</option>
                                <option value="coconut">coconut</option>
                                <option value="peanut">peanut</option>
                                <option value="almond">almond</option>
                                <option value="tree_nut">tree nut</option>
                            </select>
                        </div>

                        {/* SPECIAL */}
                        <div className="form-field">
                            <label htmlFor="special">Special Diet</label>
                            <select
                                id="special"
                                onChange={(e) => setSpecial(e.target.value)}>
                                <option value="vegan">vegan</option>
                                <option value="gluten_free">gluten_free</option>
                                <option value="vegetarian">vegetarian</option>
                            </select>
                        </div>

                        {/* CALORIES */}
                        <div className="form-field">
                            <label htmlFor="calories">Calories</label>
                            <input
                                type="number"
                                id="calories"
                                onChange={(e) => setCalories(e.target.value)}
                            />
                        </div>

                        {/* WATER ML */}
                        <div className="form-field">
                            <label htmlFor="water-ml">Water mL</label>
                            <input
                                type="number"
                                id="water-ml"
                                onChange={(e) => setWaterMl(e.target.value)}
                            />
                        </div>

                        {/* MINUTES */}
                        <div className="form-field">
                            <label htmlFor="minutes">Minutes</label>
                            <input
                                type="number"
                                id="minutes"
                                onChange={(e) => setMinutes(e.target.value)}
                            />
                        </div>
                    </form>
                </div>

                <div className="submit-container">
                    <button type="button" onClick={() => submit()}>
                        Submit
                    </button>
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
