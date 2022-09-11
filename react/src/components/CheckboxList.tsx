import { Dispatch, SetStateAction, useState } from 'react';
import './CheckboxList.css';
import { Checkbox } from './Checkbox';

type CheckboxListProps = {
    buckets: any[];
    group: any;
    setSelection: Dispatch<SetStateAction<any>>
}

export const CheckboxList = ({ buckets, group, setSelection }: CheckboxListProps) => {
    const [selection, setLocalSelection] = useState<any[]>([]);

    const toggle = (target: any) => {
        const newSelection = target.checked
            ? [...selection, target.value]
            : selection.filter((s) => s !== target.value);

        setLocalSelection(newSelection);

        setSelection({
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
                        onChange={toggle}
                    />
                </div>
            );
        });

    return <div className="checkbox-list">{checkboxes}</div>;
}
