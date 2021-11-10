import React, { useEffect, useState } from 'react';
import Slider from '@mui/material/Slider';

function CustomSlider(props) {
    const {
        min,
        max,
        label,
        name,
        setRange: setUpstreamRange
    } = props;

    const [range, setRange] = useState([]);

    const handleChange = (event) => {
        setRange(event.target.value);

        setUpstreamRange({
            type: 'range',
            name: event.target.name,
            values: [...range]
        })
    }

    useEffect(() => {
        setRange([min, max])
    }, [min, max])

    return (
        <div className="slider-container">
            <div className="slider-title">
                {label}: &nbsp; {range[0]} &ndash; {range[1]}
            </div>
            <div className="slider">
                <span className="slider-value">{min}</span>

                <Slider
                    name={name}
                    min={min}
                    max={max}
                    value={range}
                    onChange={handleChange}
                    valueLabelDisplay="auto"
                />

                <span className="slider-value">{max}</span>
            </div>
        </div>
    )
}

export default CustomSlider;