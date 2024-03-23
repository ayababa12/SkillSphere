import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = ({isManager}) => {
  return (
    <nav>
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