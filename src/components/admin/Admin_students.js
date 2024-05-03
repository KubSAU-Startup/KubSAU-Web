import React, { useState, useEffect } from 'react';
import Admin_header from './Admin_header';
import './Admin_students.css'
import Select from 'react-select';
import { customStyles } from '../Select_style/Select_style';
import { customStylesModal } from '../Select_style/Select_style';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import Modal from '../Modal/Modal';
import { getAllDirectivities, getAllGroups, getAllStudents, getTextError } from '../../network';


const endpoint = 'https://jsonplaceholder.typicode.com/users';

function Admin_students() {
    const [modalActive, setModalActive] = useState(false);
    const [userStates, setUserStates] = useState({});
    const [allUsers, setAllUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);

    const [filterGroup, setFilterGroup] = useState(null);
    const [filterDirectioin, setFilterDirection] = useState(null);
    const [filterProgram, setFilterProgram] = useState(null);

    const [modalGroup, setModalGroup] = useState(null);
    const [modalDirectioin, setModalDirection] = useState(null);
    const [modalDirectivity, setModalDirectivity] = useState(null);
    const [modalProgram, setModalProgram] = useState(null);

    const [modalEditActive, setModalEditActive] = useState(false);
    const [modalDeleteActive, setModalDeleteActive] = useState(false);
    const [allStudents, setAllStudents] = useState([]);
    const [allStatus, setAllStatus] = useState([]);
    const [allDirectivities, setAllDirectivities] = useState({
        directivities: [],
        heads: [],
        grades: []
    });
    const [allHeads, setAllHeads] = useState([]);


    const [searchResults, setSearchResults] = useState([]);
    const [hasMoreData, setHasMoreData] = useState(true);

    const [allGroups, setAllGroups] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [errorActive, setErrorActive] = useState(false);
    const [textError, setTextError] = useState('');
    const [cartStates, setCartStates] = useState({});
    const [numberGroup, setNumberGroup] = useState('');
    const [newNumberGroup, setNewNumberGroup] = useState(null);


    const [newDirectivity, setNewDirectivity] = useState(null);
    const [newHead, setNewHead] = useState(null);


    const [head, setHead] = useState(null);
    const [directivity, setDirectivity] = useState(null);

    const [abbGroup, setAbbGroup] = useState('');
    const [newAbbGroup, setNewAbbGroup] = useState('');


    const [editId, setEditId] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    const [visibleItems, setVisibleItems] = useState(10);
    const [isPaginationVisible, setIsPaginationVisible] = useState(true);

    const [offset, setOffset] = useState(0);
    const limit = 30; // Количество элементов на странице

    // функция загрузки данных пагинации
    const loadMore = () => {
        setOffset(prevOffset => prevOffset + limit);
    };

    useEffect(() => {
        getAllStudents(offset, limit, (res) => {
            setIsLoading(true);
            setHasMoreData(true);
            if (res.error) {
                setTextError(getTextError(res.error));
                setErrorActive(true);
            } else {
                if (res.response.students.length < limit) {
                    setHasMoreData(false); // Если загружено меньше, чем лимит, значит, больше данных нет
                }

                // Если это первая страница, просто устанавливаем новые данные
                if (offset === 0) {
                    setAllStudents(res.response.students);
                    setAllStatus(res.response.statuses)
                    setSearchResults(res.response.students);
                } else {
                    // Иначе обновляем данные
                    setAllStudents(prevData => [...prevData, ...res.response.students]);
                    setAllStatus(prevData => [...prevData, ...res.response.statuses])

                    setSearchResults(prevResults => [...prevResults, ...res.response.students]);
                }
            }
            setIsLoading(false);
        });
    }, [offset, limit])

    useEffect(() => {
        getAllDirectivities(true, (res) => {
            setIsLoading(true);
            if (res.error) {
                setTextError(getTextError(res.error));
                setErrorActive(true);
            } else {
                setAllDirectivities(res.response);
            }
            setIsLoading(false);
        })

        getAllGroups((res) => {
            setIsLoading(true);
            if (res.error) {
                setTextError(getTextError(res.error));
                setErrorActive(true);
            } else {
                setAllGroups(res.response);
            }
            setIsLoading(false);
        })
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
            {searchResults.map(res => (

                <div className='cart-stud'>
                    {/* <div className='data'>
                        {user.id}
                    </div> */}
                    <div className='content'>
                        <div className='col1'>
                            <p><span>ФИО:</span> {res.lastName + " " + res.firstName + " " + res.middleName}</p>
                            <p><span>Группа:</span> {allGroups.find(el => el.id === res.groupId).title}</p>
                            {res.groupId &&
                                <p>
                                    <span>Степень образования:</span> {
                                        allDirectivities.grades.find(grade =>
                                            grade.id === allDirectivities.directivities.find(directivity =>
                                                directivity.id === allGroups.find(group =>
                                                    group.id === allStudents.find(student =>
                                                        student.id === res.groupId
                                                    ).groupId
                                                ).directivityId
                                            ).gradeId
                                        )?.title
                                    }
                                </p>
                            }


                        </div>
                        <div className='col2'>
                            {res.groupId &&
                                <p>
                                    <span>Направление:</span> {
                                        allDirectivities.heads.find(head =>
                                            head.id === allDirectivities.directivities.find(directivity =>
                                                directivity.id === allGroups.find(group =>
                                                    group.id === allStudents.find(student =>
                                                        student.id === res.groupId
                                                    ).groupId
                                                ).directivityId
                                            ).headId
                                        )?.title
                                    }
                                </p>
                            }

                            {console.log(allGroups.find(el => el.id === res.groupId).directivityId)}
                            {res.groupId &&
                                <p><span>Направленность:</span> {
                                    allDirectivities.directivities.find(r =>
                                        r.id === allGroups.find(el =>
                                            el.id === res.groupId
                                        ).directivityId
                                    )?.title
                                }
                                </p>
                            }

                        </div>
                    </div>
                    <button
                        className='student-setting'
                        onClick={() => handleSettingClick(res.id)}
                    >
                        <img src={require('../../img/setting.png')} alt='setting' />
                    </button>
                    <div className={`button-edit-delete ${userStates[res.id] ? 'active' : ''}`}>
                        <button>
                            <img src={require('../../img/edit.png')} alt='edit' />
                        </button>
                        <button>
                            <img src={require('../../img/delete.png')} alt='delete' />
                        </button>
                    </div>
                </div>
            ))}
            {hasMoreData && (
                <button className='btn-loadMore' onClick={loadMore}>
                    Загрузить ещё
                </button>
            )}

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