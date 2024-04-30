import React, { useState } from 'react';
import './Admin_header.css';
import { Routes, Route, Link, Navigate } from 'react-router-dom';

function Admin_header() {

    const [isOpen, setOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState();

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
    };
    if (isAuthenticated == false) {
        return <Navigate to='/Log' />
    }
    return (
        <div className='ad_main_header'>
            <img className='ad_main_logo' src={require('../../img/logo1.png')} />
            <button className='menu_button' onClick={() => setOpen(!isOpen)}>Журналы
                <img className={`button_arrow ${isOpen ? "active" : ""}`} src={require('../../img/nav arrow.png')} />
            </button>
            <nav className={`menu ${isOpen ? "active" : ""}`}>
                <ul className='menu_list'>
                    <Link to="/AdminMain" className='link-to'><li className='menu_item'>Последние записи</li></Link>
                    <Link to="/AdminDepartment" className='link-to'><li className='menu_item'>Кафедры</li></Link>
                    <Link to="/AdminStud" className='link-to'><li className='menu_item'>Студенты</li></Link>
                    <Link to="/AdminDirection" className='link-to'><li className='menu_item'>Направления</li></Link>
                </ul>
            </nav>

            <Link to='/AdminUsers' className='admin-to-users'>Пользователи</Link>

            <Link className='admin-to-qr' to="/CreateQR">
                <p>Создать QR-код</p>
                <img className='qr-arrow' src={require('../../img/arrow.png')} />

            </Link>

            <Link to='/AdminAccount' className='admin-to-account'>Мой аккаунт</Link>
            <div className='admin-to-exit' onClick={handleLogout}>Выход</div>
        </div>

    )
}

export default Admin_header