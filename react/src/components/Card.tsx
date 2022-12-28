import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../App';
import { deleteMeal } from '../api';
import './Card.css';
import { Checkbox } from './Checkbox';
import { Stars } from './Stars';
import { MealName } from './MealName';
import {
    Activity,
    Award,
    BarChart2,
    Coffee,
    Droplet,
    Feather,
    AlertCircle,
    List,
    Thermometer,
    Trash,
    Watch
} from 'react-feather';
import { MealDoc } from '../type';

type CardProps = {
    hit: MealDoc;
    handleSelection: (hit: MealDoc) => void;
    handleDelete: () => void;
};

export const Card = ({ hit, handleSelection, handleDelete }: CardProps) => {
    const { selection } = useContext(AppContext);

    const [ids, setIds] = useState<string[]>([]);
    const [showIngredients, setShowIngredients] = useState(false);

    const onDelete = async (id: string) => {
        const res = await deleteMeal(id);

        if (res.result === 'deleted') {
            handleDelete();
        }
    };

    useEffect(() => {
        setIds(selection.map((s) => s.id));
    }, [selection]);

    return (
        <div className="card">
            <div className="card-header">
                <div className="name-container">
                    <MealName name={hit.name} link={hit.link} />
                    <span
                        title={
                            ids.includes(hit.id)
                                ? 'Remove from pack'
                                : 'Add to pack'
                        }
                    >
                        <Checkbox toggle={() => handleSelection(hit)} />
                    </span>
                </div>
                <span className="brand">{hit.brand || 'You made this!'}</span>
                <Stars mealId={hit.id} ratingDoc={hit.ratingDoc} />
            </div>
            <div className="card-content">
                {showIngredients ? (
                    <div>{hit.ingredients}</div>
                ) : (
                    <>
                        <div className="list">
                            <div className="list-item" title="calories">
                                <Activity size={20} />
                                <span>{hit.calories} cal</span>
                            </div>
                            <div className="list-item" title="net weight (oz.)">
                                <Feather size={20} />
                                <span>{hit.ounces} oz</span>
                            </div>
                            <div
                                className="list-item"
                                title="ounces per calorie"
                            >
                                <BarChart2 size={20} />
                                <span>
                                    {Math.round(hit.calories / hit.ounces)}{' '}
                                    cal/oz{' '}
                                </span>
                            </div>
                            {hit.allergens.length > 0 && (
                                <div className="list-item" title="Allergens">
                                    <AlertCircle size={20} />
                                    <div>
                                        {hit.allergens.map(
                                            (a: string, i: number) => (
                                                <span key={i}>
                                                    {i > 0 ? ', ' : null}
                                                    {a.replace('_', ' ')}
                                                </span>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}
                            {hit.special.length > 0 && (
                                <div className="list-item" title="Special Diet">
                                    <Award size={20} />
                                    <div>
                                        {hit.special.map(
                                            (s: string, i: number) => (
                                                <span key={i}>
                                                    {i > 0 ? ', ' : null}
                                                    {s.replace('_', ' ')}
                                                </span>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="list">
                            <div
                                className="list-item"
                                title="water required (mL)"
                            >
                                <Droplet size={20} />
                                <span>{hit.water_ml} mL</span>
                            </div>
                            <div className="list-item" title="water temp.">
                                <Thermometer size={20} />
                                <span>{hit.water_temp}</span>
                            </div>
                            <div
                                className="list-item"
                                title="cook time (minutes)"
                            >
                                <Watch size={20} />
                                <span>{hit.minutes} min</span>
                            </div>
                            <div className="list-item" title="meal type">
                                <Coffee size={20} />
                                <div>
                                    {hit.meal_type.map(
                                        (a: string, i: number) => (
                                            <span key={i}>
                                                {i > 0 ? ', ' : null}
                                                {a.replace('_', ' ')}
                                            </span>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
            <div className="card-footer">
                {!hit.brand && (
                    <button type="button" title="Delete meal">
                        <Trash size={22} onClick={() => onDelete(hit.id)} />
                    </button>
                )}
                <button
                    type="button"
                    title={`${showIngredients ? 'Hide' : 'Show'} ingredients`}
                >
                    <List
                        size={22}
                        color={showIngredients ? 'var(--info)' : 'currentColor'}
                        onClick={() => setShowIngredients((curr) => !curr)}
                    />
                </button>
            </div>
        </div>
    );
};
