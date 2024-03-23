import React from 'react';
import { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField'; 
import {SERVER_URL} from '../App'
import { getUserToken, saveUserToken, clearUserToken ,getIsManager, saveIsManager} from "../localStorage";
import { Link } from 'react-router-dom';
import { useNavigate  } from 'react-router-dom';





const LoginPage = ({ userToken, setUserToken, isManager, setIsManager }) => {
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
    <div>
      {/* Conditional rendering based on the value of 'register' state */}
      
      {register ?
      (
        <div>  {/* This is displayed ig the user wants to register */}
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
                    onClick={() => createManager(email, password, first_name, last_name)} 
                  > 
                    Register 
                  </Button> 
                  
                  <p  style={{color:"red"}}>{errorMsg}</p>
                  
                  
                  <Link onClick={() => {setRegister(false); setErrorMsg("");}}>
                      Already have an account? click here to login!
                  </Link> 
                  
                
        </div>
      ) 
      :
      (
        <div>      {/* This is displayed ig the user wants to login */}
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
                    onClick={() => login(email, password)} 
                  > 
                    Login 
                  </Button> 
                  <p  style={{color:"red"}}>{errorMsg}</p>

                  <Link onClick={() => {setRegister(true); setErrorMsg("");}}>
                      Are you a manager? Create an account today and start managing your employees!
                  </Link>
        </div>)
        } 
      </div> 
    
  );
};

export default LoginPage;