import { ReactNode, useState } from 'react';
import './Tooltip.css';

type TooltipProps = {
    children: ReactNode;
    text: string;
    position?: 'bottom' | 'top';
};

export const Tooltip = ({
    children: trigger,
    text,
    position = 'bottom'
}: TooltipProps) => {
    const [showTooltip, setShowTooltip] = useState(false);

    const style = position === 'bottom' ? { top: '130%' } : { bottom: '130%' };

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
