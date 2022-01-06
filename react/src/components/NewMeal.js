import React from 'react';
import { newDoc } from 'api';

function NewMeal() {
    const submit = async () => {
        await newDoc({
            index: 'ratings',
            newDoc: {}
        });
    };

    return (
        <div id="new-meal">
            New Meal Form
            <button type="button" onClick={() => submit()}>
                Submit
            </button>
        </div>
    );
}

export default NewMeal;
