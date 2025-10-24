import { X, Mail, Phone, MapPin, User, Calendar, Droplets, Briefcase, Heart } from 'lucide-react';

export default function ViewVolunteerModal({ volunteer, onClose }) {
  if (!volunteer) return null;

  const getSelectedInterests = () => {
    const interests = [];
    if (volunteer.templeService) interests.push('Temple Service');
    if (volunteer.socialService) interests.push('Social Service');
    if (volunteer.educationalSupport) interests.push('Educational Support');
    if (volunteer.events) interests.push('Events');
    if (volunteer.medicalCamps) interests.push('Medical Camps');
    if (volunteer.othersInterest) interests.push('Others');
    return interests;
  };

  const getSelectedAvailability = () => {
    const availability = [];
    if (volunteer.weekdays) availability.push('Weekdays');
    if (volunteer.weekends) availability.push('Weekends');
    if (volunteer.flexible) availability.push('Flexible');
    if (volunteer.specificTime) availability.push('Specific Time');
    return availability;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const selectedInterests = getSelectedInterests();
  const selectedAvailability = getSelectedAvailability();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Volunteer Details</h2>
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
                <p className="text-gray-900 font-medium">{volunteer.fullName}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                <p className="text-gray-900">{volunteer.qualification || 'Not provided'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <p className="text-gray-900">{volunteer.gender || 'Not provided'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Droplets className="w-4 h-4 mr-1" />
                  Blood Group
                </label>
                <p className="text-gray-900">{volunteer.bloodGroup || 'Not provided'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                <p className="text-gray-900">{volunteer.maritalStatus || 'Not provided'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Briefcase className="w-4 h-4 mr-1" />
                  Occupation
                </label>
                <p className="text-gray-900">{volunteer.occupation || 'Not provided'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Date of Birth
                </label>
                <p className="text-gray-900">{volunteer.dateOfBirth || 'Not provided'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Heart className="w-4 h-4 mr-1" />
                  Blood Donor
                </label>
                <p className="text-gray-900">{volunteer.bloodDonor ? volunteer.bloodDonor.charAt(0).toUpperCase() + volunteer.bloodDonor.slice(1) : 'Not specified'}</p>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  Address
                </label>
                <p className="text-gray-900 whitespace-pre-line">{volunteer.address || 'Not provided'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Phone className="w-4 h-4 mr-1" />
                  Phone Number
                </label>
                <p className="text-gray-900">{volunteer.phoneNumber || 'Not provided'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Mail className="w-4 h-4 mr-1" />
                  Email ID
                </label>
                <p className="text-gray-900">{volunteer.email}</p>
              </div>
            </div>
          </div>

          {/* Volunteer Preferences Section */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Volunteer Preferences</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Areas of Interest:</h4>
                {selectedInterests.length > 0 ? (
                  <div className="space-y-2">
                    {selectedInterests.map((interest, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-900 rounded-full"></div>
                        <span className="text-gray-700">{interest}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No interests selected</p>
                )}
              </div>

              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Availability:</h4>
                {selectedAvailability.length > 0 ? (
                  <div className="space-y-2">
                    {selectedAvailability.map((availability, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-900 rounded-full"></div>
                        <span className="text-gray-700">{availability}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No availability specified</p>
                )}
              </div>
            </div>
          </div>

          {/* Feedback & Suggestions */}
          {volunteer.feedback && (
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Feedback & Suggestions</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-line">{volunteer.feedback}</p>
              </div>
            </div>
          )}

          {/* Admin Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Administration Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(volunteer.status)}`}>
                  {volunteer.status}
                </span>
              </div>
            </div>
            
            {volunteer.adminNotes && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Notes</label>
                <p className="text-gray-900 whitespace-pre-line bg-white p-3 rounded border">{volunteer.adminNotes}</p>
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