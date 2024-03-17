import React from 'react'
import './Modal.css'

function Modal({ active, setActive, children }) {
    return (
        <div className={`modal ${active ? "active" : ""}`}>
            <div className='modal-content'>
                {children}
                <div className='modal-button'>
                    <button>Сохранить</button>
                    <button onClick={() => setActive(false)}>Отмена</button>
                </div>

            </div>
        </div>
    )
}

export default Modal