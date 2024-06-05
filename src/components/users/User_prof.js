import React, { useState, useEffect } from 'react';
import User_header from './User_header';
import '../admin/Admin_students.css'
import Select from 'react-select';
import { customStyles } from '../Select_style/Select_style';
import { customStylesModal } from '../Select_style/Select_style';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import Empty_modal from '../Modal/Empty_modal';
import Error_empty from '../Modal/Error_empty';
import Error_ok from '../Modal/Error_ok';
import Loading from '../Modal/Loading';
import Error_modal from '../Modal/Error_modal';
import { addNewEmployee, editEmployee, deleteEmployee, getTextError, getAllEmployees } from '../../network';


function User_prof() {

    const [modalActive, setModalActive] = useState(false);
    const [filterType, setFilterType] = useState(null);
    const [codeText, setCodeText] = useState('');
    const [errorEmptyActive, setErrorEmptyActive] = useState(false);
    const [errorOkActive, setErrorOkActive] = useState(false);
    const [modalStaff, setModalStaff] = useState(null);
    const [modalStaffEdit, setModalStaffEdit] = useState(null);

    const [modalEditActive, setModalEditActive] = useState(false);
    const [modalDeleteActive, setModalDeleteActive] = useState(false);

    const [allEmployees, setAllEmployees] = useState([]);
    const [filterData, setFilterData] = useState([]);

    const [searchResults, setSearchResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [errorActive, setErrorActive] = useState(false);
    const [textError, setTextError] = useState('');
    const [error, setError] = useState('');
    const [errorEmail, setErrorEmail] = useState('');
    const [errorFirstN, setErrorFirstN] = useState('');
    const [errorLastN, setErrorLastN] = useState('');
    const [errorMiddleN, setErrorMiddleN] = useState('');
    const [errorStaff, setErrorStaff] = useState('');



    const [editId, setEditId] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    const [visibleItems, setVisibleItems] = useState(10);
    const [isPaginationVisible, setIsPaginationVisible] = useState(true);

    const [lastN, setLastN] = useState('');
    const [firstN, setFirstN] = useState('');
    const [middleN, setMiddleN] = useState('');
    const [email, setEmail] = useState('');

    const [lastNEdit, setLastNEdit] = useState('');
    const [firstNEdit, setFirstNEdit] = useState('');
    const [middleNEdit, setMiddleNEdit] = useState('');
    const [emailEdit, setEmailEdit] = useState('');

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
        setIsLoading(true);
        setVisibleItems(30);

        getAllEmployees((res) => {
            if (res.error) {
                setTextError(getTextError(res.error));
                setErrorActive(true);
            } else {
                setAllEmployees(res.response);
                setSearchResults(res.response);
            }
            setIsLoading(false);
        }).catch((error) => {
            setTextError(error.message);
            setCodeText(error.code);
            setErrorEmptyActive(true);
            setIsLoading(false);
        })

    }, []);

    //скрытие кнопки пагинации, если закончились данные для отображения
    useEffect(() => {

        if (searchResults.length <= visibleItems) {
            setIsPaginationVisible(false); // Скрыть кнопку пагинации
        } else {
            setIsPaginationVisible(true); // Показать 
        }
    }, [searchResults, visibleItems]);

    useEffect(() => {
        if (modalActive || modalEditActive || modalDeleteActive) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }
    }, [modalActive, modalEditActive, modalDeleteActive]);

    // функция пагинации
    const loadMore = () => {
        setVisibleItems(prevVisibleItems => prevVisibleItems + 30);
    };

    async function addData() {
        setIsLoading(true);

        setErrorEmail('');
        setErrorLastN('');
        setErrorFirstN('');
        setErrorMiddleN('');
        setErrorStaff('');
        if (!isValidEmail(email) || firstN === '' || lastN === '' || middleN === '' || modalStaff === null) {
            if (!isValidEmail(email) && email !== '') {
                setErrorEmail('Электронный адрес записан некорректно');
            }
            if (firstN === '') {
                setErrorFirstN('Заполните имя');
            }
            if (lastN === '') {
                setErrorLastN('Заполните фамилию');
            }
            if (middleN === '') {
                setErrorMiddleN('Заполните отчество');
            }
            if (modalStaff === null) {
                setErrorStaff('Выберите должность');
            }
            setIsLoading(false);

        } else {
            await addNewEmployee(firstN, lastN, middleN, email, modalStaff.value, (res) => {
                if (res.success) {
                    setAllEmployees(prevData => [res.response, ...prevData]);
                } else {
                    setTextError(res.message);
                    setCodeText(res.code);
                    setErrorEmptyActive(true);
                }
                setIsLoading(false);

            }).catch((error) => {
                setTextError(error.message);
                setCodeText(error.code);
                setErrorOkActive(true);
                setIsLoading(false);
            });

            document.body.style.overflow = '';
            const usMainHeaders = document.getElementsByClassName('us_main_header');
            for (let i = 0; i < usMainHeaders.length; i++) {
                usMainHeaders[i].style.paddingRight = `10px`;
            }
            document.getElementById('body-content').style.paddingRight = ``;

            setModalActive(false);
        }

    }

    async function editData() {
        setIsLoading(true);
        setErrorEmail('');
        setErrorLastN('');
        setErrorFirstN('');
        setErrorMiddleN('');
        setErrorStaff('');
        if (!isValidEmail(emailEdit) || firstNEdit === '' || lastNEdit === '' || middleNEdit === '' || modalStaffEdit === null) {
            if (!isValidEmail(emailEdit) && emailEdit !== '') {
                setErrorEmail('Электронный адрес записан некорректно');
            }
            if (firstNEdit === '') {
                setErrorFirstN('Заполните имя');
            }
            if (lastNEdit === '') {
                setErrorLastN('Заполните фамилию');
            }
            if (middleNEdit === '') {
                setErrorMiddleN('Заполните отчество');
            }
            if (modalStaffEdit === null) {
                setErrorStaff('Выберите должность');
            }
            setIsLoading(false);

        } else {

            await editEmployee(editId, firstNEdit, lastNEdit, middleNEdit, emailEdit, modalStaffEdit.value, (res) => {
                if (res.success) {
                    const editData = allEmployees.map(elem => {
                        if (elem.id === editId) {
                            return {
                                ...elem, // копируем все свойства из исходного объекта
                                firstName: firstNEdit,
                                lastName: lastNEdit,
                                middleName: middleNEdit,
                                email: emailEdit,
                                type: modalStaffEdit.value
                            };
                        } else {
                            return elem; // если элемент не подлежит изменению, возвращаем его без изменений
                        }
                    });
                    setAllEmployees(editData);
                } else {
                    setTextError(res.message);
                    setCodeText(res.code);
                    setErrorEmptyActive(true);
                }
                setIsLoading(false);

            }).catch((error) => {
                setTextError(error.message);
                setCodeText(error.code);
                setErrorOkActive(true);
                setIsLoading(false);
            });
            document.body.style.overflow = '';
            const usMainHeaders = document.getElementsByClassName('us_main_header');
            for (let i = 0; i < usMainHeaders.length; i++) {
                usMainHeaders[i].style.paddingRight = `10px`;
            }
            document.getElementById('body-content').style.paddingRight = ``;
            setModalEditActive(false);

        }
    }
    async function deleteData() {
        setIsLoading(true);

        await deleteEmployee(deleteId, (res) => {
            if (res.success) {
                setAllEmployees(allEmployees.filter((a) => a.id !== deleteId));

            } else {
                setTextError(res.message);
                setCodeText(res.code);
                setErrorEmptyActive(true);
            }
            setIsLoading(false);

        }).catch((error) => {
            setTextError(error.message);
            setCodeText(error.code);
            setErrorOkActive(true);
            setIsLoading(false);
        });

    }

    useEffect(() => {
        setSearchResults(allEmployees);
        if (searchTerm !== '' || filterType !== null) {
            getParams()
        }
    }, [allEmployees])


    // Функция поиска
    const handleChange = (e) => {
        const searchTerm = e.target.value.toLowerCase(); // Приводим введенный текст к нижнему регистру для удобства сравнения
        setSearchTerm(searchTerm);
        setIsLoading(true);
        let filteredResults = [...allEmployees]; // Создаем копию исходных данных для фильтрации
        if (filterType !== null) {
            filteredResults = filteredResults.filter(res => res.type === filterType.value);
        }

        filteredResults = filteredResults.filter(item => {

            // Проверяем условие для каждого поля, по которому хотим искать
            return (
                item.lastName.toLowerCase().includes(searchTerm) ||
                item.firstName.toLowerCase().includes(searchTerm) ||
                item.middleName.toLowerCase().includes(searchTerm) ||
                (item.type && position.find((el) => el.value === item.type)?.label.toLowerCase().includes(searchTerm))
            );
        });
        setSearchResults(filteredResults);

        setIsLoading(false);
    };


    const getParams = () => {
        let filteredResults = [...allEmployees]; // Создаем копию исходных данных для фильтрации
        if (searchTerm) {

            filteredResults = filteredResults.filter(item => {

                // Проверяем условие для каждого поля, по которому хотим искать
                return (
                    item.lastName.toLowerCase().includes(searchTerm) ||
                    item.firstName.toLowerCase().includes(searchTerm) ||
                    item.middleName.toLowerCase().includes(searchTerm) ||
                    (item.type && position.find((el) => el.value === item.type)?.label.toLowerCase().includes(searchTerm))
                );
            });
        }
        if (filterType !== null) {
            filteredResults = filteredResults.filter(res => res.type === filterType.value);
        }
        setFilterData(filteredResults);
        setSearchResults(filteredResults); // Присваиваем результаты фильтрации обратно в состояние
    }

    const resetParams = () => {
        setFilterType(null);
        let filteredResults = [...allEmployees]; // Создаем копию исходных данных для фильтрации
        if (searchTerm) {

            filteredResults = filteredResults.filter(item => {

                // Проверяем условие для каждого поля, по которому хотим искать
                return (
                    item.lastName.toLowerCase().includes(searchTerm) ||
                    item.firstName.toLowerCase().includes(searchTerm) ||
                    item.middleName.toLowerCase().includes(searchTerm) ||
                    (item.type && position.find((el) => el.value === item.type)?.label.toLowerCase().includes(searchTerm))
                );
            });
        }
        setSearchResults(filteredResults);
    }
    function handleFilterType(data) {
        setFilterType(data);
    }
    function handleModalStaff(data) {
        setModalStaff(data);
    }
    function handleModalStaffEdit(data) {
        setModalStaffEdit(data);
    }

    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

    function isValidEmail(email) {
        if (email === '') {
            return true;
        } else {
            return /\S+@\S+\.\S+/.test(email);

        }
    }

    const position = [
        { value: 1, label: 'Администратор' },
        { value: 2, label: 'Преподаватель' },
        { value: 3, label: 'Лаборант' }
    ]
    return (
        <>
            {/* окно загрузки */}
            <Loading active={isLoading} setActive={setIsLoading} />
            <User_header />
            <div id='body-content'>
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
                        placeholder="Должность"
                        value={filterType}
                        onChange={handleFilterType}
                        isSearchable={true}
                        options={position}
                    />
                    <button className='get-params' type='submit' onClick={getParams}>Применить</button>
                    <button className='delete-params' onClick={resetParams}>Сбросить</button>

                </div>

                <button className='add-student' onClick={() => {
                    setModalActive(true);
                    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
                    document.body.style.overflow = 'hidden';
                    const usMainHeaders = document.getElementsByClassName('us_main_header');
                    for (let i = 0; i < usMainHeaders.length; i++) {
                        usMainHeaders[i].style.paddingRight = `${scrollbarWidth + 10}px`;
                    }
                    document.getElementById('body-content').style.paddingRight = `${scrollbarWidth}px`;
                    setLastN('');
                    setFirstN('');
                    setMiddleN('');
                    setEmail('');
                    setModalStaff(null);
                    setErrorLastN('');
                    setErrorFirstN('');
                    setErrorMiddleN('');
                    setErrorStaff('');
                    setErrorEmail('');
                }}>
                    <FontAwesomeIcon icon={faPlusCircle} />
                </button>
                {searchResults.slice(0, visibleItems).map(res => (

                    <div className='cart-stud' key={res.id}>
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
                            }}>
                            <img src={require('../../img/setting.png')} alt='setting' />
                        </button>
                        {isSetOpen && selectedItemId === res.id && (
                            <div className={`button-edit-delete ${isSetOpen && selectedItemId === res.id ? 'active' : ''}`}>
                                <button onClick={() => {
                                    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
                                    document.body.style.overflow = 'hidden';
                                    const usMainHeaders = document.getElementsByClassName('us_main_header');
                                    for (let i = 0; i < usMainHeaders.length; i++) {
                                        usMainHeaders[i].style.paddingRight = `${scrollbarWidth + 10}px`;
                                    }
                                    document.getElementById('body-content').style.paddingRight = `${scrollbarWidth}px`;
                                    setErrorLastN('');
                                    setErrorFirstN('');
                                    setErrorMiddleN('');
                                    setErrorStaff('');
                                    setErrorEmail('');
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
                                    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
                                    document.body.style.overflow = 'hidden';
                                    const usMainHeaders = document.getElementsByClassName('us_main_header');
                                    for (let i = 0; i < usMainHeaders.length; i++) {
                                        usMainHeaders[i].style.paddingRight = `${scrollbarWidth + 10}px`;
                                    }
                                    document.getElementById('body-content').style.paddingRight = `${scrollbarWidth}px`;

                                }}>
                                    <img src={require('../../img/delete.png')} alt='delete' />
                                </button>
                            </div>)}
                    </div>
                ))}
                {/* кнопка пагинации */}
                {isPaginationVisible && (
                    <button className='btn-loadMore' onClick={loadMore}>
                        Загрузить ещё
                    </button>
                )}
            </div>
            <Empty_modal active={modalActive} setActive={setModalActive}>

                <div className='modal-students'>
                    {/* {error && <p style={{ color: 'red' }}>{error}</p>} */}
                    <div>
                        <div className='input-conteiner'>
                            <input type='text' className='name-stud' placeholder=' ' value={lastN} onChange={e => setLastN(e.target.value)} />
                            <label className='label-name'>Фамилия</label>
                        </div>
                        {(errorLastN !== '') && <p className='inputModalError' >{errorLastN}</p>}
                    </div>
                    <div>
                        <div className='input-conteiner'>
                            <input type='text' className='name-stud' placeholder=' ' value={firstN} onChange={e => setFirstN(e.target.value)} />
                            <label className='label-name'>Имя</label>
                        </div>
                        {(errorFirstN !== '') && <p className='inputModalError' >{errorFirstN}</p>}
                    </div>
                    <div>
                        <div className='input-conteiner'>
                            <input type='text' className='name-stud' placeholder=' ' value={middleN} onChange={e => setMiddleN(e.target.value)} />
                            <label className='label-name'>Отчество</label>
                        </div>
                        {(errorMiddleN !== '') && <p className='inputModalError' >{errorMiddleN}</p>}
                    </div>
                    <div>
                        <div className='input-conteiner'>
                            <input type='text' className='name-stud' placeholder=' ' value={email} onChange={e => setEmail(e.target.value)} />
                            <label className='label-name'>e-mail</label>
                        </div>
                        {(errorEmail && email !== '') && <p className='inputModalError' >{errorEmail}</p>}
                    </div>
                    <div>

                        <Select
                            styles={customStylesModal}
                            placeholder="Должность"
                            value={modalStaff}
                            maxMenuHeight={120}
                            onChange={handleModalStaff}
                            isSearchable={true}
                            options={position}
                        />
                        {(errorStaff !== '') && <p style={{ color: 'red', fontSize: '12px', position: 'absolute' }}>{errorStaff}</p>}
                    </div>

                    <div className='modal-button'>
                        <button onClick={() => {
                            addData();

                        }}>Сохранить</button>
                        <button onClick={() => {

                            document.body.style.overflow = '';
                            const usMainHeaders = document.getElementsByClassName('us_main_header');
                            for (let i = 0; i < usMainHeaders.length; i++) {
                                usMainHeaders[i].style.paddingRight = `10px`;
                            }
                            document.getElementById('body-content').style.paddingRight = ``; 
                            setLastN('');
                            setFirstN('');
                            setMiddleN('');
                            setEmail('');
                            setModalStaff(null);
                            setModalActive(false);
                            setErrorLastN('');
                            setErrorFirstN('');
                            setErrorMiddleN('');
                            setErrorStaff('');
                            setErrorEmail('');
                        }}>Отмена</button>
                    </div>

                </div>
            </Empty_modal>

            <Empty_modal active={modalEditActive} setActive={setModalEditActive}>
                <div className='modal-students'>
                    <div>
                        <div className='input-conteiner'>
                            <input type='text' className='name-stud' placeholder=' ' value={lastNEdit} onChange={e => setLastNEdit(e.target.value)} />
                            <label className='label-name'>Фамилия</label>
                        </div>
                        {(errorLastN !== '') && <p className='inputModalError' >{errorLastN}</p>}

                    </div>
                    <div>
                        <div className='input-conteiner'>
                            <input type='text' className='name-stud' placeholder=' ' value={firstNEdit} onChange={e => setFirstNEdit(e.target.value)} />
                            <label className='label-name'>Имя</label>
                        </div>
                        {(errorFirstN !== '') && <p className='inputModalError' >{errorFirstN}</p>}

                    </div>
                    <div>
                        <div className='input-conteiner'>
                            <input type='text' className='name-stud' placeholder=' ' value={middleNEdit} onChange={e => setMiddleNEdit(e.target.value)} />
                            <label className='label-name'>Отчество</label>
                        </div>
                        {(errorMiddleN !== '') && <p className='inputModalError' >{errorMiddleN}</p>}

                    </div>
                    <div>
                        <div className='input-conteiner'>
                            <input type='text' className='name-stud' placeholder=' ' value={emailEdit} onChange={e => setEmailEdit(e.target.value)} />
                            <label className='label-name'>e-mail</label>
                        </div>
                        {(errorEmail !== '') && <p className='inputModalError' >{errorEmail}</p>}

                    </div>
                    <div>


                        <Select
                            styles={customStylesModal}
                            placeholder="Должность"
                            value={modalStaffEdit}
                            maxMenuHeight={120}
                            onChange={handleModalStaffEdit}
                            isSearchable={true}
                            options={position}
                        />
                        {(errorStaff !== '') && <p style={{ color: 'red', fontSize: '12px', position: 'absolute' }}>{errorStaff}</p>}

                    </div>

                    <div className='modal-button'>
                        <button onClick={() => {
                            editData();
                        }}>Сохранить</button>
                        <button onClick={() => {
                            document.body.style.overflow = '';
                            const usMainHeaders = document.getElementsByClassName('us_main_header');
                            for (let i = 0; i < usMainHeaders.length; i++) {
                                usMainHeaders[i].style.paddingRight = `10px`;
                            }
                            document.getElementById('body-content').style.paddingRight = ``;
                            setLastNEdit('');
                            setFirstNEdit('');
                            setMiddleNEdit('');
                            setEmailEdit('');
                            setModalStaffEdit(null);
                            setModalEditActive(false);
                            setErrorLastN('');
                            setErrorFirstN('');
                            setErrorMiddleN('');
                            setErrorStaff('');
                            setErrorEmail('');

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
                            document.body.style.overflow = '';
                            const usMainHeaders = document.getElementsByClassName('us_main_header');
                            for (let i = 0; i < usMainHeaders.length; i++) {
                                usMainHeaders[i].style.paddingRight = `10px`;
                            }
                            document.getElementById('body-content').style.paddingRight = ``;

                        }}>Удалить</button>
                        <button onClick={() => {
                            setModalDeleteActive(false);
                            document.body.style.overflow = '';
                            const usMainHeaders = document.getElementsByClassName('us_main_header');
                            for (let i = 0; i < usMainHeaders.length; i++) {
                                usMainHeaders[i].style.paddingRight = `10px`;
                            }
                            document.getElementById('body-content').style.paddingRight = ``;

                        }}>Отмена</button>
                    </div>
                </div>

            </Empty_modal>
            <Error_modal active={errorActive} text={textError} />
            <Error_empty active={errorEmptyActive} text={textError} codeText={codeText} />
            <Error_ok active={errorOkActive} setActive={setErrorOkActive} text={textError} codeText={codeText} />
        </>

    );
}


export default User_prof;