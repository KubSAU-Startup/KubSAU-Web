import './Log.css';
import { useForm } from "react-hook-form";
import React, { useEffect, useState } from 'react';
import { checkAccount, checkUrl, loginAxios } from "../../network"
import Error_auth_data from '../Modal/Error_auth_data';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faL } from "@fortawesome/free-solid-svg-icons";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Link, Navigate, Route, Redirect, useHistory, useNavigate } from 'react-router-dom';
import Forgot_pass from '../Modal/Forgot_pass';
import Loading from '../Modal/Loading';
import Error_empty from '../Modal/Error_empty';
import Empty_modal from '../Modal/Empty_modal';
const eye = <FontAwesomeIcon icon={faEye} />;
const eyeSlah = <FontAwesomeIcon icon={faEyeSlash} />;


function Log() {
    const [isAuthenticated, setIsAuthenticated] = useState();
    const [errorActive, setErrorActive] = useState(false);
    const [forgotPass, setForgotPass] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorEmptyActive, setErrorEmptyActive] = useState(false);
    const [errorUrl, setErrorUrl] = useState('');

    const [codeText, setCodeText] = useState('');
    const [textError, setTextError] = useState('');
    const [urlActive, setUrlActive] = useState(false);
    const [urlServer, setUrlServer] = useState("");

    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors }, reset, watch, getValues } = useForm();

    const onSubmit = (data) => {
        setIsLoading(true);

        loginAxios(data, (res) => {
            if (res.success) {
                const token = res.response.accessToken
                localStorage.setItem('token', token)
                setIsAuthenticated(true);
            } else {
                setErrorActive(true);
                setIsAuthenticated(false);
            }
            setIsLoading(false);

        }).catch((error) => {
            setTextError(error.message);
            setCodeText(error.code);
            setErrorEmptyActive(true);
            setIsLoading(false);
        });
    }
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false)
        }
    }, []);

    useEffect(() => {
        if (localStorage.getItem('url')) {
            checkAccount((res) => {
                if (res.success) {

                    if (isAuthenticated) {
                        if (res.response.type === 1) {
                            navigate('/admin/Choice');
                        } else if (res.response.type === 2 || res.response.type === 3) {
                            if (res.response.selectedDepartmentId === null) {
                                navigate('/user/UserChoice');
                                console.log('res.response.selectedDepartmentId === null')
                            } else {
                                navigate('/user/UserMain');
                                console.log('else')

                            }
                        }
                    }
                }
                else {
                    localStorage.removeItem('token');
                    setIsAuthenticated(false);
                }
            }).catch((error) => {
                setTextError(error.message);
                setCodeText(error.code);
                setErrorEmptyActive(true);
                setIsLoading(false);
            });
        } else {
            setUrlActive(true);

        }

    }, [isAuthenticated, navigate]);

    const [passwordShown, setPasswordShown] = useState(false);
    const togglePasswordVisiblity = () => {
        setPasswordShown(passwordShown ? false : true);
    };

    const editUrl = () => {
        localStorage.setItem('url', urlServer);

        setIsLoading(true);
        checkUrl(res => {
            if (res.version) {
                console.log(res)
                setUrlActive(false);
                localStorage.setItem('url', urlServer);
            }

            setIsLoading(false);

        }).catch((error) => {
            setErrorUrl(error.message);
            // setCodeText(error.code);
            // setErrorEmptyActive(true);
            setIsLoading(false);
        });
    }
    const handleUrlServer = e => {
        setUrlServer(e.target.value);

    };

    return (
        <>
            <Loading active={isLoading} setActive={setIsLoading} />
            <div id='body-content'>

                <div className='conteiner'>
                    <form className='auth-form' onSubmit={handleSubmit(onSubmit)} action='/'>
                        <div className='img-conteiner'>
                            <img src={require('../../img/logo.webp')} alt='Логотип КубГАУ' />
                        </div>

                        <input className='auth-email auth-input' type="email" placeholder='Почта' {...register("email", {
                            required: true, pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                        })} /><br></br>
                        {errors.email && <p className='auth-error'>Не корректный ввод почты</p>}

                        <div className='passw-eye'><input className='auth-input auth-pass' type={passwordShown ? "text" : "password"} placeholder='Пароль' {...register("password")} /><i onClick={togglePasswordVisiblity}>{passwordShown ? eyeSlah : eye}</i></div>
                        <div className='forgot_pass' onClick={() => { setForgotPass(true) }}>Забыли пароль?</div>
                        <div><input className='auth-submit' type='submit' value='Войти'></input></div>
                    </form>
                </div>
            </div >

            <Error_auth_data active={errorActive} setActive={setErrorActive} />
            <Forgot_pass active={forgotPass} setActive={setForgotPass} />
            <Error_empty active={errorEmptyActive} text={textError} codeText={codeText} />
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
        </>
    );
}

export default Log;
