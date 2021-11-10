import React, { useState } from 'react';

function Checkbox(props) {
    const {
        color='var(--accent)',
        label=''
    } = props;
    
    const [checked, setChecked] = useState(false);

    const onChange = (event) => {
        setChecked(event.target.checked);
    }

    return (
        <>
            <label className="checkbox" onClick={(event) => event.stopPropagation()}>
                <input
                    type="checkbox"
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