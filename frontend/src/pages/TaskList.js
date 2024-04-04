import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { useNavigate  } from 'react-router-dom';
import Navigation from '../components/navigation';
import '../App.css'
function TaskList({ isManager }) {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate ();
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

  return (
    <div>
      <h1>Task List</h1>
      {error && <p>An error occurred: {error}</p>}
      <div >
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
      </div>
      {isManager && (
        <Button variant="contained" color="primary">
          <Link to="/tasks/create" style={{ textDecoration: 'none', color: 'white' }}>Add Task</Link>
        </Button>
      )}
    </div>
  );
}

export default TaskList;

