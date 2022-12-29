import { MealSource } from './types';

export const calculatedTotals = (selection: MealSource[]) =>
    selection.reduce(
        (result, s) => {
            result.calories += s.calories * s.count;
            result.ounces += s.ounces * s.count;
            return result;
        },
        { calories: 0, ounces: 0 }
    );
