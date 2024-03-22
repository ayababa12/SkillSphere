import React from 'react';
import { getUserToken, saveUserToken, clearUserToken } from "../localStorage";
import Button from '@mui/material/Button';
import { useNavigate  } from 'react-router-dom';


const HomePage = ({ userToken, setUserToken }) => {
  const navigate = useNavigate ();

  return (
    <div>
      <h1>Home Page</h1>
      {/* Add home page content here */}
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