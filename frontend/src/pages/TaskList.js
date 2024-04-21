import React, { useState, useEffect } from 'react';
import {Button, FormControlLabel, Checkbox, Typography, FormControl, Select, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';
import { useNavigate  } from 'react-router-dom';
import Navigation from '../components/navigation';
import '../App.css'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


function TaskList({ isManager,SERVER_URL, email }) {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  let [employeeTaskList, setEmployeeTaskList] = useState([]);
  let [taskChange, setTaskChange] = useState(false);
  let [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {

    fetch(`${SERVER_URL}/tasks`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }
      return response.json();
    })
      .then(data => setTasks(data))
      .catch(error => setError(error.message));
  }, []);

  const handleDelete = () => {
    
    fetch(`${SERVER_URL}/tasks/${selectedTaskId}/delete`, {
      method: 'DELETE',
      // headers: { ... } Add any required headers here
    })
    .then(response => {
      if (response.ok) {
        setTasks(tasks.filter(task => task.id !== selectedTaskId));
      } else {
        throw new Error('Failed to delete task');
      }
    })
    .catch(error => {
      setError(`Deletion failed: ${error.message}`);
    })
    .finally(() => {
      setOpenDialog(false);
      setSelectedTaskId(null);
    });
  };

  const handleClickOpen = (taskId) => {
    setSelectedTaskId(taskId);
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };
  

  const handleCheckboxChange = (subtask_id, email, is_completed) => {
    fetch(`${SERVER_URL}/markSubTaskAsComplete`, {method:"PUT" ,headers: { 
      "Content-Type": "application/json", 
      }, 
     body: JSON.stringify({complete: !is_completed, email: email, subtask_id: subtask_id})
    })
    .then((response) => response.json())
    .then(getEmployeeTasks)
    
  }
  const getEmployeeTasks = () => {
    fetch(`${SERVER_URL}/getEmployeeSubTasks/${email}`, {method: "GET"})
    .then((response) => response.json())
    .then((data) => setEmployeeTaskList(data))
  }
  useEffect(getEmployeeTasks,[]);

  return (
  <div className="subtask-details-section">
    <Navigation isManager={isManager}/>
    { isManager ? (<div >
      <div className="subtaskDetailsContainer">
        <Typography className="subtaskDetailsText" variant='h4'>Tasks</Typography>
        </div>
      
      {error && <p style={{color:'red'}}>An error occurred: {error}</p>}
      <div>
      <div className = "task-list">
        {tasks.map(task => (
          <div key={task.id}>
            <div className="task-item">
            <div  >
              <h2>{task.title}</h2>
              <p>{task.description}</p>
            </div>
            {isManager && (
              <div>
                {/* Render manager-specific UI elements */}
                <Link to={`/tasks/${task.id}`} className="task-item-element">View Details</Link>
                {/* Add more buttons for manager functionalities */}
                <Link to={`/tasks/${task.id}/subtasks/create`} className="task-item-element">Add Subtasks</Link>
                <Link to={`/tasks/${task.id}/subtasks/view`} className="task-item-element">View Subtasks</Link>
                <Link          className="task-item-element"       
                onClick={() => handleClickOpen(task.id)}>
                Delete Task
              </Link>
              </div>
            )}
            {!isManager && (
              <div className="progress-section">
                {/* Render manager-specific UI elements */}
                <Link to={`/tasks/${task.id}`} className="task-item-element">View Details</Link>
                {/* Add more buttons for manager functionalities */}
                <Link to={`/tasks/${task.id}/subtasks/view`} className="task-item-element">View Subtasks</Link>
              </div>
            )}
          </div>
          </div>
        ))}
      </div>
      <div className="top-page">
      {isManager && (
        <Button 
        sx={{
            backgroundColor: '#cce4f1', 
            marginLeft:'10px', 
            marginBottom:"10px",
            color:"black",
            fontFamily: 'Garamond, cursive', // Add font-family property
            fontWeight:'bold',
            transition: 'background-color 0.3s', // Smooth transition effect
            '&:hover': {
                backgroundColor: '#8ab6d6', // Pastel red color on hover
            }
        }}
        color="primary" 
        variant="contained" 
        onClick={() => navigate("/tasks/create")} // Navigate to the task creation page
    > 
        Add Task
    </Button>
    
      )}
      </div>
      

      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this task and all its related subtasks?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      </div>
      
    </div>):
    (<div>
      <FormControl style={{marginLeft:"20px", marginTop:"10px"}}>
          <Select 
              labelId="select-label"
              id="select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              >
          <MenuItem value="all">View All Tasks</MenuItem>
          <MenuItem value="incomplete">View Incomplete Tasks</MenuItem>
          <MenuItem value="complete">View Completed Tasks</MenuItem>
          </Select>
      </FormControl>
    <div className="employee-specific-task-section-wrapper">
      {employeeTaskList.map(task => ( <div> { (filter==="all" || (filter==="incomplete" && !task.is_completed) || (filter==="complete" && task.is_completed)) ? (
        <div key={task.subtask_title} className="employee-progress">
          <div className="task-header">
          <FormControlLabel control={
                <Checkbox
                  defaultChecked={task.is_completed}
                  onChange={(event) => handleCheckboxChange(task.subtask_id, email, task.is_completed)} 
                  sx={{
                    color: "white",
                    '&.Mui-checked': {
                      color: "white",
                    },
                  }}
                />
              } />
          <Typography variant="h5" style={{fontWeight:"bold"}}>{task.task_title} — {task.subtask_title} — due {task.deadline}</Typography>
          </div>
          <div className="task-details">
          <Typography>Hours: {task.hours}</Typography>
          <Typography>{task.description}</Typography>
          </div>
          
        </div>) : (<div></div>) }
        </div>
      ))}
    </div>
    </div>)
}
</div>
);
}

export default TaskList;
