import React, { useEffect, useState } from 'react';
import './Admin_main.css';
import Admin_header from './Admin_header';
import { getAllDepartments, getDataAdminJournal, getTextError, getFilterWorkType, getFilterDiscipline, getFilterEmployees, getFilterGroups, getFilterDepartments, getAllStudents } from '../../network';
import Select from 'react-select';
import Error_modal from '../Modal/Error_modal';
import { customStyles } from '../Select_style/Select_style';
import Loading from '../Modal/Loading';

function Admin_main() {
    const [errorActive, setErrorActive] = useState(false);
    const [textError, setTextError] = useState('');
    const [selectedWorkType, setSelectedWorkType] = useState(null);
    const [selectedDiscipline, setSelectedDiscipline] = useState(null);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPaginationVisible, setIsPaginationVisible] = useState(true);

    // переменные для получения фильтров из бэка
    const [filterWorkType, setFilterWorkType] = useState([]);
    const [filterDiscipline, setFilterDiscipline] = useState([]);
    const [filterEmployees, setFilterEmployees] = useState([]);
    const [filterGroup, setFilterGroup] = useState([]);
    const [filterDepartments, setFilterDepartments] = useState([]);

    // переменная для получения данных карточек из бэка
    const [mainData, setMainData] = useState([]);

    // переменная для получения всех студентов из бэка
    const [allStudent, setAllStudent] = useState([]);

    // переменная поиска
    const [searchResults, setSearchResults] = useState([]);

    // переменная количество показываемых элементов пагинации
    const [visibleItems, setVisibleItems] = useState();

    // перменная запроса на поиск
    const [searchTerm, setSearchTerm] = useState('');

    // функция загрузки данных пагинации
    const loadMore = () => {
        setVisibleItems(prevVisibleItems => prevVisibleItems + 5);
    };

    // получение данных для фильтров с бэка
    useEffect(() => {
        setVisibleItems(5);
        getFilterWorkType((res) => {
            if (res.error) {
                setTextError(getTextError(res.error));
                setErrorActive(true);
                setIsLoading(false);

            } else {
                setFilterWorkType(res.response);
                setIsLoading(false);
            }
        });

        getFilterDiscipline((res) => {
            if (res.error) {
                setTextError(getTextError(res.error));
                setErrorActive(true);
                setIsLoading(false);

            } else {
                setFilterDiscipline(res.response);
                setIsLoading(false);
            }
        });

        getFilterEmployees((res) => {
            if (res.error) {
                setTextError(getTextError(res.error));
                setErrorActive(true);
                setIsLoading(false);

            } else {
                setFilterEmployees(res.response);
                setIsLoading(false);
            }
        });

        getFilterGroups((res) => {
            if (res.error) {
                setTextError(getTextError(res.error));
                setErrorActive(true);
                setIsLoading(false);

            } else {
                setFilterGroup(res.response);
                setIsLoading(false);
            }
        });
        getFilterDepartments((res) => {
            if (res.error) {
                setTextError(getTextError(res.error));
                setErrorActive(true);
                setIsLoading(false);

            } else {
                setFilterDepartments(res.response);
                setIsLoading(false);
            }
        });
        getAllStudents((res) => {
            if (res.error) {
                setTextError(getTextError(res.error));
                setErrorActive(true);
                setIsLoading(false);

            } else {
                setAllStudent(res.response);
                setIsLoading(false);
            }
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

    // функция сброса фильтров
    const resetFilters = () => {
        setIsLoading(true);
        setSelectedWorkType(null);
        setSelectedDiscipline(null);
        setSelectedTeacher(null);
        setSelectedDepartment(null);
        setSelectedGroup(null);

        // параметры для сброса
        const journalParam = {
            disciplineId: null,
            teacherId: null,
            departmentId: null,
            groupId: null,
            workTypeId: null
        }
        getDataAdminJournal(journalParam, (res) => {

            if (res.error) {
                setTextError(getTextError(res.error));
                setErrorActive(true);
                setIsLoading(false);
            } else {
                setMainData(res.response.journal)
                setSearchResults(res.response.journal);
                setIsLoading(false);
            }
        })
    };

    // функция фильтрации данных
    const getParams = () => {
        setIsLoading(true);
        const journalParam = {
            disciplineId: selectedDiscipline ? selectedDiscipline.value : null,
            teacherId: selectedTeacher ? selectedTeacher.value : null,
            departmentId: selectedDepartment ? selectedDepartment.value : null,
            groupId: selectedGroup ? selectedGroup.value : null,
            workTypeId: selectedWorkType ? selectedWorkType.value : null,
        };

        console.log(journalParam)
        getDataAdminJournal(journalParam, (res) => {
            if (res.error) {
                setTextError(getTextError(res.error));
                setErrorActive(true);
                setIsLoading(false);
            } else {
                setMainData(res.response.journal)
                setSearchResults(res.response.journal);
                setIsLoading(false);
            }
        })
    }

    // функция получения данных для заполнения журнала
    useEffect(() => {
        setIsLoading(true);
        const journalParam = {
            disciplineId: null,
            teacherId: null,
            departmentId: null,
            groupId: null,
            workTypeId: null
        }
        getDataAdminJournal(journalParam, (res) => {
            if (res.error) {
                setTextError(getTextError(res.error));
                setErrorActive(true);
                setIsLoading(false);
            } else {
                setMainData(res.response.journal)
                setSearchResults(res.response.journal);
                setIsLoading(false);
            }
        })
    }, []);

    // функция поиска
    const handleChange = (e) => {
        setVisibleItems(5);
        const searchTerm = e.target.value.toLowerCase();
        setSearchTerm(searchTerm);

        const results = mainData.response.journal.filter(journal =>
            journal.student.fullName.toLowerCase().includes(searchTerm)
        );
        setSearchResults(results);
    };

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
            <Admin_header />

            {/* поиск */}
            <div className='admin-main-search'>
                <input
                    type='text'
                    value={searchTerm}
                    onChange={handleChange}
                    placeholder='Поиск по ФИО студента...'
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
            {searchResults.slice(0, visibleItems).map(journal => (
                <div className='cart' >
                    <div className='data'>
                        {new Date(journal.work.registrationDate * 1000).toLocaleString("ru-ru")}
                    </div>
                    <div className='content'>
                        <div className='col1'>
                            <p><span>ФИО:</span> {journal.student.fullName}</p>
                            <p><span>Группа:</span> {journal.group.title}</p>
                            <p><span>Тип работы:</span> {journal.work.type.title}</p>
                            <p><span>Статус:</span> {journal.student.status.title}</p>
                        </div>
                        <div className='col2'>
                            <p><span>Дисциплина:</span> {journal.discipline.title}</p>
                            <p><span>Преподаватель:</span> {journal.employee.lastName} {journal.employee.firstName} {journal.employee.middleName}</p>
                            <p><span>Кафедра:</span> {journal.department.title}</p>
                            {journal.work.title && <p><span>Название:</span> {journal.work.title}</p>}
                        </div>
                    </div>
                </div>
            ))}

            {/* кнопка пагинации */}
            {isPaginationVisible && (
                <button className='btn-loadMore' onClick={loadMore}>
                    Загрузить ещё
                </button>)}

            {/* модальное окно ошибки */}
            <Error_modal active={errorActive} setActive={setErrorActive} text={textError} setText={setTextError} />
        </>
    );
}

export default Admin_main;
