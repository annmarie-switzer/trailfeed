import { ChangeEvent } from 'react';
import './Checkbox.css';

interface CheckboxProps {
    value?: string;
    label?: string;
    inverse?: boolean;
    checked?: boolean;
    onChange: (ev: ChangeEvent<HTMLInputElement>) => void;
}

export const Checkbox = ({
    value,
    label = '',
    inverse = false,
    checked = false,
    onChange
}: CheckboxProps) => {
    const color = inverse ? 'var(--allergies)' : 'var(--checkbox)';
    const marginLeft = label === '' ? 0 : '0.5rem';

    // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     toggle(event.target);
    // };

    return (
        <label
            className={inverse ? 'checkbox inverse' : 'checkbox'}
            onClick={(event) => event.stopPropagation()}
        >
            <input
                type="checkbox"
                checked={checked}
                value={value}
                style={{
                    backgroundColor: `${checked ? color : ''}`,
                    borderColor: `${checked ? color : 'var(--bg3)'}`
                }}
                onChange={onChange}
            />
            <span style={{ marginLeft }}>{label}</span>
        </label>
    );
};
