import React, { useState } from 'react';
import { MdSpaceDashboard } from "react-icons/md";
import { FaFileUpload } from "react-icons/fa";
import { PiMonitor } from "react-icons/pi";
import { MdAddAlert } from "react-icons/md";
import { AiOutlineAudit } from "react-icons/ai";
import { FaUserCircle } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import { Link } from 'react-router-dom';
import '../../../css/Employee/sidebar.css';

const SidebarEmployee = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <MdSpaceDashboard />,
      path: '/employee/dashboard'
    },
    {
      title: 'Upload',
      icon: <FaFileUpload />,
      path: '/employee/upload'
    },
    {
      title: 'Monitoring',
      icon: <PiMonitor />,
      path: '/employee/monitoring'
    },
    {
      title: 'Audit Logs',
      icon: <AiOutlineAudit />,
      path: '/employee/audit-logs'
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    window.location.href = '/login';
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <h3 className={isCollapsed ? 'hidden' : ''}>Employee Panel</h3>
        <button 
          className="collapse-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item, index) => (
          <Link 
            to={item.path} 
            key={index} 
            className="nav-item"
          >
            <span className="icon">{item.icon}</span>
            <span className={isCollapsed ? 'hidden' : ''}>{item.title}</span>
          </Link>
        ))}
      </nav>
      <div className="sidebar-footer">
        <Link to="/employee/profile" className="nav-item">
          <span className="icon"><FaUserCircle /></span>
          <span className={isCollapsed ? 'hidden' : ''}>Profile</span>
        </Link>
        <button onClick={handleLogout} className="nav-item logout-btn">
          <span className="icon"><IoMdLogOut /></span>
          <span className={isCollapsed ? 'hidden' : ''}>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default SidebarEmployee;
