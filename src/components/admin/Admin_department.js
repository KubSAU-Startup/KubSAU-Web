import React, { useEffect, useState } from 'react';
import Admin_header from './Admin_header';
import './Admin_department.css'
import Modal from '../Modal/Modal';
import Loading from '../Modal/Loading';
import Error_modal from '../Modal/Error_modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { addNewDepartment, deleteDepartment, editDepartment, getAllDepartments, getTextError } from '../../network';
import Empty_modal from '../Modal/Empty_modal';
import MaskInput from 'react-maskinput';

function Admin_department() {
    const [modalActive, setModalActive] = useState(false);
    const [modalEditActive, setModalEditActive] = useState(false);
    const [modalDeleteActive, setModalDeleteActive] = useState(false);
    const [allDepartments, setAllDepartments] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    // const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [errorActive, setErrorActive] = useState(false);
    const [textError, setTextError] = useState('');
    // const [getProgId, setGetProgId] = useState(null);
    const [cartStates, setCartStates] = useState({});
    const [titleDepartment, setTitleDepartment] = useState('');
    const [phoneDepartment, setPhoneDepartment] = useState('');
    const [errorPhone, setErrorPhone] = useState('');
    const [errorTitle, setErrorTitle] = useState('');

    const [newTitle, setNewTitle] = useState('');
    const [newPhone, setNewPhone] = useState('');

    const [editId, setEditId] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    const [visibleItems, setVisibleItems] = useState(30);
    const [isPaginationVisible, setIsPaginationVisible] = useState(true);

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

    useEffect(() => {
        setVisibleItems(30);


        getAllDepartments((res) => {
            if (res.error) {
                setTextError(getTextError(res.error));
                setErrorActive(true);
            } else {
                setAllDepartments(res.response);
                setSearchResults(res.response.reverse());
                console.log(searchResults);
            }
            setIsLoading(false);
        });

    }, []);

    // Функция поиска
    const handleChange = (e) => {
        const searchTerm = e.target.value.toLowerCase(); // Приводим введенный текст к нижнему регистру для удобства сравнения
        setSearchTerm(e.target.value);
        setIsLoading(true);
        const filteredResults = allDepartments.filter(item => {

            // Проверяем условие для каждого поля, по которому хотим искать
            return (
                item.title.toLowerCase().includes(searchTerm) ||
                item.phone.toLowerCase().includes(searchTerm)
            );
        });
        setSearchResults(filteredResults);
        setIsLoading(false);
    };

    const handleSettingClick = (cartId) => {

        setCartStates(prevCartStates => ({
            ...prevCartStates,
            [cartId]: !prevCartStates[cartId],
        }));
    };
    async function addDepartment() {
        setErrorTitle('');
        setErrorPhone('');
        if (titleDepartment === '' || phoneDepartment === '' || phoneDepartment === '+7 (___) ___-__-__') {

            if (titleDepartment === '') {
                setErrorTitle('Заполните название кафедры');
            }
            if (phoneDepartment === '' || phoneDepartment === '+7 (___) ___-__-__') {
                setErrorPhone('Заполните телефон кафедры');
            }

        } else {
            await addNewDepartment(titleDepartment, phoneDepartment, (res) => {
                if (res.success) {
                    // console.log('rfquhjweoruiqew', res.response);
                    // console.log('rfquhjweoruiqew', allDepartments);
                    setAllDepartments(prevData => [res.response, ...prevData]);
                } else {
                    console.log(res);
                }
            });
            setModalActive(false);
            document.body.style.overflow = 'auto';
            document.body.style.paddingRight = `0px`;
            setTitleDepartment('');
            setPhoneDepartment('');
            setErrorPhone('');
            setErrorTitle('');
        }
    }

    useEffect(() => {
        if (searchTerm) {
            const filteredResults = allDepartments.filter(item => {

                // Проверяем условие для каждого поля, по которому хотим искать
                return (
                    item.title.toLowerCase().includes(searchTerm) ||
                    item.phone.toLowerCase().includes(searchTerm)
                );
            });
            setSearchResults(filteredResults);
        } else {

            setSearchResults(allDepartments)

        }
    }, [allDepartments])

    async function editData(index, title, phone) {
        setErrorTitle('');
        setErrorPhone('');
        if (newTitle === '' || newPhone === '' || newPhone === '+7 (___) ___-__-__') {

            if (newTitle === '') {
                setErrorTitle('Заполните название кафедры');
            }
            if (newPhone === '' || newPhone === '+7 (___) ___-__-__') {
                setErrorPhone('Заполните телефон кафедры');
            }

        } else {
            await editDepartment(index, title, phone, (res) => {
                if (res.success) {

                    const editDepartments = allDepartments.map(elem => {
                        if (elem.id === index) {
                            return {
                                ...elem, // копируем все свойства из исходного объекта
                                title: title, // обновляем поле title
                                phone: phone // обновляем поле phone
                            };
                        } else {
                            return elem; // если элемент не подлежит изменению, возвращаем его без изменений
                        }
                    });

                    setAllDepartments(editDepartments);

                } else {
                    console.log(res.response);
                }
            });
            setModalEditActive(false);
            document.body.style.overflow = 'auto';
            document.body.style.paddingRight = `0px`;
            setNewTitle('');
            setNewPhone('');
            setErrorPhone('');
            setErrorTitle('');
        }

    }

    async function deleteData(index) {
        await deleteDepartment(index, (res) => {
            if (res.success) {
                console.log(res.response);
                setAllDepartments(allDepartments.filter((a) => a.id !== index));

            } else {
                console.log(res.response);
            }
        });

    }

    // функция пагинации
    const loadMore = () => {
        setVisibleItems(prevVisibleItems => prevVisibleItems + 30);
    };

    //скрытие кнопки пагинации, если закончились данные для отображения
    useEffect(() => {

        if (searchResults.length <= visibleItems) {
            setIsPaginationVisible(false); // Скрыть кнопку пагинации
        } else {
            setIsPaginationVisible(true); // Показать 
        }
    }, [searchResults, visibleItems]);
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

    return (
        <>
            {/* окно загрузки */}
            <Loading active={isLoading} setActive={setIsLoading} />

            {/* модальное окно ошибки */}
            <Error_modal active={errorActive} setActive={setErrorActive} text={textError} setText={setTextError} />

            <Admin_header />
            <div className='search-add'>
                <div className='admin-main-search'>
                    <input
                        type='text'
                        value={searchTerm}
                        onChange={handleChange}
                        placeholder='Поиск...'
                    />
                </div>
                <button className='add-student' onClick={() => {
                    setModalActive(true);
                    document.body.style.overflow = 'hidden';
                    document.body.style.paddingRight = `${scrollBarWidth}px`;

                }}>
                    <FontAwesomeIcon icon={faPlusCircle} />
                </button>
            </div>

            {searchResults.slice(0, visibleItems).map(res => (
                <div className='cart-stud' key={res.id}>
                    <div className='content'>
                        <div className='col1'>
                            <p><span>Кафедра: </span>{res.title}</p>

                        </div>
                        <div className='col2'>
                            <p><span>Номер телефона: </span>{res.phone}</p>

                        </div>

                    </div>
                    <button
                        className='qr-setting'
                        onClick={() => {
                            if (isSetOpen === true && res.id !== selectedItemId) {
                                closeModal();
                                openModal(res.id);
                            }
                            else if (isSetOpen === true) {
                                closeModal();
                            }
                            else {
                                openModal(res.id);
                            }
                        }}
                    // className='department-setting'
                    // onClick={() => handleSettingClick(res.id)}
                    >
                        <img src={require('../../img/setting.png')} alt='setting' />
                    </button>
                    {isSetOpen && selectedItemId === res.id && (
                        <div className={`button-edit-delete ${isSetOpen && selectedItemId === res.id ? 'active' : ''}`}>
                            {/* <div className={`button-edit-delete ${cartStates[res.id] ? 'active' : ''}`}> */}
                            <button onClick={() => {
                                document.body.style.overflow = 'hidden';
                                document.body.style.paddingRight = `${scrollBarWidth}px`;

                                setModalEditActive(true);
                                setEditId(res.id);
                                allDepartments.filter(r => r.id === res.id).map(r => setNewTitle(r.title));
                                allDepartments.filter(r => r.id === res.id).map(r => setNewPhone(r.phone));
                            }}>
                                <img src={require('../../img/edit.png')} alt='edit' />
                            </button>
                            <button onClick={() => {
                                document.body.style.overflow = 'hidden';
                                document.body.style.paddingRight = `${scrollBarWidth}px`;

                                setModalDeleteActive(true);
                                setDeleteId(res.id);
                            }}>
                                <img src={require('../../img/delete.png')} alt='delete' />
                            </button>
                        </div>)}
                </div>
            ))}
            {/* кнопка пагинации */}
            {isPaginationVisible && (
                <button className='btn-loadMore' onClick={loadMore}>
                    Загрузить ещё
                </button>
            )}
            <Empty_modal active={modalActive} setActive={setModalActive} >
                <div className='modal-department'>
                    <div>
                        <div className='input-conteiner'>
                            <input type='text' className='name-dapartment' placeholder=' ' value={titleDepartment} onChange={e => setTitleDepartment(e.target.value)} />
                            <label className='label-name'>Название кафедры</label>
                        </div>
                        {(errorTitle !== '') && <p className='inputModalError' >{errorTitle}</p>}

                    </div>
                    <div>

                        <div className='input-conteiner'>
                            <MaskInput alwaysShowMask mask={'+7 (000) 000-00-00'} size={20} showMask maskChar="_" className='phone-dapartment' placeholder=' ' value={phoneDepartment} onChange={e => setPhoneDepartment(e.target.value)} />
                            <label className='label-name'>Номер телефона</label>
                        </div>
                        {(errorPhone !== '') && <p className='inputModalError' >{errorPhone}</p>}

                    </div>
                </div>
                <div className='modal-button'>
                    <button onClick={() => {
                        addDepartment();
                    }}>Сохранить</button>
                    <button onClick={() => {
                        setModalActive(false); document.body.style.overflow = 'auto'; document.body.style.paddingRight = `0px`;
                    }}>Отмена</button>
                </div>
            </Empty_modal>
            <Empty_modal active={modalEditActive} setActive={setModalEditActive} >
                <div className='modal-department'>
                    <div>
                        <div className='input-conteiner'>
                            <input type='text' className='name-dapartment' placeholder=' ' value={newTitle} onChange={e => setNewTitle(e.target.value)} />
                            <label className='label-name'>Название кафедры</label>
                        </div>
                        {(errorTitle !== '') && <p className='inputModalError' >{errorTitle}</p>}

                    </div>
                    <div>
                        <div className='input-conteiner'>
                        <MaskInput alwaysShowMask mask={'+7 (000) 000-00-00'} size={20} showMask maskChar="_" className='phone-dapartment' placeholder=' ' value={newPhone} onChange={e => setNewPhone(e.target.value)} />

                            {/* <input type='text' className='phone-dapartment' placeholder=' ' value={newPhone} onChange={e => setNewPhone(e.target.value)} /> */}
                            <label className='label-name'>Номер телефона</label>
                        </div>
                        {(errorPhone !== '') && <p className='inputModalError' >{errorPhone}</p>}

                    </div>
                </div>
                <div className='modal-button'>
                    <button onClick={() => {
                        editData(editId, newTitle, newPhone);
                    }}>Сохранить</button>
                    <button onClick={() => {
                        setModalEditActive(false);
                        document.body.style.overflow = 'auto';
                        document.body.style.paddingRight = `0px`;
                        setErrorPhone('');
                        setErrorTitle('');
                        setTitleDepartment('');
                        setPhoneDepartment('');
                    }}>Отмена</button>
                </div>
            </Empty_modal>
            <Empty_modal active={modalDeleteActive} setActive={setModalDeleteActive} >
                <div className='content-delete'>
                    <p className='text-delete'>Вы уверены, что хотите удалить?</p>
                    <div className='modal-button'>
                        <button onClick={() => {
                            deleteData(deleteId);
                            setModalDeleteActive(false);

                        }}>Удалить</button>
                        <button onClick={() => {
                            setModalDeleteActive(false);
                            document.body.style.overflow = 'auto';
                            document.body.style.paddingRight = `0px`;
                            setErrorPhone('');
                            setErrorTitle('');
                            setNewPhone('');
                            setNewTitle('');
                        }}>Отмена</button>
                    </div>
                </div>
            </Empty_modal>
        </>
    )
}

export default Admin_department;
