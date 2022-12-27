import { ReactElement, useEffect, useState } from 'react';
import './Input.css';
import { Minus, Plus } from 'react-feather';

type InputProps = {
    type: string;
    onChange: (v: string) => void;
    placeholder?: string;
    onBlur?: () => void;
    hasError?: boolean;
    children?: ReactElement;
};

export const Input = ({
    type,
    placeholder,
    onChange,
    onBlur = () => null,
    hasError = false,
    children
}: InputProps) => {
    const [value, setValue] = useState<any>('');

    useEffect(() => {
        onChange(value);
    }, [value]);

    const increment = () => {
        if (value === '') {
            setValue(1);
        } else {
            setValue(Number(value) + 1);
        }
    };

    const decrement = () => {
        if (value !== '' && value !== 0) {
            setValue(Number(value) - 1);
        }
    };

    const classNames = () => {
        const classes = ['custom-input'];

        if (type === 'number') {
            classes.push('number');
        }

        if (hasError) {
            classes.push('error');
        }

        return classes.join(' ');
    };

    return (
        <div className={classNames()}>
            <div className="icon">{children}</div>
            {type === 'number' ? (
                <>
                    <input
                        type={type}
                        value={value}
                        placeholder={placeholder}
                        onChange={(e) => setValue(e.target.value)}
                        onBlur={onBlur}
                    />
                    <div className="buttons">
                        <Plus
                            size={16}
                            color="currentColor"
                            onClick={() => increment()}
                        />
                        <Minus
                            size={16}
                            color="currentColor"
                            className={value === 0 ? 'disabled' : ''}
                            onClick={() => decrement()}
                        />
                    </div>
                </>
            ) : (
                <input
                    type={type}
                    placeholder={placeholder}
                    onChange={(e) => setValue(e.target.value)}
                    onBlur={onBlur}
                />
            )}
        </div>
    );
}
