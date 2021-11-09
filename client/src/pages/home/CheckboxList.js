import React, { useState } from 'react';

function CheckboxList(props) {
    const [selection, setSelection] = useState([]);

    const toggle = (target) => {
        const newSelection = target.checked ?
            [...selection, target.value] :
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
            <div className="item-container" key={i}>
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
        <div className="checkbox-list">
            {checkboxes}
        </div>
    )
}

export default CheckboxList;