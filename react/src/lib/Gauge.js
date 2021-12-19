import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

export const useD3 = (renderChartFn, dependencies) => {
    const ref = useRef();
    useEffect(() => {
        renderChartFn(d3.select(ref.current));
        return () => {};
    }, dependencies);

    return ref;
};

function Gauge({ selection }) {
    const [selectedArc, setSelectedArc] = useState(null);
    const [dimensions, setDimensions] = useState({
        width: 0,
        height: 0
    });

    const userMaxCalories = 1380;

    const color = d3.scaleOrdinal([
        'var(--orange)',
        'var(--blue)',
        'var(--green)'
    ]);

    const arcMap = {
        calories: 'Calories',
        water_ml: 'Water',
        minutes: 'Time'
    };

    const trackData = [
        {name: 'calories', value: userMaxCalories},
        {name: 'water_ml', value: userMaxCalories},
        {name: 'minutes', value: userMaxCalories},
    ]

    const ref = useD3(
        (svg) => {
            setDimensions(() => ({
                width: window.innerWidth,
                height: window.innerHeight
            }));

            let data = ['calories', 'water_ml', 'minutes'].map((name) => {
                // value is the reult of reduce or 0
                let value =
                    selection
                        .map((s) => s[name])
                        .reduce((total, next) => total + next, 0) || 0;

                // artificially decrease the scale of the `minutes` arc
                if (name === 'minutes') {
                    value *= 60;
                }

                const displayValue = (() => {
                    switch (name) {
                        case 'minutes':
                            return `${value.toLocaleString() / 60} min`;
                        case 'water_ml':
                            return `${value.toLocaleString()} mL`;
                        default:
                            return value.toLocaleString();
                    }
                })();

                return { name, value, displayName: arcMap[name], displayValue };
            });

            // const noData = data.every((d) => d.value === 0);
            // if (noData) {
            //     data = data.map((d) => ({ ...d, value: userMaxCalories }));
            // }

            const chartRadius = dimensions.height / 1.5;
            const arcMinRadius = 350;
            const arcPadding = 35;
            const numArcs = data.length;
            const arcWidth =
                (chartRadius - arcMinRadius - numArcs * arcPadding) / numArcs;

            const getInnerRadius = (index) =>
                arcMinRadius +
                (numArcs - (index + 1)) * (arcWidth + arcPadding);

            const getOuterRadius = (index) => getInnerRadius(index) + arcWidth;

            const scale = d3
                .scaleLinear()
                .domain([0, userMaxCalories])
                .range([0, Math.PI])
                .clamp(true);

            const arc = d3
                .arc()
                .innerRadius((d, i) => getInnerRadius(i))
                .outerRadius((d, i) => getOuterRadius(i))
                .startAngle(0)
                .endAngle((d, i) => scale(d));

            const tracks = d3
                .select('.tracks')
                .selectAll('path')
                .data(trackData)
                .join('path')
                .attr('class', 'track')
                .style('fill', 'var(--bg-lighter)')
                // .on('mouseenter', (e, d) => setSelectedArc(d))
                // .on('mouseleave', () => setSelectedArc(null));

            tracks.transition()
                .delay((d, i) => i * 0)
                .duration(1000)
                .attrTween('d', (d, i) => {
                    const interpolate = d3.interpolate(0, d.value);
                    return (t) => arc(interpolate(t), i);
                });

            const arcs = d3
                .select('.arcs')
                .selectAll('path')
                .data(data)
                .join('path')
                .attr('class', 'arc')
                .style('fill', (d, i) => color(i))
                .on('mouseenter', (e, d) => setSelectedArc(d))
                .on('mouseleave', () => setSelectedArc(null));

            arcs.transition()
                .delay((d, i) => i * 0)
                .duration(1000)
                .attrTween('d', (d, i) => {
                    const interpolate = d3.interpolate(0, d.value);
                    return (t) => arc(interpolate(t), i);
                });
        },
        [selection]
    );

    return (
        <div id="gauge">
            <svg
                ref={ref}
                viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
            >
                <g
                    className="plot-area"
                    transform={`translate(
                        ${dimensions.width / 2},
                        ${dimensions.height / 1.25}
                    )`}
                >
                    <g className="tracks"></g>
                    <g className="arcs"></g>
                </g>
            </svg>
            <div id="center-text">
                <span>{selectedArc?.displayName}</span>
                <span>{selectedArc?.displayValue}</span>
            </div>
        </div>
    );
}

export default Gauge;
