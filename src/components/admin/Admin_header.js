import React, { useState, useEffect, useRef } from 'react';
import './Admin_header.css';
import { Routes, Route, Link, Navigate } from 'react-router-dom';

function Admin_header() {
    const [isOpen, setOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(true);

    const menuRef = useRef(null);

    useEffect(() => {
        // Функция, которая будет вызываться при клике вне меню
        const handleClickOutside = (event) => {
            
            // Проверяем, имеет ли меню атрибут open
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpen(false); // Закрыть меню, если клик был вне его и меню не было уже открыто
            }
        };

        // Добавление обработчика события клика для всего документа
        document.addEventListener("mousedown", handleClickOutside);

        // Очистка обработчика при размонтировании компонента
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    document.body.style.overflowX = 'hidden';

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
    };

    if (!isAuthenticated) {
        return <Navigate to='/' />
    }
    return (
        <div className='ad_main_header'>
            <img className='ad_main_logo' src={require('../../img/logo1.png')} />
            <button className='menu_button' ref={menuRef}  onClick={() => setOpen(!isOpen)}>Журналы
                <img className={`button_arrow ${isOpen ? "active" : ""}`} src={require('../../img/nav arrow.png')} />
            </button>
            <nav className={`menu ${isOpen ? "active" : ""}`}>
                <ul className='menu_list'>
                    <Link to="/AdminMain" className='link-to'><li className='menu_item'>Последние записи</li></Link>
                    <Link to="/AdminDepartment" className='link-to'><li className='menu_item'>Кафедры</li></Link>
                    <Link to="/AdminStud" className='link-to'><li className='menu_item'>Студенты</li></Link>
                    <Link to="/AdminGroup" className='link-to'><li className='menu_item'>Группы</li></Link>
                    <Link to="/AdminDirection" className='link-to'><li className='menu_item'>Направления</li></Link>
                </ul>
            </nav>

            {/* <Link to='/AdminUsers' className='admin-to-users'>Пользователи</Link> */}

            <Link className='admin-to-qr' to="/CreateQR">
                <p>Создать QR-код</p>
                <img className='qr-arrow' src={require('../../img/arrow.png')} />
            </Link>

            <Link to='/AdminAccount' className='admin-to-account'>Мой аккаунт</Link>
            <div className='admin-to-exit' onClick={handleLogout}>Выход</div>
        </div>
    )
}

export default Admin_header;
