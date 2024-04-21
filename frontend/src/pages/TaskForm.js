import React from "react";
import { useState } from "react";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import MuiAlert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import { Button, TextField, Snackbar,Typography } from '@mui/material';
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function TaskForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState(null);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleSubmit = (event) => {
    event.preventDefault();
    const SERVER_URL = "http://127.0.0.1:5000"; // Replace with your actual server URL

    fetch(`${SERVER_URL}/tasks/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description, deadline }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(() => {
        setTitle('');
        setDescription('');
        setDeadline(null);
        setSuccessMsg('Task successfully created');
        setOpenSnackbar(true);
        navigate('/tasks'); // Navigate back to /tasks route after adding the task
      })
      .catch(error => {
        setError(error.message);
        setOpenSnackbar(true);
      });
  };

  const handleCloseSnackbar = (reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <div className="formPage">
        <body className="formPage">
        <div className='form'>
        <Typography variant="h4" style={{ fontFamily: 'Garamond, cursive', textAlign: 'center' ,fontWeight:'bold'}} gutterBottom>Add Task</Typography>
      <form onSubmit={handleSubmit}>
      <div className="form-item"> 
      <TextField
        fullWidth
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        margin="normal"
      />
      </div>
      <div className="form-item"> 
      <TextField
        fullWidth
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        margin="normal"
        multiline
        rows={4}
      />
      </div>
      <div className="form-item"> 
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateTimePicker
          label="Deadline"
          value={deadline}
          onChange={setDeadline}
          required
          renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
        />
      </LocalizationProvider>
      </div>
      {error && <p className="error">{error}</p>}
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
color="primary" 
variant="contained" 
  
>
  Add Task
</Button>
<Button 
 sx={{
  backgroundColor: '#f08080', 
  marginLeft: '10px', 
  marginBottom: '10px',
  color: 'black',
  fontFamily: 'Garamond, cursive', // Add font-family property
  fontWeight:'bold',
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
            onClick={() => navigate("/tasks")} // Go back to login page
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
    </body>
    </div>
  );
}

export default TaskForm;
