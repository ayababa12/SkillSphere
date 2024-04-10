import React, {useState, useEffect} from 'react';
import { getUserToken, saveUserToken, clearUserToken } from "../localStorage";
import {Button, Typography }from '@mui/material';
import { useNavigate  } from 'react-router-dom';
import Navigation from '../components/navigation';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import "../App.css"
const HomePage = ({ isManager, userName, SERVER_URL }) => {
  let [deadlineList, setDeadlineList] = useState([]);
  const navigate = useNavigate ();
  const getUpcomingDeadlines = () => {
    fetch(`${SERVER_URL}/upcomingDeadlines`, {method: "GET"})
    .then((response) => response.json())
    .then((array) =>{ setDeadlineList(array["result"]); console.log(array["result"])})
    
    }
  useEffect(getUpcomingDeadlines, [])
  return (
    <div>
      <div className="welcomeBanner">
          <Typography className="welcomeText" variant='h4'>Welcome Back, {userName}!</Typography>
          <ul>
          {deadlineList.map((item, index) => (
            <li key={index}>{item[0]}: {item[1]} due by {item[2]}</li>
          ))}
        </ul>
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