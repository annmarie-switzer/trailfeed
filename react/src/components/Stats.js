import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from 'components/App';
import { Activity, Droplet, Watch } from 'react-feather';

export const statMeta = [
    {
        id: 'calories',
        suffix: 'Cal',
        icon: <Activity color="var(--calories)" />,
        color: 'var(--calories)'
    },
    {
        id: 'water_ml',
        suffix: 'mL',
        icon: <Droplet color="var(--blue)" />,
        color: 'var(--blue)'
    },
    {
        id: 'minutes',
        suffix: 'min',
        icon: <Watch color="var(--green)" />,
        color: 'var(--green)'
    }
];

export const calculateStats = (selection) => {
    const newData = statMeta.map((stat) => {
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
    const { currentStat, setCurrentStat } = useContext(AppContext);

    const [data, setData] = useState(calculateStats(selection));

    const cycleStats = () => {
        setCurrentStat(currentStat == data.length - 1 ? 0 : currentStat + 1);
    };

    // recalculate when selection changes
    useEffect(() => {
        setData(calculateStats(selection));
    }, [selection]);

    return (
        <div id="stats">
            <div style={{ cursor: 'pointer' }} onClick={cycleStats}>
                {data[currentStat].icon}
            </div>
            <span>
                {data[currentStat].displayValue} {data[currentStat].suffix}
            </span>
        </div>
    );
}

export default Stats;
