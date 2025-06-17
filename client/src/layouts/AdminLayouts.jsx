import React, { useState } from 'react';
import SidebarAdmin from '../components/Admin/Sidebar_Navbar/sidebarAdmin';
import Navbar from '../components/Common/Navbar';
import { Outlet } from 'react-router-dom';
import '../css/Admin/sidebar.css';

const AdminLayouts = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="admin-layout">
      <SidebarAdmin isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className={`main-wrapper ${isCollapsed ? 'collapsed' : ''}`}>
        <Navbar className={isCollapsed ? 'collapsed' : ''} />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayouts;