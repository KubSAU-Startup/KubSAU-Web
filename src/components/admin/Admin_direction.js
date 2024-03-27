import React, { useState, useEffect } from 'react';
import Admin_header from './Admin_header';
import './Admin_direction.css'
import Select from 'react-select';
import Modal from '../Modal/Modal';
import { customStyles } from '../Select_style/Select_style';
import { customStylesModal } from '../Select_style/Select_style';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';

const endpoint = 'https://jsonplaceholder.typicode.com/users';

function Admin_direction() {
    const [modalActive, setModalActive] = useState(false);
    const [userStates, setUserStates] = useState({});
    const [allUsers, setAllUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const [filterDirectivity, setFilterDirectivity] = useState(null);
    const [filterDirectioin, setFilterDirection] = useState(null);
    const [filterProgram, setFilterProgram] = useState(null);

    const [modalIdGroup, setModalIdGroup] = useState(null);
    const [modalDirectioin, setModalDirection] = useState(null);
    const [modalDirectivity, setModalDirectivity] = useState(null);
    const [modalProgram, setModalProgram] = useState(null);

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
            user.name.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setFilteredUsers(filtered);
    };

    const handleSettingClick = (userId) => {
        setUserStates(prevUserStates => ({
            ...prevUserStates,
            [userId]: !prevUserStates[userId],
        }));
    };
    function handleFilterDirectivity(data) {
        setFilterDirectivity(data);
    }

    function handleFilterDirection(data) {
        setFilterDirection(data);
    }

    function handleFilterProgram(data) {
        setFilterProgram(data);
    }

    function handleModalIdGroup(data) {
        setModalIdGroup(data);
    }

    function handleModalDirection(data) {
        setModalDirection(data);
    }

    function handleModalDirectivity(data) {
        setModalDirectivity(data);
    }

    function handleModalProgram(data) {
        setModalProgram(data);
    }
    return (
        <>
            <Admin_header />
            <div className='admin-main-search'>
                <input
                    type='text'
                    value={searchTerm}
                    onChange={handleChange}
                    placeholder='Поиск по имени...'
                />
            </div>
            <div className='filters'>
                <Select
                    styles={customStyles}
                    placeholder="Направление"
                    value={filterDirectioin}
                    onChange={handleFilterDirection}
                    isSearchable={true}
                    options={allUsers.map(user => ({
                        value: user.address.city,
                        label: user.address.city,
                    }))}
                />
                <Select
                    styles={customStyles}
                    placeholder="Направленность"
                    value={filterDirectivity}
                    onChange={handleFilterDirectivity}
                    isSearchable={true}
                    options={allUsers.map(user => ({
                        value: user.email,
                        label: user.email,
                    }))}
                />
                <Select
                    styles={customStyles}
                    placeholder="Программа"
                    value={filterProgram}
                    onChange={handleFilterProgram}
                    isSearchable={true}
                    options={allUsers.map(user => ({
                        value: user.email,
                        label: user.email,
                    }))}
                />


                <button className='get-params' type='submit'>Применить</button>
                <button className='delete-params'>Сбросить</button>

            </div>

            <button className='add-student' onClick={() => setModalActive(true)}>
                <FontAwesomeIcon icon={faPlusCircle} />
            </button>
            {filteredUsers.map(user => (
                <div className='cart-direct' key={user.id}>
                    <div className='content'>
                        <div className='col1'>
                            <p><span>Направление:</span> {user.address.suite}</p>
                            <p><span>Программа:</span> {user.company.name}</p>
                        </div>
                        <div className='col2'>
                            <p><span>Направленность:</span> {user.address.city}</p>

                        </div>
                    </div>
                    <button
                        className='direction-setting'
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
            <Modal active={modalActive} setActive={setModalActive}>
                <div className='input-conteiner'>
                    <input type='text' className='name-direction' placeholder=' ' />
                    <label className='label-name'>Аббревиатура направления</label>
                </div>
                <Select
                    styles={customStylesModal}
                    placeholder="Направление"
                    value={modalDirectioin}
                    onChange={handleModalDirection}
                    isSearchable={true}
                    options={allUsers.map(user => ({
                        value: user.address.city,
                        label: user.address.city,
                    }))}
                />
                <Select
                    styles={customStylesModal}
                    placeholder="Направленность"
                    value={modalDirectivity}
                    onChange={handleModalDirectivity}
                    isSearchable={true}
                    options={allUsers.map(user => ({
                        value: user.address.city,
                        label: user.address.city,
                    }))}
                />
                <Select
                    styles={customStylesModal}
                    placeholder="Программа"
                    value={modalProgram}
                    onChange={handleModalProgram}
                    isSearchable={true}
                    options={allUsers.map(user => ({
                        value: user.email,
                        label: user.email,
                    }))}
                />


            </Modal>
        </>

    );
}

export default Admin_direction;