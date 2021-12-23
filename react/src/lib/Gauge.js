import React, { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from 'lib/App';
import * as d3 from 'd3';
import Stats, { calculateStats, statMeta } from './Stats';

export const useD3 = (renderChartFn, dependencies) => {
    const ref = useRef();
    useEffect(() => {
        renderChartFn(d3.select(ref.current));
        return () => {};
    }, dependencies);

    return ref;
};

function Gauge({ selection }) {
    // global current stat
    const { currentStat, setCurrentStat } = useContext(AppContext);

    // calculated data
    const [data, setData] = useState(calculateStats(selection));

    // currently hovered arc
    const [selectedArc, setSelectedArc] = useState(null);

    const [dimensions, setDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    const [maxCalories, setMaxCalories] = useState(
        Number(localStorage?.getItem('trailfeedMaxCals')) || 10000
    );

    const handleChange = (event) => {
        const newVal = Number(event.target.value.replace(',', ''));
        localStorage.setItem('trailfeedMaxCals', newVal);
        setMaxCalories(newVal);
    };

    const ref = useD3(
        (svg) => {
            // tracks
            const prevTrackData = d3.local();

            d3.selectAll('.track').each(function (d) {
                prevTrackData.set(this, d);
            });

            const trackData = statMeta.map((arc) => ({
                ...arc,
                value: maxCalories
            }));

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
                .attrTween('d', (d, i, nodes) => {
                    const old = prevTrackData.get(nodes[i], d);
                    const interpolateFrom = old ? maxCalories : 0;
                    const interpolate = d3.interpolate(
                        interpolateFrom,
                        d.value
                    );
                    return (t) => arc(interpolate(t), i);
                });

            // arcs
            const prevData = d3.local();

            d3.selectAll('.arc').each(function (d) {
                prevData.set(this, d);
            });

            const data = calculateStats(selection);

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

            const arcs = d3
                .select('.arcs')
                .selectAll('path')
                .data(data)
                .join('path')
                .attr('class', 'arc')
                .style('opacity', (d, i) => (i === currentStat ? 1 : 0.4))
                .style('fill', (d, i) => data[i].color)
                .on('mouseenter', (e, hovered) => {
                    setSelectedArc(hovered);
                    d3.selectAll('.arc').style('opacity', (d, i) =>
                        d.id === hovered.id ? 1 : 0.4
                    );
                })
                .on('mouseleave', (e, d) => {
                    setSelectedArc(null);
                    d3.selectAll('.arc').style('opacity', (d, i) =>
                        i === currentStat ? 1 : 0.4
                    );
                })
                .on('click', (e, d) =>
                    setCurrentStat(data.findIndex((datum) => datum.id === d.id))
                );

            arcs.transition()
                .delay((d, i) => i * 0)
                .duration(1000)
                .attrTween('d', (d, i, nodes) => {
                    const old = prevData.get(nodes[i], d);
                    const interpolateFrom = old ? old.value : 0;
                    const interpolate = d3.interpolate(
                        interpolateFrom,
                        d.value
                    );
                    return (t) => arc(interpolate(t), i);
                });
        },
        [selection, currentStat]
    );

    return (
        <div id="gauge">
            <svg
                ref={ref}
                viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}>
                <g
                    className="plot-area"
                    transform={`translate(
                        ${dimensions.width / 2},
                        ${dimensions.height / 1.25}
                    )`}>
                    <g className="tracks"></g>
                    <g className="arcs"></g>
                </g>
            </svg>
            <div id="center-text">
                {selectedArc ? (
                    <>
                        <span>{selectedArc.icon}</span>
                        <span>
                            {selectedArc.displayValue} {selectedArc.suffix}
                        </span>
                    </>
                ) : (
                    <Stats selection={selection} />
                )}
            </div>
            <div className="input-container">
                {/* <span>goal Cals</span> */}
                <input
                    type="text"
                    onChange={handleChange}
                    value={maxCalories.toLocaleString()}
                />
            </div>
        </div>
    );
}

export default Gauge;
