import { Users, Calendar, CalendarDays, IndianRupee, Globe, TrendingUp } from 'lucide-react';
import { useData } from '../contexts/DataContext';

export default function Dashboard() {
  const { volunteers, appointments, events, donations, projects, analytics } = useData();

  const pendingVolunteers = volunteers.filter(v => v.status === 'pending').length;
  const pendingAppointments = appointments.filter(a => a.status === 'pending').length;
  const upcomingEvents = events.filter(e => e.status === 'upcoming').length;
  const totalDonations = donations.reduce((sum, d) => sum + Number(d.amount || 0), 0);
  const domesticDonations = donations.filter(d => d.type === 'domestic').reduce((sum, d) => sum + Number(d.amount || 0), 0);
  const internationalDonations = donations.filter(d => d.type === 'international').reduce((sum, d) => sum + Number(d.amount || 0), 0);
  const activeProjects = projects.filter(p => p.status === 'active').length;

  const stats = [
    {
      label: 'Total Visitors',
      value: analytics.visitors || 1234,
      icon: Globe,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      label: 'Total Donations',
      value: `₹${totalDonations.toLocaleString()}`,
      icon: IndianRupee,
      color: 'bg-green-500',
      change: `${donations.length} donations`
    },
    {
      label: 'Upcoming Events',
      value: upcomingEvents,
      icon: CalendarDays,
      color: 'bg-purple-500',
      change: `${events.length} total`
    },
    {
      label: 'Pending Appointments',
      value: pendingAppointments,
      icon: Calendar,
      color: 'bg-orange-500',
      change: `${appointments.length} total`
    },
    {
      label: 'Registered Volunteers',
      value: volunteers.length,
      icon: Users,
      color: 'bg-teal-500',
      change: `${pendingVolunteers} pending`
    },
    {
      label: 'Active Projects',
      value: activeProjects,
      icon: TrendingUp,
      color: 'bg-red-500',
      change: `${projects.length} total`
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">Welcome to MAHA SHREE RUDRA SAMSTHANAM FOUNDATION Admin Panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-2">{stat.change}</p>
                </div>
                <div className={`${stat.color} rounded-full p-4`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Donations Breakdown</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Domestic Donations</span>
              <span className="text-lg font-semibold text-green-600">₹{domesticDonations.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">International Donations</span>
              <span className="text-lg font-semibold text-blue-600">₹{internationalDonations.toLocaleString()}</span>
            </div>
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-800 font-semibold">Total</span>
                <span className="text-xl font-bold text-gray-800">₹{totalDonations.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {volunteers.slice(-5).reverse().map((volunteer, index) => (
              <div key={index} className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">New volunteer: {volunteer.fullName}</span>
              </div>
            ))}
            {appointments.slice(-3).reverse().map((appointment, index) => (
              <div key={index} className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-gray-600">New appointment: {appointment.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
