import { useState } from 'react';
import { Plus, Edit2, Trash2, Send, CheckCircle, Eye, Search, Image as ImageIcon, Calendar, MapPin, Users, Clock } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import ViewEventModal from '../pages/ViewEventModal';

export default function EventManagement() {
  const { events, addEvent, updateEvent, deleteEvent } = useData();
  const [showModal, setShowModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [viewingEvent, setViewingEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventDate: '',
    eventTime: '',
    imageUrl: '',
    imageFile: null,
    status: 'upcoming',
    invitesSent: false,
    location: '',
    organizer: '',
    maxAttendees: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Handle image file if uploaded
    let finalImageUrl = formData.imageUrl;
    if (formData.imageFile) {
      // In a real application, you would upload the file to a server here
      // For demo purposes, we'll create a blob URL
      finalImageUrl = URL.createObjectURL(formData.imageFile);
    }

    const eventData = {
      ...formData,
      imageUrl: finalImageUrl,
      // Remove the file object from the data to be stored
      imageFile: undefined
    };

    if (editingEvent) {
      updateEvent(editingEvent.id, eventData);
    } else {
      addEvent(eventData);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      eventDate: '',
      eventTime: '',
      imageUrl: '',
      imageFile: null,
      status: 'upcoming',
      invitesSent: false,
      location: '',
      organizer: '',
      maxAttendees: ''
    });
    setEditingEvent(null);
    setShowModal(false);
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({ 
      ...event,
      imageFile: null // Reset file when editing
    });
    setShowModal(true);
  };

  const handleView = (event) => {
    setViewingEvent(event);
    setViewModal(true);
  };

  const handleSendInvites = (id) => {
    updateEvent(id, { invitesSent: true });
    alert('Invitations sent successfully!');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        imageFile: file,
        imageUrl: '' // Clear URL when file is uploaded
      }));
    }
  };

  const handleImageUrlChange = (url) => {
    setFormData(prev => ({
      ...prev,
      imageUrl: url,
      imageFile: null // Clear file when URL is entered
    }));
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (date, time) => {
    const eventDate = new Date(date);
    return {
      date: eventDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      time: time,
      fullDate: eventDate.toLocaleDateString('en-US', { 
        weekday: 'short',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Event Management</h1>
          <p className="text-gray-600 mt-1">Create and manage temple events and invitations</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-900 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-blue-800 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Event</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
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
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Events Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Image</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Event Details</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Date & Time</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Location</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Invites</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event) => {
                const datetime = formatDateTime(event.eventDate, event.eventTime);
                return (
                  <tr key={event.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                        {event.imageUrl ? (
                          <img 
                            src={event.imageUrl} 
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-800 text-lg">{event.title}</div>
                        <div className="text-sm text-gray-600 line-clamp-2 mt-1">{event.description}</div>
                        {event.organizer && (
                          <div className="text-xs text-gray-500 mt-1">By: {event.organizer}</div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-800">{datetime.date}</div>
                        <div className="text-gray-600">{event.eventTime}</div>
                        <div className="text-xs text-gray-500 mt-1">{datetime.fullDate}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-sm">
                      {event.location || 'Not specified'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {event.invitesSent ? (
                        <span className="flex items-center space-x-1 text-green-600 text-sm">
                          <CheckCircle className="w-4 h-4" />
                          <span>Sent</span>
                        </span>
                      ) : (
                        <span className="text-yellow-600 text-sm">Pending</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleView(event)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        {!event.invitesSent && event.status === 'upcoming' && (
                          <button
                            onClick={() => handleSendInvites(event.id)}
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                            title="Send Invites"
                          >
                            <Send className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(event)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => deleteEvent(event.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredEvents.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {events.length === 0 ? 'No events created yet' : 'No events match your search'}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Event Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingEvent ? 'Edit Event' : 'Add New Event'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Event Details */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Event Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Event Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                      required
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Event Date *</label>
                      <input
                        type="date"
                        value={formData.eventDate}
                        onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Event Time *</label>
                      <input
                        type="time"
                        value={formData.eventTime}
                        onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="Event venue or address"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Organizer</label>
                      <input
                        type="text"
                        value={formData.organizer}
                        onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                        placeholder="Event organizer name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Attendees</label>
                    <input
                      type="number"
                      value={formData.maxAttendees}
                      onChange={(e) => setFormData({ ...formData, maxAttendees: e.target.value })}
                      placeholder="Maximum number of attendees"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Image Section */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Event Image</h3>
                
                <div className="space-y-4">
                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                    />
                    {formData.imageFile && (
                      <p className="text-sm text-green-600 mt-2">
                        Selected file: {formData.imageFile.name}
                      </p>
                    )}
                  </div>

                  {/* OR Separator */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">OR</span>
                    </div>
                  </div>

                  {/* Image URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) => handleImageUrlChange(e.target.value)}
                      placeholder="https://example.com/event-image.jpg"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                    />
                  </div>

                  {/* Image Preview */}
                  {(formData.imageUrl || formData.imageFile) && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
                      <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                        {formData.imageFile ? (
                          <img 
                            src={URL.createObjectURL(formData.imageFile)} 
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : formData.imageUrl ? (
                          <img 
                            src={formData.imageUrl} 
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : null}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Event Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
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
                  {editingEvent ? 'Update' : 'Add'} Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Event Details Modal */}
      {viewModal && (
        <ViewEventModal
          event={viewingEvent}
          onClose={() => setViewModal(false)}
        />
      )}
    </div>
  );
}