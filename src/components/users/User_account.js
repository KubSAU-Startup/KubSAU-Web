import User_header from './User_header';
import '../admin/Admin_header.css'
import React, { useEffect, useState } from 'react';
import { checkAccount, getEmployeeById, editEmployee, checkUrl, updatePassword } from '../../network';
import Error_modal from '../Modal/Error_modal';
import { getTextError } from '../../network';
import Loading from '../Modal/Loading';
import Error_empty from '../Modal/Error_empty';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faLink, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import Error_ok from '../Modal/Error_ok';
import Empty_modal from '../Modal/Empty_modal';
import { Link, useNavigate } from 'react-router-dom';
const eye = <FontAwesomeIcon icon={faEye} />;
const eyeSlah = <FontAwesomeIcon icon={faEyeSlash} />;

function User_account() {
    const [errorActive, setErrorActive] = useState(false);
    const [textError, setTextError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [dataAccount, setDataAccount] = useState({});
    const [idAccount, setIdAccount] = useState(null);

    const [codeText, setCodeText] = useState('');
    const [errorEmptyActive, setErrorEmptyActive] = useState(false);
    const [errorOkActive, setErrorOkActive] = useState(false);
    const [modalStaffEdit, setModalStaffEdit] = useState(null);

    const [modalEditActive, setModalEditActive] = useState(false);
    const [passwordActive, setPasswordActive] = useState(false);

    const [errorEmail, setErrorEmail] = useState('');
    const [errorFirstN, setErrorFirstN] = useState('');
    const [errorLastN, setErrorLastN] = useState('');
    const [errorMiddleN, setErrorMiddleN] = useState('');

    const [errorOldPasswd, setErrorOldPasswd] = useState('');
    const [errorRepeatPasswd, setErrorRepeatPasswd] = useState('');
    const [errorNewPasswd, setErrorNewPasswd] = useState('');

    const [newPassword, setNewPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');

    const [editId, setEditId] = useState(null);
    const [lastNEdit, setLastNEdit] = useState('');
    const [firstNEdit, setFirstNEdit] = useState('');
    const [middleNEdit, setMiddleNEdit] = useState('');
    const [emailEdit, setEmailEdit] = useState('');

    const [errorUrl, setErrorUrl] = useState('');
    const [newPasswordShown, setNewPasswordShown] = useState(false);
    const [oldPasswordShown, setOldPasswordShown] = useState(false);
    const [repeatPasswordShown, setRepeatPasswordShown] = useState(false);
    const [userDepartments, setUserDepartments] = useState([]);
    const [urlActive, setUrlActive] = useState(false);
    const [urlServer, setUrlServer] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const navigate = useNavigate();

    // получение данных об аккаунте (id) при загрузке страницы
    useEffect(() => {
        setIsLoading(true);
        checkAccount((res) => {
            if (res.error) {
                setTextError(getTextError(res.error));
                setErrorActive(true);
                setIsLoading(false);
            } else {
                setIsLoading(false);
                setIdAccount(res.response);
                if(res.response.departments.length !== 1){
                    setIsVisible(true);
                }else{
                    setIsVisible(false);
                }
                setUserDepartments(res.response.departments);
            }
        }).catch((error) => {
            setTextError(error.message);
            setCodeText(error.code);
            setErrorEmptyActive(true);
            setIsLoading(false);
        });
    }, []);


    // после получения id аккаунта получаем дополнительные данные
    useEffect(() => {
        setIsLoading(true);
        if (idAccount !== null) {
            getEmployeeById(idAccount.id, (res) => {
                if (res.error) {
                    setTextError(getTextError(res.error));
                    setErrorActive(true);
                    setIsLoading(false);
                } else {
                    setIsLoading(false);
                    setDataAccount(res.response);
                }
            }).catch((error) => {
                setTextError(error.message);
                setCodeText(error.code);
                setErrorEmptyActive(true);
                setIsLoading(false);
            });
        }
    }, [idAccount]);

    // редактирование основных данных об аккаунте
    async function editData() {
        setIsLoading(true);
        setErrorEmail('');
        setErrorLastN('');
        setErrorFirstN('');
        setErrorMiddleN('');

        // проверка ошибок ввода данных
        if (!isValidEmail(emailEdit) || firstNEdit === '' || lastNEdit === '' || middleNEdit === '' || emailEdit === '') {
            if (!isValidEmail(emailEdit) && emailEdit !== '') {
                setErrorEmail('Электронный адрес записан некорректно');
            }
            if (firstNEdit === '') {
                setErrorFirstN('Заполните имя');
            }
            if (lastNEdit === '') {
                setErrorLastN('Заполните фамилию');
            }
            if (middleNEdit === '') {
                setErrorMiddleN('Заполните отчество');
            }
            if (emailEdit === '') {
                setErrorEmail('Заполните почту');
            }
            setIsLoading(false);

        } else {

            // отправка запроса с новыми данными
            await editEmployee(editId, firstNEdit, lastNEdit, middleNEdit, emailEdit, '', (res) => {
                if (res.success) {
                    // изменение данных на странице
                    setDataAccount({
                        id: editId,
                        firstName: firstNEdit,
                        lastName: lastNEdit,
                        middleName: middleNEdit,
                        email: emailEdit,
                        type: modalStaffEdit.value

                    })
                } else {
                    setTextError(getTextError(res.error));
                    setCodeText(res.code);
                    setErrorEmptyActive(true);
                }
                setIsLoading(false);

            }).catch((error) => {
                // обработка ошибок запроса
                setTextError(getTextError(error));
                setCodeText(error.code);
                setErrorOkActive(true);
                setIsLoading(false);
            });
            // сбрасывание настроек при появлении скролла
            document.body.style.overflow = '';
            const usMainHeaders = document.getElementsByClassName('us_main_header');
            for (let i = 0; i < usMainHeaders.length; i++) {
                usMainHeaders[i].style.paddingRight = `10px`;
            }
            document.getElementById('body-content').style.paddingRight = ``;
            setModalEditActive(false);
        }
    }

    // проверка введенной почты
    function isValidEmail(email) {
        if (email === '') {
            return true;
        } else {
            return /\S+@\S+\.\S+/.test(email);
        }
    }

    // проверка введенной ссылки на сервер
    const editUrl = () => {
        localStorage.setItem('url', urlServer);
        setIsLoading(true);

        if (urlServer === '') {
            setErrorUrl('Заполните поле!');
            setIsLoading(false);

        } else {
            checkUrl(res => {
                if (res.version) {
                    setUrlActive(false);
                    localStorage.setItem('url', urlServer);
                }
                setIsLoading(false);

            }).catch((error) => {
                setErrorUrl(error.message);
                setIsLoading(false);
            });
            document.body.style.overflow = '';
            const usMainHeaders = document.getElementsByClassName('us_main_header');
            for (let i = 0; i < usMainHeaders.length; i++) {
                usMainHeaders[i].style.paddingRight = `10px`;
            }
            document.getElementById('body-content').style.paddingRight = ``;
        }
    }

    // функция редактирования пароля пользователем
    const editPassword = () => {
        setErrorNewPasswd('');
        setErrorOldPasswd('');
        setErrorRepeatPasswd('');
        setIsLoading(true);
        // проверка введенных данных в поля пользователем
        if (newPassword === '' || oldPassword === '' || repeatPassword === '' || newPassword !== repeatPassword) {
            if (newPassword === '') {
                setErrorNewPasswd('Введите новый пароль');
            }
            if (oldPassword === '') {
                setErrorOldPasswd('Введите старый пароль');
            }
            if (repeatPassword === '') {
                setErrorRepeatPasswd('Повторите новый пароль');
            }
            if (newPassword !== repeatPassword && repeatPassword !== '' && newPassword !== '') {
                setErrorRepeatPasswd('Пароли не совпадают');
            }
            setIsLoading(false);
        } else {
            // запрос на серевер с новым паролем
            updatePassword(oldPassword, newPassword, (res) => {
                if (res.success) {
                    setPasswordActive(false);
                } else {
                    setErrorOldPasswd('Неверный пароль');
                }

                setIsLoading(false);
            }).catch((error) => {
                setTextError(getTextError(error));
                setCodeText(error.code);
                setErrorOkActive(true);
                setIsLoading(false);
            });
            document.body.style.overflow = '';
            const usMainHeaders = document.getElementsByClassName('us_main_header');
            for (let i = 0; i < usMainHeaders.length; i++) {
                usMainHeaders[i].style.paddingRight = `10px`;
            }
            document.getElementById('body-content').style.paddingRight = ``;
        }
    }

    // функции inputs ввода данных
    const handleUrlServer = e => {
        setUrlServer(e.target.value);
    };
    const handleNewPassword = e => {
        setNewPassword(e.target.value);
    };
    const handleOldPassword = e => {
        setOldPassword(e.target.value);
    };
    const handleRepeatPassword = e => {
        setRepeatPassword(e.target.value);
    };

    // функции для показа введенного пароля пользователю
    const toggleOldPasswordVisiblity = () => {
        setOldPasswordShown(oldPasswordShown ? false : true);
    };
    const toggleNewPasswordVisiblity = () => {
        setNewPasswordShown(newPasswordShown ? false : true);
    };
    const toggleRepeatPasswordVisiblity = () => {
        setRepeatPasswordShown(repeatPasswordShown ? false : true);
    };

    // массив перечисления должностей
    const position = [
        { value: 1, label: 'Администратор' },
        { value: 2, label: 'Преподаватель' },
        { value: 3, label: 'Лаборант' }
    ]

    return (
        <>
            {/* компонент загрузки страницы */}
            <Loading active={isLoading} setActive={setIsLoading} />

            {/* компонент шапки */}
            <User_header />

            {/* контент страницы */}
            <div id='body-content'>

                <div className='account-content'>

                    {/* иконка пользователя */}
                    <div className='img-account'>
                        <FontAwesomeIcon icon={faUser} />
                    </div>

                    {/* блок с личной информацией */}
                    <div className='data-account'>
                        <div className='personal-data'>
                            <div><h2>Личные данные</h2></div>
                            <div className='data'>
                                <span>Фамилия:</span><p>{dataAccount.lastName}</p>
                                <span>Имя:</span><p>{dataAccount.firstName}</p>
                                <span>Отчество:</span><p>{dataAccount.middleName}</p>
                                <span>Кафедра:</span><p>{idAccount?.selectedDepartmentId !== null && userDepartments.find(r => r.id === idAccount?.selectedDepartmentId)?.title}</p>
                                <span>Статус:</span><p>{position.find(res => res.value === dataAccount.type)?.label}</p>
                                <span>Почта:</span><p>{dataAccount.email}</p>
                            </div>

                            {/* кнопка редактирования */}
                            <button onClick={() => {
                                // подстраивание страницы под скрытый скролл
                                const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
                                document.body.style.overflow = 'hidden';
                                const usMainHeaders = document.getElementsByClassName('us_main_header');
                                for (let i = 0; i < usMainHeaders.length; i++) {
                                    usMainHeaders[i].style.paddingRight = `${scrollbarWidth + 10}px`;
                                }
                                document.getElementById('body-content').style.paddingRight = `${scrollbarWidth}px`;
                                // обнуление и выбор необходимых данных
                                setErrorLastN('');
                                setErrorFirstN('');
                                setErrorMiddleN('');
                                setErrorEmail('');
                                setModalEditActive(true);
                                setFirstNEdit(dataAccount.firstName);
                                setLastNEdit(dataAccount.lastName);
                                setMiddleNEdit(dataAccount.middleName);
                                setEmailEdit(dataAccount.email);
                                setModalStaffEdit({ value: dataAccount.type, label: position.find(r => r.value === dataAccount.type).label });
                                setEditId(dataAccount.id);
                            }}>Редактировать</button>

                            {/* кнопка смены кафедры */}
                            {isVisible &&
                            <button style={{ marginLeft: '20px' }} onClick={() => {
                                navigate('/user/UserChoice');
                            }}>Сменить кафедру</button>
                            }

                        </div>
                        <div className='secure'>
                            <div><h2>Безопасность</h2>
                            </div><div className='data'>
                                <FontAwesomeIcon icon={faLock} style={{ fontSize: '20px', color: '#26BD00' }} />
                                <span>Пароль:</span>
                                {/* копка изменения пароля */}
                                <div><button onClick={() => {
                                    // подстраивание страницы под скрытый скролл
                                    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
                                    document.body.style.overflow = 'hidden';
                                    const usMainHeaders = document.getElementsByClassName('us_main_header');
                                    for (let i = 0; i < usMainHeaders.length; i++) {
                                        usMainHeaders[i].style.paddingRight = `${scrollbarWidth + 10}px`;
                                    }
                                    document.getElementById('body-content').style.paddingRight = `${scrollbarWidth}px`;
                                    // обнуление и выбор необходимых данных
                                    setPasswordActive(true);
                                    setErrorOldPasswd('');
                                    setErrorRepeatPasswd('');
                                    setErrorNewPasswd('');
                                    setNewPassword('');
                                    setOldPassword('');
                                    setRepeatPassword('');
                                    setOldPasswordShown(false);
                                    setNewPasswordShown(false);
                                    setRepeatPasswordShown(false);
                                }}>Изменить пароль</button></div>

                                <FontAwesomeIcon icon={faLink} style={{ fontSize: '20px', color: '#26BD00' }} />
                                <span>URL:</span>
                                {/* кнопка изменения пароля */}
                                <div><button onClick={() => {
                                    // подстраивание страницы под скрытый скролл
                                    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
                                    document.body.style.overflow = 'hidden';
                                    const usMainHeaders = document.getElementsByClassName('us_main_header');
                                    for (let i = 0; i < usMainHeaders.length; i++) {
                                        usMainHeaders[i].style.paddingRight = `${scrollbarWidth + 10}px`;
                                    }
                                    document.getElementById('body-content').style.paddingRight = `${scrollbarWidth}px`;
                                    // обнуление и выбор необходимых данных
                                    setUrlActive(true);
                                    setUrlServer(localStorage.getItem('url'));
                                    setErrorUrl('')
                                }}>Изменить URL</button></div>
                            </div>
                        </div>
                    </div>
                </div >
            </div >
            {/* модальное окно для редактирования основной информации об аккаунте */}
            <Empty_modal active={modalEditActive} setActive={setModalEditActive}>
                <div className='modal-students'>
                    <div>
                        <div className='input-conteiner'>
                            <input type='text' className='name-stud' placeholder=' ' value={lastNEdit} onChange={e => setLastNEdit(e.target.value)} />
                            <label className='label-name'>Фамилия</label>
                        </div>
                        {(errorLastN !== '') && <p className='inputModalError' >{errorLastN}</p>}

                    </div>
                    <div>
                        <div className='input-conteiner'>
                            <input type='text' className='name-stud' placeholder=' ' value={firstNEdit} onChange={e => setFirstNEdit(e.target.value)} />
                            <label className='label-name'>Имя</label>
                        </div>
                        {(errorFirstN !== '') && <p className='inputModalError' >{errorFirstN}</p>}

                    </div>
                    <div>
                        <div className='input-conteiner'>
                            <input type='text' className='name-stud' placeholder=' ' value={middleNEdit} onChange={e => setMiddleNEdit(e.target.value)} />
                            <label className='label-name'>Отчество</label>
                        </div>
                        {(errorMiddleN !== '') && <p className='inputModalError' >{errorMiddleN}</p>}

                    </div>
                    <div>
                        <div className='input-conteiner'>
                            <input type='text' className='name-stud' placeholder=' ' value={emailEdit} onChange={e => setEmailEdit(e.target.value)} />
                            <label className='label-name'>e-mail</label>
                        </div>
                        {(errorEmail !== '') && <p className='inputModalError' >{errorEmail}</p>}

                    </div>

                    {/* кнопки модального окна */}
                    <div className='modal-button'>
                        <button onClick={() => {
                            editData();
                        }}>Сохранить</button>
                        {/* сбор настроек после пояления скролла */}
                        <button onClick={() => {
                            document.body.style.overflow = '';
                            const usMainHeaders = document.getElementsByClassName('us_main_header');
                            for (let i = 0; i < usMainHeaders.length; i++) {
                                usMainHeaders[i].style.paddingRight = `10px`;
                            }
                            document.getElementById('body-content').style.paddingRight = ``;
                            setModalEditActive(false);
                        }}>Отмена</button>
                    </div>
                </div>
            </Empty_modal>

            {/* модальные окна ошибок */}
            <Error_modal active={errorActive} text={textError} />
            <Error_empty active={errorEmptyActive} text={textError} codeText={codeText} />
            <Error_ok active={errorOkActive} setActive={setErrorOkActive} text={textError} codeText={codeText} />

            {/* модальное окно для редактирования url */}
            <Empty_modal active={urlActive} setActive={setUrlActive}>
                <div>
                    <p><b>Введите URL:</b></p>
                    <input
                        className='url-input'
                        value={urlServer}
                        onChange={handleUrlServer}
                        placeholder='URL...'
                    />
                    {(errorUrl !== '') && <p className='inputModalError' >{errorUrl}</p>}

                    <div className='url-modal-button'>
                        <button onClick={() => { editUrl() }}>Сохранить</button>
                    </div>
                </div>
            </Empty_modal>

            {/* модальное окно для редактирования пароля */}
            <Empty_modal active={passwordActive} setActive={setPasswordActive}>
                <div className='content-password'>
                    <p>Старый пароль:</p>
                    <input
                        type={oldPasswordShown ? "text" : "password"}
                        className='password-input'
                        value={oldPassword}
                        onChange={handleOldPassword}
                    /><i style={{ position: 'absolute', margin: '5px 15px' }} onClick={toggleOldPasswordVisiblity}>{oldPasswordShown ? eyeSlah : eye}</i>
                    {(errorOldPasswd !== '') && <p className='inputModalError' style={{ margin: '5px 0 0' }}>{errorOldPasswd}</p>}

                </div>
                <div className='content-password'>
                    <p>Новый пароль:</p>
                    <input
                        type={newPasswordShown ? "text" : "password"}
                        className='password-input'
                        value={newPassword}
                        onChange={handleNewPassword}
                    /><i style={{ position: 'absolute', margin: '5px 15px' }} onClick={toggleNewPasswordVisiblity}>{newPasswordShown ? eyeSlah : eye}</i>
                    {(errorNewPasswd !== '') && <p className='inputModalError' style={{ margin: '5px 0 0' }}>{errorNewPasswd}</p>}

                </div>
                <div className='content-password'>
                    <p>Повторите пароль:</p>
                    <input
                        type={repeatPasswordShown ? "text" : "password"}
                        className='password-input'
                        value={repeatPassword}
                        onChange={handleRepeatPassword}
                    /><i style={{ position: 'absolute', margin: '5px 15px' }} onClick={toggleRepeatPasswordVisiblity}>{repeatPasswordShown ? eyeSlah : eye}</i>
                    {(errorRepeatPasswd !== '') && <p className='inputModalError' style={{ margin: '5px 0 0' }}>{errorRepeatPasswd}</p>}

                </div>
                <div className='modal-button'>
                    <button onClick={() => { editPassword() }}>Сохранить</button>
                    <button onClick={() => {
                        document.body.style.overflow = '';
                        const usMainHeaders = document.getElementsByClassName('us_main_header');
                        for (let i = 0; i < usMainHeaders.length; i++) {
                            usMainHeaders[i].style.paddingRight = `10px`;
                        }
                        document.getElementById('body-content').style.paddingRight = ``;
                        setPasswordActive(false);
                    }}>Отмена</button>
                </div>
            </Empty_modal>

        </>
    );
}

export default User_account;