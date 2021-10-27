import React from 'react';

function CheckboxList(props) {
    const checkboxes = props.buckets.map((bucket, i) => {
        return (
            <div key={i} className="checkbox-list">
                <input type="checkbox" id={bucket.key} />
                <label htmlFor={bucket.key}>{bucket.key}</label>
            </div>
        )
    })

    return (
        <div>{checkboxes}</div>
    )
}

export default CheckboxList;