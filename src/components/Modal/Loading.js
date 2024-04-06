import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import './Loading.css'

function Loading({ active, setActive }) {
    return (
        <div className={`conteiner-loading ${active ? "active" : ""}`}>
          <CircularProgress className='loading' color="success" />
        </div>
      );
}

export default Loading;