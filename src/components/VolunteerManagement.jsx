import { useState } from 'react';
import { Plus, Search, CheckCircle, XCircle, Edit2, Trash2, Mail, Phone, Eye } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import ViewVolunteerModal from '../pages/ViewVolunteerModal';

export default function VolunteerManagement() {
  const { volunteers, addVolunteer, updateVolunteer, deleteVolunteer } = useData();
  const [showModal, setShowModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [editingVolunteer, setEditingVolunteer] = useState(null);
  const [viewingVolunteer, setViewingVolunteer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [formData, setFormData] = useState({
    // Personal Details
    fullName: '',
    qualification: '',
    gender: '',
    bloodGroup: '',
    address: '',
    phoneNumber: '',
    email: '',
    occupation: '',
    dateOfBirth: '',
    bloodDonor: '',
    maritalStatus: '',
    
    // Volunteer Preferences
    templeService: false,
    socialService: false,
    educationalSupport: false,
    events: false,
    medicalCamps: false,
    othersInterest: false,
    weekdays: false,
    weekends: false,
    flexible: false,
    specificTime: false,
    
    // Feedback & Suggestions
    feedback: '',
    
    // Management fields
    status: 'pending',
    adminNotes: ''
  });

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const maritalStatuses = ['Single', 'Married', 'Divorced', 'Widowed'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingVolunteer) {
      updateVolunteer(editingVolunteer.id, formData);
    } else {
      addVolunteer(formData);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      qualification: '',
      gender: '',
      bloodGroup: '',
      address: '',
      phoneNumber: '',
      email: '',
      occupation: '',
      dateOfBirth: '',
      bloodDonor: '',
      maritalStatus: '',
      templeService: false,
      socialService: false,
      educationalSupport: false,
      events: false,
      medicalCamps: false,
      othersInterest: false,
      weekdays: false,
      weekends: false,
      flexible: false,
      specificTime: false,
      feedback: '',
      status: 'pending',
      adminNotes: ''
    });
    setEditingVolunteer(null);
    setShowModal(false);
  };

  const handleEdit = (volunteer) => {
    setEditingVolunteer(volunteer);
    setFormData({ ...volunteer });
    setShowModal(true);
  };

  const handleView = (volunteer) => {
    setViewingVolunteer(volunteer);
    setViewModal(true);
  };

  const handleApprove = (id) => {
    updateVolunteer(id, { status: 'approved' });
  };

  const handleReject = (id) => {
    updateVolunteer(id, { status: 'rejected' });
  };

  const handleInterestChange = (interest) => {
    setFormData(prev => ({
      ...prev,
      [interest]: !prev[interest]
    }));
  };

  const handleAvailabilityChange = (availability) => {
    setFormData(prev => ({
      ...prev,
      [availability]: !prev[availability]
    }));
  };

  const filteredVolunteers = volunteers.filter(volunteer => {
    const matchesSearch = volunteer.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         volunteer.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || volunteer.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getSelectedInterests = (volunteer) => {
    const interests = [];
    if (volunteer.templeService) interests.push('Temple Service');
    if (volunteer.socialService) interests.push('Social Service');
    if (volunteer.educationalSupport) interests.push('Educational Support');
    if (volunteer.events) interests.push('Events');
    if (volunteer.medicalCamps) interests.push('Medical Camps');
    if (volunteer.othersInterest) interests.push('Others');
    return interests.join(', ');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Volunteer Management</h1>
          <p className="text-gray-600 mt-1">Manage volunteer applications and assignments</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-900 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-blue-800 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Volunteer</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search volunteers..."
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
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Contact</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Qualification</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Interests</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Blood Group</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVolunteers.map((volunteer) => (
                <tr key={volunteer.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium text-gray-800">{volunteer.fullName}</div>
                      <div className="text-sm text-gray-500">{volunteer.occupation}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-col space-y-1 text-sm">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{volunteer.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{volunteer.phoneNumber}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600 text-sm">
                    {volunteer.qualification}
                  </td>
                  <td className="py-3 px-4 text-gray-600 text-sm">
                    {getSelectedInterests(volunteer)}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {volunteer.bloodGroup || '-'}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(volunteer.status)}`}>
                      {volunteer.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleView(volunteer)}
                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                        title="View"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      {volunteer.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(volunteer.id)}
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                            title="Approve"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleReject(volunteer.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Reject"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleEdit(volunteer)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="Edit"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => deleteVolunteer(volunteer.id)}
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
          {filteredVolunteers.length === 0 && (
            <div className="text-center py-8 text-gray-500">No volunteers found</div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingVolunteer ? 'Edit Volunteer' : 'Add New Volunteer'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Personal Details Section */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Personal Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">Qualification</label>
                      <input
                        type="text"
                        value={formData.qualification}
                        onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                        placeholder="e.g. B.Tech, MBA"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group</label>
                      <select
                        value={formData.bloodGroup}
                        onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                      >
                        <option value="">Select Blood Group</option>
                        {bloodGroups.map(group => (
                          <option key={group} value={group}>{group}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status</label>
                      <select
                        value={formData.maritalStatus}
                        onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                      >
                        <option value="">Select Marital Status</option>
                        {maritalStatuses.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      rows="3"
                      placeholder="Enter full address"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        placeholder="Enter phone number"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email ID *</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Occupation / Profession</label>
                      <input
                        type="text"
                        value={formData.occupation}
                        onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                        placeholder="e.g. Software Engineer, Teacher"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                      <input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Would you like to be an active blood donor?
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="bloodDonor"
                          value="yes"
                          checked={formData.bloodDonor === 'yes'}
                          onChange={(e) => setFormData({ ...formData, bloodDonor: e.target.value })}
                          className="w-4 h-4 text-blue-900"
                        />
                        <span className="text-gray-700">Yes</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="bloodDonor"
                          value="no"
                          checked={formData.bloodDonor === 'no'}
                          onChange={(e) => setFormData({ ...formData, bloodDonor: e.target.value })}
                          className="w-4 h-4 text-blue-900"
                        />
                        <span className="text-gray-700">No</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Volunteer Preferences Section */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Volunteer Preferences</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3">Areas of Interest:</h4>
                    <div className="space-y-2">
                      {[
                        { key: 'templeService', label: 'Temple Service' },
                        { key: 'socialService', label: 'Social Service' },
                        { key: 'educationalSupport', label: 'Educational Support' },
                        { key: 'events', label: 'Events' },
                        { key: 'medicalCamps', label: 'Medical Camps' },
                        { key: 'othersInterest', label: 'Others' }
                      ].map(({ key, label }) => (
                        <label key={key} className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={formData[key]}
                            onChange={() => handleInterestChange(key)}
                            className="w-4 h-4 text-blue-900 rounded focus:ring-blue-900"
                          />
                          <span className="text-gray-700">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3">Availability:</h4>
                    <div className="space-y-2">
                      {[
                        { key: 'weekdays', label: 'Weekdays' },
                        { key: 'weekends', label: 'Weekends' },
                        { key: 'flexible', label: 'Flexible' },
                        { key: 'specificTime', label: 'Specific Time' }
                      ].map(({ key, label }) => (
                        <label key={key} className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={formData[key]}
                            onChange={() => handleAvailabilityChange(key)}
                            className="w-4 h-4 text-blue-900 rounded focus:ring-blue-900"
                          />
                          <span className="text-gray-700">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Feedback & Suggestions */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Feedback & Suggestions</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Share your thoughts, suggestions, or any additional information...
                  </label>
                  <textarea
                    value={formData.feedback}
                    onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                  ></textarea>
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
                      <option value="rejected">Rejected</option>
                    </select>
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
                  {editingVolunteer ? 'Update' : 'Add'} Volunteer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewModal && (
        <ViewVolunteerModal
          volunteer={viewingVolunteer}
          onClose={() => setViewModal(false)}
        />
      )}
    </div>
  );
}