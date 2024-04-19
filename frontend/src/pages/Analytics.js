import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const SERVER_URL = "http://127.0.0.1:5000";
  
    Promise.all([
      fetch(`${SERVER_URL}/analytics/gender`).then(handleResponse),
      
      fetch(`${SERVER_URL}/analytics/department`).then(handleResponse),
    ])
    .then(([genderResponse, ageResponse, departmentResponse]) => {
      setupChartData('gender', genderResponse);
      setupChartData('age', ageResponse);
      setupChartData('department', departmentResponse);
      setLoading(false);
    })
    .catch(error => {
      setError('Failed to load data');
      setLoading(false);
      console.error('Error loading the analytics data:', error);
    });
  }, []);

  // A helper function to handle responses and throw an error if not ok
  function handleResponse(response) {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  }

  function setupChartData(key, data) {
    // Verify data is an array
    if (!Array.isArray(data)) {
      setError('Data is not in expected format');
      return;
    }

    const labels = data.map(item => item[key]);
    const turnoverData = data.map(item => item.turnover);

    const chartData = {
      labels,
      datasets: [{
        label: 'Turnover',
        data: turnoverData,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      }],
    };

    switch (key) {
      case 'gender':
        setGenderData(chartData);
        break;
      case 'age':
        setAgeData(chartData);
        break;
      case 'department':
        setDepartmentData(chartData);
        break;
      default:
        // Handle unexpected key
        setError(`Unknown key: ${key}`);
        break;
    }
  }

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

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
