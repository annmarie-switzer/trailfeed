import React, { useEffect, useState } from 'react';

function Input({ type, placeholder, onChange, children }) {
    const [value, setValue] = useState(type === 'number' ? 0 : '');

    useEffect(() => {
        onChange(value);
    }, [value]);

    return (
        <div
            id="input-wrapper"
            className={value || value === 0 ? 'number has-value' : 'number'}>
            <div className="icon">{children}</div>
            <input
                type={type}
                placeholder={placeholder}
                onChange={(e) => setValue(e.target.value)}
            />
        </div>
    );
}

export default Input;
