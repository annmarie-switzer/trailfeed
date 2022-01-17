import React, { useState, useEffect } from 'react';

function Textarea({ rows = 1, placeholder, onChange }) {
    const [value, setValue] = useState('');

    useEffect(() => {
        onChange(value);
    }, [value]);

    return (
        <div id="textarea-wrapper" className={value ? 'has-value' : ''}>
            {/* <div className="icon">{children}</div> */}
            <textarea
                rows={rows}
                placeholder={placeholder}
                onChange={(e) => setValue(e.target.value)}
            />
        </div>
    );
}

export default Textarea;
