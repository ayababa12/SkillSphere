import React from 'react';
import { getUserToken, saveUserToken, clearUserToken } from "../localStorage";
import {Button, Typography }from '@mui/material';
import { useNavigate  } from 'react-router-dom';
import Navigation from '../components/navigation';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import "../App.css"
const HomePage = ({ isManager }) => {
  const navigate = useNavigate ();

  return (
    <div>
      <div className="welcomeBanner">
          <Typography className="welcomeText" variant='h4'>Welcome Back!</Typography>
      </div>
      <hr></hr>
      <div >
                  <Button  className='mui-button'
                    variant="contained" 
                    onClick={() => {clearUserToken(); navigate("/authentication");}} //go back to login page
                  > 
                    Logout 
                  </Button>
    
      </div>
      <Navigation isManager={isManager}/>
    </div>
  );
};

export default HomePage;