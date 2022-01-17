import React, { useEffect, useState, useContext } from 'react';
import { addDoc } from 'api';
import {
    Activity,
    AlertCircle,
    AlertTriangle,
    ArrowLeft,
    Award,
    CheckCircle,
    Coffee,
    Droplet,
    FileText,
    Terminal,
    Thermometer,
    Watch
} from 'react-feather';
import { useNavigate } from 'react-router-dom';
import Select from './forms/Select';
import Input from './forms/Input';
import Textarea from './forms/Textarea';
import ThemeSwitcher from './ThemeSwitcher';
import { AppContext } from 'components/App';

function NewMeal() {
    const navigate = useNavigate();
    const { user } = useContext(AppContext);

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
        minutes: null,
        user: user.email
    });

    const [complete, setComplete] = useState(false);
    const [error, setError] = useState(null);

    const submit = async () => {
        try {
            await addDoc({
                index: 'meals',
                newDoc
            });

            setComplete(true);
            setError(null);

            setTimeout(() => {
                setComplete(false);
            }, 1000);
        } catch (e) {
            setComplete(false);
            setError(e);
        }
    };

    const updateDoc = (id, val) => {
        newDoc[id] = val;
        setNewDoc({ ...newDoc });
    };

    useEffect(() => {
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
                <div className="info">
                    Add a new meal to your database. This meal will only be
                    available for you to see.
                </div>

                <div className="form-container">
                    <div className="left">
                        <div className="header">Meal Info.</div>
                        {/* NAME */}
                        <div className="form-field">
                            <Input
                                type="text"
                                placeholder="Meal Name"
                                onChange={(val) => updateDoc('name', val)}>
                                <Terminal />
                            </Input>
                        </div>

                        {/* MEAL TYPE */}
                        <div className="form-field">
                            <Select
                                label="Meal Type"
                                options={['breakfast', 'dessert', 'entree']}
                                onChange={(val) => updateDoc('meal_type', val)}>
                                <Coffee />
                            </Select>
                        </div>

                        {/* CALORIES */}
                        <div className="form-field">
                            <Input
                                type="number"
                                placeholder="Calories"
                                onChange={(val) => updateDoc('calories', val)}>
                                <Activity />
                            </Input>
                        </div>

                        {/* WATER TEMP */}
                        <div className="form-field">
                            <Select
                                label="Water Temp."
                                options={['boiling', 'cold', 'any', 'none']}
                                onChange={(val) =>
                                    updateDoc('water_temp', val)
                                }>
                                <Thermometer />
                            </Select>
                        </div>

                        {/* WATER ML */}
                        <div className="form-field">
                            <Input
                                type="number"
                                placeholder="Water mL"
                                onChange={(val) => updateDoc('water_ml', val)}>
                                <Droplet />
                            </Input>
                        </div>

                        {/* MINUTES */}
                        <div className="form-field">
                            <Input
                                type="number"
                                placeholder="Minutes"
                                onChange={(val) => updateDoc('minutes', val)}>
                                <Watch />
                            </Input>
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
                                onChange={(val) => updateDoc('allergens', val)}>
                                <AlertTriangle />
                            </Select>
                            <div className="hint">Optional</div>
                        </div>

                        {/* SPECIAL */}
                        <div className="form-field">
                            <Select
                                multi={true}
                                label="Special Diet"
                                options={['vegan', 'vegetarian', 'gluten_free']}
                                onChange={(val) => updateDoc('special', val)}>
                                <Award />
                            </Select>
                            <div className="hint">Optional</div>
                        </div>
                    </div>

                    <div className="right">
                        <div className="header">Ingredients</div>
                        {/* INGREDIENTS */}
                        <div className="form-field">
                            <Textarea
                                rows={20}
                                placeholder="oatmeal, dried cherries, brown sugar..."
                                onChange={(val) =>
                                    updateDoc('ingredients', val)
                                }></Textarea>
                            <div className="hint">
                                Optional. List the ingredients, separated by
                                commas.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="toolbar">
                <div>
                    <button type="button" onClick={() => navigate('/')}>
                        <ArrowLeft />
                        <span>Back</span>
                    </button>
                    <ThemeSwitcher />
                </div>

                <div className="feedback">
                    {error ? (
                        <div className="error">
                            <AlertCircle />
                            Some error
                        </div>
                    ) : complete ? (
                        <div className="ok">
                            <CheckCircle />
                            Saved!
                        </div>
                    ) : null}
                </div>

                <div
                    title={
                        !valid
                            ? `Missing required fields: ${Object.entries(newDoc)
                                  .filter((e) => e[1] === null)
                                  .map((e) => e[0])}`
                            : 'Submit form'
                    }>
                    <button
                        type="button"
                        disabled={!valid}
                        onClick={() => submit()}>
                        <FileText />
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}

export default NewMeal;
