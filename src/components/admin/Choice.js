import './Choice.css';
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate, Link, redirect, useNavigate
} from "react-router-dom";
import { data_token } from '../../network';

function Choice() {
  // if(data_token != localStorage.getItem('token')){
  //   return <Navigate to='/Log'/>
  // }

  return (
    <div className='cont-carts' >



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
  )
}

export default Choice