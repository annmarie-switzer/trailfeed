import React from 'react';

function LogoutIcon(props) {
    return (
        <svg
            style={props.style}
            width={props.width || 24}
            height={props.height || 24}
            fill={props.fill || 'none'}
            stroke={props.stroke || 'var(--fg)'}
            viewBox="0 0 24 24"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-log-out">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
    );
}

export default LogoutIcon;