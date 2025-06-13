import React, { useState } from 'react';
import { MdSpaceDashboard } from "react-icons/md";
import { FaUserFriends } from "react-icons/fa";
import { FaFileUpload } from "react-icons/fa";
import { PiMonitor } from "react-icons/pi";
import { MdAddAlert } from "react-icons/md";
import { AiOutlineAudit } from "react-icons/ai";
import { Link } from 'react-router-dom';
import '../../../css/Admin/sidebar.css';

const SidebarAdmin = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <MdSpaceDashboard />,
      path: '/admin/dashboard'
    },
    {
      title: 'Manage Employee',
      icon: <FaUserFriends />,
      path: '/admin/manage-employee'
    },
    {
      title: 'Upload',
      icon: <FaFileUpload />,
      path: '/admin/upload'
    },
    {
      title: 'Monitoring',
      icon: <PiMonitor />,
      path: '/admin/monitoring'
    },
    {
      title: 'Audit Logs',
      icon: <AiOutlineAudit />,
      path: '/admin/audit-logs'
    }
  ];

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <h3 className={isCollapsed ? 'hidden' : ''}>Admin Panel</h3>
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
    </div>
  );
};

export default SidebarAdmin;
