import React, { useContext, useEffect, useState } from 'react';
import './Stars.css';
import { AppContext } from 'components/App';
import { Star } from 'react-feather';
import { search, updateRating, addDoc } from 'api';

function Stars({ mealId }) {
    const { user } = useContext(AppContext);
    const [docId, setDocId] = useState(null);
    const [rating, setRating] = useState(0);

    const getRating = async () => {
        const ratingsQuery = {
            query: {
                bool: {
                    must: [
                        {
                            term: {
                                user: {
                                    value: user.email
                                }
                            }
                        },
                        {
                            term: {
                                meal_id: {
                                    value: mealId
                                }
                            }
                        }
                    ]
                }
            }
        };

        const ratingsRes = await search({
            query: ratingsQuery,
            index: 'ratings'
        });

        if (ratingsRes.hits?.hits.length > 0) {
            const { _id, _source } = ratingsRes.hits.hits[0];
            setDocId(_id);
            setRating(_source.rating);
        } else {
            setRating(0);
        }
    };

    const rate = async (r) => {
        if (docId) {
            await updateRating({ docId, rating: r });
        } else {
            await addDoc({
                index: 'ratings',
                newDoc: { user: user.email, meal_id: mealId, rating: r }
            });
        }

        getRating();
    };

    useEffect(() => {
        if (user.email) {
            getRating();
        }
    }, [mealId]);

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

export default Stars;
