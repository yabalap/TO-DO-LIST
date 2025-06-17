import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SidebarEmployee from '../components/Employee/Sidebar_Navbar/sidebarEmployee';
import Navbar from '../components/Common/Navbar';
import '../css/Employee/sidebar.css';

const EmployeeLayouts = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="employee-layout">
      <SidebarEmployee isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className={`main-wrapper ${isCollapsed ? 'collapsed' : ''}`}>
        <Navbar className={isCollapsed ? 'collapsed' : ''} />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default EmployeeLayouts; 