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





const CreateEmployeePage = () => {
    const navigate = useNavigate ();

    let [email, setEmail] = useState(""); 
    let [password, setPassword] = useState("");
    let [first_name, setFirstName] = useState(""); 
    let [last_name, setLastName] = useState(""); 
    let [department, setDepartment] = useState(""); 
    let [gender, setGender] = useState(""); 
    let [dateOfBirth, setDateOfBirth] = useState(""); 
    let [errorMsg, setErrorMsg] = useState("");

    const handleDepartment = (event) => {
        setDepartment(event.target.value);
      };

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
                    label="Age"
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
                    value={department}
                    label="Age"
                    onChange={handleDepartment}
                >
                    <MenuItem value={"Male"}>Male</MenuItem>
                    <MenuItem value={"Female"}>Female</MenuItem>
                
                </Select>
            </FormControl>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                    
                            <DatePicker label="Basic date picker" />
                    
            </LocalizationProvider>

            <Button 
            color="primary" 
            variant="contained" 
            onClick={() => {}} 
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
