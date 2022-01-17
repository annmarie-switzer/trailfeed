import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'react-feather';
import Checkbox from '../Checkbox';

function Select({ label, options, multi = 'false', onChange, children }) {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(multi ? [] : null);

    const setMultiSelection = (val) => {
        setSelected(
            selected.includes(val)
                ? selected.filter((s) => s !== val)
                : [...selected, val]
        );
    };

    useEffect(() => {
        onChange(selected);
    }, [selected]);

    return (
        <div
            id="select-container"
            className={open ? 'open' : ''}
            onClick={() => setOpen(!open)}>
            <div className="icon">{children}</div>

            <div className="fake-select">
                {!selected || selected.length === 0 ? (
                    <span className="label">{label}</span>
                ) : (
                    <span className="select-value">
                        {multi ? selected.join(', ') : selected}
                    </span>
                )}
            </div>

            <div className="icon">
                <ChevronDown size={16} onClick={() => setOpen(!open)} />
            </div>

            <div className={open ? 'select-menu open' : 'select-menu'}>
                {options.map((o, i) =>
                    multi ? (
                        <div
                            key={i}
                            className="option multi"
                            value={o}
                            onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                                label={o}
                                onChange={() => setMultiSelection(o)}
                            />
                        </div>
                    ) : (
                        <div
                            key={i}
                            className="option"
                            value={o}
                            onClick={() => setSelected(o)}>
                            {o}
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

export default Select;
