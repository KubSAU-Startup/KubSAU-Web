import React, { useEffect, useState } from 'react';
import '../admin/Admin_department.css'
import Modal from '../Modal/Modal';
import Loading from '../Modal/Loading';
import Error_modal from '../Modal/Error_modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { addNewDepartment, deleteDepartment, editDepartment, getAllDepartments, getTextError } from '../../network';
import Empty_modal from '../Modal/Empty_modal';
import User_header from './User_header';


function User_subject() {
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
    const [titleDepartment, setTitleDepartment] = useState(null);
    const [phoneDepartment, setPhoneDepartment] = useState(null);

    const [newTitle, setNewTitle] = useState(null);
    const [newPhone, setNewPhone] = useState(null);

    const [editId, setEditId] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    const [visibleItems, setVisibleItems] = useState(30);
    const [isPaginationVisible, setIsPaginationVisible] = useState(true);

    const [newDepartment, setNewDepartment] = useState({});

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

  
    return (
        <>
            {/* окно загрузки */}
            <Loading active={isLoading} setActive={setIsLoading} />

            {/* модальное окно ошибки */}
            <Error_modal active={errorActive} setActive={setErrorActive} text={textError} setText={setTextError} />

            <User_header />
            <div className='search-add'>
                <div className='admin-main-search'>
                    <input
                        type='text'
                        value={searchTerm}
                        onChange={handleChange}
                        placeholder='Поиск...'
                    />
                </div>
                <button className='add-department' onClick={() => setModalActive(true)}>
                    <FontAwesomeIcon icon={faPlusCircle} />
                </button>
            </div>

            {searchResults.slice(0, visibleItems).map(res => (
                <div className='cart-department' key={res.id}>
                    <div className='data-department'>
                        <p><span>Кафедра: </span>{res.title}</p>
                        <p><span>Номер телефона: </span>{res.phone}</p>
                    </div>
                    
                </div>
            ))}
            {/* кнопка пагинации */}
            {isPaginationVisible && (
                <button className='btn-loadMore' onClick={loadMore}>
                    Загрузить ещё
                </button>
            )}
            
        </>
    )
}

export default User_subject;