// import React, { useState } from 'react';
// import {login} from "./authentication"
// import Button from '@mui/material/Button';
// import TextField from '@mui/material/TextField';

// function createManager(email, password) { 
//     return fetch(`${SERVER_URL}/createManager`, { 
//       method: "POST", 
//       headers: { 
//         "Content-Type": "application/json", 
//       }, 
//       body: JSON.stringify({ 
//         email: email, 
//         password: password, 
//       }), 
//     }).then((response) => login(username, password)); 
  


//   return (
//     <div>
//       <div className="form-item"> 
//         <TextField 
//           fullWidth 
//           label="Email" 
//           type="text" 
//           value={email} 
//           onChange={({ target: { value } }) => setEmail(value)} 
//         /> 
//       </div> 
//       <div className="form-item"> 
//         <TextField 
//           fullWidth 
//           label="Password" 
//           type="password" 
//           value={password} 
//           onChange={({ target: { value } }) => setPassword(value)} 
//         /> 
//       </div> 
//       <Button 
//         color="primary" 
//         variant="contained" 
//         onClick={handleRegister} 
//       > 
//         Register 
//       </Button> 
//     </div>
//   );
// }

// export default Register;

