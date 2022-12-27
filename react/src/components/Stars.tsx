import { useContext, useState } from 'react';
import './Stars.css';
import { Star } from 'react-feather';
import { updateRating, addDoc } from '../api';
import { AppContext } from '../App';

type StarsProps = {
    ratingDoc: any;
    mealId: string;
};

export const Stars = ({ ratingDoc, mealId, }: StarsProps) => {
    const { user } = useContext(AppContext);
    const [docId, setDocId] = useState(ratingDoc?._id);
    const [rating, setRating] = useState(
        ratingDoc ? ratingDoc._source.rating : 0
    );

    const rate = async (r: number) => {
        if (docId) {
            console.log('updating existing rating...');
            await updateRating({ docId, rating: r });
        } else {
            console.log('creating new rating...');
            const newDocRes = await addDoc({
                index: 'ratings',
                newDoc: { user: user.email, meal_id: mealId, rating: r }
            });

            setDocId(newDocRes._id);
        }

        setRating(r);
    };

    return (
        <span
            id="stars"
            title={
                user.email
                    ? `Your rating: ${rating} stars`
                    : 'Log in to rate meals.'
            }>
            {Array.from(Array(4), (e, i) =>
                user.email ? (
                    <Star
                        key={i}
                        className={
                            rating > 0 && i < rating ? 'filled' : 'empty'
                        }
                        onClick={() => rate(i + 1)}
                    />
                ) : (
                    <Star key={i} className="disabled" />
                )
            )}
        </span>
    );
}
