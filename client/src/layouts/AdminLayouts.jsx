import React from 'react';
import SidebarAdmin from '../components/Admin/Sidebar_Navbar/sidebarAdmin';
import { Outlet } from 'react-router-dom';
import '../css/Admin/sidebar.css';

const AdminLayouts = () => {
  return (
    <div className="admin-layout">
      <SidebarAdmin />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayouts;