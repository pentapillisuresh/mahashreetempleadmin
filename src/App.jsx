import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
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

function AdminPanel() {
  const { isAuthenticated, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'volunteers':
        return <VolunteerManagement />;
      case 'appointments':
        return <AppointmentManagement />;
      case 'temple':
        return <TempleContentManagement />;
      case 'events':
        return <EventManagement />;
      case 'projects':
        return <ProjectManagement />;
      case 'donations':
        return <DonationManagement />;
      case 'elibrary':
        return <ELibraryManagement />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} onLogout={logout} />
      <div className="flex-1 ml-64">
        <div className="p-8">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AdminPanel />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
