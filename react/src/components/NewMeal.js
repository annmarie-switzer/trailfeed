import React, { useState } from 'react';
import { newDoc } from 'api';
import { ArrowLeft } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import Select from './Select';
import Text from './Text';
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
                        <Text type="text" label="Name" onChange={setName} />

                        {/* INGREDIENTS */}
                        <Text
                            textarea={true}
                            label="Ingredients"
                            onChange={setIngredients}
                        />

                        {/* MEAL TYPE */}
                        <Select
                            label="Meal Type"
                            options={['breakfast', 'dessert', 'entree']}
                            onChange={setMealType}
                        />

                        {/* WATER TEMP */}
                        <Select
                            label="Water Temp."
                            options={['boiling', 'cold', 'any', 'none']}
                            onChange={setWaterTemp}
                        />

                        {/* ALLERGENS */}
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
                            onChange={setAllergens}
                        />

                        {/* SPECIAL */}
                        <Select
                            multi={true}
                            label="Special Diet"
                            options={['vegan', 'vegetarian', 'gluten_free']}
                            onChange={setSpecial}
                        />

                        {/* CALORIES */}
                        <Text
                            type="number"
                            label="Calories"
                            onChange={setCalories}
                        />

                        {/* WATER ML */}
                        <Text
                            type="number"
                            label="Water mL"
                            onChange={setWaterMl}
                        />

                        {/* MINUTES */}
                        <Text
                            type="number"
                            label="Minutes"
                            onChange={setMinutes}
                        />
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
