import React, { useState } from 'react';

function CheckboxList(props) {
    const [selection, setSelection] = useState([]);

    const toggle = (target) => {
        const newSelection = target.checked ? 
            [ ...selection, target.value] : 
            selection.filter(s => s != target.value)

        setSelection(newSelection);

        props.setSelection({
            type: 'terms',
            name: `${target.name}.keyword`,
            values: newSelection
        });
    }

    const checkboxes = props.buckets.map((bucket, i) => {
        return (
            <div key={i} className="checkbox-list">
                <input
                    type="checkbox"
                    id={bucket.key}
                    name={props.name}
                    value={bucket.key}
                    onChange={(event) => toggle(event.target)} />
                <label htmlFor={bucket.key}>{bucket.key}</label>
            </div>
        )
    })

    return (
        <div>{checkboxes}</div>
    )
}

export default CheckboxList;