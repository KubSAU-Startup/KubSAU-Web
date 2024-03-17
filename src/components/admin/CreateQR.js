import React, { useEffect, useState } from 'react';
import './Admin_header.css';
import './CreateQR.css'
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import Select from 'react-select';
import QRCode from 'qrcode.react';
import { Hidden } from '@mui/material';



const endpoint = 'https://jsonplaceholder.typicode.com/users';

function CreateQR() {
  const [isOpen, setOpen] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [userStates, setUserStates] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState();

  const [semester, setSemester] = useState(null);
  const [program, setProgram] = useState(null);
  const [group, setGroup] = useState(null);
  const [qrCodeText, setQRCodeText] = useState('');

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

  function handleSelectSemester(data) {
    setSemester(data);
  }
  function handleSelectProgram(data) {
    setProgram(data);
  }
  function handleSelectGroup(data) {
    setGroup(data);
  }

  const getQR = () => {
    if (semester !== null && program !== null && group !== null) {

      let dataToQR = semester.value + ',' + program.value + ',' + group.value;

      setQRCodeText(dataToQR);
      const qrCodeURL = document.getElementById('qrCodeEl')
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      console.log(qrCodeURL)
      let aEl = document.createElement("a");
      aEl.href = qrCodeURL;
      aEl.download = `${semester.value}.png`;
      document.body.appendChild(aEl);
      aEl.click();
      document.body.removeChild(aEl);

    } else {
      alert("iii");
    }
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
            <Select
              // styles={customStyles}
              placeholder="Семестр"
              value={semester}
              onChange={handleSelectSemester}
              isSearchable={true}
              options={allUsers.map(user => ({
                value: user.address.street,
                label: user.address.street,
              }))}
            />
            <Select
              // styles={customStyles}
              placeholder="Программа"
              value={program}
              onChange={handleSelectProgram}
              isSearchable={true}
              options={allUsers.map(user => ({
                value: user.address.zipcode,
                label: user.address.zipcode,
              }))}
            />
            <Select
              // styles={customStyles}
              placeholder="Группа"
              value={group}
              onChange={handleSelectGroup}
              isSearchable={true}
              options={allUsers.map(user => ({
                value: user.address.suite,
                label: user.address.suite,
              }))}
            />

            <button className='btn-create-qr' onClick={getQR}>
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
              <option value={''}>Программа: </option>
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
      <QRCode
        id="qrCodeEl"
        size={150}
        value={qrCodeText}
        style={{ display: 'none' }}
      />
      {filteredUsers.map(user => (
        <div className='cart-qr-group' key={user.id}>
          <div className='data-qr'>
            <div className='qr1'>
              <p><span>Семестр: </span>{user.address.street}</p>
              <p><span>Программа: </span>{user.address.zipcode}</p>
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