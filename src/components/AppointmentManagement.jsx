import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Eye } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import ViewAppointmentModal from '../pages/ViewAppointmentModal';

export default function AppointmentManagement() {
  const { appointments, addAppointment, updateAppointment, deleteAppointment } = useData();
  const [showModal, setShowModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [viewingAppointment, setViewingAppointment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Get today's date in YYYY-MM-DD format for min date
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    // Personal Details
    fullName: '',
    dateOfBirth: '',
    cityStateCountry: '',
    age: '',
    gender: '',
    mobileNumber: '',
    email: '',
    completeAddress: '',
    
    // Service Required
    astrologyConsultation: false,
    intiVashiu: false,
    poojas: false,
    namingCeremony: false,
    otherService: false,
    horoscopeMatching: false,
    grihaPravesham: false,
    homamsYagnams: false,
    templeRituals: false,
    otherServiceText: '',
    
    // Preferred Date & Time
    preferredDate: '',
    preferredTime: '',
    
    // Additional Information
    requirements: '',
    attendeesCount: '',
    location: '',
    
    // Declaration
    declarationAccepted: false,
    
    // Management fields
    status: 'pending',
    paymentStatus: 'pending',
    paymentAmount: '',
    adminNotes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingAppointment) {
      updateAppointment(editingAppointment.id, formData);
    } else {
      addAppointment(formData);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      dateOfBirth: '',
      cityStateCountry: '',
      age: '',
      gender: '',
      mobileNumber: '',
      email: '',
      completeAddress: '',
      astrologyConsultation: false,
      intiVashiu: false,
      poojas: false,
      namingCeremony: false,
      otherService: false,
      horoscopeMatching: false,
      grihaPravesham: false,
      homamsYagnams: false,
      templeRituals: false,
      otherServiceText: '',
      preferredDate: '',
      preferredTime: '',
      requirements: '',
      attendeesCount: '',
      location: '',
      declarationAccepted: false,
      status: 'pending',
      paymentStatus: 'pending',
      paymentAmount: '',
      adminNotes: ''
    });
    setEditingAppointment(null);
    setShowModal(false);
  };

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
    setFormData({ ...appointment });
    setShowModal(true);
  };

  const handleView = (appointment) => {
    setViewingAppointment(appointment);
    setViewModal(true);
  };

  const handleServiceChange = (service) => {
    setFormData(prev => ({
      ...prev,
      [service]: !prev[service]
    }));
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || appointment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getSelectedServices = (appointment) => {
    const services = [];
    if (appointment.astrologyConsultation) services.push('Astrology Consultation');
    if (appointment.intiVashiu) services.push('Inti Vashiu');
    if (appointment.poojas) services.push('Poojas');
    if (appointment.namingCeremony) services.push('Naming Ceremony');
    if (appointment.horoscopeMatching) services.push('Horoscope Matching');
    if (appointment.grihaPravesham) services.push('Griha Pravesham');
    if (appointment.homamsYagnams) services.push('Homams/Yagnams');
    if (appointment.templeRituals) services.push('Temple Rituals');
    if (appointment.otherService && appointment.otherServiceText) services.push(appointment.otherServiceText);
    return services.join(', ');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Appointment Management</h1>
          <p className="text-gray-600 mt-1">Manage astrology and ritual appointments</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-900 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-blue-800 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Appointment</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Services</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Preferred Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Contact</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Payment</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((appointment) => (
                <tr key={appointment.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium text-gray-800">{appointment.fullName}</div>
                      <div className="text-sm text-gray-500">{appointment.email}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600 text-sm">
                    {getSelectedServices(appointment)}
                  </td>
                  <td className="py-3 px-4 text-gray-600 text-sm">
                    <div>{appointment.preferredDate}</div>
                    <div className="text-gray-500">{appointment.preferredTime}</div>
                  </td>
                  <td className="py-3 px-4 text-gray-600 text-sm">
                    <div>{appointment.mobileNumber}</div>
                    <div className="text-gray-500">{appointment.cityStateCountry}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-gray-800 font-medium">₹{appointment.paymentAmount || 0}</div>
                    <div className={`text-xs ${appointment.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {appointment.paymentStatus}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleView(appointment)}
                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                        title="View"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(appointment)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="Edit"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => deleteAppointment(appointment.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredAppointments.length === 0 && (
            <div className="text-center py-8 text-gray-500">No appointments found</div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingAppointment ? 'Edit Appointment' : 'Add New Appointment'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Personal Details Section */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Personal Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enter your full name
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your age
                      </label>
                      <input
                        type="number"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                        min="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City, State, Country
                    </label>
                    <input
                      type="text"
                      value={formData.cityStateCountry}
                      onChange={(e) => setFormData({ ...formData, cityStateCountry: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Gender
                      </label>
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                      >
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mobile/WhatsApp Number
                      </label>
                      <input
                        type="tel"
                        value={formData.mobileNumber}
                        onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enter your email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enter your complete address
                    </label>
                    <textarea
                      value={formData.completeAddress}
                      onChange={(e) => setFormData({ ...formData, completeAddress: e.target.value })}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Service Required Section */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Service Required (Select all that apply)</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.astrologyConsultation}
                        onChange={() => handleServiceChange('astrologyConsultation')}
                        className="w-4 h-4 text-blue-900 rounded focus:ring-blue-900"
                      />
                      <span className="text-gray-700">Astrology Consultation</span>
                    </label>
                    
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.intiVashiu}
                        onChange={() => handleServiceChange('intiVashiu')}
                        className="w-4 h-4 text-blue-900 rounded focus:ring-blue-900"
                      />
                      <span className="text-gray-700">Inti Vashiu (House Vastu Consultation)</span>
                    </label>
                    
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.poojas}
                        onChange={() => handleServiceChange('poojas')}
                        className="w-4 h-4 text-blue-900 rounded focus:ring-blue-900"
                      />
                      <span className="text-gray-700">Poojas (Lakshmi Pooja, Rudrabhishekam, Satyanarayana Vratam)</span>
                    </label>
                    
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.namingCeremony}
                        onChange={() => handleServiceChange('namingCeremony')}
                        className="w-4 h-4 text-blue-900 rounded focus:ring-blue-900"
                      />
                      <span className="text-gray-700">Naming Ceremony</span>
                    </label>
                    
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.otherService}
                        onChange={() => handleServiceChange('otherService')}
                        className="w-4 h-4 text-blue-900 rounded focus:ring-blue-900"
                      />
                      <span className="text-gray-700">Other</span>
                    </label>
                    {formData.otherService && (
                      <input
                        type="text"
                        value={formData.otherServiceText}
                        onChange={(e) => setFormData({ ...formData, otherServiceText: e.target.value })}
                        placeholder="Please specify other service"
                        className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                      />
                    )}
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.horoscopeMatching}
                        onChange={() => handleServiceChange('horoscopeMatching')}
                        className="w-4 h-4 text-blue-900 rounded focus:ring-blue-900"
                      />
                      <span className="text-gray-700">Horoscope Matching (Pellilu / Marriages)</span>
                    </label>
                    
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.grihaPravesham}
                        onChange={() => handleServiceChange('grihaPravesham')}
                        className="w-4 h-4 text-blue-900 rounded focus:ring-blue-900"
                      />
                      <span className="text-gray-700">Griha Pravesham (House Warming Ceremony)</span>
                    </label>
                    
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.homamsYagnams}
                        onChange={() => handleServiceChange('homamsYagnams')}
                        className="w-4 h-4 text-blue-900 rounded focus:ring-blue-900"
                      />
                      <span className="text-gray-700">Homams / Yagnams</span>
                    </label>
                    
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.templeRituals}
                        onChange={() => handleServiceChange('templeRituals')}
                        className="w-4 h-4 text-blue-900 rounded focus:ring-blue-900"
                      />
                      <span className="text-gray-700">Temple Rituals</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Preferred Date & Time */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Preferred Appointment Date & Time</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <input
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                      min={getTodayDate()} // Restrict to today and future dates
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                    <input
                      type="time"
                      value={formData.preferredTime}
                      onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Additional Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Please describe your requirements in detail...
                    </label>
                    <textarea
                      value={formData.requirements}
                      onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        How many people will attend?
                      </label>
                      <input
                        type="number"
                        value={formData.attendeesCount}
                        onChange={(e) => setFormData({ ...formData, attendeesCount: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Location
                      </label>
                      <select
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                      >
                        <option value="">Select Location</option>
                        <option value="temple">At Temple</option>
                        <option value="home">At Home</option>
                        <option value="online">Online</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Declaration */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Declaration</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 mb-4">
                    I confirm that the above details are true and accurate. I request to book an appointment for the mentioned service and understand that the final confirmation will be provided by the temple administration
                  </p>
                  
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.declarationAccepted}
                      onChange={(e) => setFormData({ ...formData, declarationAccepted: e.target.checked })}
                      className="w-4 h-4 text-blue-900 rounded focus:ring-blue-900"
                      required
                    />
                    <span className="text-gray-700 font-medium">I accept the declaration</span>
                  </label>
                </div>
              </div>

              {/* Admin Management Fields */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Administration</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                    <select
                      value={formData.paymentStatus}
                      onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Amount (₹)</label>
                    <input
                      type="number"
                      value={formData.paymentAmount}
                      onChange={(e) => setFormData({ ...formData, paymentAmount: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                      min="0"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes</label>
                  <textarea
                    value={formData.adminNotes}
                    onChange={(e) => setFormData({ ...formData, adminNotes: e.target.value })}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                    placeholder="Internal notes for administration..."
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
                >
                  {editingAppointment ? 'Update' : 'Add'} Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewModal && (
        <ViewAppointmentModal
          appointment={viewingAppointment}
          onClose={() => setViewModal(false)}
        />
      )}
    </div>
  );
}