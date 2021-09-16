import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';

Clock.propTypes = {
    date: PropTypes.instanceOf(Date)
}

function Clock(props) {
    const [time, setTime] = useState(props.date);

    useEffect(() => {
        setInterval(() => {
            setTime(new Date());
        }, 1000);
    })

    return (
        <div>
            <h3>The time is:</h3>
            <h1>{time.toLocaleTimeString()}</h1>
        </div>
    )
}

export default Clock;