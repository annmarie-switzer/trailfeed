import React, { useEffect, useState } from 'react';
import { AppContext } from 'lib/App';

function Pack(props) {
    const { selection } = props;

    const [totalCalories, setTotalCalories] = useState(0);
    const [totalWater, setTotalWater] = useState(0);
    const [totalTime, setTotalTime] = useState(0);

    useEffect(() => {
        setTotalCalories(
            selection
                .map((s) => s.calories)
                .reduce((total, next) => total + next, 0)
        );

        setTotalWater(
            selection
                .map((s) => s.water_ml)
                .reduce((total, next) => total + next, 0)
        );

        setTotalTime(
            selection
                .map((s) => s.minutes)
                .reduce((total, next) => total + next, 0)
        );
    }, [selection]);

    return (
        <div id="pack">
            <div>Total calories: {totalCalories.toLocaleString()} kCal</div>
            <div>Total water: {totalWater.toLocaleString()} mL</div>
            <div>Total time: {totalTime.toLocaleString()} minutes</div>
        </div>
    );
}

export default Pack;
