import { useState } from 'react';
import { Plus, Search, CheckCircle, XCircle, Edit2, Trash2, Mail, Phone } from 'lucide-react';
import { useData } from '../contexts/DataContext';

export default function VolunteerManagement() {
  const { volunteers, addVolunteer, updateVolunteer, deleteVolunteer } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingVolunteer, setEditingVolunteer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    interestArea: 'Temple Service',
    status: 'pending',
    notes: ''
  });

  const interestAreas = [
    'Temple Service',
    'Social Service',
    'Education',
    'Medical Support',
    'Event Management',
    'Cultural Activities'
  ];

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
      email: '',
      phone: '',
      interestArea: 'Temple Service',
      status: 'pending',
      notes: ''
    });
    setEditingVolunteer(null);
    setShowModal(false);
  };

  const handleEdit = (volunteer) => {
    setEditingVolunteer(volunteer);
    setFormData({
      fullName: volunteer.fullName,
      email: volunteer.email,
      phone: volunteer.phone,
      interestArea: volunteer.interestArea,
      status: volunteer.status,
      notes: volunteer.notes || ''
    });
    setShowModal(true);
  };

  const handleApprove = (id) => {
    updateVolunteer(id, { status: 'approved' });
  };

  const handleReject = (id) => {
    updateVolunteer(id, { status: 'rejected' });
  };

  const filteredVolunteers = volunteers.filter(volunteer => {
    const matchesSearch = volunteer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         volunteer.email.toLowerCase().includes(searchTerm.toLowerCase());
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
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Interest Area</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVolunteers.map((volunteer) => (
                <tr key={volunteer.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-800">{volunteer.fullName}</td>
                  <td className="py-3 px-4">
                    <div className="flex flex-col space-y-1 text-sm">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{volunteer.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{volunteer.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{volunteer.interestArea}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(volunteer.status)}`}>
                      {volunteer.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600 text-sm">
                    {new Date(volunteer.applicationDate).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
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

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingVolunteer ? 'Edit Volunteer' : 'Add New Volunteer'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Interest Area</label>
                  <select
                    value={formData.interestArea}
                    onChange={(e) => setFormData({ ...formData, interestArea: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                  >
                    {interestAreas.map(area => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>

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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                ></textarea>
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
    </div>
  );
}
