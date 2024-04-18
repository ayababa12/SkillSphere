import React, { useState } from 'react';
import {
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Select,
  Grid,
  Typography,
  MenuItem,
  InputLabel
} from '@mui/material';

function Survey() {
  const [email, setEmail] = useState(''); 
  const [satisfactionLevel, setSatisfactionLevel] = useState('');
  const [numProjects, setNumProjects] = useState('');
  const [avgMonthlyHours, setAvgMonthlyHours] = useState('');
  const [yearsAtCompany, setYearsAtCompany] = useState('');
  const [workAccident, setWorkAccident] = useState('');
  const [promotion, setPromotion] = useState('');
  const [department, setDepartment] = useState('');
  const [salary, setSalary] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const SERVER_URL = "http://127.0.0.1:5000"; // Replace with your actual server URL
    const surveyData = {
      employee_email: email,
      satisfaction_level: satisfactionLevel,
      num_projects: numProjects,
      avg_monthly_hours: avgMonthlyHours,
      years_at_company: yearsAtCompany,
      work_accident: workAccident === "yes", // Convert the value to boolean
      promotion_last_5years: promotion === "yes", // Convert the value to boolean
      department: department,
      salary: salary
    };
  
    fetch(`${SERVER_URL}/submit-survey`, { // Adjust the URL to your survey submission endpoint
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(surveyData),
    })
    .then(response => response.json())
    .then(data => {
      // Handle the response data on success
      console.log('Survey submitted successfully:', data);
      // Clear the form or navigate the user to a thank you page
    })
    .catch(error => {
      // Handle any errors here
      console.error('Error submitting survey:', error);
    });
  };
  // const satisfactionBubbles = Array.from({ length: 10 }, (_, i) => i + 1).map((number) => (
  //   <FormControlLabel
  //     key={number}
  //     value={String(number)}
  //     control={<Radio />}
  //     label={String(number)}
  //   />
  // ));
  
  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '700px', margin: 'auto' }}>
      <Typography variant="h6" style={{ textAlign: 'center', marginBottom: '20px' }}>Employee Survey</Typography>

      <FormControl fullWidth margin="normal">
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          type="email"
        />
      </FormControl>


      <FormControl component="fieldset" margin="normal">
        <FormLabel component="legend">Satisfaction Level (1-10)</FormLabel>
        <RadioGroup
          row
          name="satisfactionLevel"
          value={satisfactionLevel}
          onChange={(e) => setSatisfactionLevel(e.target.value)}
          required
          style={{ justifyContent: 'center' }}
        >
          {Array.from({ length: 10 }, (_, i) => (
            <FormControlLabel
              key={i + 1}
              value={String(i + 1)}
              control={<Radio />}
              label={String(i + 1)}
            />
          ))}
        </RadioGroup>
      </FormControl>
  
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            label="Number of Projects Worked On"
            value={numProjects}
            onChange={(e) => setNumProjects(e.target.value)}
            required
            type="number"
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Average Monthly Hours"
            value={avgMonthlyHours}
            onChange={(e) => setAvgMonthlyHours(e.target.value)}
            required
            type="number"
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Number of Years at Company"
            value={yearsAtCompany}
            onChange={(e) => setYearsAtCompany(e.target.value)}
            required
            type="number"
            fullWidth
          />
        </Grid>
      </Grid>
  
      <FormControl component="fieldset" margin="normal">
        <FormLabel component="legend">Work Accident</FormLabel>
        <RadioGroup
          row
          name="workAccident"
          value={workAccident}
          onChange={(e) => setWorkAccident(e.target.value)}
          required
        >
          <FormControlLabel value="yes" control={<Radio />} label="Yes" />
          <FormControlLabel value="no" control={<Radio />} label="No" />
        </RadioGroup>
      </FormControl>
  
      <FormControl component="fieldset" margin="normal">
        <FormLabel component="legend">Promotion in Last 5 Years</FormLabel>
        <RadioGroup
          row
          name="promotion"
          value={promotion}
          onChange={(e) => setPromotion(e.target.value)}
          required
        >
          <FormControlLabel value="yes" control={<Radio />} label="Yes" />
          <FormControlLabel value="no" control={<Radio />} label="No" />
        </RadioGroup>
      </FormControl>
  
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Department</InputLabel>
            <Select value={department} onChange={(e) => setDepartment(e.target.value)}
            required>
              <MenuItem value="HR">HR</MenuItem>
              <MenuItem value="Accounting">Accounting</MenuItem>
              {/* Add other departments as needed */}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Salary Classification</InputLabel>
            <Select value={salary} onChange={(e) => setSalary(e.target.value)}
            required>
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
  
      <Button variant="contained" color="primary" type="submit" style={{ marginTop: '20px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}>
        Submit Survey
      </Button>
    </form>
  );
  
}

export default Survey;
