import React, { useState, useEffect } from 'react';
import Admin_header from './Admin_header';
import './Admin_direction.css'
import Select from 'react-select';
import Modal from '../Modal/Modal';
import { customStyles } from '../Select_style/Select_style';
import { customStylesModal } from '../Select_style/Select_style';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { getAllDirectivities, getTextError } from '../../network';
import Loading from '../Modal/Loading';
import Error_modal from '../Modal/Error_modal';

function Admin_direction() {
    const [modalActive, setModalActive] = useState(false);
    const [userStates, setUserStates] = useState({});
    const [allUsers, setAllUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
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
    const [filterData, setFilterData] = useState([]);

    const [searchDone, setSearchDone] = useState(false);
    const [filterDone, setFilterDone] = useState(false);
    const [visibleItems, setVisibleItems] = useState(30);
    const [isPaginationVisible, setIsPaginationVisible] = useState(true);

    const [modalIdGroup, setModalIdGroup] = useState(null);
    const [modalDirectioin, setModalDirection] = useState(null);
    const [modalDirectivity, setModalDirectivity] = useState(null);
    const [modalProgram, setModalProgram] = useState(null);

    // const [isSetOpen, setIsSetOpen] = useState(false);
    // const [selectedItemId, setSelectedItemId] = useState(null);

    // const openModal = (itemId) => {
    //     setSelectedItemId(itemId);
    //     setIsSetOpen(true);
    // };

    // const closeModal = () => {
    //     setIsSetOpen(false);
    // };

    // useEffect(() => {
    //     // Функция, которая вызывается при клике вне меню
    //     const handleClickOutside = (event) => {
    //         if (event.srcElement.offsetParent && !(event.srcElement.offsetParent.className === 'qr-setting')) {
    //             closeModal();
    //         }
    //     };

    //     // Добавление обработчика события клика для всего документа
    //     document.addEventListener("click", handleClickOutside);

    //     // Очистка обработчика при размонтировании компонента
    //     return () => {
    //         document.removeEventListener("click", handleClickOutside);
    //     };
    // }, []);


    useEffect(() => {
        setVisibleItems(30);
        setIsLoading(true);
        getAllDirectivities(true, (res) => {
            if (res.error) {
                setTextError(getTextError(res.error));
                setErrorActive(true);
            } else {
                setAllDirectivities(res.response);
                setSearchResults(res.response.directivities);
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
        setSearchDone(searchTerm !== null ? true : false);

        setIsLoading(false);
    };

    const getParams = () => {
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
    }

    const resetParams = () => {
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
    }

    // функция пагинации
    const loadMore = () => {
        setVisibleItems(prevVisibleItems => prevVisibleItems + 30);
    };

    const handleSettingClick = (userId) => {
        setUserStates(prevUserStates => ({
            ...prevUserStates,
            [userId]: !prevUserStates[userId],
        }));
    };
    function handleFilterDirectivity(data) {
        setFilterDirectivity(data);
    }

    function handleFilterDirection(data) {
        setFilterDirection(data);
    }

    function handleFilterGrade(data) {
        setFilterGrade(data);
    }

    function handleModalIdGroup(data) {
        setModalIdGroup(data);
    }

    function handleModalDirection(data) {
        setModalDirection(data);
    }

    function handleModalDirectivity(data) {
        setModalDirectivity(data);
    }

    function handleModalProgram(data) {
        setModalProgram(data);
    }
    return (
        <>
            <Loading active={isLoading} setActive={setIsLoading} />
            <Error_modal active={errorActive} setActive={setErrorActive} text={textError} setText={setTextError} />

            <Admin_header />
            <div className='admin-main-search'>
                <input
                    type='text'
                    value={searchTerm}
                    onChange={handleChange}
                    placeholder='Поиск...'
                />
            </div>
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


                <button className='get-params' type='submit' onClick={getParams}>Применить</button>
                <button className='delete-params' onClick={resetParams}>Сбросить</button>

            </div>

            {/* <button className='add-student' onClick={() => setModalActive(true)}>
                <FontAwesomeIcon icon={faPlusCircle} />
            </button> */}
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
                    {/* <button
                        className='qr-setting'
                        onClick={() => {
                            if (isSetOpen === true && user.id !== selectedItemId) {
                                closeModal();
                                openModal(user.id);
                            }
                            else if (isSetOpen === true) {
                                closeModal();
                            }
                            else {
                                openModal(user.id);
                            }
                        }}
                    // className='direction-setting'
                    // onClick={() => handleSettingClick(user.id)}
                    >
                        <img src={require('../../img/setting.png')} alt='setting' />
                    </button>
                    {isSetOpen && selectedItemId === user.id && (
                        <div className={`button-edit-delete ${isSetOpen && selectedItemId === user.id ? 'active' : ''}`}>
                        <button>
                            <img src={require('../../img/edit.png')} alt='edit' />
                        </button>
                        <button>
                            <img src={require('../../img/delete.png')} alt='delete' />
                        </button>
                    </div>)} */}
                </div>
            ))}
            {/* кнопка пагинации */}
            {isPaginationVisible && (
                <button className='btn-loadMore' onClick={loadMore}>
                    Загрузить ещё
                </button>
            )}
            {/* <Modal active={modalActive} setActive={setModalActive}>
                <div className='input-conteiner'>
                    <input type='text' className='name-direction' placeholder=' ' />
                    <label className='label-name'>Название направления</label>
                </div>
                <div className='input-conteiner'>
                    <input type='text' className='name-direction' placeholder=' ' />
                    <label className='label-name'>Название направленности</label>
                </div>
                <div className='input-conteiner'>
                    <input type='text' className='name-direction' placeholder=' ' />
                    <label className='label-name'>Аббревиатура направления</label>
                </div>

                <Select
                    styles={customStylesModal}
                    placeholder="Программа"
                    value={modalProgram}
                    onChange={handleModalProgram}
                    isSearchable={true}
                    isMulti={true}
                    options={allUsers.map(user => ({
                        value: user.email,
                        label: user.email,
                    }))}
                />


            </Modal> */}
        </>

    );
}

export default Admin_direction;