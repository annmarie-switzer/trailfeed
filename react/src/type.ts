export type MealDoc = {
    brand: string;
    name: string;
    meal_type: MealType[];
    calories: number;
    water_ml: number;
    water_temp: WaterTemp;
    minutes: number;
    ounces: number;
    allergens: string[];
    special: string[];
    link: string;
    ingredients: string;
    id: string;
    ratingDoc: RatingDoc;
    count: number;
};

type MealType = 'breakfast' | 'entree' | 'dessert' | 'snack';

type WaterTemp = 'boiling' | 'cold' | 'none';

type RatingDoc = {
    _index: 'ratings';
    _type: '_doc';
    _id: string;
    _score: number;
    _source: {
        user: string;
        meal_id: string;
        rating: number;
    };
};
