import React, { useState } from 'react';

function Checkbox(props) {
    const {
        value,
        color='var(--accent)',
        label='',
    } = props;
    
    const [checked, setChecked] = useState(false);

    const onChange = (event) => {
        setChecked(event.target.checked);
        props.onChange(event.target);
    };

    return (
        <>
            <label className="checkbox" onClick={(event) => event.stopPropagation()}>
                <input
                    type="checkbox"
                    value={value}
                    style={{
                        backgroundColor: `${checked ? color : ''}`,
                        borderColor: `${checked ? color : 'var(--bg3)'}`
                    }}
                    onChange={onChange}
                />
                <span>{label}</span>
            </label>
        </>
    )
}

export default Checkbox;