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
import { getTextError } from '../../network';
import Loading from '../Modal/Loading';

function Choice() {

  const [errorActive, setErrorActive] = useState(false);
  const [textError, setTextError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    checkAccount((res) => {
      if (res.error) {
        setTextError(getTextError(res.error));
        setErrorActive(true);
        setIsLoading(false);
      }else{
        setIsLoading(false);
      }

    })
  }, []);

  return (
    <>
      <Loading active={isLoading} setActive={setIsLoading}/>

      <div className='cont-carts'>
       
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
      </div>

      <Error_modal active={errorActive} setActive={setErrorActive} text={textError} setText={setTextError} />
    </>
  )
}

export default Choice