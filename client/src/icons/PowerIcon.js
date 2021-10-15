import React from "react";

function PowerIcon(props) {
    return (
        <svg
            width={props.width || 24}
            height={props.height || 24}
            viewBox="0 0 24 24"
            fill={props.fill || 'none'}
            stroke={props.stroke || 'currentColor'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-power">
                <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
                <line x1="12" y1="2" x2="12" y2="12" />
        </svg>
    )
}

export default PowerIcon;