import React, { useEffect, useState } from 'react';
import '../admin/Admin_main.css';
import User_header from './User_header';
import '../admin/Admin_students.css'
import { getDataAdminJournal, getTextError, getFilterWorkType, getFilterDiscipline, getFilterEmployees, getFilterGroups, getFilterDepartments, editWork, deleteWork } from '../../network';
import Select from 'react-select';
import Error_modal from '../Modal/Error_modal';
import Error_empty from '../Modal/Error_empty';
import { faFilter, faUndo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { customStyles } from '../Select_style/Select_style';
import Loading from '../Modal/Loading';
import Empty_modal from '../Modal/Empty_modal';
import "flatpickr/dist/themes/material_green.css";
import Flatpickr from "react-flatpickr";
import Error_ok from '../Modal/Error_ok';

function User_main() {
    const [errorActive, setErrorActive] = useState(false);
    const [errorEmptyActive, setErrorEmptyActive] = useState(false);

    const [textError, setTextError] = useState('');
    const [selectedWorkType, setSelectedWorkType] = useState(null);
    const [selectedDiscipline, setSelectedDiscipline] = useState(null);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [filterWorkType, setFilterWorkType] = useState([]);
    const [filterDiscipline, setFilterDiscipline] = useState([]);
    const [filterEmployees, setFilterEmployees] = useState([]);
    const [filterGroup, setFilterGroup] = useState([]);
    const [modalEditActive, setModalEditActive] = useState(false);
    const [modalDeleteActive, setModalDeleteActive] = useState(false);
    const [dateTime, setDateTime] = useState(null);

    const [studentEdit, setStudentEdit] = useState(null);
    const [disciplineEdit, setDisciplineEdit] = useState(null);
    const [workTypeEdit, setWorkTypeEdit] = useState(null);
    const [departmentEdit, setDepartmentEdit] = useState(null);
    const [titleEdit, setTitleEdit] = useState(null);
    const [errorTitle, setErrorTitle] = useState('');
    const [codeText, setCodeText] = useState('');

    const [mainData, setMainData] = useState([]);
    const [errorOkActive, setErrorOkActive] = useState(false);

    const [journalParam, setJournalParam] = useState({});
    const [searchResults, setSearchResults] = useState([]);
    const [editId, setEditId] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [hasMoreData, setHasMoreData] = useState(true);

    const [inputValue, setInputValue] = useState("");
    const [debouncedInputValue, setDebouncedInputValue] = useState("");
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

    // получение данных для фильтров с бэка
    useEffect(() => {
        setIsLoading(true);
        getFilterWorkType((res) => {
            if (res.error) {
                setTextError(getTextError(res.error));
                setErrorActive(true);
            } else {
                setFilterWorkType(res.response);
            }

            setIsLoading(false);
        }).catch((error) => {
            setTextError(getTextError(error));
            setCodeText(error.code);
            setErrorEmptyActive(true);
            setIsLoading(false);
        });

        getFilterDiscipline((res) => {
            if (res.error) {
                setTextError(getTextError(res.error));
                setErrorActive(true);
            } else {
                setFilterDiscipline(res.response);
            }
            setIsLoading(false);
        }).catch((error) => {
            setTextError(getTextError(error));
            setCodeText(error.code);
            setErrorEmptyActive(true);
            setIsLoading(false);
        });

        getFilterEmployees((res) => {
            if (res.error) {
                setTextError(getTextError(res.error));
                setErrorActive(true);
            } else {
                setFilterEmployees(res.response);
            }
            setIsLoading(false);
        }).catch((error) => {
            setTextError(getTextError(error));
            setCodeText(error.code);
            setErrorEmptyActive(true);
            setIsLoading(false);
        });

        getFilterGroups((res) => {
            if (res.error) {
                setTextError(getTextError(res.error));
                setErrorActive(true);
            } else {
                setFilterGroup(res.response);
            }
            setIsLoading(false);
        }).catch((error) => {
            setTextError(getTextError(error));
            setCodeText(error.code);
            setErrorEmptyActive(true);
            setIsLoading(false);
        });

    }, []);


    // функция сброса фильтров
    const resetFilters = () => {
        setIsLoading(true);
        setSelectedWorkType(null);
        setSelectedDiscipline(null);
        setSelectedTeacher(null);
        setSelectedDepartment(null);
        setSelectedGroup(null);
        setOffset(0);
        setJournalParam({})
        setIsLoading(false);
    };

    // Функция для получения данных с сервера и выполнения поиска
    const getParams = () => {
        setIsLoading(true);
        setOffset(0);

        setJournalParam({
            disciplineId: selectedDiscipline ? selectedDiscipline.value : null,
            teacherId: selectedTeacher ? selectedTeacher.value : null,
            departmentId: selectedDepartment ? selectedDepartment.value : null,
            groupId: selectedGroup ? selectedGroup.value : null,
            workTypeId: selectedWorkType ? selectedWorkType.value : null,
        });
        setIsLoading(false);
    };

    // Функция поиска
    const handleInputValue = (e) => {
        setInputValue(e.target.value);
    };

    // ожидание 1 сек перед отправкой запроса после ввода данных в поиск
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedInputValue(inputValue);
        }, 1000);
        return () => clearTimeout(timeoutId);
    }, [inputValue, 1000]);

    useEffect(() => {
        setIsLoading(true);
        setHasMoreData(true);
        // получение данных для отображения
        getDataAdminJournal(offset, limit, journalParam, debouncedInputValue, (res) => {
            if (res.error) {
                setTextError(getTextError(res.error));
                setErrorActive(true);
            } else {
                if (res.response.entries.length < limit) {
                    setHasMoreData(false); // Если загружено меньше, чем лимит, значит, больше данных нет
                }

                // Если это первая страница, просто устанавливаем новые данные
                if (offset === 0) {
                    setMainData(res.response.entries);
                    setSearchResults(res.response.entries);
                } else {
                    // Иначе обновляем данные
                    setMainData(prevData => [...prevData, ...res.response.entries]);
                    setSearchResults(prevResults => [...prevResults, ...res.response.entries]);
                }
            }
            setIsLoading(false);
        }).catch((error) => {
            setTextError(error.message);
            setCodeText(error.code);
            setErrorEmptyActive(true);
            setIsLoading(false);
        })
    }, [offset, limit, journalParam, debouncedInputValue]);

    // функция редактирования работы
    async function editData() {
        setIsLoading(true);
        if (workTypeEdit !== 'Курсовая')
            setTitleEdit('');

        setErrorTitle('');

        if (titleEdit === '') {
            setErrorTitle('Введите название работы');
            setIsLoading(false);
        } else {

            await editWork(editId, dateTime, titleEdit, (res) => {
                if (res.success) {

                    const editWork = mainData.map(elem => {
                        if (elem.work.id === editId) {
                            return {
                                ...elem, // копируем все свойства из исходного объекта
                                work: {
                                    ...elem.work,
                                    registrationDate: dateTime,
                                    title: titleEdit
                                }

                            };
                        } else {
                            return elem; // если элемент не подлежит изменению, возвращаем его без изменений
                        }
                    });

                    setMainData(editWork);

                } else {
                    setTextError(res.message);
                    setCodeText(res.code);
                    setErrorOkActive(true);
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
            const usMainHeaders = document.getElementsByClassName('us_main_header');
            for (let i = 0; i < usMainHeaders.length; i++) {
                usMainHeaders[i].style.paddingRight = `10px`;
            }
            document.getElementById('body-content').style.paddingRight = ``;
            setTitleEdit('');
        }
    }

    // функция удаления
    async function deleteData() {
        setIsLoading(true);
        await deleteWork(deleteId, (res) => {
            if (res.success) {
                setMainData(mainData.filter((a) => a.work.id !== deleteId));
            } else {
                setTextError(res.message);
                setCodeText(res.code);
                setErrorOkActive(true);
            }
            setIsLoading(false);
        }).catch((error) => {
            setTextError(error.message);
            setCodeText(error.code);
            setErrorOkActive(true);
            setIsLoading(false);
        });

    }

    // изменение отображения данных
    useEffect(() => {
        setSearchResults(mainData);
    }, [mainData])

    // получения данных о необходимой фильтрации
    function handleSelectDiscipline(data) {
        setSelectedDiscipline(data);
    }
    function handleSelectType(data) {
        setSelectedWorkType(data);
    }
    function handleSelectTeacher(data) {
        setSelectedTeacher(data);
    }
    function handleSelectGroup(data) {
        setSelectedGroup(data);
    }

    // получение новой даты
    function handleDateTime(data) {
        let dateObject = new Date(data);
        let timestamp = dateObject.getTime();
        setDateTime(timestamp);
    }

    // статусы студентов
    const statuses = [
        { value: 1, label: 'Учится' },
        { value: 2, label: 'Академ' },
        { value: 3, label: 'Отчислен' },
    ]

    return (
        <>

            {/* окно загрузки */}
            <Loading active={isLoading} setActive={setIsLoading} />
            {/* шапка страницы */}
            <User_header />
            <div id='body-content'>
                {/* название страницы */}
                <div className='page-name'>
                    <p>Последние записи</p>
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
                    <div>
                        <Select
                            styles={customStyles}
                            placeholder="Тип работы"
                            value={selectedWorkType}
                            onChange={handleSelectType}
                            isSearchable={true}
                            options={filterWorkType.map(workTypes => ({
                                value: workTypes.id,
                                label: workTypes.title,
                            }))}
                        />
                    </div>
                    <div>
                        <Select
                            styles={customStyles}
                            placeholder="Дисциплина"
                            value={selectedDiscipline}
                            onChange={handleSelectDiscipline}
                            isSearchable={true}
                            options={filterDiscipline.map(disciplines => ({
                                value: disciplines.id,
                                label: disciplines.title,
                            }))}
                        />
                    </div>
                    <div>
                        <Select
                            styles={customStyles}
                            placeholder="Преподаватель"
                            value={selectedTeacher}
                            onChange={handleSelectTeacher}
                            isSearchable={true}
                            options={filterEmployees.map(teachers => ({
                                value: teachers.id,
                                label: teachers.title,
                            }))}
                        />
                    </div>
                    <div>
                        <Select
                            styles={customStyles}
                            placeholder="Группа"
                            value={selectedGroup}
                            onChange={handleSelectGroup}
                            isSearchable={true}
                            options={filterGroup.map(groups => ({
                                value: groups.id,
                                label: groups.title,
                            }))}
                        />
                    </div>

                    {/* кнопки применить и сбросить */}
                    <button className='get-params' onClick={getParams} type='submit' ><FontAwesomeIcon icon={faFilter} /></button>
                    {/* очистить фильтры */}
                    <button className='delete-params' onClick={resetFilters}><FontAwesomeIcon icon={faUndo} /></button>
                </div>

                {/* данные о зарегистрированных работах (карточки) */}
                {searchResults.map(entries => (
                    <div className='cart-stud' key={entries.work.id}>
                        <div className='data'>
                            {new Date(entries.work.registrationDate).toLocaleString("ru-ru")}
                        </div>
                        <div className='content'>
                            <div className='col1'>
                                <p><span>ФИО:</span> {entries.student.fullName}</p>
                                <p><span>Группа:</span> {entries.group.title}</p>
                                <p><span>Тип работы:</span> {entries.work.type.title}</p>
                                <p><span>Статус:</span> {statuses.find(r => r.value === entries.student.status)?.label}</p>
                            </div>
                            <div className='col2'>
                                <p><span>Дисциплина:</span> {entries.discipline.title}</p>
                                <p><span>Преподаватель:</span> {entries.employee.lastName} {entries.employee.firstName} {entries.employee.middleName}</p>
                                <p><span>Кафедра:</span> {entries.department.title}</p>
                                {entries.work.title && <p><span>Название:</span> {entries.work.title}</p>}
                            </div>
                        </div>
                        {/* кнопка настроек */}
                        <button
                            className='qr-setting'
                            onClick={() => {
                                if (isSetOpen === true && entries.work.id !== selectedItemId) {
                                    closeModal();
                                    openModal(entries.work.id);
                                }
                                else if (isSetOpen === true) {
                                    closeModal();
                                }
                                else {
                                    openModal(entries.work.id);
                                }
                            }}
                        >
                            <img src={require('../../img/setting.png')} alt='setting' />
                        </button>
                        {isSetOpen && selectedItemId === entries.work.id && (
                            <div className={`button-edit-delete ${isSetOpen && selectedItemId === entries.work.id ? 'active' : ''}`}>
                                {/* кнопка редактирования */}
                                <button onClick={() => {

                                    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
                                    document.body.style.overflow = 'hidden';
                                    const usMainHeaders = document.getElementsByClassName('us_main_header');
                                    for (let i = 0; i < usMainHeaders.length; i++) {
                                        usMainHeaders[i].style.paddingRight = `${scrollbarWidth + 10}px`;
                                    }
                                    document.getElementById('body-content').style.paddingRight = `${scrollbarWidth}px`;
                                    setEditId(entries.work.id);
                                    setDateTime(entries.work.registrationDate);
                                    setErrorTitle('');
                                    setStudentEdit(entries.student.fullName);
                                    setDisciplineEdit(entries.discipline.title);
                                    setWorkTypeEdit(entries.work.type.title);
                                    setDepartmentEdit(entries.department.title);
                                    entries.work.title && setTitleEdit(entries.work.title);
                                    setModalEditActive(true)
                                }}>
                                    <img src={require('../../img/edit.png')} alt='edit' />
                                </button>
                                {/* кнопка удаления */}
                                <button onClick={() => {
                                    setModalDeleteActive(true); setDeleteId(entries.work.id);
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
                {hasMoreData && (
                    <button className='btn-loadMore' onClick={loadMore}>
                        Загрузить ещё
                    </button>
                )}
                {searchResults.length === 0 && <div className='no-data'><p>Нет данных</p></div>}

            </div>

            {/* модальное окно редактирования */}
            <Empty_modal active={modalEditActive} setActive={setModalEditActive} >
                <div className='modal-main'>
                    <div className='grid'>
                        <div>
                            <p><b>Дата регистрации: </b></p>
                        </div>
                        <div>
                            <Flatpickr
                                style={{
                                    fontSize: "16px",
                                    padding: "10px",
                                    border: "3px solid #1e971c",
                                    borderRadius: "5px"
                                }}
                                value={dateTime}
                                onChange={handleDateTime}
                                options={{
                                    dateFormat: "d.m.Y, H:i:S",
                                    enableTime: true,
                                    time_24hr: true
                                }}
                            />
                        </div>
                        <div><p><b>ФИО студента: </b></p></div>
                        <div><p>{studentEdit}</p></div>
                        <div><p><b>Дисциплина: </b></p></div>
                        <div><p>{disciplineEdit}</p></div>
                        <div><p><b>Тип работы: </b></p></div>
                        <div><p>{workTypeEdit}</p></div>
                        <div><p><b>Кафедра: </b></p></div>
                        <div><p>{departmentEdit}</p></div>
                    </div>
                    <div>
                        {workTypeEdit === 'Курсовая' && <div className='input-conteiner'>
                            <input type='text' className='name-dapartment' placeholder=' ' value={titleEdit} onChange={e => setTitleEdit(e.target.value)} />
                            <label className='label-name'>Название работы</label>
                        </div>}
                        {(errorTitle !== '') && <p className='inputModalError' >{errorTitle}</p>}

                    </div>
                </div>
                <div className='modal-button'>
                    <button onClick={() => {
                        editData();
                    }}>Сохранить</button>
                    <button onClick={() => {
                        setModalEditActive(false);
                        setTitleEdit('');
                        // Восстанавливаем позицию прокрутки
                        document.body.style.overflow = '';
                        const usMainHeaders = document.getElementsByClassName('us_main_header');
                        for (let i = 0; i < usMainHeaders.length; i++) {
                            usMainHeaders[i].style.paddingRight = `10px`;
                        }
                        document.getElementById('body-content').style.paddingRight = ``;
                    }}>Отмена</button>
                </div>
            </Empty_modal>

            {/* модальное окно удаления */}
            <Empty_modal active={modalDeleteActive} setActive={setModalDeleteActive} >
                <div className='content-delete'>
                    <p className='text-delete'>Вы уверены, что хотите удалить?</p>
                    <div className='modal-button'>
                        <button onClick={() => {
                            deleteData();
                            setModalDeleteActive(false);
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

            {/* модальное окно ошибки */}
            <Error_modal active={errorActive} text={textError} />
            <Error_empty active={errorEmptyActive} text={textError} codeText={codeText} />
            <Error_ok active={errorOkActive} setActive={setErrorOkActive} text={textError} codeText={codeText} />

        </>
    );
}

export default User_main;
