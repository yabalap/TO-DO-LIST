import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login/Login';
import AdminLayouts from './layouts/AdminLayouts';
import DashboardAdmin from './components/Admin/AdminDashboard/dashboardAdmin';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-dashboard" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin" element={<AdminLayouts />}>
          <Route path="dashboard" element={<DashboardAdmin />} />
          <Route path="manage-employee" element={<div>Manage Employee Page</div>} />
          <Route path="upload" element={<div>Upload Page</div>} />
          <Route path="monitoring" element={<div>Monitoring Page</div>} />
          <Route path="audit-logs" element={<div>Audit Logs Page</div>} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
