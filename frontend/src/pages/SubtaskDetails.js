import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Navigation  from '../components/navigation';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import "../App.css"
const SERVER_URL = "http://127.0.0.1:5000";

function SubtaskDetails({isManager}) {
  const navigate = useNavigate();
  const { task_id } = useParams(); // Extracting taskId from URL params
  const [subtasks, setSubtasks] = useState([]);
  const [error, setError] = useState(null);
  let [edit, setEdit] = useState(false);
  let [subTaskToEdit, setSubTaskToEdit] = useState("");
  let [title, setTitle] = useState("")
  let [description, setDescription] = useState("")
  let [hours, setHours] = useState("")
  let [deadline, setDeadline] = useState(null)
  useEffect(() => {
    if (edit) {
      setTitle(subTaskToEdit.title);
      setDescription(subTaskToEdit.description);
      setHours(subTaskToEdit.hours);
    }
  }, [edit, subTaskToEdit]);
  useEffect(() => {
    const fetchSubtasks = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/tasks/${task_id}/subtasks/view`);
        if (!response.ok) {
          throw new Error('Failed to fetch subtasks');
        }
        const data = await response.json();
        setSubtasks(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchSubtasks();
  }, [task_id, edit]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (subtasks.length === 0) {
    return <div>No subtasks available for this task</div>;
  }

  function updateSubTask(title,description,deadline) { 
    return fetch(`${SERVER_URL}/subTask/${subTaskToEdit.id}`, { 
      method: "PUT", 
      headers: { 
        "Content-Type": "application/json", 
      }, 
      body: JSON.stringify({ 
        title: title,
        description: description,
        hours: hours,
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

  function deleteSubTask(){
    return fetch(`${SERVER_URL}/subtask/${subTaskToEdit.id}`, { 
        method: "DELETE"
      }).then((response) => response.json()
      ).then((body) => {
          setError("");
          setEdit(false);
          navigate("/tasks")
      }); 
  }
  
  return (
    
    <div className="subtask-details-section">
      <Navigation isManager={isManager}/>
      {!edit ? (
        <div>
        <h1>Subtask Details</h1>
          <div >
          
          <ul >
          {subtasks.map((subtask, index) => (
            <div className='sub-task-info'>
            <li key={index}>
              <h2>Subtask {index + 1}</h2>
              <ul>
                <li><strong>Title:</strong> {subtask.title}</li>
                <li><strong>Description:</strong> {subtask.description}</li>
                <li><strong>Hours:</strong> {subtask.hours}</li>
                <li><strong>Deadline:</strong> {subtask.deadline}</li>
                <li><strong>Is Completed:</strong> {subtask.is_completed ? 'Yes' : 'No'}</li>
                <li>
                  <strong>Employees:</strong> 
                  <ul>
                    {subtask.employee.map((employee, empIndex) => (
                      <li key={empIndex}>
                        <strong>Email:</strong> {employee.email}<br />
                        <strong>Start Time:</strong> {employee.start_time}<br />
                        <strong>End Time:</strong> {employee.end_time ? employee.end_time : 'Not specified'}<br />
                        <strong>Is Completed:</strong> {employee.is_completed ? 'Yes' : 'No'}
                      </li>
                    ))}
                  </ul>
                  
                </li>
                <Link onClick = {() => {setEdit(true); setSubTaskToEdit(subtask)}} style={{color:"white"}}>Edit</Link>
              </ul>
              
            </li>
            </div>
          ))}
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
                      <TextField className="taskFormItem"
                      fullWidth 
                      label="hours" 
                      type="number" 
                      value={hours} 
                      onChange={({ target: { value } }) => setHours(value)} 
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
                        onClick={() => {updateSubTask(title,description,deadline);}} 
                        > 
                        Apply Changes 
                    </Button> 
                    <Button style={{backgroundColor: '#1f4d20',marginLeft:'40px'}}
                        color="primary" 
                        variant="contained" 
                        onClick={() => deleteSubTask()} 
                        > 
                        Delete Sub-Task 
                    </Button>
                  </div>
       </div>)}
    </div>
  );
}

export default SubtaskDetails;
