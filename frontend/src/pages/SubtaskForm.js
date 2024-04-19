import React, { useState, useEffect } from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
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
      const response = await fetch('http://127.0.0.1:5000/employees');
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
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(() => {
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
        {error && <p className="error">{error}</p>}
        <div className="form-item"> 
        <Button
          type="submit"
          color="primary"
          variant="contained"
          sx={{ marginY: 2, backgroundColor: '#1f4d20' }}
        >
          Add Subtask
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
