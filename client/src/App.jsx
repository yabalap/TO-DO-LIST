import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './components/Login/Login';
import AdminLayouts from './layouts/AdminLayouts';
import EmployeeLayouts from './layouts/EmployeeLayouts';
import DashboardAdmin from './components/Admin/AdminDashboard/dashboardAdmin';
import DashboardEmployee from './components/Employee/EmployeeDashboard/dashboardEmployee';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
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
          <Route path="manage-employee" element={<div>Manage Employee Page</div>} />
          <Route path="upload" element={<div>Upload Page</div>} />
          <Route path="monitoring" element={<div>Monitoring Page</div>} />
          <Route path="audit-logs" element={<div>Audit Logs Page</div>} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Employee Routes */}
        <Route 
          path="/employee" 
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <EmployeeLayouts />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<DashboardEmployee />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Catch all route - redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
