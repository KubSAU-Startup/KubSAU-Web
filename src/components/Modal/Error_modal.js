import React from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import './Modal.css'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Error_modal({ active, setActive, children, text, setText }) {
    return (
        <div className={`modal ${active ? 'active' : ''}`}>
            <div className='modal-content'>
                <div className='error-modal'>
                    <div className='error-modal-header'>
                        <FontAwesomeIcon icon={faExclamationTriangle} className='error-icon' />
                        <p>Произошла ошибка:</p>
                    </div>
                    <p>{`${text}`}</p>
                    <p>Попробуйте авторизоваться</p>
                    <Link to='/' className='btn-to-log'>Авторизоваться</Link>
                </div>
            </div>
        </div>
    )
}

export default Error_modal