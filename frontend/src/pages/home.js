import React, {useState, useEffect} from 'react';
import { getUserToken, saveUserToken, clearUserToken, clearUserName } from "../localStorage";
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
    .then((array) =>{ setDeadlineList(array["result"]);})
    
    }
  useEffect(getUpcomingDeadlines, [])
  return (
    <div>
      <div className="welcomeBanner">
          <Typography className="welcomeText" variant='h4'>Welcome Back, {userName}!</Typography>
          {deadlineList.length > 0 ? 
          (<div>
          <Typography className="upcomingDeadlines">Upcoming Deadlines:</Typography>
          <div className = "deadlinesList">
              <ul>
              {deadlineList.map((item, index) => (
                <li key={index}>{item[0]} — {item[1]} due by {item[2]}</li>
              ))}
            </ul>
        </div>
        </div>):
        (<div></div>)
            }
      </div>
      
      <hr></hr>
      <div >
                  <Button  className='mui-button'
                    variant="contained" 
                    onClick={() => {clearUserToken(); clearUserName(); navigate("/authentication");}} //go back to login page
                  > 
                    Logout 
                  </Button>
    
      </div>
      <Navigation isManager={isManager}/>
      <div className="announcementsContainer">
              <div className="announcement-header">
              <Typography variant='h5' className="announcementText">Announcements</Typography>
              {isManager && <Button className="addAnnouncementButton" variant="contained">Add Announcement</Button>}
              </div>
              <div className="announcementWrapper">
                <Typography className="author" variant="h7">Ashley White</Typography> 
                <Typography variant="h8">We have signed a new deal with UMG! I am excited about the new marvelous adventure! Cheers for more opportunities!</Typography>
              </div>
              <div className="announcementWrapper">
                <Typography className="author" variant="h7">Morgan Freeman</Typography> 
                <Typography variant="h8">We wish you and your loved ones a blessed holiday. Eid Moubarak!</Typography>
              </div>
              <div className="announcementWrapper">
                <Typography className="author" variant="h7">Morgan Freeman</Typography> 
                <Typography variant="h8">We are thrilled to announce the launch of our latest innovation. After months of hard work and dedication from our talented team, we are excited to bring this revolutionary product to market.</Typography>
              </div>
      </div>
    </div>
  );
};

export default HomePage;