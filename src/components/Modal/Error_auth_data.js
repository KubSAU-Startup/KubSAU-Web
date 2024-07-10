import React from 'react'
import './Modal.css'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Error_auth_data({ active, setActive }) {

    return (
        <div className={`modal ${active ? 'active' : ''}`}>
            <div className='modal-content'>
                <div className='error-modal'>
                    <div className='error-modal-header'>
                        <FontAwesomeIcon icon={faExclamationTriangle} className='error-icon' />
                        <p>Произошла ошибка:</p>
                    </div>
                    <p>Неверные данные!</p>
                    <p>Если у вас возникли проблемы с авторизацией позвоните по номеру: </p><a href='tel:+79000000000'>+7 (900) 000-00-00</a>
                    <button className='btn-to-log' onClick={() => { setActive(false) }}>ОК</button>
                </div>
            </div>
        </div>
    )
}

export default Error_auth_data