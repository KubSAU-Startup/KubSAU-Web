import React from 'react'
import './Modal.css'

function Forgot_pass({ active, setActive }) {

    return (
        <div className={`modal ${active ? 'active' : ''}`}>
            <div className='modal-content'>
                <div className='error-modal'>
                    <p>Позвоните по номеру: </p><a href='tel:+79000000000'>+7 (900) 000-00-00</a>
                    <button className='btn-to-log' onClick={() => { setActive(false) }}>ОК</button>
                </div>
            </div>
        </div>
    )
}

export default Forgot_pass