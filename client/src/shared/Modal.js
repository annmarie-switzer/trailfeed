import React from 'react';

function Modal(props) {
    return (
        <div id="modal">
            <div id="backdrop" onClick={props.close}></div>
            <div id="content">
                <p>Hello! I am a modal</p>
                <button onClick={props.close}>Close Me</button>
                <pre>{JSON.stringify(props, null, 2)}</pre>
            </div>
        </div>
    )
}

export default Modal;