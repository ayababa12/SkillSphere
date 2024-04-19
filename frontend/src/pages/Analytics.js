import React, { useState, useEffect, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import Navigation from '../components/navigation';



function Analytics({SERVER_URL}) {
  const [genderData, setGenderData] = useState({});
  const [ageData, setAgeData] = useState({});
  const [departmentData, setDepartmentData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getGenderData = useCallback( () => {
    return fetch(`${SERVER_URL}/analytics/gender`, {method:"GET"})
    .then((response) => response.json())
    .then((data) => {setGenderData(data);})

  });
 
  useEffect(() => {getGenderData();}, [])

  const getDepartmentData = useCallback( () => {
    return fetch(`${SERVER_URL}/analytics/department`, {method:"GET"})
    .then((response) => response.json())
    .then((data) => {setDepartmentData(data);})

  });
 
  useEffect(() => {getDepartmentData();}, [])

  const updateRates = useCallback( () => {
    return fetch(`${SERVER_URL}/predict-turnover`, {method:"GET"})
  });
 
  useEffect(() => {updateRates();}, [])
  
  const graphGenderData = Object.keys(genderData).map((key) => ({
    gender: key,
    rate: genderData[key]
  }));

  const graphDepartmentData = Object.keys(departmentData).map((key) => ({
    department: key,
    rate: departmentData[key]
  }));

  return (
    <div>
      <Navigation isManager={true}/>
      <div style = {{marginLeft: "220px"}}>
      <h2>Turnover Rates By Gender (%)</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={graphGenderData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="gender" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="rate" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>

      <h2>Turnover Rates By Department (%)</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={graphDepartmentData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="department"  />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="rate" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
    </div>
  );
}

export default Analytics;
