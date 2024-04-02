import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
const SERVER_URL = "http://127.0.0.1:5000";
function TaskDetails() {
  const { task_id } = useParams(); // Extracting taskId from URL params
  const [task, setTask] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/tasks/${task_id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch task details');
        }
        const data = await response.json();
        setTask(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchTaskDetails();
  }, [task_id]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!task) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Task Details</h1>
      <h2>Title: {task.title}</h2>
      <p>Description: {task.description}</p>
      <p>Deadline: {task.deadline}</p>

      <h3>Employees:</h3>
      <ul>
        {task.employees.map(employee => (
          <li key={employee.id}>{employee.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default TaskDetails;
