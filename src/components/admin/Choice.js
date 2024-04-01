import './Choice.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate, Link, redirect, useNavigate
} from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { checkAccount } from '../../network';
import Error_modal from '../Modal/Error_modal';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Choice() {

  const [errorActive, setErrorActive] = useState(false);
  const [textError, setTextError] = useState('');

  useEffect(() => {
    checkAccount((res) => {
      if (res.error) {
        switch (res.error.code) {
          case 101:
            setTextError('Неверные учетные данные!');
            break;
          case 102:
            setTextError('Требуется токен доступа!');
            break;
          case 103:
            setTextError('Сессия истекла!');
            break;
          default:
            setTextError('Неизвестная ошибка!');
        }
        setErrorActive(true);

      } 
    })
  }, []);

  return (
    <><div className='cont-carts'>



      <Link to={'/AdminMain'} className='views-info'>
        <img className='choice-img' src={require('../../img/file.png')} />
        <div className='choice-text'>
          <p>Просмотр и редактирование информации</p>
        </div>
        <img className='choice-arrow' src={require('../../img/arrow.png')} />
      </Link>




      <Link to={'/CreateQR'} className='createQR'>
        <img className='choice-img' src={require('../../img/qr.png')} />
        <div className='choice-text'>
          <p>Создать QR-код</p>
        </div>
        <img className='choice-arrow' src={require('../../img/arrow.png')} />
      </Link>
    </div><Error_modal active={errorActive} setActive={setErrorActive}>
        <div className='error-modal'>
          <div className='error-modal-header'>
            <FontAwesomeIcon icon={faExclamationTriangle} className='error-icon' />
            <p>Произошла ошибка:</p>
          </div>
          <p>{`${textError}`}</p>
          <p>Попробуйте авторизоваться</p>
          <Link to='/Log' className='btn-to-log'>Авторизоваться</Link>
        </div>
      </Error_modal></>
  )
}

export default Choice