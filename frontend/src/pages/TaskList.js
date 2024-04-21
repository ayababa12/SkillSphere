import React, { useState, useEffect } from 'react';
import { Button, FormControlLabel, Checkbox, Typography, FormControl, Select, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/navigation';
import '../App.css';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

function TaskList({ isManager, SERVER_URL, email }) {
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
    fetch(`${SERVER_URL}/markSubTaskAsComplete`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ complete: !is_completed, email: email, subtask_id: subtask_id })
    })
      .then((response) => response.json())
      .then(getEmployeeTasks)
  }

  const getEmployeeTasks = () => {
    fetch(`${SERVER_URL}/getEmployeeSubTasks/${email}`, { method: "GET" })
      .then((response) => response.json())
      .then((data) => setEmployeeTaskList(data))
  }
  useEffect(getEmployeeTasks, []);

  return (
    <div className="subtask-details-section">
      <div className="subtaskDetailsContainer">
            <Typography className="subtaskDetailsText" variant='h4'>Tasks</Typography>
          </div>

          {error && <p style={{ color: 'red' }}>An error occurred: {error}</p>}
      <Navigation isManager={isManager} />
      {isManager ? (
        <div>
          
          <ul >
            {tasks.map((task, index) => (
              <div className={`sub-task-info`}>
                <li key={index}>
                  <h2>Task {index + 1}</h2>
                  <ul>
                    <li><strong>Title:</strong> {task.title}</li>
                    <li><strong>Description:</strong> {task.description}</li>
                    <li><strong>Is Completed:</strong> {task.is_completed ? 'Yes' : 'No'}</li>
                  </ul>
                
                {isManager && (
                  <div>
                    <Link to={`/tasks/${task.id}`} className="task-item-element">View Details</Link>
                    <Link to={`/tasks/${task.id}/subtasks/create`} className="task-item-element">Add Subtasks</Link>
                    <Link to={`/tasks/${task.id}/subtasks/view`} className="task-item-element">View Subtasks</Link>
                    <Link className="task-item-element" onClick={() => handleClickOpen(task.id)}>Delete Task</Link>
                  </div>
                )}
                </li>
              </div>
            ))}
          </ul>
          <div className="top-page">
            {isManager && (
              <Button
                sx={{
                  backgroundColor: '#cce4f1',
                  marginLeft: '10px',
                  marginBottom: "10px",
                  color: "black",
                  fontFamily: 'Garamond, cursive', // Add font-family property
                  fontWeight: 'bold',
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
                Are you sure you want to delete this task?
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

      ) : (
        <div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginRight: '20px', marginTop: '10px' }}>
  <FormControl>
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
</div>

          <div className="employee-specific-task-section-wrapper">
          <ul >
            {employeeTaskList.map((task, index) => (
              <div key={task.subtask_title} className={`sub-task-info task-${index + 1}`}>
                {(filter === "all" || (filter === "incomplete" && !task.is_completed) || (filter === "complete" && task.is_completed)) ? (
                  <div>
                    <div>
                      <h2>Task {index + 1}</h2>
                      <ul>
                        <li><strong>Title:</strong> {task.task_title}</li>
                        <li><strong>Description:</strong> {task.description}</li>
                        <li><strong>Is Completed:</strong> {task.is_completed ? 'Yes' : 'No'}</li>
                      </ul>
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskList;
