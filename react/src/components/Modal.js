import React from 'react';
import { X } from 'react-feather';
import MealName from './MealName';

function Modal({ modalData, setModalData }) {
    console.log(modalData);
    return (
        <div id="modal" onClick={() => setModalData(null)}>
            <div className="modal-main" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <MealName name={modalData.name} link={modalData.link} />
                    <button type="button" onClick={() => setModalData(null)}>
                        <X />
                    </button>
                </div>
                <div className="modal-content">
                    {modalData.ingredients}
                </div>
            </div>
        </div>
    );
}

export default Modal;
