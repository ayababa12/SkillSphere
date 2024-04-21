import React, { useState } from "react";
import { Typography, TextField, Button, Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import { getUserToken } from "../localStorage";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function AnnouncementForm() {
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleSubmit = (event) => {
    event.preventDefault();
    const SERVER_URL = "http://127.0.0.1:5000"; // Replace with your actual server URL
    const token = getUserToken(); // Get the authentication token

    fetch(`${SERVER_URL}/announcement`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the authentication token in the headers
      },
      body: JSON.stringify({ content }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(() => {
        setContent("");
        setSuccessMsg("Announcement successfully created");
        setOpenSnackbar(true);
        navigate("/"); // Navigate back to home route after adding the announcement
      })
      .catch((error) => {
        setError(error.message);
        setOpenSnackbar(true);
      });
  };

  const handleCancel = () => {
    navigate("/"); // Navigate back to home route when cancel button is clicked
  };

  const handleCloseSnackbar = (reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <div className="formPage" style={{ backgroundColor: "#cce4f1" }}>
      <div className="form">
      <Typography className="taskDetailsContainer" variant="h4" style={{ fontFamily: 'Garamond, cursive', textAlign: 'center' ,fontWeight:'bold',color:'white'}} >Add Announcement</Typography>
        <form onSubmit={handleSubmit}>
          <div className="form-item">
            <TextField
              fullWidth
              label="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              margin="normal"
              multiline
              rows={4}
            />
          </div>
          <div className="form-item">
          <Button 
            sx={{
                backgroundColor: '#cce4f1', 
                marginLeft: '10px', 
                marginBottom: '10px',
                color: 'black',
                fontFamily: 'Garamond, cursive', // Add font-family property
                fontWeight:'bold',
                transition: 'background-color 0.3s', // Smooth transition effect
                '&:hover': {
                    backgroundColor: '#8ab6d6', // Pastel red color on hover
                },
                display: 'block', // Center the button
                marginLeft: 'auto', // Center the button
                marginRight: 'auto', // Center the button
                marginTop: '20px', // Add top margin
                marginBottom: '20px', // Add bottom margin
            }}
            type="submit"
            color="primary" 
            variant="contained" 
              
            
            > 
            Add Announcement 
            </Button> 
            <Button 
            sx={{
                backgroundColor: '#f08080', 
                marginLeft:'10px', 
                marginBottom:"10px",
                color:'black',
                fontWeight:'bold',
                fontFamily: 'Garamond, cursive', // Add font-family property
                transition: 'background-color 0.3s', // Smooth transition effect
                '&:hover': {
                backgroundColor: '#e42020', // Pastel red color on hover
                },
                display: 'block', // Center the button
                marginLeft: 'auto', // Center the button
                marginRight: 'auto', // Center the button
                marginTop: '20px', // Add top margin
                marginBottom: '20px', // Add bottom margin
            }}
            color="primary" 
            variant="contained" 
            onClick={() => navigate("/")} // Go back to login page
            > 
            Cancel
            </Button>
          </div>
        </form>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          {error ? (
            <Alert onClose={handleCloseSnackbar} severity="error">
              {error}
            </Alert>
          ) : (
            <Alert onClose={handleCloseSnackbar} severity="success">
              {successMsg}
            </Alert>
          )}
        </Snackbar>
      </div>
    </div>
  );
}

export default AnnouncementForm;
