import { Dispatch, SetStateAction } from 'react';
import './Modal.css';
import { X } from 'react-feather';
import { MealName } from './MealName';

type ModalProps = {
    modalData: any;
    setModalData: Dispatch<SetStateAction<any>>;
};

export const Modal = ({ modalData, setModalData }: ModalProps) => {
    return (
        <div id="modal" onClick={() => setModalData(null)}>
            <div className="modal-main" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <MealName name={modalData.name} link={modalData.link} />
                    <button type="button" onClick={() => setModalData(null)}>
                        <X />
                    </button>
                </div>
                <div className="modal-content">{modalData.ingredients}</div>
            </div>
        </div>
    );
}
