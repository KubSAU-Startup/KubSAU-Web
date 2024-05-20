import React, { useState, useEffect } from 'react';
import User_header from './User_header';
import '../admin/Admin_students.css'
import Select from 'react-select';
import { customStyles } from '../Select_style/Select_style';
import { getAllDirectivities, getAllDisciplines, getTextError } from '../../network';
import Loading from '../Modal/Loading';
import Error_modal from '../Modal/Error_modal';



function User_subject() {
    const [searchTerm, setSearchTerm] = useState('');

    const [filterSemester, setfilterSemester] = useState(null);
    const [filterDirection, setFilterDirection] = useState(null);
    const [filterGrade, setFilterGrade] = useState(null);
    const [allDirectivities, setAllDirectivities] = useState({
        directivities: [],
        heads: [],
        grades: []
    });
    const [isLoading, setIsLoading] = useState(true);
    const [searchResults, setSearchResults] = useState([]);
    const [errorActive, setErrorActive] = useState(false);
    const [textError, setTextError] = useState('');
    const [filterData, setFilterData] = useState([]);

    const [searchDone, setSearchDone] = useState(false);
    const [visibleItems, setVisibleItems] = useState(30);
    const [isPaginationVisible, setIsPaginationVisible] = useState(true);
    const [allDisciplines, setAllDisciplines] = useState([]);

    useEffect(() => {
        setVisibleItems(30);
        setIsLoading(true);
        getAllDirectivities(true, (res) => {
            if (res.error) {
                setTextError(getTextError(res.error));
                setErrorActive(true);
            } else {
                setAllDirectivities(res.response);
                // setSearchResults(res.response.directivities);
            }
            setIsLoading(false);
        })
        getAllDisciplines((res) => {
            if (res.error) {
                setTextError(getTextError(res.error));
                setErrorActive(true);
            } else {
                setAllDisciplines(res.response);
                setSearchResults(res.response);
            }
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

    // Функция поиска
    const handleChange = (e) => {

        const searchTerm = e.target.value.toLowerCase(); // Приводим введенный текст к нижнему регистру для удобства сравнения

        setSearchTerm(e.target.value);
        setIsLoading(true);

        let filteredResults = [...allDirectivities.directivities]; // Создаем копию исходных данных для фильтрации
        if (filterSemester !== null) {
            filteredResults = filteredResults.filter(res => res.id === filterSemester.value);
        }
        if (filterDirection !== null) {
            filteredResults = filteredResults.filter(res => res.headId === filterDirection.value);
        }
        if (filterGrade !== null) {
            filteredResults = filteredResults.filter(res => res.gradeId === filterGrade.value);
        }

        filteredResults = filteredResults.filter(item => {

            // Проверяем условие для каждого поля, по которому хотим искать
            return (
                item.title.toLowerCase().includes(searchTerm) ||
                (item.headId && allDirectivities.heads.find((el) => el.id === item.headId)?.title.toLowerCase().includes(searchTerm)) ||
                (item.headId && allDirectivities.grades.find((el) => el.id === item.gradeId)?.title.toLowerCase().includes(searchTerm))
            );
        });
        setSearchResults(filteredResults);
        setSearchDone(searchTerm !== null ? true : false);

        setIsLoading(false);
    };


    const getParams = () => {
        let filteredResults = [...allDirectivities.directivities]; // Создаем копию исходных данных для фильтрации

        if (filterSemester !== null) {
            filteredResults = filteredResults.filter(res => res.id === filterSemester.value);
        }
        if (filterDirection !== null) {
            filteredResults = filteredResults.filter(res => res.headId === filterDirection.value);
        }
        if (filterGrade !== null) {
            filteredResults = filteredResults.filter(res => res.gradeId === filterGrade.value);
        }
        setFilterData(filteredResults);
        setSearchResults(filteredResults); // Присваиваем результаты фильтрации обратно в состояние
        console.log(filteredResults)
    }

    const resetParams = () => {
        setFilterDirection(null);
        setfilterSemester(null);
        setFilterGrade(null);
        setSearchTerm('');
        setSearchResults(allDirectivities.directivities);
    }
    // функция пагинации
    const loadMore = () => {
        setVisibleItems(prevVisibleItems => prevVisibleItems + 30);
    };


    function handleFilterSemester(data) {
        setfilterSemester(data);
    }

    function handleFilterDirection(data) {
        setFilterDirection(data);
    }

    function handleFilterGrade(data) {
        setFilterGrade(data);
    }
    // массив для семестров
    const dataSemester = [{ value: 1, label: 1 },
    { value: 2, label: 2 },
    { value: 3, label: 3 },
    { value: 4, label: 4 },
    { value: 5, label: 5 },
    { value: 6, label: 6 },
    { value: 7, label: 7 },
    { value: 8, label: 8 },
    { value: 9, label: 9 },
    { value: 30, label: 30 },
    { value: 11, label: 11 },
    { value: 12, label: 12 }];


    return (
        <>
            <Loading active={isLoading} setActive={setIsLoading} />
            <Error_modal active={errorActive} setActive={setErrorActive} text={textError} setText={setTextError} />

            <User_header />
            <div className='admin-main-search'>
                <input
                    type='text'
                    value={searchTerm}
                    onChange={handleChange}
                    placeholder='Поиск...'
                />
            </div>

            {searchResults.slice(0, visibleItems).map(res => (
                <div className='cart-stud' key={res.id}>
                    <div className='content'>
                            <p><span>Название:</span> {res.title}</p>                        
                    </div>
                </div>
            ))}
            {/* кнопка пагинации */}
            {isPaginationVisible && (
                <button className='btn-loadMore' onClick={loadMore}>
                    Загрузить ещё
                </button>
            )}</>
    );
}

export default User_subject;