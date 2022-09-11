import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import './RangeSlider.css';
import Slider from '@mui/material/Slider';

type RangeSliderProps = {
    min: number;
    max: number;
    label: string;
    name: string;
    setRange: Dispatch<SetStateAction<any>>;
    step?: number;
};

export const RangeSlider = ({
    min,
    max,
    label,
    name,
    setRange: setUpstreamRange,
    step = 1
}: RangeSliderProps) => {
    const [range, setRange] = useState<any>([]);

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
                    onChange={(e: any) => setRange(e.target.value)}
                    onChangeCommitted={handleChange}
                    valueLabelDisplay="off"
                    step={step}
                />
                <span className="slider-value">{range[1]}</span>
            </div>
        </div>
    );
}
