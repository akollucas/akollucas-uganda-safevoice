import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import VictimLogin from './pages/VictimLogin';
import AdminDashboard from './pages/AdminDashboard';
import PoliceAdminDashboard from './pages/PoliceAdminDashboard';
import PoliceOfficerDashboard from './pages/PoliceOfficerDashboard';
import VolunteerDashboard from './pages/VolunteerDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/victim-login" element={<VictimLogin />} />
          <Route path="/admin/*" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/police-admin/*" element={<ProtectedRoute roles={['policeAdmin']}><PoliceAdminDashboard /></ProtectedRoute>} />
          <Route path="/officer/*" element={<ProtectedRoute roles={['policeOfficer']}><PoliceOfficerDashboard /></ProtectedRoute>} />
          <Route path="/volunteer/*" element={<ProtectedRoute roles={['volunteer']}><VolunteerDashboard /></ProtectedRoute>} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;