import React, { useEffect, useState, useRef } from 'react';
import './Select.css';
import { ChevronDown } from 'react-feather';
import Checkbox from '../Checkbox';

function Select({
    label,
    options,
    multi = false,
    onChange,
    onClose = null,
    onOpen = null,
    isValid = true,
    children
}) {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(multi ? [] : null);
    const [classes, setClasses] = useState(['select-container']);

    const node = useRef();

    const onSelect = (val) => {
        setSelected(val);
        isValid = true;
    }

    const setMultiSelection = (val) => {
        setSelected(
            selected.includes(val)
                ? selected.filter((s) => s !== val)
                : [...selected, val]
        );
    };

    const toggle = (newOpen) => {
        let add = [];
        let remove = [];

        if (newOpen === false) {
            if (onClose) onClose();
            remove.push('open');

            console.log(isValid);

            !isValid ? add.push('error') : remove.push('error');
        } else {
            if (onOpen) onOpen();
            add.push('open');
        }
        
        setOpen(newOpen);
        setClasses([...classes.filter((c) => !remove.includes(c)), ...add]);
    };

    // TODO - does not trigger error class
    // const offClick = (e) => {
    //     if (!node.current.contains(e.target)) {
    //         toggle(false);
    //     }
    // };

    // useEffect(() => {
    //     document.addEventListener('mousedown', offClick);
    //     return () => {
    //         document.removeEventListener('mousedown', offClick);
    //     };
    // }, []);

    useEffect(() => {
        onChange(selected);
    }, [selected]);

    return (
        <div ref={node} className={classes.join(' ')} onClick={() => toggle(!open)}>
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
                <ChevronDown size={16} onClick={() => toggle(!open)} />
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
                            onClick={() => onSelect(o)}>
                            {o}
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

export default Select;
