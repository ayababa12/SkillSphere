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


const UserProfilePage = ({userToken}) => {
    const navigate = useNavigate ();
    const { email } = useParams();
    let [department, setDepartment] = useState("");
    let [dateOfBirth, setDateOfBirth] = useState(null);
    let [first_name, setFirstName] = useState("");
    let [last_name, setLastName] = useState("");
    let [gender, setGender] = useState("");
    let [errorMsg, setErrorMsg] = useState("");

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

  return (
    <div>
      <h1>{first_name} {last_name}</h1>
      {/* Render user profile information */}
    { edit? (
                <div>
                    <Button  className='mui-button'
                        color="primary" 
                        variant="contained" 
                        onClick={() => setEdit(false)} 
                        > 
                        Cancel 
                    </Button> 
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
                            <MenuItem value={"Accounting"}>Accounting</MenuItem> {/* !!!!!!! ATTENTION !!!!!!! PLACEHOLDER VALUES */}
                            <MenuItem value={"HR"}>HR</MenuItem>
                        
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
                    <Button  style={{backgroundColor: '#1f4d20', marginLeft:'40px'}}
                        color="primary" 
                        variant="contained" 
                        onClick={() => updateEmployee(first_name,last_name,department,gender, dateOfBirth)} 
                        > 
                        Apply Changes 
                    </Button> 
                    <Button style={{backgroundColor: '#1f4d20',marginLeft:'40px'}}
                        color="primary" 
                        variant="contained" 
                        onClick={() => deleteEmployee()} 
                        > 
                        Delete Employee 
                    </Button> 
                    <p  style={{color:"red"}}>{errorMsg}</p>
            
          </div>
        ):

        (
            <div>
                <Button className='mui-button'
                    color="primary" 
                    variant="contained" 
                    onClick={() => setEdit(true)} 
                    > 
                    Edit 
                </Button> 
            </div>

        )

    }
    </div>

  );
};

export default UserProfilePage;