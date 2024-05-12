import React, { useState, useEffect } from 'react';
import Admin_header from './Admin_header';
import './Admin_students.css'
import Select from 'react-select';
import { customStyles } from '../Select_style/Select_style';
import { customStylesModal } from '../Select_style/Select_style';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import Empty_modal from '../Modal/Empty_modal'
import { getAllDirectivities, getAllGroups, getAllStudents, getTextError, addNewStudent, editStudent, deleteStudent } from '../../network';


const endpoint = 'https://jsonplaceholder.typicode.com/users';

function Admin_students() {
    const [modalActive, setModalActive] = useState(false);
    const [modalContActive, setModalContActive] = useState(false);
    const [userStates, setUserStates] = useState({});
    const [allUsers, setAllUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);

    const [filterGroup, setFilterGroup] = useState(null);
    const [filterDirectioin, setFilterDirection] = useState(null);
    const [filterProgram, setFilterProgram] = useState(null);

    const [modalGroup, setModalGroup] = useState(null);
    const [modalEditGroup, setModalEditGroup] = useState(null);
    const [modalStatus, setModalStatus] = useState(null);
    const [modalEditStatus, setModalEditStatus] = useState(null);

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

    const [lastN, setLastN] = useState(null);
    const [firstN, setFirstN] = useState(null);
    const [middleN, setMiddleN] = useState(null);
    const [lastNEdit, setLastNEdit] = useState(null);
    const [firstNEdit, setFirstNEdit] = useState(null);
    const [middleNEdit, setMiddleNEdit] = useState(null);

    const [offset, setOffset] = useState(0);
    const limit = 30; // Количество элементов на странице

    // функция загрузки данных пагинации
    const loadMore = () => {
        setOffset(prevOffset => prevOffset + limit);
    };
    const [isSetOpen, setIsSetOpen] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);

    const openModal = (itemId) => {
        setSelectedItemId(itemId);
        setIsSetOpen(true);
    };

    const closeModal = () => {
        setIsSetOpen(false);
    };

    useEffect(() => {
        // Функция, которая вызывается при клике вне меню
        const handleClickOutside = (event) => {
            if (event.srcElement.offsetParent && !(event.srcElement.offsetParent.className === 'qr-setting')) {
                closeModal();
            }
        };

        // Добавление обработчика события клика для всего документа
        document.addEventListener("click", handleClickOutside);

        // Очистка обработчика при размонтировании компонента
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

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
                    setAllStatus([...res.response.statuses])

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
        // const fetchData = async () => {
        //     try {
        //         const response = await fetch(endpoint);
        //         const data = await response.json();
        //         setAllUsers(data);
        //         setFilteredUsers(data);

        //         const initialUserStates = {};
        //         data.forEach(user => {
        //             initialUserStates[user.id] = false;
        //         });
        //         setUserStates(initialUserStates);
        //     } catch (error) {
        //         console.error('Error fetching data:', error);
        //     }
        // };

        // fetchData();
    }, []);
    useEffect(() => {
        if (modalActive || modalEditActive || modalDeleteActive) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }
    }, [modalActive, modalEditActive, modalDeleteActive]);

    const handleChange = (e) => {
        setSearchTerm(e.target.value);
        const filtered = allUsers.filter(user =>
            user.name.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setFilteredUsers(filtered);
    };
    async function addData() {
        await addNewStudent(firstN, lastN, middleN, modalGroup.value, modalStatus.value, (res) => {
            if (res.success) {
                setAllStudents(prevData => [res.response, ...prevData]);
            } else {
                console.log(res);
            }
        });
    }
    console.log(searchResults)
    async function editData() {
        await editStudent(editId, firstNEdit, lastNEdit, middleNEdit, modalEditGroup.value, modalEditStatus.value, (res) => {
            if (res.success) {
                console.log(res.response);

                const editStudent = allStudents.map(elem => {
                    if (elem.id === editId) {
                        return {
                            ...elem, // копируем все свойства из исходного объекта
                            firstName: firstNEdit,
                            lastName: lastNEdit,
                            middleName: middleNEdit,
                            groupId: modalEditGroup.value,
                            statusId: modalEditStatus.value
                        };
                    } else {
                        return elem; // если элемент не подлежит изменению, возвращаем его без изменений
                    }
                });

                setAllStudents(editStudent);

            } else {
                console.log(res.response);
            }
        });
    }
    async function deleteData() {
        await deleteStudent(deleteId, (res) => {
            if (res.success) {
                console.log(res.response);
                setAllStudents(allStudents.filter((a) => a.id !== deleteId));

            } else {
                console.log(res.response);
            }
        });

    }

    useEffect(() => {
        setSearchResults(allStudents)
    }, [allStudents])

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
    function handleModalStatus(data) {
        setModalStatus(data);
    }
    function handleModalEditGroup(data) {
        setModalEditGroup(data);
    }
    function handleModalEditStatus(data) {
        setModalEditStatus(data);
    }
    return (
        <>
            <Admin_header />
            <div className='admin-main-search'>
                <input
                    type='text'
                    value={searchTerm}
                    onChange={handleChange}
                    placeholder='Поиск...'
                />
            </div>
            <div className='filters'>
                <Select
                    styles={customStyles}
                    placeholder="Группа"
                    value={filterGroup}
                    onChange={handleFilterGroup}
                    isSearchable={true}
                    options={allGroups.map(res => ({
                        value: res.id,
                        label: res.title,
                    }))}
                />
                {/* <Select
                    styles={customStyles}
                    placeholder="Направление"
                    value={filterDirectioin}
                    onChange={handleFilterDirection}
                    isSearchable={true}
                    options={allDirectivities.heads.map(res => ({
                        value: res.id,
                        label: res.title,
                    }))}
                /> */}
                <Select
                    styles={customStyles}
                    placeholder="Степень образования"
                    value={filterProgram}
                    onChange={handleFilterProgram}
                    isSearchable={true}
                    options={allDirectivities.grades.map(res => ({
                        value: res.id,
                        label: res.title,
                    }))}
                />
                <Select
                    styles={customStyles}
                    placeholder="Статус"
                    value={filterProgram}
                    onChange={handleFilterProgram}
                    isSearchable={true}
                    options={allStatus.map(res => ({
                        value: res.id,
                        label: res.title,
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
                            {res.groupId &&
                                <p><span>Группа:</span> {allGroups.find(el => el.id === res.groupId)?.title}</p>}
                            {res.groupId &&
                                <p>
                                    <span>Степень образования:</span> {
                                        allDirectivities.grades.find(grade =>
                                            grade.id === allDirectivities.directivities.find(r =>
                                                r.id === allGroups.find(el =>
                                                    el.id === res.groupId
                                                )?.directivityId
                                            )?.gradeId
                                        )?.title}</p>}
                        </div>
                        <div className='col2'>
                            {res.groupId &&
                                <p>
                                    <span>Направление:</span> {
                                        allDirectivities.heads.find(head => head.id === allDirectivities.directivities.find(r =>
                                            r.id === allGroups.find(el =>
                                                el.id === res.groupId
                                            )?.directivityId
                                        )?.headId)?.title}</p>}

                            {res.groupId &&
                                <p><span>Направленность:</span> {
                                    allDirectivities.directivities.find(r =>
                                        r.id === allGroups.find(el =>
                                            el.id === res.groupId
                                        )?.directivityId
                                    )?.title}</p>}

                            {res.id && <p><span>Статус: </span>{
                                allStatus.find(el =>
                                    el.id === allStudents.find(r =>
                                        r.id === res.id)?.statusId)?.title}</p>}

                        </div>
                    </div>
                    <button
                        className='qr-setting'
                        onClick={() => {
                            if (isSetOpen === true && res.id !== selectedItemId) {
                                closeModal();
                                openModal(res.id);
                            }
                            else if (isSetOpen === true) {
                                closeModal();
                            }
                            else {
                                openModal(res.id);
                            }
                        }}
                    // className='student-setting'
                    // onClick={() => handleSettingClick(res.id)}
                    >
                        <img src={require('../../img/setting.png')} alt='setting' />
                    </button>
                    {isSetOpen && selectedItemId === res.id && (
                        <div className={`button-edit-delete ${isSetOpen && selectedItemId === res.id ? 'active' : ''}`}>
                            {/* <div className={`button-edit-delete ${userStates[res.id] ? 'active' : ''}`}> */}
                            <button onClick={() => {
                                setEditId(res.id);
                                setLastNEdit(res.lastName);
                                setFirstNEdit(res.firstName);
                                setMiddleNEdit(res.middleName);
                                setModalEditGroup({
                                    value: allGroups.find(el => el.id === res.groupId)?.id,
                                    label: allGroups.find(el => el.id === res.groupId)?.title
                                })
                                setModalEditStatus({
                                    value: allStatus.find(el =>
                                        el.id === allStudents.find(r =>
                                            r.id === res.id).statusId)?.id,
                                    label: allStatus.find(el =>
                                        el.id === allStudents.find(r =>
                                            r.id === res.id).statusId)?.title
                                })
                                setModalEditActive(true);
                            }}>
                                <img src={require('../../img/edit.png')} alt='edit' />
                            </button>
                            <button onClick={() => {
                                setDeleteId(res.id);
                                setModalDeleteActive(true);
                            }}>
                                <img src={require('../../img/delete.png')} alt='delete' />
                            </button>
                        </div>)}
                </div>
            ))}
            {hasMoreData && (
                <button className='btn-loadMore' onClick={loadMore}>
                    Загрузить ещё
                </button>
            )}

            <Empty_modal active={modalActive} setActive={setModalActive}>

                <div className='modal-students'>
                    <div className='input-conteiner'>
                        <input type='text' className='name-stud' placeholder=' ' value={lastN} onChange={e => setLastN(e.target.value)} />
                        <label className='label-name'>Фамилия</label>
                    </div>
                    <div className='input-conteiner'>
                        <input type='text' className='name-stud' placeholder=' ' value={firstN} onChange={e => setFirstN(e.target.value)} />
                        <label className='label-name'>Имя</label>
                    </div>
                    <div className='input-conteiner'>
                        <input type='text' className='name-stud' placeholder=' ' value={middleN} onChange={e => setMiddleN(e.target.value)} />
                        <label className='label-name'>Отчество</label>
                    </div>


                    <Select
                        styles={customStylesModal}
                        placeholder="Группа"
                        value={modalGroup}
                        maxMenuHeight={120}
                        onChange={handleModalGroup}
                        isSearchable={true}
                        options={allGroups.map(el => ({
                            value: el.id,
                            label: el.title,
                        }))}
                    />
                    <Select
                        styles={customStylesModal}
                        placeholder="Статус"
                        value={modalStatus}
                        maxMenuHeight={120}
                        onChange={handleModalStatus}
                        isSearchable={true}
                        options={allStatus.map(el =>
                        ({
                            value: el.id,
                            label: el.title
                        }))}
                    />
                    <div className='modal-button'>
                        <button onClick={() => {
                            addData();
                            setLastN('');
                            setFirstN('');
                            setMiddleN('');
                            setModalGroup(null);
                            setModalStatus(null);
                            setModalActive(false);
                        }}>Сохранить</button>
                        <button onClick={() => { setModalActive(false) }}>Отмена</button>
                    </div>

                </div>
            </Empty_modal>

            <Empty_modal active={modalEditActive} setActive={setModalEditActive}>
                <div className='modal-students'>
                    <div className='input-conteiner'>
                        <input type='text' className='name-stud' placeholder=' ' value={lastNEdit} onChange={e => setLastNEdit(e.target.value)} />
                        <label className='label-name'>Фамилия</label>
                    </div>
                    <div className='input-conteiner'>
                        <input type='text' className='name-stud' placeholder=' ' value={firstNEdit} onChange={e => setFirstNEdit(e.target.value)} />
                        <label className='label-name'>Имя</label>
                    </div>
                    <div className='input-conteiner'>
                        <input type='text' className='name-stud' placeholder=' ' value={middleNEdit} onChange={e => setMiddleNEdit(e.target.value)} />
                        <label className='label-name'>Отчество</label>
                    </div>


                    <Select
                        styles={customStylesModal}
                        placeholder="Группа"
                        value={modalEditGroup}
                        maxMenuHeight={120}
                        onChange={handleModalEditGroup}
                        isSearchable={true}
                        options={allGroups.map(el => ({
                            value: el.id,
                            label: el.title,
                        }))}
                    />
                    <Select
                        styles={customStylesModal}
                        placeholder="Статус"
                        value={modalEditStatus}
                        maxMenuHeight={120}
                        onChange={handleModalEditStatus}
                        isSearchable={true}
                        options={allStatus.map(el =>
                        ({
                            value: el.id,
                            label: el.title
                        }))}
                    />
                    <div className='modal-button'>
                        <button onClick={() => {
                            editData();
                            setModalEditActive(false);
                        }}>Сохранить</button>
                        <button onClick={() => { setModalEditActive(false) }}>Отмена</button>
                    </div>

                </div>
            </Empty_modal>
            <Empty_modal active={modalDeleteActive} setActive={setModalDeleteActive} >
                <div className='content-delete'>
                    <p className='text-delete'>Вы уверены, что хотите удалить?</p>
                    <div className='modal-button'>
                        <button onClick={() => { deleteData(); setModalDeleteActive(false); }}>Удалить</button>
                        <button onClick={() => { setModalDeleteActive(false); }}>Отмена</button>
                    </div>
                </div>
            </Empty_modal>
        </>

    );
}

export default Admin_students;