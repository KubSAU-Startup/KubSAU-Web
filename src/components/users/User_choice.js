import './User_choice.css';
import { useNavigate } from "react-router-dom";
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

  // получение данных о кафедрах сотрудника
  useEffect(() => {
    setIsLoading(true);
    checkAccount((res) => {
      if (res.error) {
        setTextError(getTextError(res.error));
        setErrorActive(true);
      } else {
        setDepartments(res.response.departments);
      }
      setIsLoading(false);
    }).catch((error) => {
      setTextError(error.message);
      setCodeText(error.code);
      setErrorEmptyActive(true);
      setIsLoading(false);
    });
  }, []);

  // функция выбора кафедры
  const sendDepartment = (departmentId) => {
    setIsLoading(true);
    modifySession(departmentId, (res) => {
      if (res.error) {
        setTextError(getTextError(res.error));
        setErrorActive(true);
      } else {
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
      {/* компонент загрузки */}
      <Loading active={isLoading} setActive={setIsLoading} />
      <div id='body-content'>

        <div className='choice-conteiner'>
          <div className='content-title-choice'>
            <p className='title-choice'>Выберите кафедру: </p>
          </div>
          <div className='choice-cart-conteiner'>
            {/* кафедры на выбор */}
            {departments.map(value =>
              <div className='choice-cart' key={value.id} onClick={() => { sendDepartment(value.id) }}>
                <p>{value.title}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* окна ошибок */}
      <Error_modal active={errorActive} setActive={setErrorActive} text={textError} setText={setTextError} />
      <Error_empty active={errorEmptyActive} text={textError} codeText={codeText} />
    </>
  )
}

export default User_choice