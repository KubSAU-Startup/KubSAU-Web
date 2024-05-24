import React, { useState, useEffect } from 'react';
import User_header from './User_header';
import '../admin/Admin_students.css'
import Select from 'react-select';
import { customStyles } from '../Select_style/Select_style';
import { customStylesModal } from '../Select_style/Select_style';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import Empty_modal from '../Modal/Empty_modal'
import { addNewEmployee, editEmployee, deleteEmployee, getTextError, getAllEmployees } from '../../network';


function User_prof() {

    const [modalActive, setModalActive] = useState(false);
    const [modalContActive, setModalContActive] = useState(false);
    const [userStates, setUserStates] = useState({});
    const [allUsers, setAllUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);

    const [filterGroup, setFilterGroup] = useState(null);
    const [filterGrade, setFilterGrade] = useState(null);
    const [filterType, setFilterType] = useState(null);

    const [modalStaff, setModalStaff] = useState(null);
    const [modalEditGroup, setModalEditGroup] = useState(null);
    const [modalStaffEdit, setModalStaffEdit] = useState(null);
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
    const [allEmployees, setAllEmployees] = useState([]);

    const [inputValue, setInputValue] = useState("");
    const [debouncedInputValue, setDebouncedInputValue] = useState("");
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
    const [email, setEmail] = useState(null);

    const [lastNEdit, setLastNEdit] = useState(null);
    const [firstNEdit, setFirstNEdit] = useState(null);
    const [middleNEdit, setMiddleNEdit] = useState(null);
    const [emailEdit, setEmailEdit] = useState(null);

    const [offset, setOffset] = useState(0);
    const limit = 30; // Количество элементов на странице

    // функция загрузки данных пагинации
    // const loadMore = () => {
    //     setOffset(prevOffset => prevOffset + limit);
    // };
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

    // useEffect(() => {
    //     setIsLoading(true);
    //     setHasMoreData(true);

    //     if (inputValue === '') {
    //         getAllStudents(offset, limit, (res) => {
    //             if (res.error) {
    //                 setTextError(getTextError(res.error));
    //                 setErrorActive(true);
    //             } else {
    //                 if (res.response.students.length < limit) {
    //                     setHasMoreData(false); // Если загружено меньше, чем лимит, значит, больше данных нет
    //                 }

    //                 // Если это первая страница, просто устанавливаем новые данные
    //                 if (offset === 0) {
    //                     setAllStudents(res.response.students);
    //                     setAllStatus(res.response.statuses)
    //                     // setSearchResults(res.response.students);
    //                 } else {
    //                     // Иначе обновляем данные
    //                     setAllStudents(prevData => [...prevData, ...res.response.students]);
    //                     setAllStatus([...res.response.statuses])

    //                     // setSearchResults(prevResults => [...prevResults, ...res.response.students]);
    //                 }
    //             }
    //             setIsLoading(false);
    //         })
    //     } else {
    //         console.log(debouncedInputValue);
    //         searchOfStudents(offset, limit, debouncedInputValue, (res) => {
    //             if (res.error) {
    //                 setTextError(getTextError(res.error));
    //                 setErrorActive(true);
    //             } else {
    //                 if (res.response.students.length < limit) {
    //                     setHasMoreData(false); // Если загружено меньше, чем лимит, значит, больше данных нет
    //                 }

    //                 // Если это первая страница, просто устанавливаем новые данные
    //                 if (offset === 0) {
    //                     setAllStudents(res.response.students);
    //                     // setAllStatus(res.response.statuses)
    //                     // setSearchResults(res.response.students);
    //                 } else {
    //                     // Иначе обновляем данные
    //                     setAllStudents(prevData => [...prevData, ...res.response.students]);
    //                     // setAllStatus([...res.response.statuses])

    //                     // setSearchResults(prevResults => [...prevResults, ...res.response.students]);
    //                 }
    //             }
    //             setIsLoading(false);
    //         })
    //     }
    // }, [offset, limit, debouncedInputValue])

    useEffect(() => {
        setIsLoading(true);

        getAllEmployees((res) => {
            if (res.error) {
                setTextError(getTextError(res.error));
                setErrorActive(true);
            } else {
                setAllEmployees(res.response);
                setSearchResults(res.response);
            }
            setIsLoading(false);

        })

    }, []);
    useEffect(() => {
        if (modalActive || modalEditActive || modalDeleteActive) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }
    }, [modalActive, modalEditActive, modalDeleteActive]);

    const handleInputValue = (e) => {
        setInputValue(e.target.value);
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedInputValue(inputValue);
        }, 1000);
        return () => clearTimeout(timeoutId);
    }, [inputValue, 1000]);

    async function addData() {
        console.log(firstN, lastN, middleN, email, modalStaff.value);
        await addNewEmployee(firstN, lastN, middleN, email, modalStaff.value, (res) => {
            if (res.success) {
                setAllEmployees(prevData => [res.response, ...prevData]);
            } else {
                console.log(res);
            }
        });
    }

    async function editData() {
        await editEmployee(editId, firstNEdit, lastNEdit, middleNEdit, emailEdit, modalStaffEdit.value, (res) => {
            if (res.success) {
                console.log(res.response);

                const editData = allEmployees.map(elem => {
                    if (elem.id === editId) {
                        return {
                            ...elem, // копируем все свойства из исходного объекта
                            firstName: firstNEdit,
                            lastName: lastNEdit,
                            middleName: middleNEdit,
                            email: emailEdit,
                            employeeTypeId: modalStaffEdit.value
                        };
                    } else {
                        return elem; // если элемент не подлежит изменению, возвращаем его без изменений
                    }
                });

                setAllEmployees(editData);

            } else {
                console.log(res.response);
            }
        });
    }
    async function deleteData() {
        await deleteEmployee(deleteId, (res) => {
            if (res.success) {
                console.log(res.response);
                setAllEmployees(allEmployees.filter((a) => a.id !== deleteId));

            } else {
                console.log(res.response);
            }
        });

    }

    useEffect(() => {
        setSearchResults(allEmployees)
    }, [allEmployees])

    function handleFilterType(data) {
        setFilterType(data);
    }
    function handleModalStaff(data) {
        setModalStaff(data);
    }
    function handleModalStaffEdit(data) {
        setModalStaffEdit(data);
    }


    const position = [
        { value: 1, label: 'Администратор' },
        { value: 2, label: 'Преподаватель' },
        { value: 3, label: 'Лаборант' }
    ]
    return (
        <>
            <User_header />
            <div className='admin-main-search'>
                <input
                    type='text'
                    value={inputValue}
                    onChange={handleInputValue}
                    placeholder='Поиск...'
                />
            </div>
            <div className='filters'>
                <Select
                    styles={customStyles}
                    placeholder="Должность"
                    value={filterType}
                    onChange={handleFilterType}
                    isSearchable={true}
                    options={position}
                />
                <button className='get-params' type='submit'>Применить</button>
                <button className='delete-params'>Сбросить</button>

            </div>

            <button className='add-student' onClick={() => {
                setModalActive(true);
                document.body.style.overflow = 'hidden';

            }}>
                <FontAwesomeIcon icon={faPlusCircle} />
            </button>
            {searchResults.map(res => (

                <div className='cart-stud' key={res.id}>
                    {/* <div className='data'>
                        {user.id}
                    </div> */}
                    <div className='content'>
                        <div className='col1'>
                            <p><span>ФИО сотрудника:</span> {res.lastName + " " + res.firstName + " " + res.middleName}</p>

                        </div>
                        <div className='col2'>
                            <p><span>Должность:</span> {res.type && position.find(r => r.value === res.type)?.label}</p>
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
                    // className='department-setting'
                    // onClick={() => handleSettingClick(res.id)}
                    >
                        <img src={require('../../img/setting.png')} alt='setting' />
                    </button>
                    {isSetOpen && selectedItemId === res.id && (
                        <div className={`button-edit-delete ${isSetOpen && selectedItemId === res.id ? 'active' : ''}`}>
                            <button onClick={() => {
                                document.body.style.overflow = 'hidden';

                                setModalEditActive(true);
                                setFirstNEdit(res.firstName);
                                setLastNEdit(res.lastName);
                                setMiddleNEdit(res.middleName);
                                setEmailEdit(res.email);
                                setModalStaffEdit({ value: res.type, label: position.find(r => r.value === res.type).label });
                                setEditId(res.id);

                            }}>
                                <img src={require('../../img/edit.png')} alt='edit' />
                            </button>
                            <button onClick={() => {
                                setModalDeleteActive(true); setDeleteId(res.id);
                                document.body.style.overflow = 'hidden';

                            }}>
                                <img src={require('../../img/delete.png')} alt='delete' />
                            </button>
                        </div>)}
                </div>
            ))}
            {/* {hasMoreData && (
                <button className='btn-loadMore' onClick={loadMore}>
                    Загрузить ещё
                </button>
            )} */}

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
                    <div className='input-conteiner'>
                        <input type='text' className='name-stud' placeholder=' ' value={email} onChange={e => setEmail(e.target.value)} />
                        <label className='label-name'>e-mail</label>
                    </div>


                    <Select
                        styles={customStylesModal}
                        placeholder="Должность"
                        value={modalStaff}
                        maxMenuHeight={120}
                        onChange={handleModalStaff}
                        isSearchable={true}
                        options={position}
                    />

                    <div className='modal-button'>
                        <button onClick={() => {
                            document.body.style.overflow = 'auto';

                            addData();
                            setLastN('');
                            setFirstN('');
                            setMiddleN('');
                            setEmail('');
                            setModalStaff(null);
                            setModalActive(false);
                        }}>Сохранить</button>
                        <button onClick={() => {
                            setModalActive(false);
                            document.body.style.overflow = 'auto';

                        }}>Отмена</button>
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
                    <div className='input-conteiner'>
                        <input type='text' className='name-stud' placeholder=' ' value={emailEdit} onChange={e => setEmailEdit(e.target.value)} />
                        <label className='label-name'>e-mail</label>
                    </div>


                    <Select
                        styles={customStylesModal}
                        placeholder="Должность"
                        value={modalStaffEdit}
                        maxMenuHeight={120}
                        onChange={handleModalStaffEdit}
                        isSearchable={true}
                        options={position}
                    />
                    <div className='modal-button'>
                        <button onClick={() => {
                            document.body.style.overflow = 'auto';

                            editData();
                            setModalEditActive(false);
                        }}>Сохранить</button>
                        <button onClick={() => {
                            setModalEditActive(false);
                            document.body.style.overflow = 'auto';

                        }}>Отмена</button>
                    </div>

                </div>
            </Empty_modal>
            <Empty_modal active={modalDeleteActive} setActive={setModalDeleteActive} >
                <div className='content-delete'>
                    <p className='text-delete'>Вы уверены, что хотите удалить?</p>
                    <div className='modal-button'>
                        <button onClick={() => {
                            deleteData(); setModalDeleteActive(false);
                            document.body.style.overflow = 'auto';

                        }}>Удалить</button>
                        <button onClick={() => {
                            setModalDeleteActive(false);
                            document.body.style.overflow = 'auto';

                        }}>Отмена</button>
                    </div>
                </div>
            </Empty_modal>
        </>

    );
}


export default User_prof;