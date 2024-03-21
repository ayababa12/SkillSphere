import React from "react";
import { useState, useEffect } from "react";
import { getUserToken, saveUserToken, clearUserToken } from "./localStorage";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/login';
import HomePage from './pages/home';

var SERVER_URL = "http://127.0.0.1:5000" 

function App() {

  let [userToken, setUserToken] = useState(getUserToken()); 

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={<LoginPage />}
        />
        <Route
          path="/"
          element={userToken ? <HomePage /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
