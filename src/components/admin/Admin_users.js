import React, { useEffect, useState } from 'react';
import Admin_header from './Admin_header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
const endpoint = 'https://jsonplaceholder.typicode.com/users';


function Admin_users() {
    const [modalActive, setModalActive] = useState(false);
    const [userStates, setUserStates] = useState({});
    const [allUsers, setAllUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

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
            user.address.street.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setFilteredUsers(filtered);
    };

    const handleSettingClick = (userId) => {
        setUserStates(prevUserStates => ({
            ...prevUserStates,
            [userId]: !prevUserStates[userId],
        }));
    };
    return (
        <>
            <Admin_header />
            <div className='search-add'>
                <div className='admin-main-search'>
                    <input
                        type='text'
                        value={searchTerm}
                        onChange={handleChange}
                        placeholder='Поиск по названию...'
                    />
                </div>
                <button className='add-student' onClick={() => setModalActive(true)}>
                    <FontAwesomeIcon icon={faPlusCircle} />
                </button>
            </div>

            {filteredUsers.map(user => (
                <div className='cart-stud' key={user.id}>
                    <div className='content'>
                        <div className='col1'>
                            <p><span>Кафедра: </span>{user.address.street}</p>
                        </div>
                        <div className='col2'>
                            <p><span>Номер телефона: </span>{user.address.zipcode}</p>
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
    );
}

export default Admin_users;