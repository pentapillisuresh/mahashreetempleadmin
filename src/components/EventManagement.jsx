import { useState } from 'react';
import { Plus, Edit2, Trash2, Send, CheckCircle } from 'lucide-react';
import { useData } from '../contexts/DataContext';

export default function EventManagement() {
  const { events, addEvent, updateEvent, deleteEvent } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventDate: '',
    eventTime: '',
    imageUrl: '',
    status: 'upcoming',
    invitesSent: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingEvent) {
      updateEvent(editingEvent.id, formData);
    } else {
      addEvent(formData);
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
      status: 'upcoming',
      invitesSent: false
    });
    setEditingEvent(null);
    setShowModal(false);
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({ ...event });
    setShowModal(true);
  };

  const handleSendInvites = (id) => {
    updateEvent(id, { invitesSent: true });
    alert('Invitations sent successfully!');
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white">
              <div className="text-center">
                <div className="text-4xl font-bold">
                  {new Date(event.eventDate).getDate()}
                </div>
                <div className="text-lg">
                  {new Date(event.eventDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-gray-800">{event.title}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  event.status === 'upcoming' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {event.status}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>Time: {event.eventTime}</span>
                {event.invitesSent && (
                  <span className="flex items-center space-x-1 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span>Invites Sent</span>
                  </span>
                )}
              </div>

              <div className="flex space-x-2">
                {!event.invitesSent && event.status === 'upcoming' && (
                  <button
                    onClick={() => handleSendInvites(event.id)}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-green-700 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Invites</span>
                  </button>
                )}
                <button
                  onClick={() => handleEdit(event)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteEvent(event.id)}
                  className="px-4 py-2 border border-red-300 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {events.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            No events created yet
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingEvent ? 'Edit Event' : 'Add New Event'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Date</label>
                  <input
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Time</label>
                  <input
                    type="time"
                    value={formData.eventTime}
                    onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL (optional)</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
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
    </div>
  );
}
