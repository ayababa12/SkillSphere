import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../App.css'
import Navigation from "../components/navigation"
import {Button, TextField} from "@mui/material"
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
const SERVER_URL = "http://127.0.0.1:5000";
function TaskDetails({isManager}) {
  const navigate = useNavigate ();
  const { task_id } = useParams(); // Extracting taskId from URL params
  const [task, setTask] = useState(null);
  const [error, setError] = useState(null);
  let [edit, setEdit] = useState(false);
  let [title, setTitle] = useState('')
  let [description, setDescription] = useState('')
  let [deadline, setDeadline] = useState(null);


  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/tasks/${task_id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch task details');
        }
        const data = await response.json();
        setTask(data);
        setTitle(data.title);
        setDescription(data.description);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchTaskDetails();
  }, [task_id, edit]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!task) {
    return <div>Loading...</div>;
  }

  function updateTask(title,description,deadline) { 
    return fetch(`${SERVER_URL}/tasks/${task_id}`, { 
      method: "PUT", 
      headers: { 
        "Content-Type": "application/json", 
      }, 
      body: JSON.stringify({ 
        title: title,
        description: description,
        deadline: deadline,
      }), 
    }).then((response) => response.json()
    ).then((body) => {
      if (body.message != 'success'){ //server sent an error message
        setError(body.message);
        
      }
      else{ 
        setError("");
        setEdit(false);
        
      }
    }); 
  }

  function deleteTask(){
    return fetch(`${SERVER_URL}/tasks/${task_id}/delete`, { 
        method: "DELETE"
      }).then((response) => response.json()
      ).then((body) => {
          setError("");
          setEdit(false);
          navigate("/tasks")
      }); 
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
                <ul style={{marginLeft:"200px"}} className="nav">
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
                  <div className = 'taskForm'>
                  <div className="form-item"> 
                        <TextField className="taskFormItem"
                        fullWidth 
                        label="title" 
                        type="text" 
                        value={title} 
                        onChange={({ target: { value } }) => setTitle(value)} 
                        /> 
                        
                    </div> 
                    <div className="form-item"> 
                        <TextField className="taskFormItem"
                        fullWidth 
                        label="description" 
                        type="text" 
                        value={description} 
                        onChange={({ target: { value } }) => setDescription(value)} 
                        /> 
                        
                    </div>
                    <div className="form-item"> 
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker className="taskFormItem"
                      label="Deadline"
                      value={deadline}
                      onChange={(value) => setDeadline(value)}
                      renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                    />
                    </LocalizationProvider>
                    </div>
                    <Button  style={{backgroundColor: '#1f4d20', marginLeft:'40px'}}
                        color="primary" 
                        variant="contained" 
                        onClick={() => {updateTask(title,description,deadline);}} 
                        > 
                        Apply Changes 
                    </Button> 
                    <Button style={{backgroundColor: '#1f4d20',marginLeft:'40px'}}
                        color="primary" 
                        variant="contained" 
                        onClick={() => deleteTask()} 
                        > 
                        Delete Task 
                    </Button>
                  </div>
              </div>)}
  </div>
  );
}

export default TaskDetails;
