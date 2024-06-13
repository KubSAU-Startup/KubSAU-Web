import React, { useState, useEffect } from 'react';
import User_header from './User_header';
import '../admin/Admin_students.css'
import { getAllDisciplines, getTextError } from '../../network';
import Loading from '../Modal/Loading';
import Error_modal from '../Modal/Error_modal';
import Error_empty from '../Modal/Error_empty';

function User_subject() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [searchResults, setSearchResults] = useState([]);
    const [errorActive, setErrorActive] = useState(false);
    const [textError, setTextError] = useState('');
    const [codeText, setCodeText] = useState('');
    const [errorEmptyActive, setErrorEmptyActive] = useState(false);
    const [visibleItems, setVisibleItems] = useState(30);
    const [isPaginationVisible, setIsPaginationVisible] = useState(true);
    const [allDisciplines, setAllDisciplines] = useState([]);

    // получение данных о дисциплинах
    useEffect(() => {
        setVisibleItems(30);
        setIsLoading(true);
        getAllDisciplines((res) => {
            if (res.error) {
                setTextError(getTextError(res.error));
                setErrorActive(true);
            } else {
                setAllDisciplines(res.response);
                setSearchResults(res.response);
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
        setSearchTerm(e.target.value);
        setIsLoading(true);
        const filteredResults = allDisciplines.filter(item => {

            // Проверяем условие для каждого поля, по которому хотим искать
            return (
                item.title.toLowerCase().includes(searchTerm)
            );
        });
        setSearchResults(filteredResults);
        setIsLoading(false);
    };

    // функция пагинации
    const loadMore = () => {
        setVisibleItems(prevVisibleItems => prevVisibleItems + 30);
    };

    return (
        <>
            {/* компонент загрузки */}
            <Loading active={isLoading} setActive={setIsLoading} />

            {/* окна ошибок */}
            <Error_modal active={errorActive} setActive={setErrorActive} text={textError} setText={setTextError} />
            <Error_empty active={errorEmptyActive} text={textError} codeText={codeText} />

            {/* шапка */}
            <User_header />
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

                {/* вывод всех дисциплин */}
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
                )}</div></>
    );
}

export default User_subject;