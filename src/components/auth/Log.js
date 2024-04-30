import './Log.css';
import { useForm } from "react-hook-form";
import React, { useState } from 'react';
import { loginAxios } from "../../network"
import Error_auth_data from '../Modal/Error_auth_data';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faL } from "@fortawesome/free-solid-svg-icons";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Link, Navigate, Route, Redirect, useHistory } from 'react-router-dom';
import Forgot_pass from '../Modal/Forgot_pass';
import Loading from '../Modal/Loading';
const eye = <FontAwesomeIcon icon={faEye} />;
const eyeSlah = <FontAwesomeIcon icon={faEyeSlash} />;


function Log() {
    const [isAuthenticated, setIsAuthenticated] = useState();
    const [errorActive, setErrorActive] = useState(false);
    const [forgotPass, setForgotPass] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset, watch, getValues } = useForm();

    const onSubmit = (data) => {
        setIsLoading(true);
        
        loginAxios(data, (res) => {
            console.log('before')
            if (res.success) {
                const token = res.response.accessToken
                localStorage.setItem('token', token)
                setIsAuthenticated(true);
                setIsLoading(false);
            } else {
                setErrorActive(true);
                setIsLoading(false);
            }
        })
    }

    

    const [passwordShown, setPasswordShown] = useState(false);
    const togglePasswordVisiblity = () => {

        setPasswordShown(passwordShown ? false : true);

    };

    if (isAuthenticated) {
        return <Navigate to='/Choice' />
    }
    return (
        <>
        <Loading active={isLoading} setActive={setIsLoading}/>

        <div className='conteiner'>
            <form className='auth-form' onSubmit={handleSubmit(onSubmit)} action='/'>
                <div className='img-conteiner'>
                    <img src={require('../../img/logo.png')} alt='Логотип КубГАУ' />
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
            <Error_auth_data active={errorActive} setActive={setErrorActive} />
            <Forgot_pass active={forgotPass} setActive={setForgotPass} /></>
    );
}

export default Log;
