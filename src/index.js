import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'
import './index.css';
import Choice from '../src/components/admin/Choice'
import Log from './components/auth/Log';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
        

  // </React.StrictMode>
);

reportWebVitals();
