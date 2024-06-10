import React, { useState } from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import './Modal.css'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Loading from './Loading';
import { checkUrl } from '../../network';

function Error_empty({ active, text, codeText }) {
    const [urlServer, setUrlServer] = useState("");
    const [errorUrl, setErrorUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleUrlServer = e => {
        setUrlServer(e.target.value);

    };

    const editUrl = () => {
        localStorage.setItem('url', urlServer);

        setIsLoading(true);
        checkUrl(res => {
            if (res.version) {
                console.log(res)
                localStorage.setItem('url', urlServer);
                window.location.reload();
            }

            setIsLoading(false);

        }).catch((error) => {
            setErrorUrl(error.message);
            setIsLoading(false);
        });
    }
    return (
        <><Loading active={isLoading} setActive={setIsLoading} />
            <div className={`modal ${active ? 'active' : ''}`}>
                <div className='modal-content'>
                    <div className='error-modal-empty'>
                        <div className='error-empty-header'>
                            <FontAwesomeIcon icon={faExclamationTriangle} className='error-icon' />
                            <p>Произошла ошибка:</p>
                        </div>
                        <p>{`${text}`}</p>
                        <p><b>Код ошибки: </b>{`${codeText}`}</p>
                        <p style={{ color: 'red', fontWeight: '700', display: 'block', width: '500px', lineHeight: '1.5' }}>Попробуйте заново ввести URL, если ошибка повториться, то свяжитесь со службой поддержки</p>
                        <p><b>Введите URL:</b></p>
                        <input
                            className='url-input'
                            value={urlServer}
                            onChange={handleUrlServer}
                            placeholder='URL...' />
                        {(errorUrl !== '') && <p style={{color: 'red', fontSize: '12px', marginTop: '-25px', position: 'absolute'}}>{errorUrl}</p>}

                        <div className='url-modal-button'>
                            <button
                                onClick={() => { editUrl(); }}
                            >Сохранить</button>
                        </div>
                    </div>
                </div>
            </div></>
    )
}

export default Error_empty