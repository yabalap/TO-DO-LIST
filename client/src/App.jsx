import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './components/Login/Login';
import AdminLayouts from './layouts/AdminLayouts';
import EmployeeLayouts from './layouts/EmployeeLayouts';
import DashboardAdmin from './components/Admin/AdminDashboard/dashboardAdmin';
import DashboardEmployee from './components/Employee/EmployeeDashboard/dashboardEmployee';
import ManageEmployee from './components/Admin/ManageEmployee/manageEmployee';
import AddUser from './components/Admin/ManageEmployee/addUser';
import EditUser from './components/Admin/ManageEmployee/editUser';
import UploadsEmployee from './components/Employee/Uploads/uploadsEmployee';
import MonitorEmployee from './components/Employee/Monitoring/monitorEmployee';
import EditMonitor from './components/Employee/Monitoring/editMonitor';
import MonitoringAdmin from './components/Admin/Monitoring/monitoringAdmin';
import ViewMonitor from './components/Admin/Monitoring/viewMonitor';
import AuditEmployee from './components/Employee/AuditLogs/auditEmployee';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // If user is employee but role is 'user', allow access
    if (userRole === 'employee' && allowedRoles.includes('user')) {
      return children;
    }
    return <Navigate to={`/${userRole}/dashboard`} replace />;
  }

  return children;
};

// Public Route Component
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  if (token) {
    return <Navigate to={`/${userRole}/dashboard`} replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/" 
          element={
            <PublicRoute>
              <Navigate to="/login" replace />
            </PublicRoute>
          } 
        />
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        
        {/* Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayouts />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<DashboardAdmin />} />
          <Route path="manage-employee" element={<ManageEmployee />} />
          <Route path="add-employee" element={<AddUser />} />
          <Route path="edit-employee/:id" element={<EditUser />} />
          <Route path="monitoring" element={<MonitoringAdmin />} />
          <Route path="monitoring/edit/:id" element={<div>Edit Monitoring Page</div>} />
          <Route path="monitoring/view/:id" element={<ViewMonitor />} />
          <Route path="audit-logs" element={<AuditEmployee />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Employee Routes */}
        <Route 
          path="/employee" 
          element={
            <ProtectedRoute allowedRoles={['user', 'employee']}>
              <EmployeeLayouts />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<DashboardEmployee />} />
          <Route path="upload" element={<UploadsEmployee />} />
          <Route path="monitoring" element={<MonitorEmployee />} />
          <Route path="monitoring/edit/:id" element={<EditMonitor />} />
          <Route path="audit-logs" element={<AuditEmployee />} />
          <Route path="profile" element={<div className="page-container">Profile Page</div>} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Catch all route - redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
