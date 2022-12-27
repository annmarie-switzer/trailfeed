import { ReactNode, useState } from 'react';
import './Tooltip.css';

type TooltipProps = {
    children: ReactNode;
    text: string;
    position?: 'bottom' | 'top';
    width?: number | string;
};

export const Tooltip = ({
    children: trigger,
    text,
    position = 'bottom',
    width
}: TooltipProps) => {
    const [showTooltip, setShowTooltip] = useState(false);

    const style =
        position === 'bottom'
            ? { top: '130%', width }
            : { bottom: '130%', width };

    return (
        <div
            className="tooltip-container"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            {trigger}
            <div
                className={showTooltip ? 'tooltip show' : 'tooltip'}
                style={style}
            >
                {text}
            </div>
        </div>
    );
};
