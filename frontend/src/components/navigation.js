import '../styles/navigation.css'
import React from 'react';
import { Link } from 'react-router-dom';
import logo from "../images/Logo.jpg"
const Navigation = ({isManager}) => {
  return (
    <div className = "nav">
    <nav>
      <img src={logo} style={{width:'202px',height:"auto",marginTop:'8px'}} />
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        {isManager?
            (<li>
                <Link to="/employees">Employees</Link>
              </li>):
            (<div></div>)
        }
        <li>
          <Link to="/tasks">Tasks</Link>
        </li>
        {!isManager && (
          <li>
            <Link to="/survey">Survey</Link>
          </li>
        )}
      </ul>
    </nav>
    </div>
  );
};

export default Navigation;