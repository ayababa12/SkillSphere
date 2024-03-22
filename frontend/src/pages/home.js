import React from 'react';
import { getUserToken, saveUserToken, clearUserToken } from "../localStorage";
import Button from '@mui/material/Button';
import { useNavigate  } from 'react-router-dom';
import Navigation from '../components/navigation';

const HomePage = ({ userToken, setUserToken }) => {
  const navigate = useNavigate ();

  return (
    <div>
      <Navigation />
      <h1>Home Page</h1>
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