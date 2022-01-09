import React, { useEffect, useState } from 'react';

function Text({ textarea = false, placeholder, type, onChange }) {
    const [value, setValue] = useState('');

    useEffect(() => {
        onChange(value);
    }, [value]);

    return (
        <div id="text-container" className={value ? 'has-value' : ''}>
            {textarea ? (
                <textarea onKeyUp={(e) => setValue(e.target.value)} />
            ) : (
                <input type={type} onKeyUp={(e) => setValue(e.target.value)} />
            )}
            <span className="placeholder">{placeholder}</span>
        </div>
    );
}

export default Text;
