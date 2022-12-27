import { useState } from 'react';
import './Checkbox.css';

interface CheckboxProps {
    value?: string;
    label?: string;
    inverse?: boolean;
    defaultChecked?: boolean;
    toggle: (el: HTMLInputElement) => void;
}

export const Checkbox = ({
    value,
    label = '',
    inverse = false,
    defaultChecked = false,
    toggle
}: CheckboxProps) => {
    const [checked, setChecked] = useState(defaultChecked);

    const color = inverse ? 'var(--allergies)' : 'var(--checkbox)';

    const marginLeft = label === '' ? 0 : '0.5rem';

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked);
        toggle(event.target);
    };

    return (
        <label
            className={inverse ? 'checkbox inverse' : 'checkbox'}
            onClick={(event) => event.stopPropagation()}
        >
            <input
                type="checkbox"
                value={value}
                style={{
                    backgroundColor: `${checked ? color : ''}`,
                    borderColor: `${checked ? color : 'var(--bg3)'}`
                }}
                onChange={handleChange}
            />
            <span style={{ marginLeft }}>{label}</span>
        </label>
    );
};
