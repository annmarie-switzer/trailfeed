import React, { useEffect, useState } from 'react';
import Slider from '@mui/material/Slider';

function CustomSlider(props) {
    const { min, max, label, name, setRange: setUpstreamRange } = props;

    const [range, setRange] = useState([]);

    const handleChange = (event) => {
        setRange(event.target.value);

        setUpstreamRange({
            name: event.target.name,
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
                    onChange={handleChange}
                    valueLabelDisplay="off"
                />
                <span className="slider-value">{range[1]}</span>
            </div>
        </div>
    );
}

export default CustomSlider;
