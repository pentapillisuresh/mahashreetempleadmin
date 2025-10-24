import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Calendar,
  CalendarDays,
  FolderKanban,
  BookOpen,
  LogOut,
  IndianRupee,
  Contact,
} from "lucide-react";

export default function Sidebar({ onLogout }) {
  const location = useLocation();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "volunteers", label: "Volunteers", icon: Users },
    { id: "appointments", label: "Appointments", icon: Calendar },
    { id: "temple", label: "Temple Content", icon: TempleIcon },
    { id: "events", label: "Events", icon: CalendarDays },
    { id: "projects", label: "Projects", icon: FolderKanban },
    { id: "donations", label: "Donations", icon: IndianRupee },
    { id: "elibrary", label: "E-Library", icon: BookOpen },
    { id: "contacts", label: "Contacts", icon: Contact },
  ];

  return (
    <div className="w-64 bg-blue-900 text-white h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-6 border-b border-blue-800">
        <h1 className="text-xl font-bold">MAHA SHREE RUDRA</h1>
        <p className="text-sm text-blue-300 mt-1">Admin Panel</p>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 scrollbar-hide">
        {menuItems.map(({ id, label, icon: Icon }) => {
          const isActive = location.pathname.includes(id);

          return (
            <Link
              key={id}
              to={`/admin/${id}`}
              className={`flex items-center space-x-3 px-6 py-3 w-full transition-colors border-l-4 ${
                isActive
                  ? "bg-blue-800 border-white"
                  : "border-transparent hover:bg-blue-800"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>

      <button
        onClick={onLogout}
        className="flex items-center space-x-3 px-6 py-4 text-red-400 hover:bg-blue-800 transition-colors border-t border-blue-800"
      >
        <LogOut className="w-5 h-5" />
        <span className="font-medium">Logout</span>
      </button>
    </div>
  );
}

// Detailed Hindu Temple Icon
function TempleIcon({ className }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Temple Base */}
      <path d="M3 21H21" />
      <path d="M4 21V10" />
      <path d="M8 21V10" />
      <path d="M12 21V10" />
      <path d="M16 21V10" />
      <path d="M20 21V10" />
      
      {/* Main Temple Structure */}
      <path d="M6 10L12 4L18 10H6Z" />
      
      {/* Central Shikara (Main Tower) */}
      <path d="M12 4V2" />
      <path d="M11 2H13" />
      
      {/* Side Shikaras (Smaller Towers) */}
      <path d="M8 7V5" />
      <path d="M16 7V5" />
      
      {/* Temple Entrance */}
      <path d="M10 21V17H14V21" />
      <path d="M11 17H13" />
      
      {/* Decorative Elements */}
      <path d="M7 13H17" />
      <path d="M8 15H16" />
      
      {/* Kalash (Pot) on top */}
      <path d="M12 2C12.5523 2 13 1.55228 13 1C13 0.447715 12.5523 0 12 0C11.4477 0 11 0.447715 11 1C11 1.55228 11.4477 2 12 2Z" />
    </svg>
  );
}