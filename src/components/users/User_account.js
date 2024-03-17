import React from 'react';
import User_header from './User_header';


function User_account() {
    return (
        <>
            <User_header />
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
                                <span>Кафедра: </span>
                                <span>Статус: </span>

                            </div>
                            <div>
                                <p>Компьютерных технологий и систем</p>
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
                                <img src={require('../../img/mail.png')} width={'25px'} />
                                <img src={require('../../img/lock.png')} width={'20px'} />
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

export default User_account;