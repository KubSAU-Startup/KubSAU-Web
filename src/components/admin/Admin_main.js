import React, { useEffect, useState } from 'react';
import './Admin_main.css';
import Admin_header from './Admin_header';
import { getDataFilters } from '../../network';
import { getDataAdminJournal } from '../../network';
import Select from 'react-select';
import Error_modal from '../Modal/Error_modal';
import { getTextError } from '../../network';
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
    });

    const [searchResults, setSearchResults] = useState([]);
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
        setVisibleItems(5);
        getDataFilters((res) => {
            if (res.error) {
                setTextError(getTextError(res.error));
                setErrorActive(true);
                setIsLoading(false);

            } else {
                setFilter(res);
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

    const resetFilters = () => {
        setIsLoading(true);
        setSelectedWorkType(null);
        setSelectedDiscipline(null);
        setSelectedTeacher(null);
        setSelectedDepartment(null);
        setSelectedGroup(null);

        const journalParam = {
            disciplineId: null,
            teacherId: null,
            departmentId: null,
            groupId: null,
            workTypeId: null
        }
        getDataAdminJournal(journalParam, (data) => {

            if (data.error) {
                setTextError(getTextError(data.error));
                setErrorActive(true);
                setIsLoading(false);
            } else {
                setMainData(data)
                setSearchResults(data.response.journal);
                setIsLoading(false);
            }

        })

    };

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
        getDataAdminJournal(journalParam, (data) => {
            if (data.error) {
                setTextError(getTextError(data.error));
                setErrorActive(true);
                setIsLoading(false);
            } else {
                setMainData(data)
                setSearchResults(data.response.journal);
                setIsLoading(false);
            }
        })
    }

    useEffect(() => {
        setIsLoading(true);
        const journalParam = {
            disciplineId: null,
            teacherId: null,
            departmentId: null,
            groupId: null,
            workTypeId: null
        }
        getDataAdminJournal(journalParam, (data) => {
            if (data.error) {
                setTextError(getTextError(data.error));
                setErrorActive(true);
                setIsLoading(false);
            } else {
                setMainData(data)
                setSearchResults(data.response.journal);
                setIsLoading(false);
            }
        })
    }, []);

    const handleChange = (e) => {
        setVisibleItems(5);
        const searchTerm = e.target.value.toLowerCase();
        setSearchTerm(searchTerm);

        const results = mainData.response.journal.filter(journal =>
            journal.student.fullName.toLowerCase().includes(searchTerm)
        );
        setSearchResults(results);
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

    return (
        <>
            <Loading active={isLoading} setActive={setIsLoading} />

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
                        styles={customStyles}
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
            {isPaginationVisible && (
                <button className='btn-loadMore' onClick={loadMore}>
                    Загрузить ещё
                </button>)}
            <Error_modal active={errorActive} setActive={setErrorActive} text={textError} setText={setTextError} />

        </>
    );
}

export default Admin_main;
