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
  MenuItem,
  InputLabel
} from '@mui/material';

function Survey() {
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
    // Process form submission here
    // You might want to validate inputs or even set up a POST request to your backend
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl fullWidth margin="normal">
        <TextField
          label="Satisfaction Level (1-10)"
          value={satisfactionLevel}
          onChange={(e) => setSatisfactionLevel(e.target.value)}
          type="number"
          inputProps={{ min: 1, max: 10 }}
        />
      </FormControl>

      <FormControl fullWidth margin="normal">
        <TextField
          label="Number of Projects Worked On"
          value={numProjects}
          onChange={(e) => setNumProjects(e.target.value)}
          type="number"
        />
      </FormControl>

      <FormControl fullWidth margin="normal">
        <TextField
          label="Average Monthly Hours"
          value={avgMonthlyHours}
          onChange={(e) => setAvgMonthlyHours(e.target.value)}
          type="number"
        />
      </FormControl>

      <FormControl fullWidth margin="normal">
        <TextField
          label="Number of Years at Company"
          value={yearsAtCompany}
          onChange={(e) => setYearsAtCompany(e.target.value)}
          type="number"
        />
      </FormControl>

      <FormControl component="fieldset" margin="normal">
        <FormLabel component="legend">Work Accident</FormLabel>
        <RadioGroup row name="workAccident" value={workAccident} onChange={(e) => setWorkAccident(e.target.value)}>
          <FormControlLabel value="yes" control={<Radio />} label="Yes" />
          <FormControlLabel value="no" control={<Radio />} label="No" />
        </RadioGroup>
      </FormControl>

      <FormControl component="fieldset" margin="normal">
        <FormLabel component="legend">Promotion in Last 5 Years</FormLabel>
        <RadioGroup row name="promotion" value={promotion} onChange={(e) => setPromotion(e.target.value)}>
          <FormControlLabel value="yes" control={<Radio />} label="Yes" />
          <FormControlLabel value="no" control={<Radio />} label="No" />
        </RadioGroup>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Department</InputLabel>
        <Select value={department} onChange={(e) => setDepartment(e.target.value)}>
          <MenuItem value="HR">HR</MenuItem>
          <MenuItem value="Accounting">Accounting</MenuItem>
          {/* Add other departments as needed */}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Salary Classification</InputLabel>
        <Select value={salary} onChange={(e) => setSalary(e.target.value)}>
          <MenuItem value="low">Low</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="high">High</MenuItem>
        </Select>
      </FormControl>

      <Button variant="contained" color="primary" type="submit">
        Submit Survey
      </Button>
    </form>
  );
}

export default Survey;
