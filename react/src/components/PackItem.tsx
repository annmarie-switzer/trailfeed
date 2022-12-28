import { useContext } from 'react';
import { MealSource } from '../type';
import { AppContext } from '../App';
import { Minus, Plus, Trash } from 'react-feather';
import './PackItem.css';
import clsx from 'clsx';

type PackItemProps = {
    meal: MealSource;
    idx: number;
};

export const PackItem = ({ meal, idx }: PackItemProps) => {
    const { selection, setSelection } = useContext(AppContext);

    const increment = () => {
        setSelection((curr) => {
            const filtered = curr.filter((s) => s.id !== meal.id);
            const count = meal.count + 1;
            return [...filtered, { ...meal, count }];
        });
    };

    const decrement = () => {
        setSelection((curr) => {
            const filtered = curr.filter((s) => s.id !== meal.id);
            const count = meal.count - 1;
            return [...filtered, { ...meal, count }];
        });
    };

    const deselect = (meal: MealSource) => {
        setSelection(selection.filter((s) => s.id !== meal.id));
    };

    return (
        <div className={idx % 2 === 0 ? 'pack-item even' : 'pack-item'}>
            <div className="count">
                <input
                    type="number"
                    min="1"
                    value={meal.count}
                    readOnly
                />
                <Minus
                    size={14}
                    color="currentColor"
                    onClick={decrement}
                    className={clsx(
                        'button',
                        'decrement',
                        meal.count === 1 && 'disabled'
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
