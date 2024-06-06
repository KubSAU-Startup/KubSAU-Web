import Admin_header from './Admin_header';
import './Admin_account.css'
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate, Link, redirect, useNavigate
} from "react-router-dom";
import Select from 'react-select';
import { customStylesModal } from '../Select_style/Select_style';
import React, { useEffect, useState } from 'react';
import { checkAccount, getEmployeeById, editEmployee } from '../../network';
import Error_modal from '../Modal/Error_modal';
import { getTextError } from '../../network';
import Loading from '../Modal/Loading';
import Error_empty from '../Modal/Error_empty';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faLock } from '@fortawesome/free-solid-svg-icons';
import Error_ok from '../Modal/Error_ok';
import Empty_modal from '../Modal/Empty_modal';

function Admin_account() {
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

    const [errorEmail, setErrorEmail] = useState('');
    const [errorFirstN, setErrorFirstN] = useState('');
    const [errorLastN, setErrorLastN] = useState('');
    const [errorMiddleN, setErrorMiddleN] = useState('');
    const [errorStaff, setErrorStaff] = useState('');

    const [editId, setEditId] = useState(null);
    const [lastNEdit, setLastNEdit] = useState('');
    const [firstNEdit, setFirstNEdit] = useState('');
    const [middleNEdit, setMiddleNEdit] = useState('');
    const [emailEdit, setEmailEdit] = useState('');

    useEffect(() => {
        setIsLoading(true);
        checkAccount((res) => {
            if (res.error) {
                setTextError(getTextError(res.error));
                setErrorActive(true);
                setIsLoading(false);
            } else {
                setIsLoading(false);
                setIdAccount(res.response)
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
                    setDataAccount(res.response)
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

            await editEmployee(editId, firstNEdit, lastNEdit, middleNEdit, emailEdit, '',(res) => {
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

    const position = [
        { value: 1, label: 'Администратор' },
        { value: 2, label: 'Преподаватель' },
        { value: 3, label: 'Лаборант' }
    ]

    return (
        <>
            <Loading active={isLoading} setActive={setIsLoading} />

            <Admin_header />
            <div id='body-content'>

                <div className='account-content'>
                    <div className='img-account'>
                        <img src={require('../../img/my_account.png')} />

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
                                <input type={'password'} readOnly={true} className='secure-password' value={'https://kubsau-testbackend.melod1n.dedyn.io/'} />

                                <FontAwesomeIcon icon={faLink} style={{ fontSize: '20px', color: '#26BD00' }} />
                                <span>URL:</span>
                                <input type={'text'} readOnly={true} className='secure-password' value={'https://kubsau-testbackend.melod1n.dedyn.io/'} />


                            </div>

                            <div><button>Изменить</button></div>

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
        </>
    );
}

export default Admin_account;