import React from "react";
import { useState, useEffect } from "react";
import { getUserToken, saveUserToken, clearUserToken } from "./localStorage";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/authentication';
import HomePage from './pages/home';

export const SERVER_URL = "http://127.0.0.1:5000" 

function App() {

  let [userToken, setUserToken] = useState(getUserToken());

  return (
    <Router>
      <Routes>
        <Route
          path="/authentication"
          element={<LoginPage userToken={userToken} setUserToken={setUserToken} />}
        />
        <Route
          path="/"
          element={userToken ? <HomePage /> : <Navigate to="/authentication" replace />} //if user token is null, route is changed to /authentication
        />
      </Routes>
    </Router>
  );
}

export default App;
