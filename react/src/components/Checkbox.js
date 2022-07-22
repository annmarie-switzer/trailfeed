import React, { useState } from 'react';
import './Checkbox.css';

function Checkbox(props) {
    const {
        value,
        color = props.inverse ? 'var(--allergies)' : 'var(--checkbox)',
        label = '',
        inverse = false,
    } = props;

    const [checked, setChecked] = useState(props.checked);

    const marginLeft = label === '' ? 0 : '0.5rem';
    
    const onChange = (event) => {
        setChecked(event.target.checked);
        props.onChange(event.target);
    };

    return (
        <>
            <label
                className={inverse ? 'checkbox inverse' : 'checkbox'}
                onClick={(event) => event.stopPropagation()}>
                <input
                    type="checkbox"
                    value={value}
                    style={{
                        backgroundColor: `${checked ? color : ''}`,
                        borderColor: `${checked ? color : 'var(--bg3)'}`,
                    }}
                    onChange={onChange}
                />
                <span style={{ marginLeft }}>{label}</span>
            </label>
        </>
    );
}

export default Checkbox;
