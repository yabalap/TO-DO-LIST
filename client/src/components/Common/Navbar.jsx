import React, { useState } from 'react';
import { FaBell } from 'react-icons/fa';
import { Badge, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import './Navbar.css';

const Navbar = ({ className }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New task assigned', time: '5 minutes ago' },
    { id: 2, message: 'Document approved', time: '1 hour ago' },
    { id: 3, message: 'Meeting reminder', time: '2 hours ago' },
  ]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <nav className={`navbar ${className || ''}`}>
      <div className="navbar-brand">
        <h2>Task Management</h2>
      </div>
      <div className="navbar-right">
        <IconButton
          color="inherit"
          onClick={handleClick}
          className="notification-bell"
        >
          <Badge badgeContent={notifications.length} color="error">
            <FaBell />
          </Badge>
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          className="notification-menu"
          PaperProps={{
            style: {
              maxHeight: 300,
              width: 300,
            },
          }}
        >
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <MenuItem key={notification.id} onClick={handleClose}>
                <div className="notification-item">
                  <Typography variant="body1">{notification.message}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {notification.time}
                  </Typography>
                </div>
              </MenuItem>
            ))
          ) : (
            <MenuItem onClick={handleClose}>
              <Typography>No new notifications</Typography>
            </MenuItem>
          )}
        </Menu>
      </div>
    </nav>
  );
};

export default Navbar; 