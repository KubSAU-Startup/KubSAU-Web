import React, { useState } from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import './Modal.css'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Error_ok({ active, text, codeText, setActive }) {
    // const [active, setActive] = useState(true);
    return (
        <div className={`modal ${active ? 'active' : ''}`}>
            <div className='modal-content'>
                <div className='error-modal'>
                    <div className='error-modal-header'>
                        <FontAwesomeIcon icon={faExclamationTriangle} className='error-icon' />
                        <p>Произошла ошибка:</p>
                    </div>
                    <p>{`${text}`}</p>
                    <p><b>Код ошибки: </b>{`${codeText}`}</p>
                    <button onClick={()=>{setActive(false)}} className='btn-to-log'>ОК</button>
                </div>
            </div>
        </div>
    )
}

export default Error_ok