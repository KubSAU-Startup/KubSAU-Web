import './User_choice.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate, Link, redirect, useNavigate
} from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { checkAccount, modifySession, checkUrl } from '../../network';
import Error_modal from '../Modal/Error_modal';
import { getTextError } from '../../network';
import Loading from '../Modal/Loading';
import Error_empty from '../Modal/Error_empty';
import Empty_modal from '../Modal/Empty_modal';

function User_choice() {

  const [errorActive, setErrorActive] = useState(false);
  const [textError, setTextError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [errorEmptyActive, setErrorEmptyActive] = useState(false);
  const [codeText, setCodeText] = useState('');
  const navigate = useNavigate();
  const [urlActive, setUrlActive] = useState(false);
  const [urlServer, setUrlServer] = useState('');


  useEffect(() => {
    if (localStorage.getItem('url')) {

      setIsLoading(true);

      checkAccount((res) => {
        if (res.error) {
          setTextError(getTextError(res.error));
          setErrorActive(true);
        } else {
          setDepartments(res.response.departments);
          if (res.response.selectedDepartmentId !== null) {
            navigate('/user/UserMain');
          }
        }
        setIsLoading(false);


      }).catch((error) => {
        setTextError(error.message);
        setCodeText(error.code);
        setErrorEmptyActive(true);
        setIsLoading(false);
      });
    } else {
      setUrlActive(true);
      setIsLoading(false);

    }
  }, []);
  const editUrl = () => {
    setIsLoading(true);
    checkUrl(res => {
      if (res.version !== null) {
        setUrlActive(false);
        localStorage.setItem('url', urlServer);
      } 
      setIsLoading(false);

    })
  }
  const handleUrlServer = e => {
    setUrlServer(e.target.value);

  };

  const sendDepartment = (departmentId) => {
    setIsLoading(true);
    modifySession(departmentId, (res) => {
      if (res.error) {
        setTextError(getTextError(res.error));
        setErrorActive(true);
      } else {
        const token = res.response.modifiedToken
        localStorage.setItem('token', res.response.modifiedToken)
        navigate('/user/UserMain');
      }
      setIsLoading(false);

    }).catch((error) => {
      setTextError(error.message);
      setCodeText(error.code);
      setErrorEmptyActive(true);
      setIsLoading(false);
    });
  }

  return (
    <>
      <Loading active={isLoading} setActive={setIsLoading} />
      <div id='body-content'>

        <div className='choice-conteiner'>
          <div className='content-title-choice'>
            <p className='title-choice'>Выберите кафедру: </p>
          </div>
          <div className='choice-cart-conteiner'>
            {departments.map(value =>
              <div className='choice-cart' key={value.id} onClick={() => { sendDepartment(value.id) }}>
                <p>{value.title}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Error_modal active={errorActive} setActive={setErrorActive} text={textError} setText={setTextError} />
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
          <div className='url-modal-button'>
            <button onClick={() => { editUrl() }}>Сохранить</button>
          </div>
        </div>
      </Empty_modal>
    </>
  )
}

export default User_choice