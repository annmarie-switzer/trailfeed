import React, { useState } from 'react';

function Checkbox(props) {
    const {
        value,
        color = props.inverse ? 'var(--accent)' : 'var(--primary)',
        label = '',
        inverse = false,
    } = props;

    const [checked, setChecked] = useState(false);

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
                <span>{label}</span>
            </label>
        </>
    );
}

export default Checkbox;
