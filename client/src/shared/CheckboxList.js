import React, { useState } from 'react';
import Checkbox from './Checkbox';

function CheckboxList(props) {
    const { buckets, group } = props;

    const [selection, setSelection] = useState([]);

    const toggle = (target) => {
        const newSelection = target.checked
            ? [...selection, target.value]
            : selection.filter((s) => s !== target.value);

        setSelection(newSelection);

        props.setSelection({
            name: `${group}.keyword`,
            values: newSelection,
            type: 'terms'
        });
    };

    const checkboxes = buckets.map((bucket, i) => {
        return (
            <div className="item-container" key={i}>
                <Checkbox
                    value={bucket.key}
                    label={bucket.key}
                    inverse={group === 'allergens'}
                    onChange={toggle}
                />
            </div>
        );
    });

    return <div className="checkbox-list">{checkboxes}</div>;
}

export default CheckboxList;
