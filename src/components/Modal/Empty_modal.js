import React from 'react'
import './Modal.css'

function Empty_modal({ active, children }) {
    return (
        <div className={`modal ${active ? "active" : ""}`}>
            <div className='modal-content'>
                {children}
               

            </div>
        </div>
    )
}

export default Empty_modal