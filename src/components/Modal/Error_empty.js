import React from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import './Modal.css'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Error_empty({ active, text, codeText }) {
    return (
        <div className={`modal ${active ? 'active' : ''}`}>
            <div className='modal-content'>
                <div className='error-modal-empty'>
                    <div className='error-empty-header'>
                        <FontAwesomeIcon icon={faExclamationTriangle} className='error-icon' />
                        <p>Произошла ошибка:</p>
                    </div>
                    <p>{`${text}`}</p>
                    <p><b>Код ошибки: </b>{`${codeText}`}</p>
                </div>
            </div>
        </div>
    )
}

export default Error_empty