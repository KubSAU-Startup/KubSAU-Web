import React, { useState, useEffect } from 'react';
import Admin_header from './Admin_header';
import './Admin_students.css'
import Select from 'react-select';
import { customStyles } from '../Select_style/Select_style';
import { customStylesModal } from '../Select_style/Select_style';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faPlusCircle, faUndo } from '@fortawesome/free-solid-svg-icons';
import Empty_modal from '../Modal/Empty_modal';
import Error_modal from '../Modal/Error_modal';
import Error_empty from '../Modal/Error_empty';
import Error_ok from '../Modal/Error_ok';
import Loading from '../Modal/Loading';
import { getAllDirectivities, getAllGroups, getTextError, addNewStudent, editStudent, deleteStudent, searchOfStudents } from '../../network';

function Admin_students() {
    const [modalActive, setModalActive] = useState(false);
    const [errorFirstN, setErrorFirstN] = useState('');
    const [errorLastN, setErrorLastN] = useState('');
    const [errorGroup, setErrorGroup] = useState('');
    const [errorStatus, setErrorStatus] = useState('');

    const [filterGroup, setFilterGroup] = useState(null);
    const [filterGrade, setFilterGrade] = useState(null);
    const [filterStatus, setFilterStatus] = useState(null);

    const [modalGroup, setModalGroup] = useState(null);
    const [modalEditGroup, setModalEditGroup] = useState(null);
    const [modalStatus, setModalStatus] = useState(null);
    const [modalEditStatus, setModalEditStatus] = useState(null);

    const [modalEditActive, setModalEditActive] = useState(false);
    const [modalDeleteActive, setModalDeleteActive] = useState(false);
    const [allStudents, setAllStudents] = useState([]);
    const [allDirectivities, setAllDirectivities] = useState({
        directivities: [],
        heads: [],
        grades: []
    });

    const [inputValue, setInputValue] = useState("");
    const [debouncedInputValue, setDebouncedInputValue] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [hasMoreData, setHasMoreData] = useState(true);

    const [allGroups, setAllGroups] = useState([]);
    const [studentsParam, setStudentsParam] = useState({});

    const [isLoading, setIsLoading] = useState(true);
    const [errorActive, setErrorActive] = useState(false);
    const [textError, setTextError] = useState('');
    const [codeText, setCodeText] = useState('');
    const [errorEmptyActive, setErrorEmptyActive] = useState(false);
    const [errorOkActive, setErrorOkActive] = useState(false);

    const [editId, setEditId] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [nameStudents, setNameStudents] = useState('');
    const [errorNames, setErrorNames] = useState('');

    const [lastN, setLastN] = useState('');
    const [firstN, setFirstN] = useState('');
    const [middleN, setMiddleN] = useState('');
    const [lastNEdit, setLastNEdit] = useState('');
    const [firstNEdit, setFirstNEdit] = useState('');
    const [middleNEdit, setMiddleNEdit] = useState('');

    const [offset, setOffset] = useState(0);
    const limit = 30; // Количество элементов на странице

    // функция загрузки данных пагинации
    const loadMore = () => {
        setOffset(prevOffset => prevOffset + limit);
    };
    const [isSetOpen, setIsSetOpen] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);

    // открытие модального окна для дополнительных функций карточки
    const openModal = (itemId) => {
        setSelectedItemId(itemId);
        setIsSetOpen(true);
    };

    // закрытие модального окна для дополнительных функций карточки
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
        setHasMoreData(true);
        // получение данных для отобаражения на странице
        searchOfStudents(offset, limit, studentsParam, debouncedInputValue, (res) => {
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
                    setSearchResults(res.response.students);
                } else {
                    // Иначе обновляем данные
                    setAllStudents(prevData => [...prevData, ...res.response.students]);
                    setSearchResults(prevResults => [...prevResults, ...res.response.students]);
                }
            }
            setIsLoading(false);
        }).catch((error) => {
            setTextError(getTextError(error));
            setCodeText(error.code);
            setErrorEmptyActive(true);
            setIsLoading(false);
        })

    }, [offset, limit, studentsParam, debouncedInputValue])

    // получение данных для фильтров
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
        }).catch((error) => {
            setTextError(getTextError(error));
            setCodeText(error.code);
            setErrorEmptyActive(true);
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
        }).catch((error) => {
            setTextError(getTextError(error));
            setCodeText(error.code);
            setErrorEmptyActive(true);
            setIsLoading(false);
        })
    }, []);

    // запись данных поиска
    const handleInputValue = (e) => {
        setInputValue(e.target.value);
    };

    // задержка в 1 сек перед отправкой поиска
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedInputValue(inputValue);
        }, 1000);
        return () => clearTimeout(timeoutId);
    }, [inputValue, 1000]);

    // функция добавления
    async function addData() {
        setIsLoading(true);
        setErrorNames('');
        setErrorGroup('');
        setErrorStatus('');
        if (nameStudents === '' || modalGroup === null || modalStatus === null) {
            if (nameStudents === '') {
                setErrorNames('Добавьте ФИО студентов');
            }
            if (modalGroup === null) {
                setErrorGroup('Выберите группу');
            }
            if (modalStatus === null) {
                setErrorStatus('Выберите статус студента');
            }
            setIsLoading(false);
        } else {
            await addNewStudent(nameStudents, modalGroup.value, modalStatus.value, (res) => {
                if (res.success) {
                    setAllStudents(prevData => [...res.response, ...prevData]);
                } else {
                    setTextError(res.message);
                    setCodeText(res.code);
                    setErrorEmptyActive(true);
                }
                setIsLoading(false);
            }).catch((err) => {
                setTextError(err.response.data.error.message);
                setCodeText(err.response.data.error.code);
                setErrorOkActive(true);
                setIsLoading(false);
            });
            document.body.style.overflow = '';
            const adminMainHeaders = document.getElementsByClassName('ad_main_header');
            for (let i = 0; i < adminMainHeaders.length; i++) {
                adminMainHeaders[i].style.paddingRight = `10px`;
            }
            document.getElementById('body-content').style.paddingRight = ``;
            setModalActive(false);
        }
    }

    // функция редактирования
    async function editData() {
        setErrorLastN('');
        setErrorFirstN('');
        setErrorGroup('');
        setErrorStatus('');
        setIsLoading(true);
        if (firstNEdit === '' || lastNEdit === '' || modalEditGroup === null || modalEditStatus === null) {
            if (firstNEdit === '') {
                setErrorFirstN('Заполните имя');
            }
            if (lastNEdit === '') {
                setErrorLastN('Заполните фамилию');
            }
            if (modalEditGroup === null) {
                setErrorGroup('Выберите группу');
            }
            if (modalEditStatus === null) {
                setErrorStatus('Выберите статус студента');
            }
            setIsLoading(false);
        } else {
            await editStudent(editId, firstNEdit, lastNEdit, middleNEdit, modalEditGroup.value, modalEditStatus.value, (res) => {
                if (res.success) {
                    const editStudent = allStudents.map(elem => {
                        if (elem.id === editId) {
                            return {
                                ...elem, // копируем все свойства из исходного объекта
                                firstName: firstNEdit,
                                lastName: lastNEdit,
                                middleName: middleNEdit,
                                groupId: modalEditGroup.value,
                                status: modalEditStatus.value
                            };
                        } else {
                            return elem; // если элемент не подлежит изменению, возвращаем его без изменений
                        }
                    });
                    setAllStudents(editStudent);
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
            setModalEditActive(false);
            document.body.style.overflow = '';
            const adminMainHeaders = document.getElementsByClassName('ad_main_header');
            for (let i = 0; i < adminMainHeaders.length; i++) {
                adminMainHeaders[i].style.paddingRight = `10px`;
            }
            document.getElementById('body-content').style.paddingRight = ``;
        }
    }

    // функция удаления
    async function deleteData() {
        setIsLoading(true);

        await deleteStudent(deleteId, (res) => {
            if (res.success) {
                setAllStudents(allStudents.filter((a) => a.id !== deleteId));
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

    // обновление данных для отображения
    useEffect(() => {
        setSearchResults(allStudents);
    }, [allStudents])

    // установление фильтров
    const getParams = () => {
        setIsLoading(true);
        setOffset(0);
        setStudentsParam({
            groupId: filterGroup ? filterGroup.value : null,
            gradeId: filterGrade ? filterGrade.value : null,
            status: filterStatus ? filterStatus.value : null
        });
        setIsLoading(false);
    };

    // функция сброса фильтров
    const resetFilters = () => {
        setIsLoading(true);
        setFilterGroup(null);
        setFilterGrade(null);
        setFilterStatus(null);
        setOffset(0);
        setStudentsParam({})
        setIsLoading(false);
    };

    // статусы студентов
    const statuses = [
        { value: 1, label: 'Учится' },
        { value: 2, label: 'Академ' },
        { value: 3, label: 'Отчислен' },
    ]

    // функции для выбора данных в фильтрах
    function handleFilterGroup(data) {
        setFilterGroup(data);
    }
    function handleFilterGrade(data) {
        setFilterGrade(data);
    }
    function handleFilterStatus(data) {
        setFilterStatus(data);
    }

    // функции для выбора данных в модальных окнах
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
            {/* окно загрузки */}
            <Loading active={isLoading} setActive={setIsLoading} />
            {/* шапка */}
            <Admin_header />
            <div id='body-content'>
                {/* название страницы */}
                <div className='page-name'>
                    <p>Студенты</p>
                </div>
                {/* поиск */}
                <div className='admin-main-search'>
                    <input
                        type='text'
                        value={inputValue}
                        onChange={handleInputValue}
                        placeholder='Поиск...'
                    />
                </div>
                {/* фильтры */}
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
                        }))} />
                    <Select
                        styles={customStyles}
                        placeholder="Степень образования"
                        value={filterGrade}
                        onChange={handleFilterGrade}
                        isSearchable={true}
                        options={allDirectivities.grades.map(res => ({
                            value: res.id,
                            label: res.title,
                        }))} />
                    <Select
                        styles={customStyles}
                        placeholder="Статус"
                        value={filterStatus}
                        onChange={handleFilterStatus}
                        isSearchable={true}
                        options={statuses} />
                    {/* кнопки применить и сбросить */}
                    <button className='get-params' onClick={getParams} type='submit' ><FontAwesomeIcon icon={faFilter} /></button>
                    {/* очистить фильтры */}
                    <button className='delete-params' onClick={resetFilters}><FontAwesomeIcon icon={faUndo} /></button>
                </div>

                {/* кнопка добавления студента */}
                <button className='add-student' onClick={() => {
                    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
                    document.body.style.overflow = 'hidden';
                    const adminMainHeaders = document.getElementsByClassName('ad_main_header');
                    for (let i = 0; i < adminMainHeaders.length; i++) {
                        adminMainHeaders[i].style.paddingRight = `${scrollbarWidth + 10}px`;
                    }
                    document.getElementById('body-content').style.paddingRight = `${scrollbarWidth}px`;
                    // setLastN('');
                    // setFirstN('');
                    // setMiddleN('');
                    setNameStudents('');
                    setErrorNames('');
                    setModalGroup(null);
                    setModalStatus(null);
                    setErrorLastN('');
                    setErrorFirstN('');
                    setErrorGroup('');
                    setErrorStatus('');
                    setModalActive(true);
                }}>
                    <FontAwesomeIcon icon={faPlusCircle} />
                </button>

                {/* вывод данных о студентах */}
                {searchResults.map(res => (
                    <div className='cart-stud' key={res.id}>
                        <div className='content'>
                            <div className='col1'>
                                {res.middleName !== null ? res.middleName === '' : ''}
                                <p><span>ФИО:</span> {res.lastName + " " + res.firstName} {res.middleName !== null && " " + res.middleName}</p>
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
                                    statuses.find(el =>
                                        el.value === allStudents.find(r =>
                                            r.id === res.id)?.status)?.label}</p>}

                            </div>
                        </div>
                        {/* кнопка настроек */}
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
                                {/* кнопка редактирования */}
                                <button onClick={() => {
                                    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
                                    document.body.style.overflow = 'hidden';
                                    const adminMainHeaders = document.getElementsByClassName('ad_main_header');
                                    for (let i = 0; i < adminMainHeaders.length; i++) {
                                        adminMainHeaders[i].style.paddingRight = `${scrollbarWidth + 10}px`;
                                    }
                                    document.getElementById('body-content').style.paddingRight = `${scrollbarWidth}px`;
                                    setErrorLastN('');
                                    setErrorFirstN('');
                                    setErrorGroup('');
                                    setErrorStatus('');
                                    setEditId(res.id);
                                    setLastNEdit(res.lastName);
                                    setFirstNEdit(res.firstName);
                                    setMiddleNEdit(res.middleName);
                                    setModalEditGroup({
                                        value: allGroups.find(el => el.id === res.groupId)?.id,
                                        label: allGroups.find(el => el.id === res.groupId)?.title
                                    })
                                    setModalEditStatus({
                                        value: statuses.find(el =>
                                            el.value === allStudents.find(r =>
                                                r.id === res.id).status)?.value,
                                        label: statuses.find(el =>
                                            el.value === allStudents.find(r =>
                                                r.id === res.id).status)?.label
                                    })
                                    setModalEditActive(true);
                                }}>
                                    <img src={require('../../img/edit.png')} alt='edit' />
                                </button>
                                {/* кнопка удаления */}
                                <button onClick={() => {
                                    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
                                    document.body.style.overflow = 'hidden';
                                    const adminMainHeaders = document.getElementsByClassName('ad_main_header');
                                    for (let i = 0; i < adminMainHeaders.length; i++) {
                                        adminMainHeaders[i].style.paddingRight = `${scrollbarWidth + 10}px`;
                                    }
                                    document.getElementById('body-content').style.paddingRight = `${scrollbarWidth}px`;
                                    setDeleteId(res.id);
                                    setModalDeleteActive(true);
                                }}>
                                    <img src={require('../../img/delete.png')} alt='delete' />
                                </button>
                            </div>)}
                    </div>
                ))}
                {/* кнопка пагинации */}
                {hasMoreData && (
                    <button className='btn-loadMore' onClick={loadMore}>
                        Загрузить ещё
                    </button>
                )}
                {searchResults.length === 0 && <div className='no-data'><p>Нет данных</p></div>}

            </div>

            {/* модальное окно добавления */}
            <Empty_modal active={modalActive} setActive={setModalActive}>
                <div className='modal-students'>
                    <div>
                        <textarea value={nameStudents} className='names-input' placeholder='Фамилия Имя Отчество
