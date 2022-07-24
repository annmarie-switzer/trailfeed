import React, { useEffect, useState } from 'react';
import './RangeSlider.css';
import Slider from '@mui/material/Slider';

function RangeSlider({
    min,
    max,
    label,
    name,
    setRange: setUpstreamRange,
    step = 1
}) {
    const [range, setRange] = useState([]);

    const handleChange = () => {
        setUpstreamRange({
            name,
            values: range,
            type: 'range'
        });
    };

    useEffect(() => setRange([min, max]), [min, max]);

    return (
        <div className="slider-container">
            <div className="slider-title">{label}</div>
            <div className="slider">
                <span className="slider-value">{range[0]}</span>
                <Slider
                    name={name}
                    min={min}
                    max={max}
                    value={range}
                    onChange={(e) => setRange(e.target.value)}
                    onChangeCommitted={handleChange}
                    valueLabelDisplay="off"
                    step={step}
                />
                <span className="slider-value">{range[1]}</span>
            </div>
        </div>
    );
}

export default RangeSlider;
