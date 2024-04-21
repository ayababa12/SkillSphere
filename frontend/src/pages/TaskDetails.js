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


  if (!task) {
    return <div>Loading...</div>;
  }

  function updateTask(title,description,deadline) { 
    if (!title || !description){
      setError("empty title/description not allowed");
      return;
    }
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
    <div className="subtask-details-section">
    <div className="subtaskDetailsContainer">
              <Typography className="subtaskDetailsText" variant='h4'>Task Details</Typography>
            </div>
      <Navigation isManager={isManager}/>
      {!edit ? (<div >
             
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
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', marginBottom: '20px' }}>
        <Button 
          sx={{
            backgroundColor: '#f08080', 
            color: 'white',
            fontFamily: 'Garamond, cursive', // Add font-family property
            fontWeight:'bold',
            transition: 'background-color 0.3s', // Smooth transition effect
            '&:hover': {
              backgroundColor: '#e42020', // Pastel red color on hover
            }
          }}
          color="primary" 
          variant="contained" 
          onClick={() => setEdit(true)} 
        >
          Edit Task
        </Button>
      </div>
                </div>
                ):
              (<div>
              
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
                    <p className='error' style={{color:'red'}}>{error}</p>
                    <Button  sx={{
                          backgroundColor: '#cce4f1', 
                          marginLeft: '10px', 
                          marginBottom: '10px',
                          color: 'black',
                          fontFamily: 'Garamond, cursive', // Add font-family property
                          fontWeight:'bold',
                          transition: 'background-color 0.3s', // Smooth transition effect
                          '&:hover': {
                              backgroundColor: '#8ab6d6', // Pastel red color on hover
                          },
                          display: 'block', // Center the button
                          marginLeft: 'auto', // Center the button
                          marginRight: 'auto', // Center the button
                          marginTop: '20px', // Add top margin
                          marginBottom: '20px', // Add bottom margin
                      }}
                              
                      color="primary" 
                      variant="contained" 
                        onClick={() => {updateTask(title,description,deadline);}} 
                        > 
                        Apply Changes 
                    </Button> 
                    <Button sx={{
                          backgroundColor: '#f08080', 
                          marginLeft: '10px', 
                          marginBottom: '10px',
                          color: 'black',
                          fontFamily: 'Garamond, cursive', // Add font-family property
                          fontWeight:'bold',
                          transition: 'background-color 0.3s', // Smooth transition effect
                          '&:hover': {
                              backgroundColor: '#e42020', // Pastel red color on hover
                          },
                          display: 'block', // Center the button
                          marginLeft: 'auto', // Center the button
                          marginRight: 'auto', // Center the button
                          marginTop: '20px', // Add top margin
                          marginBottom: '20px', // Add bottom margin
                      }}
                      
                      color="primary" 
                      variant="contained" 
                        onClick={() => deleteTask()} 
                        > 
                        Delete Task 
                    </Button>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', marginBottom: '20px' }}>
        <Button 
           sx={{
            backgroundColor: '#a9aeb3', 
            marginLeft:'10px', 
            marginBottom:"10px",
            fontWeight:'bold',
            color:'white',
            fontFamily: 'Garamond, cursive', // Add font-family property
            transition: 'background-color 0.3s', // Smooth transition effect
            '&:hover': {
            backgroundColor: '#ff8989', // Pastel red color on hover
            }
          }}
          color="primary" 
          variant="contained" 
          onClick={() => setEdit(false)} 
          > 
          Cancel 
        </Button></div>
                  
              </div>)}
  </div>
  <div className = "progress-section-wrapper">
      <div className = "progress-section">
        <Typography  variant="h5"  style={{
    fontWeight: "bold",
    fontFamily: 'Garamond, cursive',
    fontSize: '2rem', // Adjust the font size as needed
  }}>Overall progress: {Math.ceil(totalProgress)}% Complete</Typography>
        <Stack spacing={2} sx={{ flex: 1, margin: "50px" }}>
          <LinearProgress  
            sthickness={100}
            sx={{
              backgroundColor: '#c9cdd2',
              color: "#8ab6d6",
              height: "10px"
            }}
            determinate
            value={Math.ceil(totalProgress)} />
        </Stack>
      </div>
     
      <hr></hr>
      <br></br>
      <div className="subtaskDetailsContainer">
              <Typography className="subtaskDetailsText" variant='h4'>Progress By Employee</Typography>
            </div>
            
      {Object.entries(employeeProgressList).map(([email, employee]) => (  
        <div className="employee-progress">
          <Typography variant="h5"style={{
    fontWeight: "bold",
    fontFamily: 'Garamond, cursive',
    fontSize: '1.5rem', // Adjust the font size as needed
  }}>{employee.firstName} {employee.lastName} ({email})</Typography>
  
          <div className = "progress-section">
            <Typography variant='h6' style={{
    fontWeight: "bold",
    fontFamily: 'Garamond, cursive',
    fontSize: '1.25rem', // Adjust the font size as needed
  }}>Progress: {Math.ceil(employee.completedHours/(employee.completedHours + employee.remainingHours)*100)}% Complete</Typography>
            <Stack spacing={2} sx={{ flex: 1, margin: "50px" }}>
            <LinearProgress  
              sthickness={100}
              sx={{
                backgroundColor: '#c9cdd2',
                color: "#8ab6d6",
                height: "10px",
                width: "400px",
              }}
              determinate
              value={Math.ceil(employee.completedHours/(employee.completedHours + employee.remainingHours)*100)} />
          </Stack>
        </div>
          <div className="completed-remaining-tasks">
          { Object.keys(employee.completedSubTasks).length > 0 && <div>
          <Typography variant="h6" style={{ fontFamily: 'Garamond, cursive' ,fontWeight:'bold'}} >Completed Sub-Tasks:</Typography>
          <ul>
            {employee.completedSubTasks.map(subTask => (
              <li key={subTask.title}>{subTask.title} ({subTask.hours} hours)</li>
            ))}
          </ul> </div>}
          </div>
          <div className="completed-remaining-tasks">
          { Object.keys(employee.remainingSubTasks).length > 0 && <div>
            <Typography variant="h6" style={{ fontFamily: 'Garamond, cursive' ,fontWeight:'bold'}} >Remaining Sub-Tasks:</Typography>
          <ul>
          <Typography variant="h6" style={{ fontFamily: 'Garamond, cursive' ,fontSize: '1.25rem'}}>
            {employee.remainingSubTasks.map(subTask => (
              <li key={subTask.title}>{subTask.title} ({subTask.hours} hours)</li>
            ))}</Typography>
          </ul></div>}
          </div>
          </div>
        ))}
      
      
  </div>
  </div>
  );
}

export default TaskDetails;
