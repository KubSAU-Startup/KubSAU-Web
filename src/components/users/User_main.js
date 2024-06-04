import React, { useEffect, useState } from 'react';
import '../admin/Admin_main.css';
import User_header from './User_header';
import { getDataAdminJournal, getTextError, getFilterWorkType, getFilterDiscipline, getFilterEmployees, getFilterGroups, getFilterDepartments, editWork, deleteWork } from '../../network';
import Select from 'react-select';
import Error_modal from '../Modal/Error_modal';
import Error_empty from '../Modal/Error_empty';

import { customStyles, customStylesModal } from '../Select_style/Select_style';
import Loading from '../Modal/Loading';
import Empty_modal from '../Modal/Empty_modal';
import "flatpickr/dist/themes/material_green.css";
import Flatpickr from "react-flatpickr";

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
    // переменные для получения фильтров из бэка
    const [filterWorkType, setFilterWorkType] = useState([]);
    const [filterDiscipline, setFilterDiscipline] = useState([]);
    const [filterEmployees, setFilterEmployees] = useState([]);
    const [filterGroup, setFilterGroup] = useState([]);
    const [filterDepartments, setFilterDepartments] = useState([]);
    const [modalActive, setModalActive] = useState(false);
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
    // переменная для получения данных карточек из бэка
    const [mainData, setMainData] = useState([]);

    const [journalParam, setJournalParam] = useState({});

    // переменная поиска
    const [searchResults, setSearchResults] = useState([]);

    // перменная запроса на поиск
    const [searchTerm, setSearchTerm] = useState('');
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

    // получение данных для фильтров с бэка
    useEffect(() => {
        getFilterWorkType((res) => {
            if (res.error) {
                setTextError(getTextError(res.error));
                setErrorActive(true);
            } else {
                setFilterWorkType(res.response);
            }

            setIsLoading(false);
        }).catch((error) => {
            setTextError(error.message);
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
            setTextError(error.message);
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
            setTextError(error.message);
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
            setTextError(error.message);
            setCodeText(error.code);
            setErrorEmptyActive(true);
            setIsLoading(false);
        });
        getFilterDepartments((res) => {
            if (res.error) {
                setTextError(getTextError(res.error));
                setErrorActive(true);
            } else {
                setFilterDepartments(res.response);
            }
            setIsLoading(false);
        }).catch((error) => {
            setTextError(error.message);
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

        // параметры для сброса
        setJournalParam({})

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
    };

    // Функция поиска
    const handleInputValue = (e) => {
        setInputValue(e.target.value);
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedInputValue(inputValue);
        }, 1000);
        return () => clearTimeout(timeoutId);
    }, [inputValue, 1000]);



    useEffect(() => {
        setIsLoading(true);
        setHasMoreData(true);
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
                    setErrorEmptyActive(true);
                }
                setIsLoading(false);

            }).catch((error) => {
                setTextError(error.message);
                setCodeText(error.code);
                setErrorEmptyActive(true);
                setIsLoading(false);
            });
            setModalEditActive(false);
            document.body.style.overflow = 'auto';
            document.body.style.paddingRight = `0px`;
        }
    }

    async function deleteData() {
        setIsLoading(true);
        await deleteWork(deleteId, (res) => {
            if (res.success) {
                setMainData(mainData.filter((a) => a.work.id !== deleteId));

            } else {
                setTextError(res.message);
                setCodeText(res.code);
                setErrorEmptyActive(true);
            }
            setIsLoading(false);
        }).catch((error) => {
            setTextError(error.message);
            setCodeText(error.code);
            setErrorEmptyActive(true);
            setIsLoading(false);
        });

    }

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
    function handleSelectDepartment(data) {
        setSelectedDepartment(data);
    }
    function handleDateTime(data) {
        let dateObject = new Date(data);
        let timestamp = dateObject.getTime();
        setDateTime(timestamp);
    }
    function handleModalDisciplene(data) {
        setDisciplineEdit(data);
    }
    function handleModalStudent(data) {
        setStudentEdit(data);
    }
    function handleModalWorkType(data) {
        setWorkTypeEdit(data);
    }
    function handleModalDepartment(data) {
        setDepartmentEdit(data);
    }
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;


    return (
        <>
            {/* окно загрузки */}
            <Loading active={isLoading} setActive={setIsLoading} />
            {/* шапка страницы */}
            <User_header />

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
                <div>
                    <Select
                        styles={customStyles}
                        placeholder="Кафедра"
                        value={selectedDepartment}
                        onChange={handleSelectDepartment}
                        isSearchable={true}
                        options={filterDepartments.map(department => ({
                            value: department.id,
                            label: department.title,
                        }))}
                    />
                </div>

                {/* кнопки применить и сбросить */}
                <button className='get-params' type='submit' onClick={getParams}>Применить</button>
                <button className='delete-params' onClick={resetFilters}>Сбросить</button>
            </div>

            {/* данные о зарегистрированных работах (карточки) */}
            {/* sort((a, b) => b.work.registrationDate - a.work.registrationDate). */}

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
                            <p><span>Статус:</span> {entries.student.status.title}</p>
                        </div>
                        <div className='col2'>
                            <p><span>Дисциплина:</span> {entries.discipline.title}</p>
                            <p><span>Преподаватель:</span> {entries.employee.lastName} {entries.employee.firstName} {entries.employee.middleName}</p>
                            <p><span>Кафедра:</span> {entries.department.title}</p>
                            {entries.work.title && <p><span>Название:</span> {entries.work.title}</p>}
                        </div>
                    </div>
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
                            <button onClick={() => {
                                document.body.style.overflow = 'hidden';
                                document.body.style.paddingRight = `${scrollBarWidth}px`;

                                setEditId(entries.work.id);
                                setDateTime(entries.work.registrationDate);
                                setErrorTitle('');

                                // setStudentEdit({ value: entries.student.id, label: entries.student.title });
                                // setDisciplineEdit({ value: entries.discipline.id, label: entries.discipline.title });
                                // setWorkTypeEdit({ value: entries.work.type.id, label: entries.work.type.title });
                                // setDepartmentEdit({ value: entries.department.id, label: entries.department.title });setStudentEdit({ value: entries.student.id, label: entries.student.title });
                                setStudentEdit(entries.student.fullName);
                                setDisciplineEdit(entries.discipline.title);
                                setWorkTypeEdit(entries.work.type.title);
                                // setEmplLastN();
                                // setEmplFirstN();
                                // setEmplMiddleN();
                                setDepartmentEdit(entries.department.title);
                                entries.work.title && setTitleEdit(entries.work.title);
                                setModalEditActive(true)
                            }}>
                                <img src={require('../../img/edit.png')} alt='edit' />
                            </button>
                            <button onClick={() => {
                                setModalDeleteActive(true); setDeleteId(entries.work.id);
                                document.body.style.overflow = 'hidden';
                                document.body.style.paddingRight = `${scrollBarWidth}px`;

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
                        <div>
                            <p><b>ФИО студента: </b></p>
                        </div>
                        <div>
                            <p>{studentEdit}</p>

                        </div>
                        {/* <Select
                            styles={customStylesModal}
                            placeholder="Студент"
                            value={studentEdit}
                            maxMenuHeight={120}
                            onChange={handleModalStudent}
                            isSearchable={true}
                            options={filterDiscipline.map(el => ({
                                value: el.id,
                                label: el.title,
                            }))}
                        /> */}
                        <div>
                            <p><b>Дисциплина: </b></p>
                        </div>
                        <div>
                            <p>{disciplineEdit}</p>
                            {/* <Select
                                styles={customStylesModal}
                                placeholder="Дисциплина"
                                value={disciplineEdit}
                                maxMenuHeight={120}
                                onChange={handleModalDisciplene}
                                isSearchable={true}
                                options={filterDiscipline.map(el => ({
                                    value: el.id,
                                    label: el.title,
                                }))}
                            /> */}
                        </div>
                        <div>
                            <p><b>Тип работы: </b></p>
                        </div>
                        <div>
                            <p>{workTypeEdit}</p>

                            {/* <Select
                                styles={customStylesModal}
                                placeholder="Тип работы"
                                value={workTypeEdit}
                                maxMenuHeight={120}
                                onChange={handleModalWorkType}
                                isSearchable={true}
                                options={filterWorkType.map(el => ({
                                    value: el.id,
                                    label: el.title,
                                }))}
                            /> */}
                        </div>
                        <div>
                            <p><b>Кафедра: </b></p>
                        </div>
                        <div>
                            <p>{departmentEdit}</p>

                            {/* <Select
                                styles={customStylesModal}
                                placeholder="Кафедра"
                                value={departmentEdit}
                                maxMenuHeight={120}
                                onChange={handleModalDepartment}
                                isSearchable={true}
                                options={filterDepartments.map(el => ({
                                    value: el.id,
                                    label: el.title,
                                }))}
                            /> */}
                        </div>

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
                        document.body.style.overflow = 'auto';
                        document.body.style.paddingRight = `0px`;
                        
                    }}>Отмена</button>
                </div>
            </Empty_modal>
            <Empty_modal active={modalDeleteActive} setActive={setModalDeleteActive} >
                <div className='content-delete'>
                    <p className='text-delete'>Вы уверены, что хотите удалить?</p>
                    <div className='modal-button'>
                        <button onClick={() => {
                            deleteData();
                            setModalDeleteActive(false);
                            document.body.style.overflow = 'auto';
                            document.body.style.paddingRight = `0px`;

                        }}>Удалить</button>
                        <button onClick={() => {
                            setModalDeleteActive(false);
                            document.body.style.overflow = 'auto';
                            document.body.style.paddingRight = `0px`;


                        }}>Отмена</button>
                    </div>
                </div>
            </Empty_modal>

            {/* модальное окно ошибки */}
            <Error_modal active={errorActive} text={textError} />
            <Error_empty active={errorEmptyActive} text={textError} codeText={codeText} />

        </>
    );
}

export default User_main;
