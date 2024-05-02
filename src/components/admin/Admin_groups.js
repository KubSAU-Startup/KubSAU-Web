import React, { useEffect, useState } from 'react';
import Admin_header from './Admin_header';
import Select from 'react-select';
import './Admin_department.css'
import Modal from '../Modal/Modal';
import Loading from '../Modal/Loading';
import Error_modal from '../Modal/Error_modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { addNewDepartment, addNewGroup, deleteDepartment, editDepartment, getAllDirectivities, getAllGroups, getAllHeads, getTextError } from '../../network';
import Empty_modal from '../Modal/Empty_modal';
import { customStylesModal, customStylesTypeOfWork } from '../Select_style/Select_style';

function Admin_groups() {
    const [modalActive, setModalActive] = useState(false);
    const [modalEditActive, setModalEditActive] = useState(false);
    const [modalDeleteActive, setModalDeleteActive] = useState(false);
    const [allGroups, setAllGroups] = useState([]);
    const [allDirectivities, setAllDirectivities] = useState([]);
    const [allHeads, setAllHeads] = useState([]);


    const [searchResults, setSearchResults] = useState([]);
    // const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [errorActive, setErrorActive] = useState(false);
    const [textError, setTextError] = useState('');
    // const [getProgId, setGetProgId] = useState(null);
    const [cartStates, setCartStates] = useState({});
    const [numberGroup, setNumberGroup] = useState('');
    const [phoneDepartment, setPhoneDepartment] = useState(null);

    const [newTitle, setNewTitle] = useState(null);
    const [newPhone, setNewPhone] = useState(null);

    const [head, setHead] = useState(null);
    const [direction, setDirection] = useState(null);

    const [abbGroup, setAbbGroup] = useState('');

    const [editId, setEditId] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    const [visibleItems, setVisibleItems] = useState(10);
    const [isPaginationVisible, setIsPaginationVisible] = useState(true);

    const [newDepartment, setNewDepartment] = useState({});

    useEffect(() => {
        setVisibleItems(10);
        getAllGroups((res) => {
            if (res.error) {
                setTextError(getTextError(res.error));
                setErrorActive(true);
            } else {
                setAllGroups(res.response);
                setSearchResults(res.response.reverse());
            }
            setIsLoading(false);
        });

        getAllDirectivities((res) => {
            if (res.error) {
                setTextError(getTextError(res.error));
                setErrorActive(true);
            } else {
                setAllDirectivities(res.response.directivities);
            }
            setIsLoading(false);
        });

        getAllHeads((res) => {
            if (res.error) {
                setTextError(getTextError(res.error));
                setErrorActive(true);
            } else {
                setAllHeads(res.response.heads);
            }
            setIsLoading(false);
        });

    }, []);

    // Функция поиска
    const handleChange = (e) => {
        const searchTerm = e.target.value.toLowerCase(); // Приводим введенный текст к нижнему регистру для удобства сравнения
        setSearchTerm(e.target.value);
        setIsLoading(true);
        const filteredResults = allGroups.filter(item => {

            // Проверяем условие для каждого поля, по которому хотим искать
            return (
                item.title.toLowerCase().includes(searchTerm) ||
                allDirectivities.find((el) => el.id === item.directivityId).title.toLowerCase().includes(searchTerm) ||
                allHeads.find((head) => head.id === allDirectivities.find((el) => el.id === item.directivityId).headId).title.toLowerCase().includes(searchTerm)
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
    async function addGroup() {
        const group = abbGroup + numberGroup;
        const dir = direction.value;
        await addNewGroup(group, dir,(res) => {
            if (res.success) {
                console.log('rfquhjweoruiqew', res.response);
                // console.log('rfquhjweoruiqew', allGroups);
                setAllGroups(prevData => [res.response, ...prevData]);             
            } else {
                console.log(res);
            }
        });
    }

    useEffect(() => {
        setSearchResults(allGroups)
    }, [allGroups])

    // async function editData(index, title, phone) {
    //     await editDepartment(index, title, phone, (res) => {
    //         if (res.success) {

    //             const editDepartments = allGroups.map(elem => {
    //                 if(elem.id === index) {
    //                     return {
    //                         ...elem, // копируем все свойства из исходного объекта
    //                         title: title, // обновляем поле title
    //                         phone: phone // обновляем поле phone
    //                     };
    //                 } else {
    //                     return elem; // если элемент не подлежит изменению, возвращаем его без изменений
    //                 }
    //             });

    //             setAllGroups(editDepartments);

    //         } else {
    //             console.log(res.response);
    //         }
    //     });

    // }

    // async function deleteData(index) {
    //     await deleteDepartment(index, (res) => {
    //         if (res.success) {
    //             console.log(res.response);
    //             setAllGroups(allGroups.filter((a)=> a.id !== index));

    //         } else {
    //             console.log(res.response);
    //         }
    //     });

    // }

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

    function handleHeadChange(data) {
        setHead(data);
        setAbbGroup(allHeads.find((el)=>el.id === data.value).abbreviation)
        setDirection(null);
    }
    function handleDirectionChange(data) {
        setDirection(data);
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
                        placeholder='Поиск...'
                    />
                </div>
                <button className='add-department' onClick={() => setModalActive(true)}>
                    <FontAwesomeIcon icon={faPlusCircle} />
                </button>
            </div>

            {searchResults.slice(0, visibleItems).map(res => (
                <div className='cart-stud' key={res.id}>
                    <div className='content'>
                        <div className='col1'>
                            <p><span>Группа: </span>{res.title}</p>
                            <p><span>Наравление: </span>{allDirectivities.find((el) => el.id === res.directivityId)
                                && allHeads.find((head) => head.id === allDirectivities.find((el) => el.id === res.directivityId).headId)
                                && allHeads.find((head) => head.id === allDirectivities.find((el) => el.id === res.directivityId).headId).title}</p>
                        </div>
                        <div className='col2'>
                            <p><span>Направленность: </span>{allDirectivities.find((el) => el.id === res.directivityId) && allDirectivities.find((el) => el.id === res.directivityId).title}</p>
                        </div>
                    </div>
                    <button
                        className='student-setting'
                        onClick={() => handleSettingClick(res.id)}
                    >
                        <img src={require('../../img/setting.png')} alt='setting' />
                    </button>
                    <div className={`button-edit-delete ${cartStates[res.id] ? 'active' : ''}`}>
                        <button onClick={() => {
                            setModalEditActive(true);
                            setEditId(res.id);
                            allGroups.filter(r => r.id === res.id).map(r => setNewTitle(r.title));
                            allGroups.filter(r => r.id === res.id).map(r => setNewPhone(r.phone));
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
                    <Select
                        styles={customStylesModal}
                        placeholder="Направление"
                        value={head}
                        onChange={handleHeadChange}
                        isSearchable={true}
                        isClearable={true}
                        options={allHeads.map(res => ({
                            value: res.id,
                            label: res.title
                        }
                        ))}
                    />
                    <Select
                        styles={customStylesModal}
                        placeholder="Направленность"
                        value={direction}
                        onChange={handleDirectionChange}
                        isSearchable={true}
                        isClearable={true}
                        isDisabled={head ? false : true}
                        options={head && allDirectivities.filter((el) => el.headId === head.value).map(res => ({
                            value: res.id,
                            label: res.title
                        }))}

                    />
                    <div className='value-input'>
                        {head !== null &&  <p>{abbGroup}</p>}
                        <div className='input-conteiner'>
                            <input type='text' className='name-dapartment' placeholder=' ' value={numberGroup} onChange={e => setNumberGroup(e.target.value)} />
                            <label className='label-name'>Номер группы</label>
                        </div>
                    </div>

                </div>
                <div className='modal-button'>
                    <button onClick={() => { addGroup(); setModalActive(false); setHead(null); setDirection(null); setAbbGroup(''); setNumberGroup(''); }}>Сохранить</button>
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
                    {/* <button onClick={() => { editData(editId, newTitle, newPhone); setModalEditActive(false); }}>Сохранить</button>
                    <button onClick={() => { setModalEditActive(false); }}>Отмена</button> */}
                </div>
            </Empty_modal>
            <Empty_modal active={modalDeleteActive} setActive={setModalDeleteActive} >
                <div className='content-delete'>
                    <p className='text-delete'>Вы уверены, что хотите удалить?</p>
                    <div className='modal-button'>
                        {/* <button onClick={() => { deleteData(deleteId); setModalDeleteActive(false); }}>Удалить</button>
                        <button onClick={() => { setModalDeleteActive(false); }}>Отмена</button> */}
                    </div>
                </div>
            </Empty_modal>
        </>
    )
}


export default Admin_groups;