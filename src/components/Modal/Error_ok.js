import React, { useRef } from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import './Modal.css'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Error_ok({ active, text, codeText, setActive }) {
    const modalRef = useRef(null);

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
        <div className={`modal ${active ? 'active' : ''}`} onClick={handleCloseModal}>
            <div className='modal-content' ref={modalRef}>
                <div className='error-modal-empty'>
                    <div className='error-empty-header'>
                        <FontAwesomeIcon icon={faExclamationTriangle} className='error-icon' />
                        <p>Произошла ошибка:</p>
                    </div>
                    <p>{`${text}`}</p>
                    <p><b>Код ошибки: </b>{`${codeText}`}</p>
                    <button onClick={()=>{setActive(false)}} className='btn-to-ok'>ОК</button>
                </div>
            </div>
        </div>
    )
}

export default Error_ok