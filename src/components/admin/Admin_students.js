import React, { useState, useEffect } from 'react';
import Admin_header from './Admin_header';
import './Admin_students.css'
import Select from 'react-select';
import { customStyles } from '../Select_style/Select_style';
import { customStylesModal } from '../Select_style/Select_style';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import Modal from '../Modal/Modal';


const endpoint = 'https://jsonplaceholder.typicode.com/users';

function Admin_students() {
    const [modalActive, setModalActive] = useState(false);
    const [userStates, setUserStates] = useState({});
    const [allUsers, setAllUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const [filterGroup, setFilterGroup] = useState(null);
    const [filterDirectioin, setFilterDirection] = useState(null);
    const [filterProgram, setFilterProgram] = useState(null);

    const [modalGroup, setModalGroup] = useState(null);
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

    function handleFilterGroup(data) {
        setFilterGroup(data);
    }

    function handleFilterDirection(data) {
        setFilterDirection(data);
    }

    function handleFilterProgram(data) {
        setFilterProgram(data);
    }

    function handleModalGroup(data) {
        setModalGroup(data);
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
                    placeholder="Группа"
                    value={filterGroup}
                    onChange={handleFilterGroup}
                    isSearchable={true}
                    options={allUsers.map(user => ({
                        value: user.address.suite,
                        label: user.address.suite,
                    }))}
                />
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
                <div className='cart-stud' key={user.id}>
                    {/* <div className='data'>
                        {user.id}
                    </div> */}
                    <div className='content'>
                        <div className='col1'>
                            <p><span>ФИО:</span> {user.name}</p>
                            <p><span>Направление:</span> {user.address.suite}</p>
                            <p><span>Направленность:</span> {user.company.name}</p>
                        </div>
                        <div className='col2'>
                            <p><span>Группа:</span> {user.address.city}</p>
                            <p><span>Программа:</span> {user.email}</p>

                        </div>
                    </div>
                    <button
                        className='student-setting'
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
                <div className='modal-students'>
                    <div className='input-conteiner'>
                        <input type='text' className='name-stud' placeholder=' ' />
                        <label className='label-name'>ФИО</label>
                    </div>
                    <div className='input-conteiner'>
                        <input type='text' className='name-course' placeholder=' ' />
                        <label className='label-name'>Курс</label>
                    </div>
                    <Select
                        styles={customStylesModal}
                        placeholder="Группа"
                        value={modalGroup}
                        onChange={handleModalGroup}
                        isSearchable={true}
                        options={allUsers.map(user => ({
                            value: user.address.suite,
                            label: user.address.suite,
                        }))}
                    />
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

                </div>
            </Modal>
        </>

    );
}

export default Admin_students;