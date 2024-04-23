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


function Admin_department() {
    const [modalActive, setModalActive] = useState(false);
    const [modalEditActive, setModalEditActive] = useState(false);
    const [modalDeleteActive, setModalDeleteActive] = useState(false);
    const [allDepartments, setAllDepartments] = useState({
        response: [],
        error: null,
        success: true
    });
    const [searchResults, setSearchResults] = useState([]);
    // const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [errorActive, setErrorActive] = useState(false);
    const [textError, setTextError] = useState('');
    const [getProgId, setGetProgId] = useState(null);
    const [cartStates, setCartStates] = useState({});
    const [titleDepartment, setTitleDepartment] = useState(null);
    const [phoneDepartment, setPhoneDepartment] = useState(null);

    const [newTitle, setNewTitle] = useState(null);
    const [newPhone, setNewPhone] = useState(null);

    const [editId, setEditId] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    const [visibleItems, setVisibleItems] = useState(10);
    const [isPaginationVisible, setIsPaginationVisible] = useState(true);

    useEffect(() => {
        setVisibleItems(10);


        getAllDepartments((res) => {
            if (res.error) {
                setTextError(getTextError(res.error));
                setErrorActive(true);
                setIsLoading(false);

            } else {
                setAllDepartments(res);
                setSearchResults(res.response.reverse());
                setIsLoading(false);
                console.log(res);
            }
        })

    }, []);

    const handleChange = (e) => {
        setVisibleItems(10);
        setSearchTerm(e.target.value);
        const filtered = allDepartments.response.filter(dep =>
            dep.title.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setSearchResults(filtered);
    };

    const handleSettingClick = (cartId) => {

        setCartStates(prevCartStates => ({
            ...prevCartStates,
            [cartId]: !prevCartStates[cartId],
        }));
    };

    const addDepartment = () => {
        addNewDepartment(titleDepartment, phoneDepartment, (res) => {
            console.log(res)
        })
        window.location.reload();
    }

    // функция пагинации
    const loadMore = () => {
        setVisibleItems(prevVisibleItems => prevVisibleItems + 10);
    };

    //скрытие кнопки пагинации, если закончились данные для отображения
    useEffect(() => {

        if (searchResults.length <= visibleItems) {
            setIsPaginationVisible(false); // Скрыть кнопку пагинации
        } else {
            setIsPaginationVisible(true); // Показать 
        }
    }, [searchResults, visibleItems]);

    function editData(index, title, phone) {
        editDepartment(index, title, phone, (res) => {
            console.log(res);

        });
        // window.location.reload()
    }

    async function deleteData(index) {
        await deleteDepartment(index, (res) => {
            console.log(res.data.success);

        });
        window.location.reload()
    }

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
                        placeholder='Поиск по названию...'
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
                    <button
                        className='department-setting'
                        onClick={() => handleSettingClick(res.id)}
                    >
                        <img src={require('../../img/setting.png')} alt='setting' />
                    </button>
                    <div className={`button-edit-delete ${cartStates[res.id] ? 'active' : ''}`}>
                        <button onClick={() => {
                            setModalEditActive(true);
                            setEditId(res.id);
                            allDepartments.response.filter(r => r.id === res.id).map(r => setNewTitle(r.title));
                            allDepartments.response.filter(r => r.id === res.id).map(r => setNewPhone(r.phone));
                        }}>
                            <img src={require('../../img/edit.png')} alt='edit' />
                        </button>
                        <button onClick={() => { setModalDeleteActive(true); setDeleteId(res.id) }}>
                            <img src={require('../../img/delete.png')} alt='delete' />
                        </button>
                    </div>
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
                    <div className='input-conteiner'>
                        <input type='text' className='name-dapartment' placeholder=' ' value={titleDepartment} onChange={e => setTitleDepartment(e.target.value)} />
                        <label className='label-name'>Название кафедры</label>
                    </div>
                    <div className='input-conteiner'>
                        <input type='text' className='phone-dapartment' placeholder=' ' value={phoneDepartment} onChange={e => setPhoneDepartment(e.target.value)} />
                        <label className='label-name'>Номер телефона</label>
                    </div>
                </div>
                <div className='modal-button'>
                    <button onClick={() => { addDepartment(); setModalActive(false); }}>Сохранить</button>
                    <button onClick={() => { setModalActive(false); }}>Отмена</button>
                </div>
            </Empty_modal>
            <Empty_modal active={modalEditActive} setActive={setModalEditActive} >
                <div className='modal-department'>
                    <div className='input-conteiner'>
                        <input type='text' className='name-dapartment' placeholder=' ' value={newTitle} onChange={e => setNewTitle(e.target.value)} />
                        <label className='label-name'>Название кафедры</label>
                    </div>
                    <div className='input-conteiner'>
                        <input type='text' className='phone-dapartment' placeholder=' ' value={newPhone} onChange={e => setNewPhone(e.target.value)} />
                        <label className='label-name'>Номер телефона</label>
                    </div>
                </div>
                <div className='modal-button'>
                    <button onClick={() => { editData(editId, newTitle, newPhone); setModalEditActive(false); }}>Сохранить</button>
                    <button onClick={() => { setModalEditActive(false); }}>Отмена</button>
                </div>
            </Empty_modal>
            <Empty_modal active={modalDeleteActive} setActive={setModalDeleteActive} >
                <div className='content-delete'>
                    <p className='text-delete'>Вы уверены, что хотите удалить?</p>
                    <div className='modal-button'>
                        <button onClick={() => { deleteData(deleteId); setModalDeleteActive(false); }}>Удалить</button>
                        <button onClick={() => { setModalDeleteActive(false); }}>Отмена</button>
                    </div>
                </div>
            </Empty_modal>
        </>
    )
}

export default Admin_department;
