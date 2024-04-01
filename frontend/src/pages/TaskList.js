import React, { useState, useEffect } from 'react';

function TaskList() {
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
            {/* You can add more task details here */}
          </li>
        ))}
      </ul>
    </div>
  );
}
console.log(TaskList);
export default TaskList;
