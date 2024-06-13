import './App.css';
import React, { useState, useEffect } from "react"

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Choice from './components/admin/Choice';
import Admin_main from './components/admin/Admin_main';
import CreateQR from './components/admin/CreateQR';
import Log from './components/auth/Log'
import Admin_department from './components/admin/Admin_department';
import Admin_students from './components/admin/Admin_students';
import Admin_direction from './components/admin/Admin_direction';
import Admin_account from './components/admin/Admin_account';
import Admin_users from './components/admin/Admin_users';
import User_header from './components/users/User_header';
import User_account from './components/users/User_account';
import User_main from './components/users/User_main';
import User_subject from './components/users/User_subject';
import User_prof from './components/users/User_prof';
import Admin_groups from './components/admin/Admin_groups';
import User_choice from './components/users/User_choice';
import { AdminRoute, UserRoute } from './Routes';

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false)
    }
  }, []);

  return (
    <div className="App">
   <BrowserRouter>

      <Routes>
        <Route path='/' element={<Log />} />
        <Route path='admin/' element={<AdminRoute />}>
          <Route path='Choice' element={<Choice />} />  
          <Route path='AdminMain' element={<Admin_main />} />
          <Route path='CreateQR' element={<CreateQR />} />
          <Route path='AdminDepartment' element={<Admin_department />} />
          <Route path='AdminStud' element={<Admin_students />} />
          <Route path='AdminGroup' element={<Admin_groups />} />
          <Route path='AdminDirection' element={<Admin_direction />} />
          <Route path='AdminAccount' element={<Admin_account />} />
          <Route path='AdminUsers' element={<Admin_users />} />
        </Route>
        <Route path='user/' element={<UserRoute />}>
          <Route path='UserChoice' element={<User_choice />} />
          <Route path='UserAccount' element={<User_account />} />
          <Route path='UserMain' element={<User_main />} />
          <Route path='UserSubject' element={<User_subject />} />
          <Route path='UserProf' element={<User_prof />} />
        </Route>
      </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;

