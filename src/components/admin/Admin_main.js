import React, { useEffect, useState } from 'react';
import './Admin_main.css';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import Admin_header from './Admin_header';
import { getDataFilters } from '../../network';
import { getDataAdminJournal } from '../../network';
import Select from 'react-select';
import Error_modal from '../Modal/Error_modal';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Admin_main() {
    const [errorActive, setErrorActive] = useState(false);
    const [textError, setTextError] = useState('');
    const [allUsers, setAllUsers] = useState([]);
    const [selectedWorkType, setSelectedWorkType] = useState(null);
    const [selectedDiscipline, setSelectedDiscipline] = useState(null);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState(null);

    const [filter, setFilter] = useState({
        response: {
            workTypes: [],
            disciplines: [],
            teachers: [],
            groups: []
        },
        error: null,
        success: true
    });

    const [mainData, setMainData] = useState({
        response: {
            count: 30,
            offset: 0,
            journal: [],
            error: null,
            success: true
        }
    })
    const [filteredUsers, setFilteredUsers] = useState({
        response: {
            count: 30,
            offset: 0,
            journal: [],
            error: null,
            success: true
        }
    });
    const [visibleItems, setVisibleItems] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');

    const loadMore = () => {
        setVisibleItems(prevVisibleItems => prevVisibleItems + 5);
    };

    useEffect(() => {
        getDataFilters((res) => {
            if (res.error) {
                switch (res.error.code) {
                    case 101:
                        setTextError('Неверные учетные данные!');
                        break;
                    case 102:
                        setTextError('Требуется токен доступа!');
                        break;
                    case 103:
                        setTextError('Сессия истекла!');
                        break;
                    default:
                        setTextError('Неизвестная ошибка!');
                }
                setErrorActive(true);

            } else {
                setFilter(res)
            }

        })
    }, []);

    const resetFilters = () => {

        setSelectedWorkType(null);
        setSelectedDiscipline(null);
        setSelectedTeacher(null);
        setSelectedDepartment(null);
        setSelectedGroup(null);
        console.log('тип работы:', selectedWorkType);
        console.log('дисциплина:', selectedDiscipline);
        console.log('преподаватель:', selectedTeacher);
        console.log('кафедра:', selectedDepartment);
        console.log('группа:', selectedGroup);

        const journalParam = {
            disciplineId: null,
            teacherId: null,
            departmentId: null,
            groupId: null,
            workTypeId: null
        }
        getDataAdminJournal(journalParam, (data) => {
            if (data.error) {
                switch (data.error.code) {
                    case 101:
                        setTextError('Неверные учетные данные!');
                        break;
                    case 102:
                        setTextError('Требуется токен доступа!');
                        break;
                    case 103:
                        setTextError('Сессия истекла!');
                        break;
                    default:
                        setTextError('Неизвестная ошибка!');
                }
                setErrorActive(true)
            } else {
                setMainData(data)
                setFilteredUsers(data);
            }

        })

    };

    const getParams = () => {
        const journalParam = {
            disciplineId: selectedDiscipline ? selectedDiscipline.value : null,
            teacherId: selectedTeacher ? selectedTeacher.value : null,
            departmentId: selectedDepartment ? selectedDepartment.value : null,
            groupId: selectedGroup ? selectedGroup.value : null,
            workTypeId: selectedWorkType ? selectedWorkType.value : null,
        };

        console.log(journalParam)
        getDataAdminJournal(journalParam, (data) => {
            if (data.error) {

                switch (data.error.code) {
                    case 101:
                        setTextError('Неверные учетные данные!');
                        break;
                    case 102:
                        setTextError('Требуется токен доступа!');
                        break;
                    case 103:
                        setTextError('Сессия истекла!');
                        break;
                    default:
                        setTextError('Неизвестная ошибка!');
                }
                setErrorActive(true)
            } else {
                setMainData(data)
                setFilteredUsers(data);
            }
        })
    }

    useEffect(() => {

        const journalParam = {
            disciplineId: null,
            teacherId: null,
            departmentId: null,
            groupId: null,
            workTypeId: null
        }
        getDataAdminJournal(journalParam, (data) => {
            if (data.error) {
                switch (data.error.code) {
                    case 101:
                        setTextError('Неверные учетные данные!');
                        break;
                    case 102:
                        setTextError('Требуется токен доступа!');
                        break;
                    case 103:
                        setTextError('Сессия истекла!');
                        break;
                    default:
                        setTextError('Неизвестная ошибка!');
                }
                setErrorActive(true);

            } else {
                setMainData(data)
                setFilteredUsers(data);
            }
        })
    }, []);

    const handleChange = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        setSearchTerm(searchTerm);

        const filtered = mainData.response.journal.filter(journal =>
            journal.student.fullName.toLowerCase().includes(searchTerm)
        );
        setFilteredUsers({
            response: {
                ...filteredUsers.response,
                journal: filtered
            }
        });
    };

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
    const customStylesGroup = {
        option: (provided, state) => ({
            ...provided,
            fontSize: '14px',
            color: state.isSelected ? 'white' : 'green',
            backgroundColor: state.isSelected ? 'green' : 'white',
            cursor: 'pointer',
            border: 'none',
            '&:hover': {
                backgroundColor: 'green',
                color: 'white',
            },
            ...(state.isActive && {
                border: 'none',
                boxShadow: '0 0 0 2px green',
            }),
        }),
        control: (provided) => ({
            ...provided,

            minWidth: '100px',
            border: 'none',
            boxShadow: '0 0 0 2px green',
        }),
        menu: (provided) => ({
            ...provided,
            width: '100%',
        }),
    };
    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            fontSize: '14px',
            color: state.isSelected ? 'white' : 'green',
            backgroundColor: state.isSelected ? 'green' : 'white',
            cursor: 'pointer',
            border: 'none',
            '&:hover': {
                backgroundColor: 'green',
                color: 'white',
            },
            ...(state.isActive && {
                border: 'none',
                boxShadow: '0 0 0 2px green',
            }),
        }),
        control: (provided) => ({
            ...provided,

            minWidth: '200px',
            border: 'none',
            boxShadow: '0 0 0 2px green',
        }),
        menu: (provided) => ({
            ...provided,
            width: '100%',
        }),
    };
    return (
        <>
            <Admin_header />
            <div className='admin-main-search'>
                <input
                    type='text'
                    value={searchTerm}
                    onChange={handleChange}
                    placeholder='Поиск по ФИО студента...'
                />
            </div>
            <div className='filters'>
                <div>
                    <Select
                        styles={customStyles}
                        placeholder="Тип работы"
                        value={selectedWorkType}
                        onChange={handleSelectType}
                        isSearchable={true}
                        options={filter.response.workTypes.map(workTypes => ({
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
                        options={filter.response.disciplines.map(disciplines => ({
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
                        options={filter.response.teachers.map(teachers => ({
                            value: teachers.id,
                            label: teachers.title,
                        }))}
                    />
                </div>
                <div>
                    <Select
                        styles={customStylesGroup}
                        placeholder="Группа"
                        value={selectedGroup}
                        onChange={handleSelectGroup}
                        isSearchable={true}
                        options={filter.response.groups.map(groups => ({
                            value: groups.id,
                            label: groups.title,
                        }))}
                    />
                </div>

                <button className='get-params' type='submit' onClick={getParams}>Применить</button>
                <button className='delete-params' onClick={resetFilters}>Сбросить</button>

            </div>
            {filteredUsers.response.journal.slice(0, visibleItems).map(journal => (
                <div className='cart' >
                    <div className='data'>
                        {new Date(journal.work.registrationDate * 1000).toLocaleString("ru-ru")}
                    </div>
                    <div className='content'>
                        <div className='col1'>
                            <p><span>ФИО:</span> {journal.student.fullName}</p>
                            <p><span>Группа:</span> {journal.group.title}</p>
                            <p><span>Тип работы:</span> {journal.work.type.title}</p>
                            <p><span>Статус:</span> {journal.student.status}</p>
                        </div>
                        <div className='col2'>
                            <p><span>Дисциплина:</span> {journal.discipline.title}</p>
                            <p><span>Преподаватель:</span> {journal.teacher.lastName} {journal.teacher.firstName} {journal.teacher.middleName}</p>
                            <p><span>Кафедра:</span> {journal.teacher.fullName}</p>
                            {journal.work.title && <p><span>Название:</span> {journal.work.title}</p>}
                        </div>
                    </div>
                </div>
            ))}
            <button className='btn-loadMore' onClick={loadMore}>Загрузить ещё</button>
            <Error_modal active={errorActive} setActive={setErrorActive}>
                <div className='error-modal'>
                    <div className='error-modal-header'>
                        <FontAwesomeIcon icon={faExclamationTriangle} className='error-icon' />
                        <p>Произошла ошибка:</p>
                    </div>
                    <p>{`${textError}`}</p>
                    <p>Попробуйте авторизоваться</p>
                    <Link to='/Log' className='btn-to-log'>Авторизоваться</Link>
                </div>
            </Error_modal>
        </>
    );
}

export default Admin_main;
