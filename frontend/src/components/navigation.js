import '../styles/navigation.css'
import React from 'react';
import { Link } from 'react-router-dom';
import logo from "../images/Logo.jpg"
const Navigation = ({isManager}) => {
  return (
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
        {/* Add more navigation links as needed */}
      </ul>
    </nav>
  );
};

export default Navigation;