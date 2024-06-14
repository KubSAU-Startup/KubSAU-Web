import React, { useRef } from 'react';
import './Modal.css';

function Empty_modal({ active, children, setActive }) {
    const modalRef = useRef(null);

    // функция клика вне окна
    const handleCloseModal = (event) => {
        if (!modalRef.current.contains(event.target)) {
            setActive(false); // Закрыть модальное окно только если клик был снаружи
            document.body.style.overflow = '';
            const adMainHeaders = document.getElementsByClassName('ad_main_header');
            for (let i = 0; i < adMainHeaders.length; i++) {
                adMainHeaders[i].style.paddingRight = `10px`;
            }
            const usMainHeaders = document.getElementsByClassName('us_main_header');
            for (let i = 0; i < usMainHeaders.length; i++) {
                usMainHeaders[i].style.paddingRight = `10px`;
            }
            document.getElementById('body-content').style.paddingRight = ``;
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
