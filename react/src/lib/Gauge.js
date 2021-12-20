import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import Stats, { mappedStatData, statData } from './Stats';

export const useD3 = (renderChartFn, dependencies) => {
    const ref = useRef();
    useEffect(() => {
        renderChartFn(d3.select(ref.current));
        return () => {};
    }, dependencies);

    return ref;
};

function Gauge({ selection }) {
    const maxCalories = 1380;

    const [selectedArc, setSelectedArc] = useState(null);
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    // const handleResize = () => {
    //     console.log('window resizing');
    //     setDimensions(() => ({
    //         width: window.innerWidth,
    //         height: window.innerHeight
    //     }));
    // }

    // useEffect(() => {
    //     handleResize();
    //     window.addEventListener('resize', handleResize)
    //     return _ => window.removeEventListener('resize', handleResize)
    // }, []);

    const ref = useD3(
        (svg) => {
            const data = mappedStatData(selection);

            const trackData = statData.map((arc) => ({
                ...arc,
                value: maxCalories
            }));

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
                .domain([0, maxCalories])
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
                .style('fill', 'var(--bg-lighter)');

            tracks
                .transition()
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
                .style('fill', (d, i) => data[i].color)
                .on('mouseenter', (e, d) => {
                    setSelectedArc(d);
                    d3.selectAll('.arc')
                        .filter((a) => a.id !== d.id)
                        .classed('not-hovered', true);
                })
                .on('mouseleave', (e, d) => {
                    setSelectedArc(null);
                    d3.selectAll('.arc').classed('not-hovered', false);
                });

            arcs.transition()
                .delay((d, i) => i * 0)
                .duration(1000)
                .attrTween('d', (d, i) => {
                    const interpolate = d3.interpolate(0, d.value);
                    return (t) => arc(interpolate(t), i);
                });
        },
        [selection, dimensions]
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
                <span>{selectedArc?.icon}</span>
                <span>
                    {selectedArc?.displayValue} {selectedArc?.suffix}
                </span>
            </div>
        </div>
    );
}

export default Gauge;