Фамилия Имя Отчество' onChange={event => setNameStudents(event.target.value)} />
                        {(errorNames !== '') && <p className='inputModalError' >{errorNames}</p>}

                    </div>

                    <div style={{ marginBottom: '20px' }}>
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
                        {(errorGroup !== '') && <p style={{ color: 'red', fontSize: '12px', position: 'absolute' }} >{errorGroup}</p>}
                    </div>
                    <div>
                        <Select
                            styles={customStylesModal}
                            placeholder="Статус"
                            value={modalStatus}
                            maxMenuHeight={120}
                            onChange={handleModalStatus}
                            isSearchable={true}
                            options={statuses}
                        />
                        {(errorStatus !== '') && <p style={{ color: 'red', fontSize: '12px', position: 'absolute' }} >{errorStatus}</p>}
                    </div>
                    <div className='modal-button'>
                        <button onClick={() => {
                            addData();
                        }}>Сохранить</button>

                        <button onClick={() => {
                            document.body.style.overflow = '';
                            const adminMainHeaders = document.getElementsByClassName('ad_main_header');
                            for (let i = 0; i < adminMainHeaders.length; i++) {
                                adminMainHeaders[i].style.paddingRight = `10px`;
                            }
                            document.getElementById('body-content').style.paddingRight = ``;
                            setModalActive(false);
                        }}>Отмена</button>
                    </div>
                </div>
            </Empty_modal>
            {/* <Empty_modal active={modalActive} setActive={setModalActive}>
                <div className='modal-students'>
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
                    </div>
                    <div style={{ marginBottom: '20px' }}>
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
                        {(errorGroup !== '') && <p style={{ color: 'red', fontSize: '12px', position: 'absolute' }} >{errorGroup}</p>}
                    </div>
                    <div>
                        <Select
                            styles={customStylesModal}
                            placeholder="Статус"
                            value={modalStatus}
                            maxMenuHeight={120}
                            onChange={handleModalStatus}
                            isSearchable={true}
                            options={statuses}
                        />
                        {(errorStatus !== '') && <p style={{ color: 'red', fontSize: '12px', position: 'absolute' }} >{errorStatus}</p>}
                    </div>
                    <div className='modal-button'>
                        <button onClick={() => {
                            addData();
                        }}>Сохранить</button>

                        <button onClick={() => {
                            document.body.style.overflow = '';
                            const adminMainHeaders = document.getElementsByClassName('ad_main_header');
                            for (let i = 0; i < adminMainHeaders.length; i++) {
                                adminMainHeaders[i].style.paddingRight = `10px`;
                            }
                            document.getElementById('body-content').style.paddingRight = ``;
                            setModalActive(false);
                        }}>Отмена</button>
                    </div>
                </div>
            </Empty_modal> */}

            {/* модальное окно для редактирования */}
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
                    </div>
                    <div style={{ marginBottom: '20px' }}>
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
                            }))} />
                        {(errorGroup !== '') && <p style={{ color: 'red', fontSize: '12px', position: 'absolute' }} >{errorGroup}</p>}
                    </div>
                    <div>
                        <Select
                            styles={customStylesModal}
                            placeholder="Статус"
                            value={modalEditStatus}
                            maxMenuHeight={120}
                            onChange={handleModalEditStatus}
                            isSearchable={true}
                            options={statuses} />
                        {(errorStatus !== '') && <p style={{ color: 'red', fontSize: '12px', position: 'absolute' }} >{errorStatus}</p>}
                    </div>

                    <div className='modal-button'>
                        <button onClick={() => {
                            editData();
                        }}>Сохранить</button>

                        <button onClick={() => {
                            setModalEditActive(false);
                            document.body.style.overflow = '';
                            const adminMainHeaders = document.getElementsByClassName('ad_main_header');
                            for (let i = 0; i < adminMainHeaders.length; i++) {
                                adminMainHeaders[i].style.paddingRight = `10px`;
                            }
                            document.getElementById('body-content').style.paddingRight = ``;
                        }}>Отмена</button>
                    </div>
                </div>
            </Empty_modal>

            {/* модальное окно для удаления */}
            <Empty_modal active={modalDeleteActive} setActive={setModalDeleteActive} >
                <div className='content-delete'>
                    <p className='text-delete'>Вы уверены, что хотите удалить?</p>
                    <div className='modal-button'>
                        <button onClick={() => {
                            deleteData(); setModalDeleteActive(false);
                            document.body.style.overflow = '';
                            const adminMainHeaders = document.getElementsByClassName('ad_main_header');
                            for (let i = 0; i < adminMainHeaders.length; i++) {
                                adminMainHeaders[i].style.paddingRight = `10px`;
                            }
                            document.getElementById('body-content').style.paddingRight = ``;
                        }}>Удалить</button>

                        <button onClick={() => {
                            setModalDeleteActive(false);
                            document.body.style.overflow = '';
                            const adminMainHeaders = document.getElementsByClassName('ad_main_header');
                            for (let i = 0; i < adminMainHeaders.length; i++) {
                                adminMainHeaders[i].style.paddingRight = `10px`;
                            }
                            document.getElementById('body-content').style.paddingRight = ``;
                        }}>Отмена</button>
                    </div>
                </div>
            </Empty_modal>

            {/* модальные окна ошибок */}
            <Error_modal active={errorActive} text={textError} />
            <Error_empty active={errorEmptyActive} text={textError} codeText={codeText} />
            <Error_ok active={errorOkActive} setActive={setErrorOkActive} text={textError} codeText={codeText} />
        </>

    );
}

export default Admin_students;