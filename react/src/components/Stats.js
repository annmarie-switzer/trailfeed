import React, { useContext, useEffect, useState } from 'react';
import './Stats.css';
import { AppContext } from 'components/App';
import { Activity, Droplet, Feather } from 'react-feather';

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
        icon: <Droplet color="var(--water)" />,
        color: 'var(--water)'
    },
    {
        id: 'ounces',
        suffix: 'oz',
        icon: <Feather color="var(--weight)" />,
        color: 'var(--weight)'
    }
];

export const calculateStats = (selection) => {
    const newData = statMeta.map((stat) => {
        let value =
            selection
                .map((s) => s[stat.id])
                .reduce((total, next) => total + next, 0) || 0;

        const displayValue = `${value.toLocaleString()}`;

        // arbitrary scale for ounces so the arc fill will be visible
        if (stat.id === 'ounces') {
            value *= 100;
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
        <div id="stats" onClick={cycleStats}>
            <div>
                {data[currentStat].icon}
            </div>
            <span>
                {data[currentStat].displayValue} {data[currentStat].suffix}
            </span>
        </div>
    );
}

export default Stats;
