import React from 'react';
import { getUserToken, saveUserToken, clearUserToken } from "../localStorage";
import Button from '@mui/material/Button';
import { useNavigate  } from 'react-router-dom';
import Navigation from '../components/navigation';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

const HomePage = ({ isManager }) => {
  const navigate = useNavigate ();

  return (
    <div>
      
      
      <div style={{ marginTop:'15px',marginLeft: '1430px' }}>
                  <Button  style={{backgroundColor: '#1f4d20'}}
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