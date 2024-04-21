import React, { useState, useEffect } from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useNavigate, useParams } from 'react-router-dom';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function SubtaskForm() {
  const { task_id } = useParams(); // Get task_id from the URL
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [employee, setEmployee] = useState('');
  const [employees, setEmployees] = useState([]); // State to store the list of employees
  const [deadline, setDeadline] = useState(null);
  const [hours, setHours] = useState('');
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch list of employees when the component mounts
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/employees?query=');
      if (!response.ok) {
        throw new Error('Failed to fetch employees');
      }
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const SERVER_URL = "http://127.0.0.1:5000";

    fetch(`${SERVER_URL}/tasks/${task_id}/subtasks/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description, deadline, employee, hours }),
    })
      .then(response => {
        return response.json();
      })
      .then((data) => {
        if (data.message){
          throw new Error(data.message);
          return;
        }
        setTitle('');
        setDescription('');
        setDeadline(null);
        setEmployee('');
        setSuccessMsg('Subtask successfully created');
        setHours('');
        setOpenSnackbar(true);
        navigate('/tasks');
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
        <Typography className="taskDetailsContainer" variant="h4" style={{ fontFamily: 'Garamond, cursive', textAlign: 'center' ,fontWeight:'bold',color:'white'}} >Add Subtask</Typography>
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
          label="Hours"
          value={hours}
          type="number"
          onChange={(e) => setHours(e.target.value)}
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
        <div className="form-item"> 
        <TextField
          select
          fullWidth
          label="Assign Employee"
          value={employee}
          onChange={(e) => setEmployee(e.target.value)}
          margin="normal"
          required
        >
          {employees.map((emp) => (
            <MenuItem key={emp.email} value={emp.email}>
              {emp.first_name} {emp.last_name}
            </MenuItem>
          ))}
        </TextField>
        </div>
        {error && <p className="error" style={{color:"red", marginLeft:"30px"}}>{error}</p>}
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
            Add Subtask
            </Button> 
            <Button 
            sx={{
                backgroundColor: '#f08080', 
                marginLeft:'10px', 
                marginBottom:"10px",
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

export default SubtaskForm;
