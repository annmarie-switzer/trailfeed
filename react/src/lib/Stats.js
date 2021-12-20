import React, { useEffect, useState } from 'react';
import { Activity, Droplet, Watch } from 'react-feather';

export const statData = [
    {
        id: 'calories',
        name: 'Calories',
        suffix: 'Cal',
        icon: <Activity color="var(--ct-orange)" />,
        color: 'var(--ct-orange)'
    },
    {
        id: 'water_ml',
        name: 'Water',
        suffix: 'mL',
        icon: <Droplet color="var(--blue)" />,
        color: 'var(--blue)'
    },
    {
        id: 'minutes',
        name: 'Time',
        suffix: 'min',
        icon: <Watch color="var(--green)" />,
        color: 'var(--green)'
    }
];

export const mappedStatData = (selection) => {
    const newData = statData.map((stat) => {
        let value =
            selection
                .map((s) => s[stat.id])
                .reduce((total, next) => total + next, 0) || 0;

        const displayValue = `${value.toLocaleString()}`;

        if (stat.id === 'minutes') {
            value *= 60;
        }

        return { ...stat, value, displayValue };
    });

    return newData;
};

function Stats({ selection }) {
    const [stats, setStats] = useState(mappedStatData(selection));
    const [currentStat, setStat] = useState(0);

    const cycleStats = () => {
        setStat(currentStat == stats.length - 1 ? 0 : currentStat + 1);
    };

    useEffect(() => {
        setStats(mappedStatData(selection));
    }, [selection]);

    return (
        <div id="stats">
            <div style={{ cursor: 'pointer' }} onClick={cycleStats}>
                {stats[currentStat].icon}
            </div>
            <span>
                {stats[currentStat].name}
                :&nbsp;
                {stats[currentStat].displayValue}{' '}
                {currentStat === 0 ? null : stats[currentStat].suffix}
            </span>
        </div>
    );
}

export default Stats;
