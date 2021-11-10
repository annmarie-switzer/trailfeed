import React, { useState } from 'react';
import Checkbox from './Checkbox';

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
                <Checkbox label={bucket.key} />
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