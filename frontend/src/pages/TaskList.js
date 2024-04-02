import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

function TaskList({ isManager }) {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const SERVER_URL = "http://127.0.0.1:5000";

    fetch(`${SERVER_URL}/tasks`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
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
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <h2>{task.title}</h2>
            <p>{task.description}</p>
            {/* Additional task details */}
            {isManager && (
              <div>
                {/* Render manager-specific UI elements */}
                <Link to={`/tasks/${task.id}`}>View Details</Link>
                {/* Add more buttons for manager functionalities */}
              </div>
            )}
          </li>
        ))}
      </ul>
      {isManager && (
        <Button variant="contained" color="primary">
          <Link to="/tasks/create" style={{ textDecoration: 'none', color: 'white' }}>Add Task</Link>
        </Button>
      )}
    </div>
  );
}

export default TaskList;

