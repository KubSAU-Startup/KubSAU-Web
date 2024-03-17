import './Log.css';
import { useForm } from "react-hook-form";
import React, { useState } from 'react';
import {loginAxios} from "../../network"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Link, Navigate, Route, Redirect, useHistory  } from 'react-router-dom';
const eye = <FontAwesomeIcon icon={faEye} />;
const eyeSlah = <FontAwesomeIcon icon={faEyeSlash} />;


function Log() {
    const [isAuthenticated, setIsAuthenticated] = useState();
    const mess = () => {
        alert('Позвоните по номеру телефона: +7 (000) 000-00-00');
    }
    const { register, handleSubmit, formState: { errors }, reset, watch, getValues } = useForm();

    const onSubmit = (data) => {
        loginAxios(data, (res) => {
            if (res.success) {
                const token = res.response.accessToken
                localStorage.setItem('token', token)
                setIsAuthenticated(true)
            } else {
                alert('Не верные данные')
            }
        })
    }
    
    const [passwordShown, setPasswordShown] = useState(false);
    const togglePasswordVisiblity = () => {

        setPasswordShown(passwordShown ? false : true);

    };
    
    if(isAuthenticated){
        return <Navigate to='/Choice'/>
    }
    return (
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
                <div className='forgot_pass' onClick={mess}>Забыли пароль?</div>
                <div><input className='auth-submit' type='submit' value='Войти'></input></div>
            </form>
        </div>
    );
}

export default Log;
