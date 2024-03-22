import React from 'react';
import { getUserToken, saveUserToken, clearUserToken } from "../localStorage";
import Button from '@mui/material/Button';
import { useNavigate  } from 'react-router-dom';
import Navigation from '../components/navigation';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

const HomePage = ({ userToken, setUserToken }) => {
  const navigate = useNavigate ();

  return (
    <div>
      <Navigation />
                  <Button 
                    color="primary" 
                    variant="contained" 
                    onClick={() => {clearUserToken(); navigate("/authentication");}} //go back to login page
                  > 
                    Logout 
                  </Button>
    
                
    </div>
  );
};

export default HomePage;