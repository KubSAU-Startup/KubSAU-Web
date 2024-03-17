import React, { useEffect, useState } from 'react';
import './Admin_header.css';
import './CreateQR.css'
import { Routes, Route, Link, Navigate } from 'react-router-dom';

const endpoint = 'https://jsonplaceholder.typicode.com/users';

function CreateQR() {
  const [isOpen, setOpen] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [userStates, setUserStates] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(endpoint);
        const data = await response.json();
        setAllUsers(data);
        setFilteredUsers(data);

        const initialUserStates = {};
        data.forEach(user => {
          initialUserStates[user.id] = false;
        });
        setUserStates(initialUserStates);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    const filtered = allUsers.filter(user =>
      user.address.zipcode.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleSettingClick = (userId) => {
    setUserStates(prevUserStates => ({
      ...prevUserStates,
      [userId]: !prevUserStates[userId],
    }));
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };
  if (isAuthenticated == false) {
    return <Navigate to='/Log' />
  }
  return (
    <>
      <div className='ad_main_header'>
        <img className='ad_main_logo' src={require('../../img/logo1.png')} />
        <button className='menu_button' onClick={() => setOpen(!isOpen)}>Журналы
          <img className={`button_arrow ${isOpen ? "active" : ""}`} src={require('../../img/nav arrow.png')} />
        </button>
        <nav className={`menu ${isOpen ? "active" : ""}`}>
          <ul className='menu_list'>
            <Link to="/AdminMain" className='link-to'><li className='menu_item'>Последнии записи</li></Link>
            <Link to="/AdminDepartment" className='link-to'><li className='menu_item'>Кафедры</li></Link>
            <Link to="/AdminStud" className='link-to'><li className='menu_item'>Студенты</li></Link>
            <Link to="/AdminDirection" className='link-to'><li className='menu_item'>Направления</li></Link>
          </ul>
        </nav>

        <Link to='/AdminUsers' className='admin-to-users'>Пользователи</Link>

        <Link to='/AdminAccount' className='admin-to-account'>Мой аккаунт</Link>
        <div className='admin-to-exit' onClick={handleLogout}>Выход</div>
      </div>
      <div className='qr-options'>
        <div className='create-qr'>
          <h2>Создать QR-код</h2>
          <p>Выберите:</p>
          <div className='filter-qr'>
            <select>
              <option value={''}>Семестр: </option>
              {allUsers.map(user =>
                <option key={user.id} value={user.company.name}>{user.company.name}</option>
              )}
            </select>
            <select>
              <option value={''}>Направление: </option>
              {allUsers.map(user =>
                <option key={user.id} value={user.address.suite}>{user.address.suite}</option>
              )}
            </select>
            <select>
              <option value={''}>Группа: </option>
              {allUsers.map(user =>
                <option key={user.id} value={user.address.suite}>{user.address.suite}</option>
              )}
            </select>
            <button className='btn-create-qr'>
              Создать qr
              <img src={require('../../img/qr_white.png')} />
            </button>
          </div>
        </div>
        <div className='data-option'>
          <div className='search'>
            <input type='text'
              value={searchTerm}
              onChange={handleChange}
              placeholder='Поиск по направлению...' />
          </div>
          <div className='filter-data-qr'>
            <select>
              <option value={''}>Семестр: </option>
              {allUsers.map(user =>
                <option key={user.id} value={user.address.suite}>{user.address.suite}</option>
              )}
            </select>
            <select>
              <option value={''}>Направление: </option>
              {allUsers.map(user =>
                <option key={user.id} value={user.address.suite}>{user.address.suite}</option>
              )}
            </select>
            {/* onClick={() => setModalActive(true) */}

          </div>
        </div>
      </div>
      <button className='add-qr-group' >
        <img src={require('../../img/add.png')} alt='add' />
      </button>
      {filteredUsers.map(user => (
        <div className='cart-qr-group' key={user.id}>
          <div className='data-qr'>
            <div className='qr1'>
              <p><span>Семестр: </span>{user.address.street}</p>
              <p><span>Наравление: </span>{user.address.zipcode}</p>
            </div>
            <div className='qr2'>
              <span>Дисциплины: </span>
              <p>{user.address.street}</p>
            </div>
            <div className='qr3'>

              <p>{user.address.street}</p>

            </div>
          </div>
          <button
            className='qr-setting'
            onClick={() => handleSettingClick(user.id)}
          >
            <img src={require('../../img/setting.png')} alt='setting' />
          </button>
          <div className={`button-edit-delete ${userStates[user.id] ? 'active' : ''}`}>
            <button>
              <img src={require('../../img/edit.png')} alt='edit' />
            </button>
            <button>
              <img src={require('../../img/delete.png')} alt='delete' />
            </button>
          </div>
        </div>
      ))}
    </>



  )
}

export default CreateQR