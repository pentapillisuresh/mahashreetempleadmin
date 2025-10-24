import { X, Calendar, MapPin, Users, Clock, User, CheckCircle, Image as ImageIcon } from 'lucide-react';

export default function ViewEventModal({ event, onClose }) {
  if (!event) return null;

  const formatDateTime = (date, time) => {
    const eventDate = new Date(date);
    return {
      date: eventDate.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: time
    };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const datetime = formatDateTime(event.eventDate, event.eventTime);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Event Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Event Image */}
          {event.imageUrl && (
            <div className="rounded-lg overflow-hidden">
              <img 
                src={event.imageUrl} 
                alt={event.title}
                className="w-full h-64 object-cover"
              />
            </div>
          )}

          {/* Event Header */}
          <div className="border-b border-gray-200 pb-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-gray-800">{event.title}</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(event.status)}`}>
                {event.status}
              </span>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed">{event.description}</p>
          </div>

          {/* Event Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date & Time */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-gray-800">Date & Time</h4>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">{datetime.date}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">{event.eventTime}</span>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <MapPin className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-gray-800">Location</h4>
              </div>
              <p className="text-gray-700">{event.location || 'Not specified'}</p>
            </div>

            {/* Organizer */}
            {event.organizer && (
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <User className="w-5 h-5 text-purple-600" />
                  <h4 className="font-semibold text-gray-800">Organizer</h4>
                </div>
                <p className="text-gray-700">{event.organizer}</p>
              </div>
            )}

            {/* Attendees */}
            {event.maxAttendees && (
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <Users className="w-5 h-5 text-orange-600" />
                  <h4 className="font-semibold text-gray-800">Capacity</h4>
                </div>
                <p className="text-gray-700">Max {event.maxAttendees} attendees</p>
              </div>
            )}
          </div>

          {/* Invitation Status */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Invitation Status</h4>
                <p className="text-gray-600">
                  {event.invitesSent ? 'Invitations have been sent to participants' : 'Invitations pending to be sent'}
                </p>
              </div>
              {event.invitesSent ? (
                <span className="flex items-center space-x-1 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Sent</span>
                </span>
              ) : (
                <span className="text-yellow-600 font-semibold">Pending</span>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div className="border-t border-gray-200 pt-6">
            <h4 className="font-semibold text-gray-800 mb-3">Additional Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Created Date:</span>{' '}
                <span className="text-gray-600">
                  {new Date(event.createdDate || Date.now()).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Last Updated:</span>{' '}
                <span className="text-gray-600">
                  {new Date(event.updatedDate || Date.now()).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}