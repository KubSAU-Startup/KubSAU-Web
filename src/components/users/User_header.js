import React, { useState } from 'react';
import './User_header.css';
import { Routes, Route, Link, Navigate } from 'react-router-dom';

function User_header() {

    const [isOpen, setOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState();

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
    };
    if (isAuthenticated == false) {
        return <Navigate to='/' />
    }
    return (
        <div className='us_main_header'>
            <img className='us_main_logo' src={require('../../img/logo1.png')} />
            <button className='menu_button' onClick={() => setOpen(!isOpen)}>Журналы
                <img className={`button_arrow ${isOpen ? "active" : ""}`} src={require('../../img/nav arrow.png')} />
            </button>
            <nav className={`menu ${isOpen ? "active" : ""}`}>
                <ul className='menu_list'>
                    <Link to="/UserMain" className='link-to'><li className='menu_item'>Последние записи</li></Link>
                    <Link to="/UserSubject" className='link-to'><li className='menu_item'>Дисциплины</li></Link>
                    <Link to="/UserProf" className='link-to'><li className='menu_item'>Преподаватели</li></Link>
                </ul>
            </nav>


            <Link to='/UserAccount' className='user-to-account'>Мой аккаунт</Link>
            {/* <div className='user-to-exit'>Выход</div> */}

            <div className='user-to-exit' onClick={handleLogout}>Выход</div>
        </div>

    );
}

export default User_header;