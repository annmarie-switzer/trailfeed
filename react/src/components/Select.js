import React, { useEffect, useState } from 'react';
import Checkbox from './Checkbox';

function Select({ label, options, multi, onChange }) {
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
            <div className="fake-select">
                <span
                    className={
                        selected?.length > 0 || open
                            ? 'label small'
                            : 'label'
                    }>
                    {label}
                </span>
                <span className="select-value">
                    {multi ? selected.join(', ') : selected}
                </span>
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
