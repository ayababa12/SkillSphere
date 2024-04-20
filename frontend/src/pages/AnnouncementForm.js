import React, { useState } from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import { getUserToken, saveUserToken, clearUserToken, clearUserName } from "../localStorage";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function AnnouncementForm() {
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleSubmit = (event) => {
    event.preventDefault();
    const SERVER_URL = "http://127.0.0.1:5000"; // Replace with your actual server URL
    const token = getUserToken(); // Get the authentication token
  
    fetch(`${SERVER_URL}/announcement`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Include the authentication token in the headers
      },
      body: JSON.stringify({ content }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(() => {
        setContent('');
        setSuccessMsg('Announcement successfully created');
        setOpenSnackbar(true);
        navigate('/'); // Navigate back to home route after adding the announcement
      })
      .catch(error => {
        setError(error.message);
        setOpenSnackbar(true);
      });
  };
  
  const handleCancel = () => {
    navigate('/'); // Navigate back to home route when cancel button is clicked
  };

  const handleCloseSnackbar = (reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <div className="formPage">
      <div className='form'>
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
              type="submit"
              variant="contained"
              sx={{ marginRight: 2 ,backgroundColor: '#1f4d20'}}
            >
              Add Announcement
            </Button>
            <Button
              type="button"
              variant="contained"
              onClick={handleCancel}
              sx={{ backgroundColor: '#f44336'}}
            >
              Cancel
            </Button>
          </div>
        </form>
        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
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
