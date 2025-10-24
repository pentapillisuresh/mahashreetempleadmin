import { X, Calendar, Users, ExternalLink, Image as ImageIcon, Target } from 'lucide-react';

export default function ViewProjectModal({ project, onClose }) {
  if (!project) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      case 'on-hold': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Project Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Project Images Gallery */}
          {project.images && project.images.length > 0 && (
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Project Images</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {project.images.map((image, index) => (
                  <div key={index} className="rounded-lg overflow-hidden">
                    <img 
                      src={image.url} 
                      alt={`${project.title} - ${index + 1}`}
                      className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Project Header */}
          <div className="border-b border-gray-200 pb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{project.title}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {project.category}
              </span>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed">{project.description}</p>
          </div>

          {/* Project Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Progress */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <Target className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-gray-800">Progress</h4>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Completion</span>
                  <span className="font-semibold">{project.currentProgress || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${getProgressColor(project.currentProgress || 0)}`}
                    style={{ width: `${project.currentProgress || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            {(project.startDate || project.endDate) && (
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <h4 className="font-semibold text-gray-800">Timeline</h4>
                </div>
                <div className="space-y-1 text-sm">
                  {project.startDate && (
                    <div>
                      <span className="font-medium">Start:</span>{' '}
                      <span className="text-gray-700">{new Date(project.startDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  {project.endDate && (
                    <div>
                      <span className="font-medium">End:</span>{' '}
                      <span className="text-gray-700">{new Date(project.endDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Volunteers */}
            {project.volunteersRequired && (
              <div className="bg-teal-50 p-4 rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <Users className="w-5 h-5 text-teal-600" />
                  <h4 className="font-semibold text-gray-800">Volunteers</h4>
                </div>
                <p className="text-gray-700">{project.volunteersRequired} required</p>
              </div>
            )}
          </div>

          {/* Donation Link */}
          {project.donationLink && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Donation Link</h4>
                  <p className="text-gray-600">Support this project by making a donation</p>
                </div>
                <a
                  href={project.donationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Donate Now</span>
                </a>
              </div>
            </div>
          )}

          {/* Additional Information */}
          <div className="border-t border-gray-200 pt-6">
            <h4 className="font-semibold text-gray-800 mb-3">Additional Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Created Date:</span>{' '}
                <span className="text-gray-600">
                  {new Date(project.createdDate || Date.now()).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Last Updated:</span>{' '}
                <span className="text-gray-600">
                  {new Date(project.updatedDate || Date.now()).toLocaleDateString()}
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