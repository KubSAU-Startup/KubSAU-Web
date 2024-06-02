import React, { useRef } from 'react';
import './Modal.css';

function Empty_modal({ active, children, setActive }) {
    const modalRef = useRef(null);

    const handleCloseModal = (event) => {
        if (!modalRef.current.contains(event.target)) {
            setActive(false); // Закрыть модальное окно только если клик был снаружи
            document.body.style.overflow = 'auto';
            document.body.style.paddingRight = `0px`;
        }
    };

    return (
        <div className={`modal ${active ? "active" : ""}`} onClick={handleCloseModal}>
            <div className='modal-content' ref={modalRef}>
                {children}
            </div>
        </div>
    );
}

export default Empty_modal;
