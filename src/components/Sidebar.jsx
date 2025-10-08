import {
  LayoutDashboard,
  Users,
  Calendar,
  Church,
  CalendarDays,
  FolderKanban,
  DollarSign,
  BookOpen,
  LogOut
} from 'lucide-react';

export default function Sidebar({ currentPage, setCurrentPage, onLogout }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'volunteers', label: 'Volunteers', icon: Users },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'temple', label: 'Temple Content', icon: Church },
    { id: 'events', label: 'Events', icon: CalendarDays },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'donations', label: 'Donations', icon: DollarSign },
    { id: 'elibrary', label: 'E-Library', icon: BookOpen },
  ];

  return (
    <div className="w-64 bg-blue-900 text-white h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-6 border-b border-blue-800">
        <h1 className="text-xl font-bold">MAHA SHREE RUDRA</h1>
        <p className="text-sm text-blue-300 mt-1">Admin Panel</p>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center space-x-3 px-6 py-3 transition-colors ${
                isActive
                  ? 'bg-blue-800 border-l-4 border-white'
                  : 'hover:bg-blue-800 border-l-4 border-transparent'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <button
        onClick={onLogout}
        className="flex items-center space-x-3 px-6 py-4 hover:bg-blue-800 transition-colors border-t border-blue-800"
      >
        <LogOut className="w-5 h-5" />
        <span className="font-medium">Logout</span>
      </button>
    </div>
  );
}
