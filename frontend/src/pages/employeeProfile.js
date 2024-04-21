import { useParams, useNavigate } from 'react-router-dom';
import { useCallback, useState, useEffect } from 'react';
import {SERVER_URL} from '../App'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField'; 
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import '../styles/employees.css'
import { Typography } from '@mui/material';
import Navigation from '../components/navigation';


const UserProfilePage = ({userToken}) => {
    const navigate = useNavigate ();
    const { email } = useParams();
    let [department, setDepartment] = useState("");
    let [dateOfBirth, setDateOfBirth] = useState(null);
    let [first_name, setFirstName] = useState("");
    let [last_name, setLastName] = useState("");
    let [gender, setGender] = useState("");
    let [errorMsg, setErrorMsg] = useState("");
    let [employeeTaskList, setEmployeeTaskList] = useState([]);
    let [filter, setFilter] = useState("all");

    let [edit, setEdit] = useState(false); // Flag to know if the user wants to edit or not

    const handleDepartment = (event) => {
        setDepartment(event.target.value);
      };
    const handleGender = (event) => {
        setGender(event.target.value);
    };
    const handleDateOfBirth = (value) => {
        setDateOfBirth(value);
    };

    

    const getEmployeeInfo = useCallback(() => { 
    fetch(`${SERVER_URL}/employees/${email}`, { 
        headers: { 
        Authorization: `bearer ${userToken}`, 
        }, 
    }) 
        .then((response) => response.json()) 
        .then((body) => {
            if (body.message){ //error case
                navigate("/notFound");
            }
            else{
                setDepartment(body.department);
                setDateOfBirth(null);
                setFirstName(body.first_name);
                setLastName(body.last_name);
                setGender(body.gender);
            }
        }); 
    });

    useEffect(getEmployeeInfo, [edit]);

    function updateEmployee(first_name,last_name,department,gender, date_of_birth) { 
        return fetch(`${SERVER_URL}/employees/${email}`, { 
          method: "PUT", 
          headers: { 
            "Content-Type": "application/json", 
          }, 
          body: JSON.stringify({ 
            first_name: first_name,
            last_name: last_name,
            department: department,
            gender: gender,
            date_of_birth: date_of_birth
          }), 
        }).then((response) => response.json()
        ).then((body) => {
          if (body.message != 'success'){ //server sent an error message
            setErrorMsg(body.message);
            console.log(body.message);
            console.log(date_of_birth);
            
          }
          else{ 
            setErrorMsg("");
            setEdit(false);
          }
        }); 
      }

      function deleteEmployee(){
        return fetch(`${SERVER_URL}/employees/${email}`, { 
            method: "DELETE"
          }).then((response) => response.json()
          ).then((body) => {
              setErrorMsg("");
              setEdit(false);
              navigate("/employees")
          }); 
      }

      const getEmployeeSubTasks = useCallback( () => {
        fetch(`${SERVER_URL}/getEmployeeSubTasks/${email}`, {method: "GET"})
        .then((response) => response.json())
        .then((data) => {setEmployeeTaskList(data);});
      })
      useEffect(getEmployeeSubTasks, []);

  return (
    <div>
        <Navigation isManager={true}/>
    <div className="welcomeBanner2">
      <Typography className="welcomeText2" variant='h4'>{first_name} {last_name}</Typography>
    </div>
    
      {/* Render user profile information */}
    { edit? (
                <div style={{marginLeft: "220px"}}>
                    
                    <div className="form-item"> 
                        <TextField 
                        fullWidth 
                        label="Fname" 
                        type="text" 
                        value={first_name} 
                        onChange={({ target: { value } }) => setFirstName(value)} 
                        /> 
                    </div> 
                    <div className="form-item"> 
                        <TextField 
                        fullWidth 
                        label="Lname" 
                        type="text" 
                        value={last_name} 
                        onChange={({ target: { value } }) => setLastName(value)} 
                        /> 
                    </div> 
                    <div className="form-item"> 
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Department</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={department}
                            label="Department"
                            onChange={handleDepartment}
                        >
                            <MenuItem value={"accounting"}>Accounting</MenuItem> {/* !!!!!!! ATTENTION !!!!!!! PLACEHOLDER VALUES */}
                            <MenuItem value={"hr"}>HR</MenuItem>
                            <MenuItem value={"sales"}>Sales</MenuItem>
                            <MenuItem value={"technical"}>Technical</MenuItem>
                            <MenuItem value={"support"}>Support</MenuItem>
                            <MenuItem value={"management"}>Management</MenuItem>
                            <MenuItem value={"IT"}>IT</MenuItem>
                            <MenuItem value={"product_mng"}>Product Management</MenuItem>
                            <MenuItem value={"marketing"}>Marketing</MenuItem>
                    
                        </Select>
                    </FormControl>
                    </div>
                    <div className="form-item"> 
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={gender}
                            label="Gender"
                            onChange={handleGender}
                        >
                            <MenuItem value={"Male"}>Male</MenuItem>
                            <MenuItem value={"Female"}>Female</MenuItem>
                        
                        </Select>
                    </FormControl>
                    </div>
                    <div className="form-item"> 
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                    
                            <DatePicker 
                                value={dateOfBirth} 
                                onChange={handleDateOfBirth} 
                                label="Date of birth" />
                            
                    </LocalizationProvider>
                    </div>
                    <p  style={{color:"red"}}>{errorMsg}</p>
                     <Button 
            sx={{
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
            type="submit"
            color="primary" 
            variant="contained" 
            onClick={() => {updateEmployee(first_name,last_name,department,gender, dateOfBirth)}} 
            
            > 
            Apply Changes
            </Button> 
            <Button 
            sx={{
                backgroundColor: '#f08080', 
                marginLeft:'10px', 
                marginBottom:"10px",
                fontWeight:'bold',
                fontFamily: 'Garamond, cursive', // Add font-family property
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
            onClick={() => deleteEmployee()} 
            > 
            Delete Employee
            </Button>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', marginBottom: '20px' }}>
        <Button 
          sx={{
            backgroundColor: '#a9aeb3', 
            color: 'white',
            fontFamily: 'Garamond, cursive', // Add font-family property
            fontWeight:'bold',
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
                    
            
          </div>
        ):

        (
            <div>
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
          Edit Employee
        </Button></div>
                <FormControl style={{marginLeft:"220px", marginTop:"10px"}}>
                    <Select 
                        labelId="select-label"
                        id="select"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        >
                    <MenuItem value="all">View All Tasks</MenuItem>
                    <MenuItem value="incomplete">View Incomplete Tasks</MenuItem>
                    <MenuItem value="complete">View Complete Tasks</MenuItem>
                    </Select>
                </FormControl>
                <div className='announcementsContainer'>
                {employeeTaskList.length > 0 ? 
                (<div className="employee-specific-task-section-wrapper">
                    {employeeTaskList.map(task => ( <div>{ (filter==="all" || (filter==="incomplete" && !task.is_completed) || (filter==="complete" && task.is_completed)) ? (
                        <div key={task.subtask_title} className="employee-progress">
                            <div className="task-header">
                            <Typography variant="h5" style={{fontWeight:"bold"}}>{task.task_title} — {task.subtask_title} — due {task.deadline}</Typography>
                            </div>
                            <div className="task-details">
                            <Typography>Status: {task.is_completed ? "Completed" : "Incomplete"}</Typography>
                            <Typography>Hours: {task.hours}</Typography>
                            <Typography>{task.description}</Typography>
                            </div>
          
                        </div>) : (<div></div>) } </div>
                ))} 
                </div>):
                (<div></div>)
                }
                </div>
            </div>

        )

    }
    </div>
  
  );
};

export default UserProfilePage;