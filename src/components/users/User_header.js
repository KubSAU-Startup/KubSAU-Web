import React, { useState, useRef, useEffect } from 'react';
import './User_header.css';
import { Routes, Route, Link, Navigate } from 'react-router-dom';

function User_header() {

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


    if (isAuthenticated == false) {
        return <Navigate to='/' />
    }
    return (
        <div className='ad_main_header'>
            <img className='ad_main_logo' src={require('../../img/logo1.png')} />
            <button className='menu_button' ref={menuRef} onClick={() => setOpen(!isOpen)}>Журналы
                <img className={`button_arrow ${isOpen ? "active" : ""}`} src={require('../../img/nav arrow.png')} />
            </button>
            <nav className={`menu ${isOpen ? "active" : ""}`}>
                <ul className='menu_list'>
                    <Link to="/UserMain" className='link-to'><li className='menu_item'>Последние записи</li></Link>
                    <Link to="/UserSubject" className='link-to'><li className='menu_item'>Дисциплины</li></Link>
                    <Link to="/UserProf" className='link-to'><li className='menu_item'>Сотрудники</li></Link>
                </ul>
            </nav>


            <Link to='/UserAccount' className='user-to-account'>Мой аккаунт</Link>
            {/* <div className='user-to-exit'>Выход</div> */}

            <div className='user-to-exit' onClick={handleLogout}>Выход</div>
        </div>

    );
}

export default User_header;