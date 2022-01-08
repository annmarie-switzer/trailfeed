import React, { useEffect, useState } from 'react';

function Select({ options, onChange }) {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        onChange(selected);
    }, [selected])

    return (
        <div id="select-container" onClick={() => setOpen(!open)}>
            <div className={open ? 'fake-select open' : 'fake-select'}>
                <span className={selected || open ? 'placeholder small' : 'placeholder'}>
                    Meal type
                </span>
                <span className="select-value">{selected}</span>
            </div>
            <div className={open ? 'select-menu open' : 'select-menu'}>
                {options.map((o, i) => (
                    <div
                        key={i}
                        className="option"
                        value={o}
                        onClick={() => setSelected(o)}>
                        {o}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Select;
