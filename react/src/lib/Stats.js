import React, { useEffect, useState } from 'react';
import { Activity, Droplet, Watch } from 'react-feather';

function Stats({ selection }) {
    const [totalCalories, setTotalCalories] = useState(0);
    const [totalWater, setTotalWater] = useState(0);
    const [totalTime, setTotalTime] = useState(0);

    const [currentStat, setStat] = useState(0);
    const stats = [
        {
            name: 'Calories',
            val: totalCalories,
            suffix: '',
            icon: <Activity color="var(--ct-orange)" />
        },
        {
            name: 'Water',
            val: totalWater,
            suffix: 'mL',
            icon: <Droplet color="var(--blue)" />
        },
        {
            name: 'Time',
            val: totalTime,
            suffix: 'minutes',
            icon: <Watch color="var(--green)" />
        }
    ];

    const cycleStats = () => {
        setStat(currentStat == stats.length - 1 ? 0 : currentStat + 1);
    };

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
        <div id="stats">
            <div style={{ cursor: 'pointer' }} onClick={cycleStats}>
                {stats[currentStat].icon}
            </div>
            <span>
                {stats[currentStat].name}
                :&nbsp;{stats[currentStat].val.toLocaleString()}&nbsp;
                {stats[currentStat].suffix}
            </span>
        </div>
    );
}

export default Stats;
