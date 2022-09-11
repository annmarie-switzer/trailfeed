import { useEffect, useState } from 'react';
import './Select.css';
import { CheckSquare, ChevronDown, Square } from 'react-feather';

type SelectProps = {
    label: string;
    options: any;
    multi?: boolean;
    onChange: (s: any) => void;
    onClose?: () => void;
    onOpen?: () => void;
    hasError?: boolean;
    children: any;
};

export const Select = ({
    label,
    options,
    multi = false,
    onChange,
    onClose = () => null,
    onOpen = () => null,
    hasError = false,
    children
}: SelectProps) => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<any>(multi ? [] : null);

    const classNames = () => {
        const classes = ['select-container'];

        if (open) {
            classes.push('open');
        }

        if (hasError) {
            classes.push('error');
        }

        return classes.join(' ');
    };

    const onSelect = (val: string) => {
        setSelected(val);
    };

    const setMultiSelection = (val: any) => {
        setSelected(
            selected.includes(val)
                ? selected.filter((s: any) => s !== val)
                : [...selected, val]
        );
    };

    const onClick = () => {
        open ? onBlur() : onFocus();
    };

    const onFocus = () => {
        onOpen();
        setOpen(true);
    };

    const onBlur = () => {
        onClose();
        setOpen(false);
    };

    useEffect(() => {
        onChange(selected);
    }, [selected]);

    return (
        <div
            className={classNames()}
            tabIndex={0}
            onClick={onClick}
            onBlur={onBlur}>
            <div className="icon">{children}</div>

            <div className="fake-select">
                {!selected || selected.length === 0 ? (
                    <span className="label">{label}</span>
                ) : (
                    <span className="select-value">
                        {multi ? selected.join(', ') : selected}
                    </span>
                )}
            </div>

            <div className="icon">
                <ChevronDown size={16} onClick={onClick} />
            </div>

            <div className={open ? 'select-menu open' : 'select-menu'}>
                {options.map((o: any, i: number) =>
                    multi ? (
                        <div
                            key={i}
                            className="option multi"
                            // value={o}
                            onClick={(e) => {
                                e.stopPropagation();
                                setMultiSelection(o);
                            }}>
                            {selected.includes(o) ? (
                                <CheckSquare size={20} color="var(--accent)" />
                            ) : (
                                <Square size={20} color="var(--fg4)" />
                            )}
                            <span>{o}</span>
                        </div>
                    ) : (
                        <div
                            key={i}
                            className="option"
                            // value={o}
                            onClick={() => onSelect(o)}>
                            {o}
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
