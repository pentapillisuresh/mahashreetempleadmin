import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Eye, RefreshCw, AlertCircle } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import ViewAppointmentModal from '../pages/ViewAppointmentModal';

export default function AppointmentManagement() {
  const { 
    appointments, 
    addAppointment, 
    updateAppointment,
    deleteAppointment, 
    updateAppointmentStatus,
    loading, 
    error,
    clearError 
  } = useData();
  
  const [showModal, setShowModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [viewingAppointment, setViewingAppointment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [successMessage, setSuccessMessage] = useState('');

  // Get today's date in YYYY-MM-DD format for min date
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    // Personal Details (matching backend model)
    fullName: '',
    dateOfBirth: '',
    timeOfBirth: '',
    cityStateCountry: '',
    age: '',
    gender: '',
    mobileNumber: '',
    emailAddress: '',
    completeAddress: '',
    
    // Service Required - will be stored as JSON array
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
    preferredAppointmentDate: '',
    preferredAppointmentTime: '',
    
    // Additional Information
    detailedRequirements: '',
    numberOfAttendees: 1,
    
    // Status (matching backend enum)
    status: 'pending'
  });

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Clear error when component unmounts or when user interacts
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Prepare data for backend
      const backendData = {
        fullName: formData.fullName,
        dateOfBirth: formData.dateOfBirth,
        timeOfBirth: formData.preferredAppointmentTime,
        cityStateCountry: formData.cityStateCountry,
        age: parseInt(formData.age) || 0,
        gender: formData.gender,
        mobileNumber: formData.mobileNumber,
        emailAddress: formData.emailAddress,
        completeAddress: formData.completeAddress,
        serviceRequired: getServiceRequiredArray(),
        preferredAppointmentDate: formData.preferredAppointmentDate,
        preferredAppointmentTime: formData.preferredAppointmentTime,
        detailedRequirements: formData.detailedRequirements,
        numberOfAttendees: parseInt(formData.numberOfAttendees) || 1,
        status: formData.status
      };

      if (editingAppointment) {
        await updateAppointment(editingAppointment.id, backendData);
        setSuccessMessage('Appointment updated successfully!');
      } else {
        await addAppointment(backendData);
        setSuccessMessage('Appointment created successfully!');
      }
      resetForm();
    } catch (err) {
      // Error is handled in the context
      console.error('Failed to save appointment:', err);
    }
  };

  // Helper function to convert service checkboxes to array for backend
  const getServiceRequiredArray = () => {
    const services = [];
    if (formData.astrologyConsultation) services.push('Astrology Consultation');
    if (formData.intiVashiu) services.push('Inti Vashiu');
    if (formData.poojas) services.push('Poojas');
    if (formData.namingCeremony) services.push('Naming Ceremony');
    if (formData.horoscopeMatching) services.push('Horoscope Matching');
    if (formData.grihaPravesham) services.push('Griha Pravesham');
    if (formData.homamsYagnams) services.push('Homams/Yagnams');
    if (formData.templeRituals) services.push('Temple Rituals');
    if (formData.otherService && formData.otherServiceText) {
      services.push(formData.otherServiceText);
    }
    return services;
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      dateOfBirth: '',
      timeOfBirth: '',
      cityStateCountry: '',
      age: '',
      gender: '',
      mobileNumber: '',
      emailAddress: '',
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
      preferredAppointmentDate: '',
      preferredAppointmentTime: '',
      detailedRequirements: '',
      numberOfAttendees: 1,
      status: 'pending'
    });
    setEditingAppointment(null);
    setShowModal(false);
    clearError();
  };

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
    
    // Convert backend data to form data
    const formDataFromBackend = {
      fullName: appointment.fullName || '',
      dateOfBirth: appointment.dateOfBirth || '',
      timeOfBirth: appointment.preferredAppointmentTime || '',
      cityStateCountry: appointment.cityStateCountry || '',
      age: appointment.age || '',
      gender: appointment.gender || '',
      mobileNumber: appointment.mobileNumber || '',
      emailAddress: appointment.emailAddress || '',
      completeAddress: appointment.completeAddress || '',
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
      preferredAppointmentDate: appointment.preferredAppointmentDate || '',
      preferredAppointmentTime: appointment.preferredAppointmentTime || '',
      detailedRequirements: appointment.detailedRequirements || '',
      numberOfAttendees: appointment.numberOfAttendees || 1,
      status: appointment.status || 'pending'
    };

    // Set service checkboxes based on serviceRequired array
    if (appointment.serviceRequired && Array.isArray(appointment.serviceRequired)) {
      appointment.serviceRequired.forEach(service => {
        switch (service) {
          case 'Astrology Consultation':
            formDataFromBackend.astrologyConsultation = true;
            break;
          case 'Inti Vashiu':
            formDataFromBackend.intiVashiu = true;
            break;
          case 'Poojas':
            formDataFromBackend.poojas = true;
            break;
          case 'Naming Ceremony':
            formDataFromBackend.namingCeremony = true;
            break;
          case 'Horoscope Matching':
            formDataFromBackend.horoscopeMatching = true;
            break;
          case 'Griha Pravesham':
            formDataFromBackend.grihaPravesham = true;
            break;
          case 'Homams/Yagnams':
            formDataFromBackend.homamsYagnams = true;
            break;
          case 'Temple Rituals':
            formDataFromBackend.templeRituals = true;
            break;
          default:
            if (service && service !== 'Other') {
              formDataFromBackend.otherService = true;
              formDataFromBackend.otherServiceText = service;
            }
        }
      });
    }

    setFormData(formDataFromBackend);
    setShowModal(true);
    clearError();
  };

  const handleView = (appointment) => {
    setViewingAppointment(appointment);
    setViewModal(true);
  };

  const handleDelete = async (appointmentId) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await deleteAppointment(appointmentId);
        setSuccessMessage('Appointment deleted successfully!');
      } catch (err) {
        console.error('Failed to delete appointment:', err);
      }
    }
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await updateAppointmentStatus(appointmentId, newStatus);
      setSuccessMessage('Appointment status updated successfully!');
    } catch (err) {
      console.error('Failed to update appointment status:', err);
    }
  };

  const handleServiceChange = (service) => {
    setFormData(prev => ({
      ...prev,
      [service]: !prev[service]
    }));
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.emailAddress?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || appointment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getSelectedServices = (appointment) => {
    if (!appointment.serviceRequired) return '';
    
    if (Array.isArray(appointment.serviceRequired)) {
      return appointment.serviceRequired.join(', ');
    }
    
    // Handle case where serviceRequired might be stored as string
    try {
      const services = JSON.parse(appointment.serviceRequired);
      return Array.isArray(services) ? services.join(', ') : '';
    } catch {
      return appointment.serviceRequired || '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Appointment Management</h1>
          <p className="text-gray-600 mt-1">Manage astrology and ritual appointments</p>
        </div>
        <div className="flex items-center space-x-3">
          {loading && (
            <div className="flex items-center text-blue-600">
              <RefreshCw className="w-5 h-5 animate-spin mr-2" />
              <span>Loading...</span>
            </div>
          )}
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-900 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-blue-800 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            <Plus className="w-5 h-5" />
            <span>Add Appointment</span>
          </button>
        </div>
      </div>

      {/* Success and Error Messages */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span>{error}</span>
          <button 
            onClick={clearError}
            className="ml-auto text-red-700 hover:text-red-900"
          >
            ×
          </button>
        </div>
      )}

      {/* Search and Filter Section */}
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
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Appointments Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Services</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Preferred Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Contact</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Attendees</th>
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
                      <div className="text-sm text-gray-500">{appointment.emailAddress}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600 text-sm">
                    {getSelectedServices(appointment)}
                  </td>
                  <td className="py-3 px-4 text-gray-600 text-sm">
                    <div>{appointment.preferredAppointmentDate}</div>
                    <div className="text-gray-500">{appointment.preferredAppointmentTime}</div>
                  </td>
                  <td className="py-3 px-4 text-gray-600 text-sm">
                    <div>{appointment.mobileNumber}</div>
                    <div className="text-gray-500">{appointment.cityStateCountry}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-gray-800 font-medium">{appointment.numberOfAttendees}</div>
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={appointment.status}
                      onChange={(e) => handleStatusChange(appointment.id, e.target.value)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border-0 focus:ring-2 focus:ring-blue-900 outline-none ${getStatusColor(appointment.status)}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleView(appointment)}
                        className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                        title="View"
                        disabled={loading}
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(appointment)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit"
                        disabled={loading}
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(appointment.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                        disabled={loading}
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
            <div className="text-center py-8 text-gray-500">
              {loading ? 'Loading appointments...' : 'No appointments found'}
            </div>
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
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
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
                      value={formData.emailAddress}
                      onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })}
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
                      value={formData.preferredAppointmentDate}
                      onChange={(e) => setFormData({ ...formData, preferredAppointmentDate: e.target.value })}
                      min={getTodayDate()}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                    <input
                      type="time"
                      value={formData.preferredAppointmentTime}
                      onChange={(e) => setFormData({ ...formData, preferredAppointmentTime: e.target.value })}
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
                      value={formData.detailedRequirements}
                      onChange={(e) => setFormData({ ...formData, detailedRequirements: e.target.value })}
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      How many people will attend?
                    </label>
                    <input
                      type="number"
                      value={formData.numberOfAttendees}
                      onChange={(e) => setFormData({ ...formData, numberOfAttendees: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                      min="1"
                      max="20"
                    />
                  </div>
                </div>
              </div>

              {/* Status Field */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Appointment Status</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50 flex items-center space-x-2"
                  disabled={loading}
                >
                  {loading && <RefreshCw className="w-4 h-4 animate-spin" />}
                  <span>{editingAppointment ? 'Update' : 'Add'} Appointment</span>
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