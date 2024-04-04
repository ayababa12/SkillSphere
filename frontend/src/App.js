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
import TaskDetails from './pages/TaskDetails';
import SubtaskForm from './pages/SubtaskForm';
import SubtaskDetails from './pages/SubtaskDetails';
export const SERVER_URL = "http://127.0.0.1:5000";

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

        <Route
          path="/tasks"
          element={<TaskList isManager={isManager} />}
        />

        <Route
          path="/tasks/create"
          element={isManager ? <TaskForm /> : <Navigate to="/" replace />}
        />
        <Route
          path="/tasks/:task_id" element={<TaskDetails isManager={isManager} />}
        />
        <Route
          path="/tasks/:task_id/subtasks/create" element={<SubtaskForm />}
        />
        <Route
          path="/tasks/:task_id/subtasks/view" element={<SubtaskDetails isManager={isManager} />}
        />
        <Route
            path="/notFound"
            element={<Error/>}
          />
      </Routes>
      
    </Router>
  );
}

export default App;
