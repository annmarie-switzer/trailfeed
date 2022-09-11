import { useState, useEffect } from 'react';
import './Textarea.css';

type TextAreaProps = {
    rows?: number;
    placeholder: string;
    onChange: (s: string) => void;
};

export const Textarea = ({ rows = 1, placeholder, onChange }: TextAreaProps) => {
    const [value, setValue] = useState('');

    useEffect(() => {
        onChange(value);
    }, [value]);

    return (
        <div id="textarea-wrapper" className={value ? 'has-value' : ''}>
            {/* <div className="icon">{children}</div> */}
            <textarea
                rows={rows}
                placeholder={placeholder}
                onChange={(e) => setValue(e.target.value)}
            />
        </div>
    );
}
