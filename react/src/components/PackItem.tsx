import { useContext } from 'react';
import { MealSource } from '../types';
import { AppContext } from '../App';
import { Minus, Plus, Trash } from 'react-feather';
import './PackItem.css';
import clsx from 'clsx';

type PackItemProps = {
    meal: MealSource;
    idx: number;
};

export const PackItem = ({ meal, idx }: PackItemProps) => {
    const { setSelection } = useContext(AppContext);

    const onSpinnerClick = (dir: 'increment' | 'decrement') => {
        setSelection((curr) => {
            const count = dir === 'increment' ? meal.count + 1 : meal.count - 1;

            const newSelection = [...curr];
            const idx = newSelection.findIndex((s) => s.id === meal.id);
            newSelection.splice(idx, 1, { ...meal, count });

            return newSelection;
        });
    };

    const deselect = (meal: MealSource) => {
        setSelection((curr) => curr.filter((s) => s.id !== meal.id));
    };

    return (
        <div className={clsx('pack-item', idx % 2 === 0 && 'even')}>
            <div className="count">
                <input type="number" min="1" value={meal.count} readOnly />
                <Minus
                    size={14}
                    color="currentColor"
                    onClick={() => onSpinnerClick('decrement')}
                    className={clsx(
                        'button',
                        'decrement',
                        meal.count === 1 && 'disabled'
                    )}
                />
                <Plus
                    size={14}
                    color="currentColor"
                    onClick={() => onSpinnerClick('increment')}
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
