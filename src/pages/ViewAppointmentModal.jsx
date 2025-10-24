import { X, Calendar, Phone, Mail, MapPin, User, Clock, Users, FileText } from 'lucide-react';

export default function ViewAppointmentModal({ appointment, onClose }) {
  if (!appointment) return null;

  const getSelectedServices = () => {
    const services = [];
    if (appointment.astrologyConsultation) services.push('Astrology Consultation');
    if (appointment.intiVashiu) services.push('Inti Vashiu (House Vastu Consultation)');
    if (appointment.poojas) services.push('Poojas (Lakshmi Pooja, Rudrabhishekam, Satyanarayana Vratam)');
    if (appointment.namingCeremony) services.push('Naming Ceremony');
    if (appointment.horoscopeMatching) services.push('Horoscope Matching (Pellilu / Marriages)');
    if (appointment.grihaPravesham) services.push('Griha Pravesham (House Warming Ceremony)');
    if (appointment.homamsYagnams) services.push('Homams / Yagnams');
    if (appointment.templeRituals) services.push('Temple Rituals');
    if (appointment.otherService && appointment.otherServiceText) services.push(appointment.otherServiceText);
    return services;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const selectedServices = getSelectedServices();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Appointment Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Personal Details Section */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Personal Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <p className="text-gray-900 font-medium">{appointment.fullName}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <p className="text-gray-900">{appointment.dateOfBirth || 'Not provided'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <p className="text-gray-900">{appointment.age || 'Not provided'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <p className="text-gray-900">{appointment.gender || 'Not provided'}</p>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  City, State, Country
                </label>
                <p className="text-gray-900">{appointment.cityStateCountry || 'Not provided'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Phone className="w-4 h-4 mr-1" />
                  Mobile/WhatsApp
                </label>
                <p className="text-gray-900">{appointment.mobileNumber}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Mail className="w-4 h-4 mr-1" />
                  Email
                </label>
                <p className="text-gray-900">{appointment.email}</p>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Complete Address</label>
                <p className="text-gray-900 whitespace-pre-line">{appointment.completeAddress || 'Not provided'}</p>
              </div>
            </div>
          </div>

          {/* Service Required Section */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Services Required</h3>
            
            {selectedServices.length > 0 ? (
              <div className="space-y-2">
                {selectedServices.map((service, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-900 rounded-full"></div>
                    <span className="text-gray-700">{service}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No services selected</p>
            )}
          </div>

          {/* Preferred Date & Time */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Preferred Appointment
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <p className="text-gray-900">{appointment.preferredDate || 'Not specified'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  Time
                </label>
                <p className="text-gray-900">{appointment.preferredTime || 'Not specified'}</p>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Additional Information
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Requirements Description</label>
                <p className="text-gray-900 whitespace-pre-line">{appointment.requirements || 'Not provided'}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    Attendees Count
                  </label>
                  <p className="text-gray-900">{appointment.attendeesCount || 'Not specified'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <p className="text-gray-900 capitalize">{appointment.location || 'Not specified'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Declaration */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Declaration</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 mb-3">
                I confirm that the above details are true and accurate. I request to book an appointment for the mentioned service and understand that the final confirmation will be provided by the temple administration.
              </p>
              
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${appointment.declarationAccepted ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-gray-700 font-medium">
                  {appointment.declarationAccepted ? 'Declaration Accepted' : 'Declaration Not Accepted'}
                </span>
              </div>
            </div>
          </div>

          {/* Admin Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Administration Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(appointment.status)}`}>
                  {appointment.status}
                </span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  appointment.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {appointment.paymentStatus}
                </span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Amount</label>
                <p className="text-gray-900 font-medium">₹{appointment.paymentAmount || 0}</p>
              </div>
            </div>
            
            {appointment.adminNotes && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Notes</label>
                <p className="text-gray-900 whitespace-pre-line bg-white p-3 rounded border">{appointment.adminNotes}</p>
              </div>
            )}
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