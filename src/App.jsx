import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';

// Components
import LoginPage from './components/LoginPage';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import VolunteerManagement from './components/VolunteerManagement';
import AppointmentManagement from './components/AppointmentManagement';
import TempleContentManagement from './components/TempleContentManagement';
import EventManagement from './components/EventManagement';
import ProjectManagement from './components/ProjectManagement';
import DonationManagement from './components/DonationManagement';
import ELibraryManagement from './components/ELibraryManagement';
import ContactSubmissions from './components/Contacts';

function AdminLayout() {
  const { logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar onLogout={logout} />
      <div className="flex-1 ml-64 p-8">
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="volunteers" element={<VolunteerManagement />} />
          <Route path="appointments" element={<AppointmentManagement />} />
          <Route path="temple" element={<TempleContentManagement />} />
          <Route path="events" element={<EventManagement />} />
          <Route path="projects" element={<ProjectManagement />} />
          <Route path="donations" element={<DonationManagement />} />
          <Route path="elibrary" element={<ELibraryManagement />} />
          <Route path="contacts" element={<ContactSubmissions />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
}

// Protected Route Wrapper - UPDATED
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

// Public Route Wrapper - Prevent authenticated users from accessing login
function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  return children;
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Routes>
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              } 
            />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;