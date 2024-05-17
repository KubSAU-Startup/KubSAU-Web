import React, { useEffect, useState } from 'react';
import '../admin/Admin_main.css';
import User_header from './User_header';
import { getDataAdminJournal, getTextError, getFilterWorkType, getFilterDiscipline, getFilterEmployees, getFilterGroups, getFilterDepartments, searchOfWorks } from '../../network';
import Select from 'react-select';
import Error_modal from '../Modal/Error_modal';
import { customStyles } from '../Select_style/Select_style';
import Loading from '../Modal/Loading';

const endpoint = 'https://jsonplaceholder.typicode.com/users';

function User_main() {

    const [errorActive, setErrorActive] = useState(false);
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

    // переменная для получения данных карточек из бэка
    const [mainData, setMainData] = useState([]);

    // переменная для получения всех студентов из бэка
    const [journalParam, setJournalParam] = useState({});

    // переменная поиска
    const [searchResults, setSearchResults] = useState([]);

    // перменная запроса на поиск
    const [searchTerm, setSearchTerm] = useState('');

    const [hasMoreData, setHasMoreData] = useState(true);

    const [inputValue, setInputValue] = useState("");
    const [debouncedInputValue, setDebouncedInputValue] = useState("");
    const [offset, setOffset] = useState(0);
    const limit = 30; // Количество элементов на странице

    // функция загрузки данных пагинации
    const loadMore = () => {
        setOffset(prevOffset => prevOffset + limit);
    };


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
        });

        getFilterDiscipline((res) => {
            if (res.error) {
                setTextError(getTextError(res.error));
                setErrorActive(true);
            } else {
                setFilterDiscipline(res.response);
            }
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
        });

        getFilterGroups((res) => {
            if (res.error) {
                setTextError(getTextError(res.error));
                setErrorActive(true);
            } else {
                setFilterGroup(res.response);
            }
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
        setSearchTerm('');
        setOffset(0);

        // параметры для сброса
        setJournalParam({
            disciplineId: null,
            teacherId: null,
            departmentId: null,
            groupId: null,
            workTypeId: null
        })

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
        setInputValue('');

    };

    useEffect(() => {
        setIsLoading(true);
        const filteredResults = mainData.filter(item => {

            // Проверяем условие для каждого поля, по которому хотим искать
            return (
                item.student.fullName.toLowerCase().includes(searchTerm) ||
                item.group.title.toLowerCase().includes(searchTerm) ||
                item.work.type.title.toLowerCase().includes(searchTerm) ||
                item.student.status.title.toLowerCase().includes(searchTerm) ||
                item.discipline.title.toLowerCase().includes(searchTerm) ||
                `${item.employee.lastName} ${item.employee.firstName} ${item.employee.middleName}`.toLowerCase().includes(searchTerm) ||
                item.department.title.toLowerCase().includes(searchTerm) ||
                (item.work.title && item.work.title.toLowerCase().includes(searchTerm))
            );
        });
        setSearchResults(filteredResults);
        setIsLoading(false);
    }, [mainData])

    // Функция поиска
    const handleInputValue = (e) => {
        setSelectedDiscipline(null);
        setSelectedTeacher(null);
        setSelectedDepartment(null);
        setSelectedGroup(null);
        setSelectedWorkType(null);
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

        if (inputValue === '') {
            getDataAdminJournal(offset, limit, journalParam, (res) => {
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
            })
        } else {
            console.log(debouncedInputValue);
            searchOfWorks(offset, limit, debouncedInputValue, (res) => {
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
            })
            setIsLoading(false);

        }

    }, [offset, limit, journalParam, debouncedInputValue]);



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
                <div className='cart' >
                    <div className='data'>
                        {new Date(entries.work.registrationDate * 1000).toLocaleString("ru-ru")}
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
                </div>
            ))}

            {/* кнопка пагинации */}

            {hasMoreData && (
                <button className='btn-loadMore' onClick={loadMore}>
                    Загрузить ещё
                </button>
            )}


            {/* модальное окно ошибки */}
            <Error_modal active={errorActive} setActive={setErrorActive} text={textError} setText={setTextError} />
        </>
    );
}


export default User_main;