import React from 'react';
import { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField'; 
import {SERVER_URL} from '../App'
import { getUserToken, saveUserToken, clearUserToken ,getIsManager, saveIsManager} from "../localStorage";
import { Link } from 'react-router-dom';
import { useNavigate  } from 'react-router-dom';
import '../styles/authentication.css'
import logo from "../images/Logo.jpg"



const LoginPage = ({ userToken, setUserToken, isManager, setIsManager, setUserName }) => {
  const navigate = useNavigate ();

  let [email, setEmail] = useState(""); 
  let [password, setPassword] = useState("");
  let [first_name, setFirstName] = useState(""); 
  let [last_name, setLastName] = useState("");
  let [register, setRegister] = useState(false); //boolean to know if the user wants to register or login 
  let [errorMsg, setErrorMsg] = useState("");

  function login(email, password) { 
    
    return fetch(`${SERVER_URL}/authentication`, { 
      method: "POST", 
      headers: { 
        "Content-Type": "application/json", 
      }, 
      body: JSON.stringify({ 
        email: email, 
        password: password, 
      }), 
    }) 
      .then((response) => response.json()) 
      .then((body) => { 
        if (body.message) { //If an error message is returned from the server
          setErrorMsg(body.message);
          
        }
        else{
          setErrorMsg("");
          setUserToken(body.token); 
          saveUserToken(body.token);
          setUserName(body.fName);
          if(body.manager){
            setIsManager(true); 
            saveIsManager(true);
          }
          else{
            setIsManager(false);
            saveIsManager(false);
          }
          navigate("/");
        }

      }); 
  }
  
  function createManager(email, password, first_name, last_name) { 
    return fetch(`${SERVER_URL}/createManager`, { 
      method: "POST", 
      headers: { 
        "Content-Type": "application/json", 
      }, 
      body: JSON.stringify({ 
        first_name: first_name,
        last_name: last_name,
        email: email, 
        password: password, 
      }), 
    }).then((response) => response.json()
    ).then((body) => {
      if (body.message){ //server sent an error message
        setErrorMsg(body.message);
        console.log(body.message);
        
      }
      else{ 
        setErrorMsg("");
        login(email, password); 
        console.log(SERVER_URL);
      }
    }); 
  }


  return (
    <div className='LoginContainer'>
      {/* Conditional rendering based on the value of 'register' state */}
      <img src={logo} className="logo" />
      {register ?
      (
        <div className='registerForm'>  {/* This is displayed ig the user wants to register */}
                  <div className="register-form-item"> 
                    <TextField 
                      fullWidth 
                      label="Fname" 
                      type="text" 
                      value={first_name} 
                      onChange={({ target: { value } }) => setFirstName(value)} 
                    /> 
                  </div> 
                  <div className="register-form-item"> 
                    <TextField 
                      fullWidth 
                      label="Lname" 
                      type="text" 
                      value={last_name} 
                      onChange={({ target: { value } }) => setLastName(value)} 
                    /> 
                  </div> 
                  <div className="register-form-item"> 
                    <TextField 
                      fullWidth 
                      label="Email" 
                      type="text" 
                      value={email} 
                      onChange={({ target: { value } }) => setEmail(value)} 
                    /> 
                  </div> 
                  <div className="register-form-item"> 
                    <TextField 
                      fullWidth 
                      label="Password" 
                      type="password" 
                      value={password} 
                      onChange={({ target: { value } }) => setPassword(value)} 
                    /> 
                  </div> 
                  
                  <Button style={{backgroundColor:'#1f4d20'}}
                    color="primary" 
                    variant="contained" 
                    onClick={() => createManager(email, password, first_name, last_name)} 
                  > 
                    Register 
                  </Button> 
                  <br></br><br></br>

                  <Link onClick={() => {setRegister(false); setErrorMsg("");}} style={{marginLeft:'10px'}}>
                      Already have an account? click here to login!
                  </Link> 
                  <p  style={{color:"red", marginLeft:'400px'}}>{errorMsg}</p>
                  
                  
                
        </div>
      ) 
      :
      (
        <div className='loginForm'>      {/* This is displayed ig the user wants to login */}
                  <div className="login-form-item"> 
                    <TextField 
                      fullWidth 
                      label="Email" 
                      type="text" 
                      value={email} 
                      onChange={({ target: { value } }) => setEmail(value)} 
                    /> 
                  </div> 
                  <div className="login-form-item"> 
                    <TextField 
                      fullWidth 
                      label="Password" 
                      type="password" 
                      value={password} 
                      onChange={({ target: { value } }) => setPassword(value)} 
                    /> 
                  </div> 
                  <Button style={{backgroundColor: '#1f4d20' }}
                    color="primary" 
                    variant="contained" 
                    onClick={() => login(email, password)} 
                  > 
                    Login 
                  </Button> 
                  <p  style={{color:"red", marginLeft:'400px'}}>{errorMsg}</p>

                  <Link onClick={() => {setRegister(true); setErrorMsg("");}} >
                      Are you a manager? Create an account today and start managing your employees!
                  </Link>
        </div>)
        } 
      </div> 
    
  );
};

export default LoginPage;