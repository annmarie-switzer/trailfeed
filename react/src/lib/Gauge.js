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

    const width = 500;
    const height = 500;

    const userMaxCalories = 10000;

    const color = d3.scaleOrdinal([
        'var(--orange)',
        'var(--blue)',
        'var(--green)'
    ]);

    const ref = useD3(
        (svg) => {
            const data = ['calories', 'water_ml', 'minutes'].map((name) => {
                const value =
                    selection
                        .map((s) => s[name])
                        .reduce((total, next) => total + next, 0) || 0;
                return { name, value };
            });

            const chartRadius = height / 2 - 50;
            const arcMinRadius = 100;
            const arcPadding = 10;
            const numArcs = data.length;
            const arcWidth =
                (chartRadius - arcMinRadius - numArcs * arcPadding) / numArcs;

            const getInnerRadius = (index) =>
                arcMinRadius +
                (numArcs - (index + 1)) * (arcWidth + arcPadding);

            const getOuterRadius = (index) => getInnerRadius(index) + arcWidth;

            const scale = d3
                .scaleLinear()
                // .domain([0, d3.max(data, (d) => d.value) * 1.1])
                .domain([0, userMaxCalories])
                .range([0, 2 * Math.PI]);

            const arc = d3
                .arc()
                .innerRadius((d, i) => getInnerRadius(i))
                .outerRadius((d, i) => getOuterRadius(i))
                .startAngle(0)
                .endAngle((d, i) => scale(d));

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
                    let interpolate = d3.interpolate(0, d.value);
                    return (t) => arc(interpolate(t), i);
                });
        },
        [selection]
    );

    return (
        <div id="gauge">
            <svg ref={ref} viewBox={`0 0 ${height} ${width}`}>
                <g
                    className="plot-area"
                    transform={`translate(${width / 2}, ${height / 2})`}
                >
                    <g className="arcs"></g>
                </g>
            </svg>
            <div id="center-text">
                {selectedArc?.name} {selectedArc?.value}
            </div>
        </div>
    );
}

export default Gauge;
