import React, { useState, useEffect } from 'react';
import {Button, FormControlLabel, Checkbox } from '@mui/material';
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

  return (<div>
    <Navigation isManager={isManager}/>
    { isManager ? (<div>
      <h1>Task List</h1>
      
      {error && <p style={{color:'red'}}>An error occurred: {error}</p>}
      <div style={{marginLeft:"200px"}}>
      <ul className = "nav">
        {tasks.map(task => (
          <li key={task.id}>
            <div className="whiteText">
              <h2>{task.title}</h2>
              <p>{task.description}</p>
            </div>
            {isManager && (
              <div>
                {/* Render manager-specific UI elements */}
                <Link to={`/tasks/${task.id}`}>View Details</Link>
                {/* Add more buttons for manager functionalities */}
                <Link to={`/tasks/${task.id}/subtasks/create`}>Add Subtasks</Link>
                <Link to={`/tasks/${task.id}/subtasks/view`}>View Subtasks</Link>
                <Button 
                variant="contained" 
                color="secondary" 
                onClick={() => handleClickOpen(task.id)}>
                Delete Task
              </Button>
              </div>
            )}
            {!isManager && (
              <div>
                {/* Render manager-specific UI elements */}
                <Link to={`/tasks/${task.id}`}>View Details</Link>
                {/* Add more buttons for manager functionalities */}
                <Link to={`/tasks/${task.id}/subtasks/view`}>View Subtasks</Link>
              </div>
            )}
          </li>
        ))}
      </ul>
      
      {isManager && (
        <Button variant="contained" color="primary" className="mui-button">
          <Link to="/tasks/create" style={{ textDecoration: 'none', color: 'white' }}>Add Task</Link>
        </Button>
      )}
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
    (<div className="employee-specific-task-section-wrapper">
      {employeeTaskList.map(task => (
        <div key={task.subtask_title} className="employee-progress">
          <div className="task-header">
          <FormControlLabel control={
                <Checkbox
                  defaultChecked={task.is_completed}
                  onChange={(event) => handleCheckboxChange(task.subtask_id, email, task.is_completed)} 
                />
              } />
          <h3>{task.task_title} — {task.subtask_title} — due {task.deadline}</h3>
          </div>
          <p>Hours: {task.hours}</p>
          <p>{task.description}</p>
          
          
        </div>
      ))}
    </div>)
}
</div>);
}

export default TaskList;
