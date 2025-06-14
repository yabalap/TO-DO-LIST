import React from 'react';
import { Outlet } from 'react-router-dom';
import SidebarEmployee from '../components/Employee/Sidebar_Navbar/sidebarEmployee';
import '../css/Employee/sidebar.css';

const EmployeeLayouts = () => {
  return (
    <div className="employee-layout">
      <SidebarEmployee />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default EmployeeLayouts; 