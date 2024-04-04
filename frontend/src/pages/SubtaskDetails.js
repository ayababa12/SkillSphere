import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
const SERVER_URL = "http://127.0.0.1:5000";

function SubtaskDetails() {
  const { task_id } = useParams(); // Extracting taskId from URL params
  const [subtasks, setSubtasks] = useState([]);
  const [error, setError] = useState(null);

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
  }, [task_id]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (subtasks.length === 0) {
    return <div>No subtasks available for this task</div>;
  }

  return (
    <div>
      <h1>Subtask Details</h1>
        <div className="whiteText">
         <ul>
         {subtasks.map((subtask, index) => (
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
             </ul>
             
           </li>
         ))}
       </ul>
       </div>
    </div>
  );
}

export default SubtaskDetails;
