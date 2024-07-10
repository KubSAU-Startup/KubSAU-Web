import React, { useEffect, useState } from 'react';
import Admin_header from './Admin_header';
import Select from 'react-select';
import './Admin_groups.css'
import Loading from '../Modal/Loading';
import Error_modal from '../Modal/Error_modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { addNewGroup, editGroup, deleteGroup, getAllDirectivities, getAllGroups, getAllHeads, getTextError } from '../../network';
import Empty_modal from '../Modal/Empty_modal';
import Error_empty from '../Modal/Error_empty';
import Error_ok from '../Modal/Error_ok';
import { customStylesModal } from '../Select_style/Select_style';

function Admin_groups() {
    const [modalActive, setModalActive] = useState(false);
    const [modalEditActive, setModalEditActive] = useState(false);
    const [modalDeleteActive, setModalDeleteActive] = useState(false);
    const [allGroups, setAllGroups] = useState([]);
    const [allDirectivities, setAllDirectivities] = useState([]);
    const [allHeads, setAllHeads] = useState([]);

    const [searchResults, setSearchResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [errorActive, setErrorActive] = useState(false);
    const [textError, setTextError] = useState('');
    const [numberGroup, setNumberGroup] = useState('');
    const [newNumberGroup, setNewNumberGroup] = useState('');

    const [errorHead, setErrorHead] = useState(null);
    const [errorDir, setErrorDir] = useState(null);
    const [errorGroup, setErrorGroup] = useState(null);

    const [newDirectivity, setNewDirectivity] = useState(null);
    const [newHead, setNewHead] = useState(null);

    const [head, setHead] = useState(null);
    const [directivity, setDirectivity] = useState(null);

    const [abbGroup, setAbbGroup] = useState('');
    const [newAbbGroup, setNewAbbGroup] = useState('');
    const [codeText, setCodeText] = useState('');
    const [errorEmptyActive, setErrorEmptyActive] = useState(false);
    const [errorOkActive, setErrorOkActive] = useState(false);

    const [editId, setEditId] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    const [visibleItems, setVisibleItems] = useState(30);
    const [isPaginationVisible, setIsPaginationVisible] = useState(true);
    const [isSetOpen, setIsSetOpen] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);

    // открытие модального окна для дополнительных функций карточки
    const openModal = (itemId) => {
        setSelectedItemId(itemId);
        setIsSetOpen(true);
    };

    // закрытие модального окна для дополнительных функций карточки
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
        setIsLoading(true);

        // получение данных о группах
        getAllGroups((res) => {
            if (res.error) {
                setTextError(getTextError(res.error));
                setErrorActive(true);
            } else {
                setAllGroups(res.response);
                setSearchResults(res.response.reverse());
            }
            setIsLoading(false);
        }).catch((error) => {
            setTextError(getTextError(error));
            setCodeText(error.code);
            setErrorEmptyActive(true);
            setIsLoading(false);
        });

        // получение данных о направленностях и направлениях
        getAllDirectivities(true, (res) => {
            if (res.error) {
                setTextError(getTextError(res.error));
                setErrorActive(true);
            } else {
                setAllDirectivities(res.response.directivities);
                setAllHeads(res.response.heads)
            }
            setIsLoading(false);
        }).catch((error) => {
            setTextError(getTextError(error));
            setCodeText(error.code);
            setErrorEmptyActive(true);
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

    // добавление новой группы
    async function addData() {
        setIsLoading(true);
        setErrorHead('');
        setErrorDir('');
        setErrorGroup('');
        if (head === null || directivity === null || numberGroup === '') {
            if (head === null) {
                setErrorHead('Выберите направление');
            }
            if (directivity === null && head !== null) {
                setErrorDir('Выберите направленность');
            }
            if (numberGroup === '') {
                setErrorGroup('Заполните номер группы');
            }
            setIsLoading(false);

        } else {
            const group = abbGroup + numberGroup;
            const dir = directivity.value;
            await addNewGroup(group, dir, (res) => {
                if (res.success) {
                    setAllGroups(prevData => [res.response, ...prevData]);
                } else {
                    setTextError(res.message);
                    setCodeText(res.code);
                    setErrorEmptyActive(true);
                }
                setIsLoading(false);
            }).catch((error) => {
                setTextError(error.message);
                setCodeText(error.code);
                setErrorOkActive(true);
                setIsLoading(false);
            });
            setModalActive(false);

            document.body.style.overflow = '';
            const adMainHeaders = document.getElementsByClassName('ad_main_header');
            for (let i = 0; i < adMainHeaders.length; i++) {
                adMainHeaders[i].style.paddingRight = `10px`;
            }
            document.getElementById('body-content').style.paddingRight = ``;
        }

    }

    // восстанавливаем поиск после обновления данных
    useEffect(() => {
        setIsLoading(true);
        if (searchTerm) {
            const filteredResults = allGroups.filter(item => {

                // Проверяем условие для каждого поля, по которому хотим искать
                return (
                    item.title.toLowerCase().includes(searchTerm) ||
                    allDirectivities.find((el) => el.id === item.directivityId).title.toLowerCase().includes(searchTerm) ||
                    allHeads.find((head) => head.id === allDirectivities.find((el) => el.id === item.directivityId).headId).title.toLowerCase().includes(searchTerm)
                );
            });
            setSearchResults(filteredResults);
        } else {
            setSearchResults(allGroups)
        }
        setIsLoading(false);
    }, [allGroups])

    // редактируем группу
    async function editData() {
        setIsLoading(true);
        setErrorHead(null);
        setErrorDir(null);
        setErrorGroup('');
        if (newHead === null || newDirectivity === null || newNumberGroup === '') {
            if (newHead === null) {
                setErrorHead('Выберите направление');
            }
            if (newDirectivity === null && newHead !== null) {
                setErrorDir('Выберите направленность');
            }
            if (newNumberGroup === '') {
                setErrorGroup('Заполните номер группы');
            }
            setIsLoading(false);

        } else {
            await editGroup(editId, newAbbGroup, newNumberGroup, newDirectivity.value, (res) => {
                if (res.success) {
                    const editGroup = allGroups.map(elem => {
                        if (elem.id === editId) {
                            return {
                                ...elem, // копируем все свойства из исходного объекта
                                title: `${newAbbGroup}${newNumberGroup}`, // обновляем поле title
                                directivityId: newDirectivity.value // обновляем поле phone
                            };
                        } else {
                            return elem; // если элемент не подлежит изменению, возвращаем его без изменений
                        }
                    });
                    setAllGroups(editGroup);
                } else {
                    setTextError(res.message);
                    setCodeText(res.code);
                    setErrorEmptyActive(true);
                }
                setIsLoading(false);
            }).catch((error) => {
                setTextError(error.message);
                setCodeText(error.code);
                setErrorOkActive(true);
                setIsLoading(false);
            });

            document.body.style.overflow = '';
            const adMainHeaders = document.getElementsByClassName('ad_main_header');
            for (let i = 0; i < adMainHeaders.length; i++) {
                adMainHeaders[i].style.paddingRight = `10px`;
            }
            document.getElementById('body-content').style.paddingRight = ``;
            setModalEditActive(false);
        }
    }

    // удаляем группу
    async function deleteData(index) {
        setIsLoading(true);

        await deleteGroup(index, (res) => {
            if (res.success) {
                setAllGroups(allGroups.filter((a) => a.id !== index));
            } else {
                setTextError(res.message);
                setCodeText(res.code);
                setErrorEmptyActive(true);
            }
            setIsLoading(false);
        }).catch((error) => {
            setTextError(error.message);
            setCodeText(error.code);
            setErrorOkActive(true);
            setIsLoading(false);
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

    // функции для выбора данных в выпадающих списках в модальных окнах
    function handleHeadChange(data) {
        setHead(data);
        if (data !== null) {
            setAbbGroup(allHeads.find((el) => el.id === data.value).abbreviation);
        }
        setDirectivity(null);
    }
    function handledirectivityChange(data) {
        setDirectivity(data);
    }
    function handleNewHeadChange(data) {
        setNewHead(data);
        if (data !== null) {
            setNewAbbGroup(allHeads.find((el) => el.id === data.value).abbreviation)
        }
        setNewDirectivity(null);
    }
    function handleNewDirectivityChange(data) {
        setNewDirectivity(data);
    }

    return (
        <>
            {/* окно загрузки */}
            <Loading active={isLoading} setActive={setIsLoading} />

            {/* модальное окно ошибки */}
            <Error_modal active={errorActive} setActive={setErrorActive} text={textError} setText={setTextError} />

            {/* шапка страницы */}
            <Admin_header />
            <div id='body-content'>
                {/* название страницы */}
                <div className='page-name'>
                    <p>Группы</p>
                </div>
                <div className='search-add'>
                    {/* поиск */}
                    <div className='admin-main-search'>
                        <input
                            type='text'
                            value={searchTerm}
                            onChange={handleChange}
                            placeholder='Поиск...'
                        />
                    </div>

                    {/* кнопка добавления группы */}
                    <button className='add-student' onClick={() => {
                        setErrorHead('');
                        setErrorDir('');
                        setErrorGroup('');
                        setHead(null);
                        setDirectivity(null);
                        setNumberGroup('');
                        setAbbGroup('');
                        setModalActive(true);

                        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
                        document.body.style.overflow = 'hidden';
                        const adMainHeaders = document.getElementsByClassName('ad_main_header');
                        for (let i = 0; i < adMainHeaders.length; i++) {
                            adMainHeaders[i].style.paddingRight = `${scrollbarWidth + 10}px`;
                        }
                        document.getElementById('body-content').style.paddingRight = `${scrollbarWidth}px`;
                    }}>
                        <FontAwesomeIcon icon={faPlusCircle} />
                    </button>
                </div>

                {/* вывод данных на экран */}
                {searchResults.slice(0, visibleItems).map(res => (
                    <div className='cart-stud' key={res.id}>
                        <div className='content'>
                            <div className='col1'>
                                <p><span>Группа: </span>{res.title}</p>
                                <p><span>Направление: </span>{allDirectivities.find((el) => el.id === res.directivityId)
                                    && allHeads.find((head) => head.id === allDirectivities.find((el) => el.id === res.directivityId).headId)
                                    && allHeads.find((head) => head.id === allDirectivities.find((el) => el.id === res.directivityId).headId).title}</p>
                            </div>
                            <div className='col2'>
                                <p><span>Направленность: </span>{allDirectivities.find((el) => el.id === res.directivityId) && allDirectivities.find((el) => el.id === res.directivityId).title}</p>
                            </div>
                        </div>
                        {/* кнопка настроек */}
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
                            }}>
                            <img src={require('../../img/setting.png')} alt='setting' />
                        </button>
                        {isSetOpen && selectedItemId === res.id && (
                            <div className={`button-edit-delete ${isSetOpen && selectedItemId === res.id ? 'active' : ''}`}>
                                {/* кнопка редактирования данных */}
                                <button onClick={() => {
                                    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
                                    document.body.style.overflow = 'hidden';
                                    const adMainHeaders = document.getElementsByClassName('ad_main_header');
                                    for (let i = 0; i < adMainHeaders.length; i++) {
                                        adMainHeaders[i].style.paddingRight = `${scrollbarWidth + 10}px`;
                                    }
                                    document.getElementById('body-content').style.paddingRight = `${scrollbarWidth}px`;


                                    setErrorHead(null);
                                    setErrorDir(null);
                                    setErrorGroup('');
                                    setModalEditActive(true);
                                    setEditId(res.id);
                                    allGroups.filter(el => el.id === res.id).map(r => {
                                        setNewAbbGroup(allHeads.find(el => el.id === allDirectivities.find(r => r.id === res.directivityId).headId).abbreviation);
                                        setNewNumberGroup(r.title.replace(allHeads.find(el => el.id === allDirectivities.find(r => r.id === res.directivityId).headId).abbreviation, ''));
                                    });
                                    allHeads.filter((head) => head.id === allDirectivities.find((el) => el.id === res.directivityId).headId).map(r => setNewHead({
                                        value: r.id,
                                        label: r.title
                                    }))
                                    allDirectivities.filter((el) => el.id === res.directivityId).map(r => setNewDirectivity({
                                        value: r.id,
                                        label: r.title
                                    }));
                                }}>
                                    <img src={require('../../img/edit.png')} alt='edit' />
                                </button>

                                {/* кнопка удаления данных */}
                                <button onClick={() => {
                                    setModalDeleteActive(true); setDeleteId(res.id);
                                    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
                                    document.body.style.overflow = 'hidden';
                                    const adMainHeaders = document.getElementsByClassName('ad_main_header');
                                    for (let i = 0; i < adMainHeaders.length; i++) {
                                        adMainHeaders[i].style.paddingRight = `${scrollbarWidth + 10}px`;
                                    }
                                    document.getElementById('body-content').style.paddingRight = `${scrollbarWidth}px`;
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
                {searchResults.length === 0 && <div className='no-data'><p>Нет данных</p></div>}

            </div>

            {/* модальное окно добавления группы */}
            <Empty_modal active={modalActive} setActive={setModalActive} >
                <div className='modal-group'>
                    <div style={{ marginBottom: '30px' }}>
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
                            ))} />
                        {(errorHead !== '') && <p style={{ color: 'red', fontSize: '12px', position: 'absolute' }} >{errorHead}</p>}
                    </div>

                    <div style={{ marginBottom: '30px' }}>
                        <Select
                            styles={customStylesModal}
                            placeholder="Направленность"
                            value={directivity}
                            onChange={handledirectivityChange}
                            isSearchable={true}
                            isClearable={true}
                            isDisabled={head ? false : true}
                            options={head && allDirectivities.filter((el) => el.headId === head.value).map(res => ({
                                value: res.id,
                                label: res.title
                            }))} />
                        {(errorDir !== '' && head !== null) && <p style={{ color: 'red', fontSize: '12px', position: 'absolute' }} >{errorDir}</p>}
                    </div>
                    <div>
                        <div className='value-input group'>
                            {head !== null && <p>{abbGroup}</p>}
                            <div className='input-conteiner'>
                                <input type='text' className='name-group' placeholder=' ' value={numberGroup} onChange={e => setNumberGroup(e.target.value)} />
                                <label className='label-name'>Номер группы</label>
                            </div>
                        </div>
                        {(errorGroup !== '') && <p className='inputModalError' >{errorGroup}</p>}
                    </div>
                </div>
                <div className='modal-button'>
                    <button onClick={() => {
                        addData();
                    }}>Сохранить</button>

                    <button onClick={() => {
                        setModalActive(false);
                        document.body.style.overflow = '';
                        const adMainHeaders = document.getElementsByClassName('ad_main_header');
                        for (let i = 0; i < adMainHeaders.length; i++) {
                            adMainHeaders[i].style.paddingRight = `10px`;
                        }
                        document.getElementById('body-content').style.paddingRight = ``;
                    }}>Отмена</button>
                </div>
            </Empty_modal>

            {/* модальное окно редактирования группы */}
            <Empty_modal active={modalEditActive} setActive={setModalEditActive} >
                <div style={{ marginBottom: '30px' }}>
                    <Select
                        styles={customStylesModal}
                        placeholder="Направление"
                        value={newHead}
                        onChange={handleNewHeadChange}
                        isSearchable={true}
                        isClearable={true}
                        options={allHeads.map(res => ({
                            value: res.id,
                            label: res.title
                        }
                        ))} />
                    {(errorHead !== '') && <p style={{ color: 'red', fontSize: '12px', position: 'absolute' }} >{errorHead}</p>}
                </div>

                <div style={{ marginBottom: '30px' }}>
                    <Select
                        styles={customStylesModal}
                        placeholder="Направленность"
                        value={newDirectivity}
                        onChange={handleNewDirectivityChange}
                        isSearchable={true}
                        isClearable={true}
                        isDisabled={newHead ? false : true}
                        options={newHead && allDirectivities.filter((el) => el.headId === newHead.value).map(res => ({
                            value: res.id,
                            label: res.title
                        }))} />
                    {(errorDir !== '') && <p style={{ color: 'red', fontSize: '12px', position: 'absolute' }} >{errorDir}</p>}
                </div>

                <div>
                    <div className='value-input'>
                        {newHead !== null && <p>{newAbbGroup}</p>}
                        <div className='input-conteiner'>
                            <input type='text' className='name-group' placeholder=' ' value={newNumberGroup} onChange={e => setNewNumberGroup(e.target.value)} />
                            <label className='label-name'>Номер группы</label>
                        </div>
                    </div>
                    {(errorGroup !== '') && <p className='inputModalError' >{errorGroup}</p>}
                </div>
                <div className='modal-button'>
                    <button onClick={() => {
                        editData();
                    }}>Сохранить</button>

                    <button onClick={() => {
                        setModalEditActive(false);
                        document.body.style.overflow = '';
                        const adMainHeaders = document.getElementsByClassName('ad_main_header');
                        for (let i = 0; i < adMainHeaders.length; i++) {
                            adMainHeaders[i].style.paddingRight = `10px`;
                        }
                        document.getElementById('body-content').style.paddingRight = ``;
                    }}>Отмена</button>
                </div>
            </Empty_modal>

            {/* модальное окно удаления группы */}
            <Empty_modal active={modalDeleteActive} setActive={setModalDeleteActive} >
                <div className='content-delete'>
                    <p className='text-delete'>Вы уверены, что хотите удалить?</p>
                    <div className='modal-button'>
                        <button onClick={() => {
                            deleteData(deleteId); setModalDeleteActive(false);
                            document.body.style.overflow = '';
                            const adMainHeaders = document.getElementsByClassName('ad_main_header');
                            for (let i = 0; i < adMainHeaders.length; i++) {
                                adMainHeaders[i].style.paddingRight = `10px`;
                            }
                            document.getElementById('body-content').style.paddingRight = ``;
                        }}>Удалить</button>

                        <button onClick={() => {
                            setModalDeleteActive(false);
                            document.body.style.overflow = '';
                            const adMainHeaders = document.getElementsByClassName('ad_main_header');
                            for (let i = 0; i < adMainHeaders.length; i++) {
                                adMainHeaders[i].style.paddingRight = `10px`;
                            }
                            document.getElementById('body-content').style.paddingRight = ``;
                        }}>Отмена</button>
                    </div>
                </div>
            </Empty_modal>

            {/* модальные окна ошибок */}
            <Error_modal active={errorActive} text={textError} />
            <Error_empty active={errorEmptyActive} text={textError} codeText={codeText} />
            <Error_ok active={errorOkActive} setActive={setErrorOkActive} text={textError} codeText={codeText} />
        </>
    )
}


export default Admin_groups;