import React, { useState, useEffect } from 'react';
import { Button, Typography, MenuItem, Select } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Navigation from '../components/navigation';
import { Link } from 'react-router-dom';
import { getUserToken, clearUserToken, clearUserName } from "../localStorage";
import "../App.css"

const HomePage = ({ isManager, userName, SERVER_URL }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [sortOrder, setSortOrder] = useState('newest'); // Default sort order
  const navigate = useNavigate(); // Define navigate

  // Function to fetch announcements from the server
  const fetchAnnouncements = () => {
    fetch(`${SERVER_URL}/?sort_order=${sortOrder}`, { method: "GET" }) // Pass sort_order as query parameter
      .then((response) => response.json())
      .then((data) => setAnnouncements(data))
      .catch((error) => console.error('Error fetching announcements:', error));
  };

  useEffect(() => {
    fetchAnnouncements(); // Fetch announcements when component mounts or when sort order changes
  }, [SERVER_URL, sortOrder]);

  // Function to handle sort order change
  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value); // Update sort order
  };

  // Function to handle logout
  const handleLogout = () => {
    clearUserToken();
    clearUserName();
    navigate("/authentication");
  };

  useEffect(() => {
    // JavaScript or React code to toggle the class
    const container = document.querySelector('.announcementsContainer');
    container.classList.toggle('show');
  }, []); // This useEffect will run once when the component mounts

  function deleteAnnouncement(id){
    return fetch(`${SERVER_URL}/announcement/${id}`,{method:"DELETE"})
    .then((response) => response.json())
    .then((data) => fetchAnnouncements());
  }

  return (
    <div>
      <div className="welcomeBanner">
        <Typography className="welcomeText" variant='h4'>Welcome Back, {userName}!</Typography>
        <div>
          <Button
            sx={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              backgroundColor: '#f08080',
              color: 'black',
              fontWeight:'bold',
              marginBottom: '10px',
              fontFamily: 'Garamond, cursive',
              transition: 'background-color 0.3s',
              '&:hover': {
                backgroundColor: '#e42020',
              }
            }}
            variant="contained"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </div>

      <Navigation isManager={isManager} />

      <div className={`announcementsContainer ${announcements.length > 0 ? 'show' : ''}`}>
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
          <Select
            value={sortOrder}
            onChange={handleSortOrderChange}
            variant="outlined"
            className="sortOrderSelect" // Apply the sortOrderSelect class
            MenuProps={{ classes: { paper: 'dropdownMenu' } }} // Apply the dropdownMenu class to the drop-down menu
          >
            <MenuItem value="newest">Newest to Oldest</MenuItem>
            <MenuItem value="oldest">Oldest to Newest</MenuItem>
          </Select>
        </div>

        {announcements.map((announcement, index) => (
          <div key={index} className="announcementWrapper">
            <div className="authorAndDate">
              <Typography className="author" variant="h6">{announcement.employee.first_name} {announcement.employee.last_name}</Typography>
              <Typography variant="body2" className="date">{announcement.date_posted}</Typography>
            </div>
            <Typography variant="body1">{announcement.content}</Typography>
            <div className="authorAndDate">
            {isManager &&  <Button variant="text" onClick={() => deleteAnnouncement(announcement.id)}>Delete</Button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
