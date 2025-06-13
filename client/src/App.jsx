import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login/Login';
import DashboardAdmin from './components/Admin/AdminDashboard/dashboardAdmin';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-dashboard" element={<DashboardAdmin />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
