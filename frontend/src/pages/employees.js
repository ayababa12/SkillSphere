import React from 'react';
import { useState, useEffect } from "react";
import TextField from '@mui/material/TextField'; 
import Button from '@mui/material/Button';
import { useNavigate  } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';


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
            <Button 
            color="primary" 
            variant="contained" 
            onClick={() => {}} 
            > 
            Add Employee 
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
const EmployeePage = () => {
    const navigate = useNavigate ();

    
    return(
        <div> 
            
      </div>
    );
    
};

export {CreateEmployeePage, DisplayEmployeePage};
