import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Box, Typography, Paper } from '@mui/material';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const options = {
  plugins: {
    datalabels: {
      color: '#FFF',
      anchor: 'end',
      align: 'top',
      formatter: Math.round,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

function Analytics() {
  const [genderData, setGenderData] = useState({});
  const [ageData, setAgeData] = useState({});
  const [departmentData, setDepartmentData] = useState({});

  useEffect(() => {
    // This is a base URL. Replace with your actual server URL where your API is hosted.
    const SERVER_URL = "http://127.0.0.1:5000";
  
    // Fetch turnover by gender data
    fetch(`${SERVER_URL}/analytics/gender`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        // Assuming data is an array of objects with `gender` and `turnover` properties
        const labels = data.map((item) => item.gender);
        const turnoverData = data.map((item) => item.turnover);
  
        // Now we will set the state with this new data in the format expected by Chart.js
        setGenderData({
          labels: labels,
          datasets: [
            {
              label: 'Turnover',
              data: turnoverData,
              backgroundColor: [
                // Add colors for each bar here
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                // ... more colors for additional bars
              ],
              borderColor: [
                // Add border colors for each bar here
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                // ... more colors for additional bars
              ],
              borderWidth: 1,
            },
          ],
        });
      })
      .catch((error) => {
        console.error('There was an error fetching the gender turnover data:', error);
      });
  
    // Repeat the above for age and department datasets.
  }, []);
  
  return (
    <Box sx={{ flexGrow: 1, padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Employee Turnover Analytics
      </Typography>
      <Paper elevation={3} sx={{ padding: 2, marginBottom: 3 }}>
        <Typography variant="h6">Turnover by Gender</Typography>
        <Bar data={genderData} options={options} plugins={[ChartDataLabels]} />
      </Paper>
      <Paper elevation={3} sx={{ padding: 2, marginBottom: 3 }}>
        <Typography variant="h6">Turnover by Age</Typography>
        <Bar data={ageData} options={options} plugins={[ChartDataLabels]} />
      </Paper>
      <Paper elevation={3} sx={{ padding: 2, marginBottom: 3 }}>
        <Typography variant="h6">Turnover by Department</Typography>
        <Bar data={departmentData} options={options} plugins={[ChartDataLabels]} />
      </Paper>
    </Box>
  );
}

export default Analytics;
