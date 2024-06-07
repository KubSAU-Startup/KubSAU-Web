import './User_choice.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate, Link, redirect, useNavigate
} from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { checkAccount, modifySession } from '../../network';
import Error_modal from '../Modal/Error_modal';
import { getTextError } from '../../network';
import Loading from '../Modal/Loading';
import Error_empty from '../Modal/Error_empty';

function User_choice() {

  const [errorActive, setErrorActive] = useState(false);
  const [textError, setTextError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [errorEmptyActive, setErrorEmptyActive] = useState(false);
  const [codeText, setCodeText] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    setIsLoading(true);

    checkAccount((res) => {
      if (res.error) {
        setTextError(getTextError(res.error));
        setErrorActive(true);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        setDepartments(res.response.departments);
        if (res.response.selectedDepartmentId !== null) {
          navigate('/user/UserMain');
        }
        console.log(res)
      }

    }).catch((error) => {
      setTextError(error.message);
      setCodeText(error.code);
      setErrorEmptyActive(true);
      setIsLoading(false);
    });
  }, []);
  // console.log(localStorage.setItem('token'));

  const sendDepartment = (departmentId) => {
    modifySession(departmentId, (res) => {
      if (res.error) {
        setTextError(getTextError(res.error));
        setErrorActive(true);
        setIsLoading(false);

      } else {
        setIsLoading(false);
        // localStorage.removeItem('token')
        // console.log(localStorage.setItem('token'));
        const token = res.response.modifiedToken
        console.log(res.response.modifiedToken);

        localStorage.setItem('token', res.response.modifiedToken)
        navigate('/user/UserMain');

        console.log(res)
      }
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
    </>
  )
}

export default User_choice