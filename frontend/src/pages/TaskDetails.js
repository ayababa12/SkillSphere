import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../App.css'
import Navigation from "../components/navigation"
import {Button, TextField, Typography} from "@mui/material"
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Stack from '@mui/joy/Stack';
import LinearProgress from '@mui/joy/LinearProgress';

function TaskDetails({isManager, SERVER_URL}) {
  const navigate = useNavigate ();
  const { task_id } = useParams(); // Extracting taskId from URL params
  const [task, setTask] = useState(null);
  const [error, setError] = useState(null);
  let [edit, setEdit] = useState(false);
  let [title, setTitle] = useState('')
  let [description, setDescription] = useState('')
  let [deadline, setDeadline] = useState(null);
  let [totalProgress, setTotalProgress] = useState(0);
  let [employeeProgressList, setEmployeeProgressList] = useState([])

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/tasks/${task_id}`);
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

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/progress/${task_id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch task details');
        }
        const data = await response.json();
        setTotalProgress(data['totalCompletedHours']/(data['totalCompletedHours']+data['totalRemainingHours'])*100)
        setEmployeeProgressList(data["byEmployee"])
      }
      catch (error){
        console.error("fetch progress error: ", error);
      }
    }; fetchProgress();
  }, [task_id, edit])

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
    <div>
    <div>
      <Navigation isManager={isManager}/>
      {!edit ? (<div >
                <Button className='mui-button' 
                        color="primary" 
                        variant="contained" 
                        onClick={() => setEdit(true)} >Edit Task</Button>
                
                <h1 style={{color:'black'}}>Task Details</h1>
                <div className='task-info'>
                <ul  >
                  <li><strong>Title:</strong> {task.title}</li>
                  <li><strong>Description:</strong> {task.description}</li>
                  <li><strong>Deadline:</strong> {task.deadline}</li>
                  <li>
                    <strong>Employees:</strong>
                    <ul >
                      {task.employees.map(employee => (
                        <li key={employee.id}>{employee.name}</li>
                      ))}
                    </ul>
                  </li>
                </ul>
                </div>
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
  <div className = "progress-section-wrapper">
      <div className = "progress-section">
        <Typography variant="h5" style={{fontWeight:"bold"}}>Overall progress: {Math.ceil(totalProgress)}% Complete</Typography>
        <Stack spacing={2} sx={{ flex: 1, margin: "50px" }}>
          <LinearProgress  
            sthickness={100}
            sx={{
              backgroundColor: '#a9b8aa',
              color: "#1f4d20",
              height: "10px"
            }}
            determinate
            value={Math.ceil(totalProgress)} />
        </Stack>
      </div>
     
      <hr></hr>
      <br></br>
      <Typography variant="h5" style={{fontWeight:"bold"}}>Progress By Employee</Typography>
      
      {Object.entries(employeeProgressList).map(([email, employee]) => (  
        <div className="employee-progress">
          <Typography variant="h5" style={{fontWeight:"bold"}}>{employee.firstName} {employee.lastName} ({email})</Typography>
          <div className = "progress-section">
            <Typography variant='h6'>Progress: {Math.ceil(employee.completedHours/(employee.completedHours + employee.remainingHours)*100)}% Complete</Typography>
            <Stack spacing={2} sx={{ flex: 1, margin: "50px" }}>
            <LinearProgress  
              sthickness={100}
              sx={{
                backgroundColor: '#8c968d',
                color: "white",
                height: "10px",
                width: "400px"
              }}
              determinate
              value={Math.ceil(employee.completedHours/(employee.completedHours + employee.remainingHours)*100)} />
          </Stack>
        </div>
          <div className="completed-remaining-tasks">
          { Object.keys(employee.completedSubTasks).length > 0 && <div>
          <Typography variant="h6">Completed Sub-Tasks:</Typography>
          <ul>
            {employee.completedSubTasks.map(subTask => (
              <li key={subTask.title}>{subTask.title} ({subTask.hours} hours)</li>
            ))}
          </ul> </div>}
          </div>
          <div className="completed-remaining-tasks">
          { Object.keys(employee.remainingSubTasks).length > 0 && <div>
          <Typography variant="h6">Remaining Sub-Tasks:</Typography>
          <ul>
            {employee.remainingSubTasks.map(subTask => (
              <li key={subTask.title}>{subTask.title} ({subTask.hours} hours)</li>
            ))}
          </ul></div>}
          </div>
          </div>
        ))}
      
      
  </div>
  </div>
  );
}

export default TaskDetails;
