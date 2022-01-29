import React, { useEffect, useState } from 'react';
import './Input.css';
import { Minus, Plus } from 'react-feather';

function Input({ type, placeholder, onChange, children }) {
    const [value, setValue] = useState('');

    useEffect(() => {
        onChange(value);
    }, [value]);

    const increment = () => {
        if (value === '') {
            setValue(1);
        } else {
            setValue(Number(value) + 1);
        }
    };

    const decrement = () => {
        if (value !== '' && value !== 0) {
            setValue(Number(value) - 1);
        }
    };

    if (type === 'number') {
        return (
            <div
                id="input-wrapper"
                className={
                    value || value === 0 ? 'number has-value' : 'number'
                }>
                <div className="icon">{children}</div>
                <input
                    type={type}
                    value={value}
                    placeholder={placeholder}
                    onChange={(e) => setValue(e.target.value)}
                />
                <div className="buttons">
                    <Plus
                        size={16}
                        color="currentColor"
                        onClick={() => increment()}
                    />
                    <Minus
                        size={16}
                        color="currentColor"
                        className={value === 0 ? 'disabled' : ''}
                        onClick={() => decrement()}
                    />
                </div>
            </div>
        );
    } else {
        return (
            <div id="input-wrapper" className={value ? 'has-value' : ''}>
                <div className="icon">{children}</div>
                <input
                    type={type}
                    placeholder={placeholder}
                    onChange={(e) => setValue(e.target.value)}
                />
            </div>
        );
    }
}

export default Input;
