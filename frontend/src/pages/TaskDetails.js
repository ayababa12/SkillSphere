import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../App.css'
import Navigation from "../components/navigation"
import {Button, TextField} from "@mui/material"
const SERVER_URL = "http://127.0.0.1:5000";
function TaskDetails({isManager}) {
  const { task_id } = useParams(); // Extracting taskId from URL params
  const [task, setTask] = useState(null);
  const [error, setError] = useState(null);
  let [edit, setEdit] = useState(false);

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
    <div className='whiteText'>
      <Navigation isManager={isManager}/>
      {!edit ? (<div>
                <Button className='mui-button' 
                        color="primary" 
                        variant="contained" 
                        onClick={() => setEdit(true)} >Edit Task</Button>
                
                <h1 style={{color:'black'}}>Task Details</h1>
                <ul style={{marginLeft:"200px"}}>
                  <li><strong>Title:</strong> {task.title}</li>
                  <li><strong>Description:</strong> {task.description}</li>
                  <li><strong>Deadline:</strong> {task.deadline}</li>
                  <li>
                    <strong>Employees:</strong>
                    <ul>
                      {task.employees.map(employee => (
                        <li key={employee.id}>{employee.name}</li>
                      ))}
                    </ul>
                  </li>
                </ul>
                </div>):
              (<div>
                <Button  className='mui-button'
                        color="primary" 
                        variant="contained" 
                        onClick={() => setEdit(false)} 
                        > 
                        Cancel 
                    </Button> 
              </div>)}
  </div>
  );
}

export default TaskDetails;
