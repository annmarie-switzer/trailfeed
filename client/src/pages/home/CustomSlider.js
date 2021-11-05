import React, { useEffect, useState } from 'react';
import Slider from '@mui/material/Slider';

function CustomSlider(props) {
    const { min, max } = props;

    const [range, setRange] = useState([]);

    const handleChange = (event) => {
        setRange(event.target.value);

        props.setRange({
            type: 'range',
            name: event.target.name,
            values: [...range]
        })
    }

    useEffect(() => {
        setRange([min, max])
    }, [min, max])

    return (
        <Slider
            name={props.name}
            min={props.min}
            max={props.max}
            value={range}
            onChange={handleChange}
            valueLabelDisplay="auto"
        />
    )
}

export default CustomSlider;