import User_header from './User_header';
import '../admin/Admin_header.css'
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate, Link, redirect, useNavigate
} from "react-router-dom";
import Select from 'react-select';
import { customStylesModal } from '../Select_style/Select_style';
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
    const [passwordShown, setPasswordShown] = useState(false);
    const [newPasswordShown, setNewPasswordShown] = useState(false);
    const [oldPasswordShown, setOldPasswordShown] = useState(false);
    const [repeatPasswordShown, setRepeatPasswordShown] = useState(false);
    const [userDepartments, setUserDepartments] = useState([]);
    const [urlActive, setUrlActive] = useState(false);
    const [urlServer, setUrlServer] = useState("");

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
                setUserDepartments(res.response.departments);
            }
        }).catch((error) => {
            setTextError(error.message);
            setCodeText(error.code);
            setErrorEmptyActive(true);
            setIsLoading(false);
        });
    }, []);


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

    async function editData() {
        setIsLoading(true);
        setErrorEmail('');
        setErrorLastN('');
        setErrorFirstN('');
        setErrorMiddleN('');
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

            await editEmployee(editId, firstNEdit, lastNEdit, middleNEdit, emailEdit, '', (res) => {
                if (res.success) {
                    setDataAccount({
                        id: editId,
                        firstName: firstNEdit,
                        lastName: lastNEdit,
                        middleName: middleNEdit,
                        email: emailEdit,
                        type: modalStaffEdit.value

                    })
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
            const usMainHeaders = document.getElementsByClassName('us_main_header');
            for (let i = 0; i < usMainHeaders.length; i++) {
                usMainHeaders[i].style.paddingRight = `10px`;
            }
            document.getElementById('body-content').style.paddingRight = ``;
            setModalEditActive(false);

        }
    }

    function isValidEmail(email) {
        if (email === '') {
            return true;
        } else {
            return /\S+@\S+\.\S+/.test(email);

        }
    }

    const editUrl = () => {
        localStorage.setItem('url', urlServer);
        if (urlServer === '') {
            setErrorUrl('Заполните поле!');
        }
        setIsLoading(true);
        checkUrl(res => {
            if (res.version) {
                setUrlActive(false);
                localStorage.setItem('url', urlServer);
                // window.location.reload();
            }
            setIsLoading(false);

        }).catch((error) => {
            setErrorUrl(error.message);
            setIsLoading(false);
        });
    }

    const editPassword = () => {
        setErrorNewPasswd('');
        setErrorOldPasswd('');
        setErrorRepeatPasswd('');
        setIsLoading(true);
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
            updatePassword(oldPassword, newPassword, () => {
                setPasswordActive(false);
                setIsLoading(false);
            }).catch(() => {
                setErrorOldPasswd('Неверный пароль');
                setIsLoading(false);

            })
        }
    }

    const handleUrlServer = e => {
        setUrlServer(e.target.value);

    };
    const handleNewPassword = e => {
        setNewPassword(e.target.value);

    }; const handleOldPassword = e => {
        setOldPassword(e.target.value);

    }; const handleRepeatPassword = e => {
        setRepeatPassword(e.target.value);

    };
    const togglePasswordVisiblity = () => {
        setPasswordShown(passwordShown ? false : true);
    };
    const toggleOldPasswordVisiblity = () => {
        setOldPasswordShown(oldPasswordShown ? false : true);
    };
    const toggleNewPasswordVisiblity = () => {
        setNewPasswordShown(newPasswordShown ? false : true);
    };
    const toggleRepeatPasswordVisiblity = () => {
        setRepeatPasswordShown(repeatPasswordShown ? false : true);
    };
    const position = [
        { value: 1, label: 'Администратор' },
        { value: 2, label: 'Преподаватель' },
        { value: 3, label: 'Лаборант' }
    ]

    return (
        <>
            <Loading active={isLoading} setActive={setIsLoading} />

            <User_header />
            <div id='body-content'>

                <div className='account-content'>
                    <div className='img-account'>
                        <FontAwesomeIcon icon={faUser} />
                    </div>
                    <div className='data-account'>
                        <div className='personal-data'>
                            <div>
                                <h2>Личные данные</h2>
                            </div>
                            <div className='data'>
                                <span>Фамилия:</span><p>{dataAccount.lastName}</p>
                                <span>Имя:</span><p>{dataAccount.firstName}</p>
                                <span>Отчество:</span><p>{dataAccount.middleName}</p>
                                <span>Кафедра:</span><p>{userDepartments.find(r => r.id === idAccount.selectedDepartmentId)?.title}</p>
                                <span>Статус:</span><p>{position.find(res => res.value === dataAccount.type)?.label}</p>
                                <span>Почта:</span><p>{dataAccount.email}</p>
                            </div>

                            <button onClick={() => {
                                const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
                                document.body.style.overflow = 'hidden';
                                const usMainHeaders = document.getElementsByClassName('us_main_header');
                                for (let i = 0; i < usMainHeaders.length; i++) {
                                    usMainHeaders[i].style.paddingRight = `${scrollbarWidth + 10}px`;
                                }
                                document.getElementById('body-content').style.paddingRight = `${scrollbarWidth}px`;
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

                        </div>
                        <div className='secure'>
                            <div>
                                <h2>Безопасность</h2>

                            </div>
                            <div className='data'>
                                {/* <div> */}
                                <FontAwesomeIcon icon={faLock} style={{ fontSize: '20px', color: '#26BD00' }} />
                                <span>Пароль:</span>
                                <div><button onClick={() => {
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
                                <div><button onClick={() => { setUrlActive(true); setUrlServer(localStorage.getItem('url')); setErrorUrl('') }}>Изменить URL</button></div>
                            </div>
                        </div>
                    </div>
                </div >
            </div >
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
                    <div>
                    </div>

                    <div className='modal-button'>
                        <button onClick={() => {
                            editData();
                        }}>Сохранить</button>
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
            <Error_modal active={errorActive} text={textError} />
            <Error_empty active={errorEmptyActive} text={textError} codeText={codeText} />
            <Error_ok active={errorOkActive} setActive={setErrorOkActive} text={textError} codeText={codeText} />
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
                    <button onClick={() => { setPasswordActive(false) }}>Отмена</button>
                </div>
            </Empty_modal>

        </>
    );
}

export default User_account;