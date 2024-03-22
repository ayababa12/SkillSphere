import React from 'react';
import { useState, useEffect } from "react";
import TextField from '@mui/material/TextField'; 
import Button from '@mui/material/Button';
import { useNavigate  } from 'react-router-dom';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {SERVER_URL} from '../App'





const CreateEmployeePage = () => {
    const navigate = useNavigate ();

    let [email, setEmail] = useState(""); 
    let [password, setPassword] = useState("");
    let [first_name, setFirstName] = useState(""); 
    let [last_name, setLastName] = useState(""); 
    let [department, setDepartment] = useState(""); 
    let [gender, setGender] = useState(null); 
    let [dateOfBirth, setDateOfBirth] = useState(null); 
    let [errorMsg, setErrorMsg] = useState("");

    const handleDepartment = (event) => {
        setDepartment(event.target.value);
      };
    const handleGender = (event) => {
        setGender(event.target.value);
    };
    const handleDateOfBirth = (value) => {
        setDateOfBirth(value);
    };

    function createEmployee(email, password, first_name, last_name, department, gender, dateOfBirth) { 
        return fetch(`${SERVER_URL}/createEmployee`, { 
          method: "POST",
          headers: { 
            "Content-Type": "application/json", 
          }, 
          body: JSON.stringify({
            first_name: first_name,
            last_name: last_name,
            email: email, 
            password: password, 
            department: department,
            gender: gender,
            date_of_birth: dateOfBirth
          }), 
        }).then((response) => response.json()
        ).then((body) => {
          if (body.message){ //server sent an error message
            setErrorMsg(body.message);
            console.log(body.message);
            
          }
          else{ 
            setErrorMsg("");
            navigate("/employees");
          }
        }); 
      }

    return(
        <div>
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
            <TextField 
                fullWidth 
                label="Email" 
                type="text" 
                value={email} 
                onChange={({ target: { value } }) => setEmail(value)} 
            /> 
            </div> 
            <div className="form-item"> 
            <TextField 
                fullWidth 
                label="Password" 
                type="password" 
                value={password} 
                onChange={({ target: { value } }) => setPassword(value)} 
            /> 
            
            </div> 
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
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                    
                    <DatePicker 
                        value={dateOfBirth} 
                        onChange={handleDateOfBirth} 
                        label="Date of birth" />
                    
            </LocalizationProvider>

            <Button 
            color="primary" 
            variant="contained" 
            onClick={() => {createEmployee(email, password, first_name, last_name, department, gender, dateOfBirth);}} 
            > 
            Add Employee 
            </Button> 
            <Button 
                color="primary" 
                variant="contained" 
                onClick={() => navigate("/employees")} //go back to login page
                > 
                Cancel
            </Button>
            <p  style={{color:"red"}}>{errorMsg}</p>
        </div>
    );
};

const DisplayEmployeePage = () => {
    const navigate = useNavigate ();
    
    return(
        <div>
            <Button 
                color="primary" 
                variant="contained" 
                onClick={() => navigate("/createEmployee")} //go back to login page
                > 
                Add New Employee
            </Button>
        </div>
    );
};


export {CreateEmployeePage, DisplayEmployeePage};
