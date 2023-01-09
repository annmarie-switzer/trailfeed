import { MealSource } from './types';

export const calculatedTotals = (selection: MealSource[]) =>
    selection.reduce(
        (result, s) => {
            result.calories += s.calories * s.count;
            result.ounces += s.ounces * s.count;
            result.water_ml += s.water_ml * s.count;
            result.minutes += s.minutes * s.count;
            return result;
        },
        { calories: 0, ounces: 0, water_ml: 0, minutes: 0 }
    );
