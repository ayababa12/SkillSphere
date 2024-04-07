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
import Navigation from '../components/navigation';
import { useCallback } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import '../styles/employees.css'



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
        <body class="formPage">
        <div className='form'>
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
            <Button style={{backgroundColor: '#1f4d20', marginLeft:'50px', marginBottom:"10px" }}
            color="primary" 
            variant="contained" 
            onClick={() => {createEmployee(email, password, first_name, last_name, department, gender, dateOfBirth);}} 
            > 
            Add Employee 
            </Button> 
            <Button style={{backgroundColor: '#1f4d20', marginLeft:'10px', marginBottom:"10px"  }}
                color="primary" 
                variant="contained" 
                onClick={() => navigate("/employees")} //go back to login page
                > 
                Cancel
            </Button>
            <p  style={{color:"red", marginLeft:'50px'}}>{errorMsg}</p>
            
        </div>
        </body>
    );
};

const DisplayEmployeePage = ({isManager, userToken}) => {
    const navigate = useNavigate ();

    let [employeeList, setEmployeeList] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const fetchEmployeeList = useCallback(() => { 
        fetch(`${SERVER_URL}/employees`, { 
          headers: { 
            Authorization: `bearer ${userToken}`, 
          }, 
        }) 
          .then((response) => response.json()) 
          .then((employeesList) => {setEmployeeList(employeesList); }); 
      }, [isManager]);


      
    useEffect(() => { 
        if (isManager) { 
            fetchEmployeeList();
    } 
    }, [isManager, userToken]); 
     
    const columns = [
        { id: 'first_name', label: 'First Name', minWidth: 170 },
        { id: 'last_name', label: 'Last Name', minWidth: 100 },
        {
          id: 'department',
          label: 'Department',
          minWidth: 170,
          align: 'right',
          format: (value) => value.toLocaleString('en-US'),
        },
        {
          id: 'email',
          label: 'Email',
          minWidth: 170,
          align: 'right',
          format: (value) => value.toLocaleString('en-US'),
        }
      ];

      
    
      const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };
    
      const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
      };

    return(
        <div>
            <Navigation isManager={isManager}/>
            <Button  className='mui-button'
                color="primary" 
                variant="contained" 
                onClick={() => navigate("/createEmployee")} //go back to login page
                > 
                Add New Employee
            </Button>
            <br/><br/><br/>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 440 }} style={{marginLeft:'202px'}}>
                    <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow >
                        {columns.map((column) => (
                            <TableCell 
                            key={column.id}
                            align={column.align}
                            style={{ minWidth: column.minWidth, backgroundColor: "#1f4d20", color:'white', fontWeight:'bold' }}
                            >
                            {column.label}
                            </TableCell>
                        ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {employeeList
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => {
                            return ( // Clickable row, takes you to employee's profile
                            <TableRow hover role="checkbox" tabIndex={-1} key={row.code} onClick={() => {navigate(`./${row.email}`)}} className="employeeTableRow">
                                {columns.map((column) => {
                                const value = row[column.id];
                                return (
                                    <TableCell key={column.id} align={column.align}>
                                    {column.format && typeof value === 'number'
                                        ? column.format(value)
                                        : value}
                                    </TableCell>
                                );
                                })}
                            </TableRow>
                            );
                        })}
                    </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={employeeList.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </div>
    );
};


export {CreateEmployeePage, DisplayEmployeePage};
