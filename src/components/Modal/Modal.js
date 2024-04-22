import React from 'react'
import './Modal.css'

function Modal({ active, setActive, children, setAdd, setEdit }) {
    return (
        <div className={`modal ${active ? "active" : ""}`}>
            <div className='modal-content'>
                {children}
                <div className='modal-button'>
                    <button onClick={() => {setActive(false);}}>Сохранить</button>
                    <button onClick={() => {setActive(false);}}>Отмена</button>
                </div>

            </div>
        </div>
    )
}

export default Modal