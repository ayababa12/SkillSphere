import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { useNavigate  } from 'react-router-dom';
import Navigation from '../components/navigation';
import '../App.css'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


function TaskList({ isManager }) {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const SERVER_URL = "http://127.0.0.1:5000";

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
    const SERVER_URL = "http://127.0.0.1:5000";
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

  return (
    <div>
      <h1>Task List</h1>
      <Navigation isManager={isManager}/>
      {error && <p style={{color:'red'}}>An error occurred: {error}</p>}
      <div style={{marginLeft:"200px"}}>
      <ul >
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
      
    </div>
  );
}

export default TaskList;

// import React, { useState, useEffect } from 'react';
// import Button from '@mui/material/Button';
// import { Link } from 'react-router-dom';
// import { useNavigate  } from 'react-router-dom';
// import Navigation from '../components/navigation';
// import '../App.css'
// function TaskList({ isManager }) {
//   const [tasks, setTasks] = useState([]);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate ();
//   useEffect(() => {
//     const SERVER_URL = "http://127.0.0.1:5000";

//     fetch(`${SERVER_URL}/tasks`)
//     .then(response => {
//       if (!response.ok) {
//         throw new Error(`Error! status: ${response.status}`);
//       }
//       return response.json();
//     })
//       .then(data => setTasks(data))
//       .catch(error => setError(error.message));
//   }, []);

//   return (
//     <div>
//       <h1>Task List</h1>
//       <Navigation isManager={isManager}/>
//       {error && <p>An error occurred: {error}</p>}
//       <div style={{marginLeft:"200px"}}>
//       <ul >
//         {tasks.map(task => (
//           <li key={task.id}>
//             <div className="whiteText">
//               <h2>{task.title}</h2>
//               <p>{task.description}</p>
//             </div>
//             {isManager && (
//               <div>
//                 {/* Render manager-specific UI elements */}
//                 <Link to={`/tasks/${task.id}`}>View Details</Link>
//                 {/* Add more buttons for manager functionalities */}
//                 <Link to={`/tasks/${task.id}/subtasks/create`}>Add Subtasks</Link>
//                 <Link to={`/tasks/${task.id}/subtasks/view`}>View Subtasks</Link>
//               </div>
//             )}
//             {!isManager && (
//               <div>
//                 {/* Render manager-specific UI elements */}
//                 <Link to={`/tasks/${task.id}`}>View Details</Link>
//                 {/* Add more buttons for manager functionalities */}
//                 <Link to={`/tasks/${task.id}/subtasks/view`}>View Subtasks</Link>
//               </div>
//             )}
//           </li>
//         ))}
//       </ul>
      
//       {isManager && (
//         <Button variant="contained" color="primary" className="mui-button">
//           <Link to="/tasks/create" style={{ textDecoration: 'none', color: 'white' }}>Add Task</Link>
//         </Button>
//       )}
//       </div>
//     </div>
//   );
// }

// export default TaskList;