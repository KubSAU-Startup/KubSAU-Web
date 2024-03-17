import React from 'react';
import Admin_header from './Admin_header';
import './Admin_account.css'

function Admin_account() {
    return (
        <>
            <Admin_header />
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
                            <div>
                                <span>Фамилия: </span>
                                <span>Имя: </span>
                                <span>Отчество: </span>
                                <span>Статус: </span>

                            </div>
                            <div>
                                <p>Василенко</p>
                                <p>Игорь</p>
                                <p>Иванович</p>
                                <p>Администратор</p>
                            </div>
                        </div>

                        <button>Редактировать</button>

                    </div>
                    <div className='secure'>
                        <div>
                            <h2>Безопасность</h2>

                        </div>
                        <div className='data'>
                            <div>
                                <img src={require('../../img/mail.png')} width={'25px'}/>
                                <img src={require('../../img/lock.png')} width={'20px'}/>
                            </div>
                            <div>
                                <span>Почта: </span>

                                <span>Пароль: </span>
                            </div>
                            <div>
                                <p>vasilenko.i@kubsau.ru</p>

                                <div className='secure-password'>
                                    <input type='password' value={'kkkkkkkkkkkkkk'} />
                                </div>
                            </div>
                        </div>

                        <div><button>Изменить</button></div>

                    </div>
                </div>
            </div >
        </>
    );
}

export default Admin_account;