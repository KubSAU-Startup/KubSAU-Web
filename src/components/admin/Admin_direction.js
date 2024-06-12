import React, { useState, useEffect } from 'react';
import Admin_header from './Admin_header';
import './Admin_direction.css'
import Select from 'react-select';
import { customStyles } from '../Select_style/Select_style';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faUndo } from '@fortawesome/free-solid-svg-icons';
import { getAllDirectivities, getTextError } from '../../network';
import Loading from '../Modal/Loading';
import Error_modal from '../Modal/Error_modal';
import Error_empty from '../Modal/Error_empty';

function Admin_direction() {

    const [searchTerm, setSearchTerm] = useState('');
    const [filterDirectivity, setFilterDirectivity] = useState(null);
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

    const [codeText, setCodeText] = useState('');
    const [errorEmptyActive, setErrorEmptyActive] = useState(false);
    const [visibleItems, setVisibleItems] = useState(30);
    const [isPaginationVisible, setIsPaginationVisible] = useState(true);

    useEffect(() => {
        setVisibleItems(30);
        setIsLoading(true);
        // получение данных о всех направлениях
        getAllDirectivities(true, (res) => {
            if (res.error) {
                setTextError(getTextError(res.error));
                setErrorActive(true);
            } else {
                setAllDirectivities(res.response);
                setSearchResults(res.response.directivities);
            }
            setIsLoading(false);
        }).catch((error) => {
            setTextError(getTextError(error));
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

    // Функция поиска
    const handleChange = (e) => {
        const searchTerm = e.target.value.toLowerCase(); // Приводим введенный текст к нижнему регистру для удобства сравнения
        setSearchTerm(searchTerm);
        setIsLoading(true);
        let filteredResults = [...allDirectivities.directivities]; // Создаем копию исходных данных для фильтрации
        if (filterDirectivity !== null) {
            filteredResults = filteredResults.filter(res => res.id === filterDirectivity.value);
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

        setIsLoading(false);
    };

    // функция фильтрации данных
    const getParams = () => {
        setIsLoading(true);
        let filteredResults = [...allDirectivities.directivities]; // Создаем копию исходных данных для фильтрации
        if (searchTerm) {

            filteredResults = filteredResults.filter(item => {

                // Проверяем условие для каждого поля, по которому хотим искать
                return (
                    item.title.toLowerCase().includes(searchTerm) ||
                    (item.headId && allDirectivities.heads.find((el) => el.id === item.headId)?.title.toLowerCase().includes(searchTerm)) ||
                    (item.headId && allDirectivities.grades.find((el) => el.id === item.gradeId)?.title.toLowerCase().includes(searchTerm))
                );
            });
        }
        if (filterDirectivity !== null) {
            filteredResults = filteredResults.filter(res => res.id === filterDirectivity.value);
        }
        if (filterDirection !== null) {
            filteredResults = filteredResults.filter(res => res.headId === filterDirection.value);
        }
        if (filterGrade !== null) {
            filteredResults = filteredResults.filter(res => res.gradeId === filterGrade.value);
        }
        setSearchResults(filteredResults); // Присваиваем результаты фильтрации обратно в состояние
        setIsLoading(false);
    }

    // очистка фильтров
    const resetParams = () => {
        setIsLoading(true);

        setFilterDirection(null);
        setFilterDirectivity(null);
        setFilterGrade(null);
        let filteredResults = [...allDirectivities.directivities]; // Создаем копию исходных данных для фильтрации
        if (searchTerm) {

            filteredResults = filteredResults.filter(item => {

                // Проверяем условие для каждого поля, по которому хотим искать
                return (
                    item.title.toLowerCase().includes(searchTerm) ||
                    (item.headId && allDirectivities.heads.find((el) => el.id === item.headId)?.title.toLowerCase().includes(searchTerm)) ||
                    (item.headId && allDirectivities.grades.find((el) => el.id === item.gradeId)?.title.toLowerCase().includes(searchTerm))
                );
            });
        }
        setSearchResults(filteredResults);
        setIsLoading(false);
    }

    // функция пагинации
    const loadMore = () => {
        setVisibleItems(prevVisibleItems => prevVisibleItems + 30);
    };

    //  функции для выбора данных в фильтрах
    function handleFilterDirectivity(data) {
        setFilterDirectivity(data);
    }
    function handleFilterDirection(data) {
        setFilterDirection(data);
    }
    function handleFilterGrade(data) {
        setFilterGrade(data);
    }

    return (
        <>
            {/* компонент загрузки экрана */}
            <Loading active={isLoading} setActive={setIsLoading} />

            {/* модальные окна ошибок */}
            <Error_modal active={errorActive} setActive={setErrorActive} text={textError} setText={setTextError} />
            <Error_empty active={errorEmptyActive} text={textError} codeText={codeText} />

            {/* шапка страницы */}
            <Admin_header />
            <div id='body-content'>
                {/* поиск */}
                <div className='admin-main-search'>
                    <input
                        type='text'
                        value={searchTerm}
                        onChange={handleChange}
                        placeholder='Поиск...'
                    />
                </div>
                {/* фильтры */}
                <div className='filters'>
                    <Select
                        styles={customStyles}
                        placeholder="Направление"
                        value={filterDirection}
                        onChange={handleFilterDirection}
                        isSearchable={true}
                        options={allDirectivities.heads.map(res => ({
                            value: res.id,
                            label: res.title,
                        }))}
                    />
                    <Select
                        styles={customStyles}
                        placeholder="Направленность"
                        value={filterDirectivity}
                        onChange={handleFilterDirectivity}
                        isSearchable={true}
                        options={allDirectivities.directivities.map(res => ({
                            value: res.id,
                            label: res.title,
                        }))}
                    />
                    <Select
                        styles={customStyles}
                        placeholder="Степень образованя"
                        value={filterGrade}
                        onChange={handleFilterGrade}
                        isSearchable={true}
                        options={allDirectivities.grades.map(res => ({
                            value: res.id,
                            label: res.title,
                        }))}
                    />


                    {/* кнопка применить фильтры */}
                    <button className='get-params' onClick={getParams} type='submit' ><FontAwesomeIcon icon={faFilter} /></button>
                    {/* очистить фильтры */}
                    <button className='delete-params' onClick={resetParams}><FontAwesomeIcon icon={faUndo} /></button>

                </div>

                {/* вывод данных на экран в виде карточек */}
                {searchResults.slice(0, visibleItems).map(res => (
                    <div className='cart-stud' key={res.id}>
                        <div className='content'>
                            <div className='col1'>
                                <p><span>Направление:</span> {res.headId && allDirectivities.heads.find(r => r.id === res.headId)?.title}</p>
                                <p><span>Степень образования:</span> {res.gradeId && allDirectivities.grades.find(r => r.id === res.gradeId)?.title}</p>
                            </div>
                            <div className='col2'>
                                <p><span>Направленность:</span> {res.title}</p>

                            </div>
                        </div>
                    </div>
                ))}
                {/* кнопка пагинации */}
                {isPaginationVisible && (
                    <button className='btn-loadMore' onClick={loadMore}>
                        Загрузить ещё
                    </button>
                )}</div>
            
        </>

    );
}

export default Admin_direction;