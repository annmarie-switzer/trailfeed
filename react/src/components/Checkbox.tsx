import { useState } from 'react';
import './Checkbox.css';

type CheckboxProps = {
    value?: any;
    label?: string;
    inverse?: boolean;
    defaultChecked?: boolean;
    onChange: (t?: any) => void;
};

export const Checkbox = ({
    value,
    label = '',
    inverse = false,
    defaultChecked = false
}: CheckboxProps) => {
    const [checked, setChecked] = useState(defaultChecked);

    const color = inverse ? 'var(--allergies)' : 'var(--checkbox)';

    const marginLeft = label === '' ? 0 : '0.5rem';

    const onChange = (event: any) => {
        setChecked(event.target.checked);
        onChange(event.target);
    };

    return (
        <>
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
                    onChange={onChange}
                />
                <span style={{ marginLeft }}>{label}</span>
            </label>
        </>
    );
};
