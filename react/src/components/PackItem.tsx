import { useContext, useEffect, useState } from 'react';
import { MealDoc } from '../type';
import { AppContext } from '../App';
import { Minus, Plus, Trash } from 'react-feather';
import './PackItem.css';
import clsx from 'clsx';

type PackItemProps = {
    meal: MealDoc;
    key: number;
};

export const PackItem = ({ meal, key }: PackItemProps) => {
    const { selection, setSelection } = useContext(AppContext);

    const [count, setCount] = useState(1);

    const increment = () => setSelection((curr) => [...curr, meal]);

    const decrement = () =>
        setSelection((curr) => {
            const removeIdx = curr.findIndex((m) => m.id === meal.id);
            return curr.splice(removeIdx, 1);
        });

    const deselect = (meal: MealDoc) => {
        setSelection(selection.filter((s) => s.id !== meal.id));
    };

    useEffect(() => {
        const meals = selection.filter((m) => m.id === meal.id);
        if (meals.length > 0) {
            setCount(meals.length);
        }
    }, [selection]);

    return (
        <div className={key % 2 === 0 ? 'pack-item even' : 'pack-item'}>
            <div className="count">
                <input type="number" min="1" value={count} />
                <Minus
                    size={14}
                    color="currentColor"
                    onClick={decrement}
                    className={clsx(
                        'button',
                        'decrement',
                        count === 1 && 'disabled'
                    )}
                />
                <Plus
                    size={14}
                    color="currentColor"
                    onClick={increment}
                    className="button increment"
                />
            </div>

            <div className="data">
                <div>{meal.name}</div>
                <div className="detail-row">
                    <span>{meal.brand}</span>|
                    <span>{meal.calories.toLocaleString()} cal</span>|
                    <span>{meal.ounces.toLocaleString()} oz</span>
                </div>
            </div>

            <div
                className="icon"
                title="Remove from pack"
                onClick={() => deselect(meal)}
            >
                <Trash size={18} />
            </div>
        </div>
    );
};
