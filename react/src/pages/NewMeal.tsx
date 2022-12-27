import { useEffect, useState, useContext } from 'react';
import './NewMeal.css';
import { addDoc } from '../api';
import {
    Activity,
    AlertCircle,
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
import { Select } from '../components/forms/Select';
import { Input } from '../components/forms/Input';
import { Textarea } from '../components/forms/Textarea';
import { ThemeSwitcher } from '../components/ThemeSwitcher';
import { AppContext } from '../App';

export const NewMeal = () => {
    const navigate = useNavigate();

    const { user } = useContext(AppContext);

    const [complete, setComplete] = useState(false);
    const [error, setError] = useState(null);
    const [valid, setValid] = useState(false);

    const [fields, setFields] = useState<any>({
        name: { value: null, touched: false, required: true },
        meal_type: { value: null, touched: false, required: true },
        calories: { value: null, touched: false, required: true },
        water_temp: { value: null, touched: false, required: true },
        water_ml: { value: null, touched: false, required: true },
        minutes: { value: null, touched: false, required: true },
        allergens: { value: null, touched: false, required: false },
        special: { value: null, touched: false, required: false },
        ingredients: { value: null, touched: false, required: false }
    });

    const requiredDiv = (
        <div className="hint error">This is a required field</div>
    );

    const submit = async () => {
        const newDoc: any = {
            user: user.email
        };

        Object.entries(fields).forEach((e: any) => {
            if (
                e[0] === 'calories' ||
                e[0] === 'minutes' ||
                e[0] === 'water_ml'
            ) {
                e[1].value = Number(e[1].value);
            }

            newDoc[e[0]] = e[1].value;
        });

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
        } catch (e: any) {
            setComplete(false);
            setError(e);
        }
    };

    const handleChange = (id: any, val: any) => {
        fields[id].value = val;
        setFields({ ...fields });
    };

    const setTouched = (id: string) => {
        fields[id].touched = true;
        setFields({ ...fields });
    };

    // field level validation
    const isValid = (id: string) => {
        if (fields[id].required && fields[id].touched) {
            return !!fields[id].value;
        } else {
            return true;
        }
    };

    // form level validation
    useEffect(() => {
        const entries = Object.entries(fields);

        const valid = entries
            .filter((e: any) => e[1].required)
            .map((e: any) => e[1].value)
            .every(
                (v) =>
                    v &&
                    (Array.isArray(v) ? v.length > 0 : true) &&
                    (typeof v === 'number' ? v >= 0 : true)
            );

        setValid(valid);
    }, [fields]);

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
                        <div className="form-field" title="Meal name">
                            <Input
                                type="text"
                                placeholder="Meal Name"
                                onChange={(val: string) =>
                                    handleChange('name', val)
                                }
                                onBlur={() => setTouched('name')}
                                hasError={!isValid('name')}
                            >
                                <Terminal />
                            </Input>
                            {!isValid('name') ? requiredDiv : null}
                        </div>

                        {/* MEAL TYPE */}
                        <div className="form-field" title="Meal type">
                            <Select
                                label="Meal Type"
                                options={[
                                    'breakfast',
                                    'dessert',
                                    'entree',
                                    'snack'
                                ]}
                                onChange={(val: string) =>
                                    handleChange('meal_type', val)
                                }
                                onClose={() => {
                                    setTimeout(() => {
                                        setTouched('meal_type');
                                    }, 100);
                                    return null;
                                }}
                                hasError={!isValid('meal_type')}
                            >
                                <Coffee />
                            </Select>
                            {!isValid('meal_type') ? requiredDiv : null}
                        </div>

                        {/* CALORIES */}
                        <div className="form-field" title="Calories">
                            <Input
                                type="number"
                                placeholder="Calories"
                                onChange={(val: string) =>
                                    handleChange('calories', val)
                                }
                                onBlur={() => setTouched('calories')}
                                hasError={!isValid('calories')}
                            >
                                <Activity />
                            </Input>
                            {!isValid('calories') ? requiredDiv : null}
                        </div>

                        {/* WATER TEMP */}
                        <div className="form-field" title="Water temp.">
                            <Select
                                label="Water Temp."
                                options={['boiling', 'cold', 'any', 'none']}
                                onChange={(val: string) =>
                                    handleChange('water_temp', val)
                                }
                                onClose={() => {
                                    setTimeout(() => {
                                        setTouched('water_temp');
                                    }, 100);
                                    return null;
                                }}
                                hasError={!isValid('water_temp')}
                            >
                                <Thermometer />
                            </Select>
                            {!isValid('water_temp') ? requiredDiv : null}
                        </div>

                        {/* WATER ML */}
                        <div className="form-field" title="Water mL">
                            <Input
                                type="number"
                                placeholder="Water mL"
                                onChange={(val: string) =>
                                    handleChange('water_ml', val)
                                }
                                onBlur={() => setTouched('water_ml')}
                                hasError={!isValid('water_ml')}
                            >
                                <Droplet />
                            </Input>
                            {!isValid('water_ml') ? requiredDiv : null}
                        </div>

                        {/* MINUTES */}
                        <div className="form-field" title="Minutes">
                            <Input
                                type="number"
                                placeholder="Minutes"
                                onChange={(val: string) =>
                                    handleChange('minutes', val)
                                }
                                onBlur={() => setTouched('minutes')}
                                hasError={!isValid('minutes')}
                            >
                                <Watch />
                            </Input>
                            {!isValid('minutes') ? requiredDiv : null}
                        </div>

                        {/* ALLERGENS */}
                        <div className="form-field" title="Allergens">
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
                                onChange={(val: string) =>
                                    handleChange('allergens', val)
                                }
                            >
                                <AlertCircle />
                            </Select>
                            <div className="hint">Optional</div>
                        </div>

                        {/* SPECIAL */}
                        <div className="form-field" title="Special diet">
                            <Select
                                multi={true}
                                label="Special Diet"
                                options={['vegan', 'vegetarian', 'gluten_free']}
                                onChange={(val: string) =>
                                    handleChange('special', val)
                                }
                            >
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
                                onChange={(val: string) =>
                                    handleChange('ingredients', val)
                                }
                            ></Textarea>
                            <div className="hint">
                                Optional. List the ingredients, separated by
                                commas.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* TODO - use the Toolbar component */}
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
                            {error}
                        </div>
                    ) : complete ? (
                        <div className="ok">
                            <CheckCircle />
                            Saved!
                        </div>
                    ) : null}
                </div>

                <div title={!valid ? `Missing required fields` : 'Submit form'}>
                    <button
                        type="button"
                        disabled={!valid}
                        onClick={() => submit()}
                    >
                        <FileText />
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};
