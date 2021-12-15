import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

/**
 * Custom hook for D3
 * @param {*} renderChartFn a callback containing the D3.js code to be executed
 * @param {*} dependencies array of values to which `renderChartFn` should be reactive
 * @returns
 */
export const useD3 = (renderChartFn, dependencies) => {
    const ref = useRef();
    useEffect(() => {
        renderChartFn(d3.select(ref.current));
        return () => {};
    }, dependencies);

    return ref;
};

function Gauge(props) {
    const data = [
        { name: 'Jan', value: 432 },
        { name: 'Feb', value: 340 },
        { name: 'Mar', value: 382 },
        { name: 'Apr', value: 398 },
        { name: 'May', value: 410 }
    ];
    const width = 500;
    const height = 500;
    const chartRadius = height / 2 - 40;

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const ref = useD3(
        (svg) => {
            svg = svg
                .append('g')
                .attr(
                    'transform',
                    'translate(' + width / 2 + ',' + height / 2 + ')'
                );

            let tooltip = d3
                .select('body')
                .append('div')
                .attr('class', 'tooltip');

            const PI = Math.PI,
                arcMinRadius = 10,
                arcPadding = 10,
                labelPadding = -5;

            let scale = d3
                .scaleLinear()
                .domain([0, d3.max(data, (d) => d.value) * 1.1])
                .range([0, 2 * PI]);

            let keys = data.map((d, i) => d.name);

            const numArcs = keys.length;

            const arcWidth =
                (chartRadius - arcMinRadius - numArcs * arcPadding) / numArcs;

            let arc = d3
                .arc()
                .innerRadius((d, i) => getInnerRadius(i))
                .outerRadius((d, i) => getOuterRadius(i))
                .startAngle(0)
                .endAngle((d, i) => scale(d));

            let arcs = svg
                .append('g')
                .attr('class', 'data')
                .selectAll('path')
                .data(data)
                .enter()
                .append('path')
                .attr('class', 'arc')
                .style('fill', (d, i) => color(i));

            arcs.transition()
                .delay((d, i) => i * 200)
                .duration(1000)
                .attrTween('d', arcTween);

            arcs.on('mousemove', showTooltip);
            arcs.on('mouseout', hideTooltip);

            function arcTween(d, i) {
                let interpolate = d3.interpolate(0, d.value);
                return (t) => arc(interpolate(t), i);
            }

            function showTooltip(d) {
                tooltip
                    .style('left', d.pageX + 10 + 'px')
                    .style('top', d.pageY - 25 + 'px')
                    .style('display', 'inline-block')
                    .html(d.value);
            }

            function hideTooltip() {
                tooltip.style('display', 'none');
            }

            function rad2deg(angle) {
                return (angle * 180) / PI;
            }

            function getInnerRadius(index) {
                return (
                    arcMinRadius +
                    (numArcs - (index + 1)) * (arcWidth + arcPadding)
                );
            }

            function getOuterRadius(index) {
                return getInnerRadius(index) + arcWidth;
            }
        },
        [data.length]
    );

    return (
        <div id="gauge">
            <svg ref={ref} width={width} height={height}></svg>
        </div>
    );
}

export default Gauge;
