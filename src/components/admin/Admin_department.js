import React, { useEffect, useState } from 'react';
import Admin_header from './Admin_header';
import './Admin_department.css'
import Modal from '../Modal/Modal';
import Loading from '../Modal/Loading';
import Error_modal from '../Modal/Error_modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { addNewDepartment, getAllDepartments, getTextError } from '../../network';
import Empty_modal from '../Modal/Empty_modal';


function Admin_department() {
    const [modalActive, setModalActive] = useState(false);
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

    useEffect(() => {
        getAllDepartments((res) => {
            if (res.error) {
                setTextError(getTextError(res.error));
                setErrorActive(true);
                setIsLoading(false);

            } else {
                setAllDepartments(res);
                setSearchResults(res.response);
                setIsLoading(false);
            }
        })

    }, []);

    const handleChange = (e) => {
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

            {searchResults.map(res => (
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
                        <button>
                            <img src={require('../../img/edit.png')} alt='edit' />
                        </button>
                        <button>
                            <img src={require('../../img/delete.png')} alt='delete' />
                        </button>
                    </div>
                </div>
            ))}
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
        </>
    )
}

export default Admin_department;
