import React, { useEffect, useState } from 'react';
import { Minus, Plus } from 'react-feather';

function Text({ textarea = false, label, type, onChange }) {
    const [value, setValue] = useState(type === 'number' ? 0 : '');

    useEffect(() => {
        onChange(value);
    }, [value]);

    if (type === 'number') {
        return (
            <div
                id="text-container"
                className={
                    value || value === 0 ? 'number has-value' : 'number'
                }>
                <input
                    type={type}
                    value={value}
                    min="0"
                    onChange={(e) => setValue(e.target.value)}
                />
                <span className="label">{label}</span>
                <div className="buttons">
                    <Plus
                        size={16}
                        color="currentColor"
                        onClick={() => setValue(Number(value) + 1)}
                    />
                    <Minus
                        size={16}
                        color="currentColor"
                        onClick={() => setValue(Number(value) - 1)}
                    />
                </div>
            </div>
        );
    } else {
        return (
            <div id="text-container" className={value ? 'has-value' : ''}>
                {textarea ? (
                    <textarea onKeyUp={(e) => setValue(e.target.value)} />
                ) : (
                    <input
                        type={type}
                        onKeyUp={(e) => setValue(e.target.value)}
                    />
                )}
                <span className="label">{label}</span>
            </div>
        );
    }
}

export default Text;
