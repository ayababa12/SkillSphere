import React, { useState, useEffect } from 'react';
import { getUserToken, saveUserToken, clearUserToken, clearUserName } from "../localStorage";
import { Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Navigation from '../components/navigation';
import "../App.css"
import { Link } from 'react-router-dom';
const HomePage = ({ isManager, userName, SERVER_URL, email }) => {
  let [announcements, setAnnouncements] = useState([]);
  const navigate = useNavigate(); // Define navigate

  // Function to fetch announcements from the server
  const fetchAnnouncements = () => {
    fetch(`${SERVER_URL}/`, { method: "GET" })
      .then((response) => response.json())
      .then((data) => setAnnouncements(data))
      .catch((error) => console.error('Error fetching announcements:', error));
  };


  useEffect(() => {
    fetchAnnouncements(); // Fetch announcements when component mounts
  }, [SERVER_URL]); // Re-fetch announcements when SERVER_URL changes

  return (
    <div>
      <div className="welcomeBanner">
        <Typography className="welcomeText" variant='h4'>Welcome Back, {userName}!</Typography>
      </div>

      <hr></hr>

      <div>
        <Button className='mui-button'
          variant="contained"
          onClick={() => { clearUserToken(); clearUserName(); navigate("/authentication"); }} // Use navigate here
        >
          Logout
        </Button>
      </div>

      <Navigation isManager={isManager} />

      <div className="announcementsContainer">
        <div className="announcement-header">
          <Typography variant='h5' className="announcementText">Announcements</Typography>
          {isManager && (
            <Button
              className="addAnnouncementButton"
              variant="contained"
              component={Link} // Use Link component from react-router-dom
              to="/announcement" // Specify the destination URL
            >
              Add Announcement
            </Button>
          )}
        </div>


        {announcements.map((announcement, index) => (
          <div key={index} className="announcementWrapper">
            <div className="authorAndDate">
              <Typography className="author" variant="h6">{announcement.employee.first_name} {announcement.employee.last_name}</Typography>
              <Typography variant="body2" className="date">{announcement.date_posted}</Typography>
            </div>
            <Typography variant="body1">{announcement.content}</Typography>
          </div>
        ))}


      </div>
    </div>
  );
};

export default HomePage;
