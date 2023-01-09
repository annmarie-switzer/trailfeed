import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import './CheckboxList.css';
import { Checkbox } from './Checkbox';

type CheckboxListProps = {
    buckets: any[];
    group: any;
    handleFilter: Dispatch<SetStateAction<any>>;
};

export const CheckboxList = ({
    buckets,
    group,
    handleFilter
}: CheckboxListProps) => {
    const [selection, setSelection] = useState<any[]>([]);

    const toggle = (e: ChangeEvent<HTMLInputElement>) => {
        const newSelection = e.target.checked
            ? [...selection, e.target.value]
            : selection.filter((s) => s !== e.target.value);

        setSelection(newSelection);

        handleFilter({
            name: `${group}`,
            values: newSelection,
            type: 'terms'
        });
    };

    const checkboxes = buckets
        .sort((a, b) => (a.key > b.key ? 1 : a.key < b.key ? -1 : 0))
        .map((bucket, i) => {
            return (
                <div className="item-container" key={i}>
                    <Checkbox
                        value={bucket.key}
                        label={bucket.key.replace('_', ' ')}
                        inverse={group === 'allergens'}
                        checked={selection.includes(bucket.key)}
                        onChange={toggle}
                    />
                </div>
            );
        });

    return <div className="checkbox-list">{checkboxes}</div>;
};
