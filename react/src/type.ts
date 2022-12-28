export interface EsHit {
    _id: string;
    _index: string;
    _type: '_doc';
    _score: number;
    _source: MealSource | RatingSource;
}

export interface MealDoc extends EsHit {
    _source: MealSource;
}

export interface RatingDoc extends EsHit {
    _source: RatingSource;
}

export type MealSource = {
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

export type RatingSource = {
    user: string;
    meal_id: string;
    rating: number;
};

type MealType = 'breakfast' | 'entree' | 'dessert' | 'snack';

type WaterTemp = 'boiling' | 'cold' | 'none';

export type User = {
    name: string;
    email: string;
};
