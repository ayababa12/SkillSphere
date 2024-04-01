import React from "react";
import { useState, useEffect } from "react";
import { getUserToken, saveUserToken, clearUserToken ,getIsManager, saveIsManager} from "./localStorage";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/authentication';
import HomePage from './pages/home';
import {CreateEmployeePage, DisplayEmployeePage} from './pages/employees';
import UserProfilePage from "./pages/employeeProfile"
import TaskForm from './pages/TaskForm'; 
import TaskList from './pages/TaskList'; 
import Error from "./pages/error"

export const SERVER_URL = "http://127.0.0.1:5000" 

function App() {

  let [userToken, setUserToken] = useState(getUserToken());
  let [isManager, setIsManager] = useState(localStorage.getItem('isManager')); // to know if the user is a manager or not

  return (
    <Router>
      <Routes>
        <Route
          path="/authentication"
          element={<LoginPage userToken={userToken} setUserToken={setUserToken} isManager={isManager} setIsManager={setIsManager} />}
        />
        <Route
          path="/"
          element={userToken ? <HomePage isManager={isManager}/> : <Navigate to="/authentication" replace />} //if user token is null, route is changed to /authentication
        />
        <Route
              path="/employees"
              element={<DisplayEmployeePage isManager={isManager} userToken={userToken}/>}
          />
        <Route
            path="/createEmployee"
            element={<CreateEmployeePage/>}
          />
          {/* Dynamic route for specific user profiles */}
        <Route path="employees/:email" element={<UserProfilePage userToken={userToken}/>} /> 

        <Route path="/tasks" element={<TaskForm />} />

        {/*
        <Route 
        path="/tasks" 
        element={userToken ? <TaskList /> : <Navigate to="/authentication" replace />} 
        />
        
        <Route 
        path="/tasks/create" 
        element={isManager ? <TaskForm onTaskCreated={() => {}} /> : <Navigate to="/" replace />} 
        />
  */}
        
      
        <Route
            path="/notFound"
            element={<Error/>}
          />
      </Routes>
      
    </Router>
  );
}

export default App;
