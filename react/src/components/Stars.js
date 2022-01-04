import React from 'react';
import { Star } from 'react-feather';

function Stars() {
    return (
        <span id="stars" title="Your rating">
            <Star color="var(--bg3)" />
            <Star color="var(--bg3)" />
            <Star color="var(--bg3)" />
            <Star color="var(--bg3)" />
        </span>
    );
}

export default Stars;
