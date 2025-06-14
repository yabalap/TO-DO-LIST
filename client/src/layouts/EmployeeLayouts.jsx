import React from 'react';
import { Outlet } from 'react-router-dom';
import '../css/Employee/sidebar.css';

const EmployeeLayouts = () => {
  return (
    <div className="employee-layout">
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default EmployeeLayouts; 