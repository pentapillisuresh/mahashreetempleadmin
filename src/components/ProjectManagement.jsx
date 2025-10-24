import { useState } from 'react';
import { Plus, Edit2, Trash2, ExternalLink, Eye, Search, Image as ImageIcon, X } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import ViewProjectModal from '../pages/ViewProjectModal';

export default function ProjectManagement() {
  const { projects, addProject, updateProject, deleteProject } = useData();
  const [showModal, setShowModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [viewingProject, setViewingProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Medical',
    status: 'active',
    donationLink: '',
    images: [], // Array for multiple images
    startDate: '',
    endDate: '',
    volunteersRequired: '',
    currentProgress: 0
  });

  const categories = ['Medical', 'Education', 'Social Welfare', 'Infrastructure', 'Cultural', 'Environmental', 'Other'];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const projectData = {
      ...formData,
      // Remove file objects from images array before storing
      images: formData.images.map(img => ({
        ...img,
        file: undefined // Remove file object, keep only URL
      }))
    };

    if (editingProject) {
      updateProject(editingProject.id, projectData);
    } else {
      addProject(projectData);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'Medical',
      status: 'active',
      donationLink: '',
      images: [],
      startDate: '',
      endDate: '',
      volunteersRequired: '',
      currentProgress: 0
    });
    setEditingProject(null);
    setShowModal(false);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({ 
      ...project,
      images: project.images || []
    });
    setShowModal(true);
  };

  const handleView = (project) => {
    setViewingProject(project);
    setViewModal(true);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      id: Date.now() + Math.random(),
      file: file,
      url: URL.createObjectURL(file),
      name: file.name,
      type: 'upload'
    }));

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));

    // Clear the file input
    e.target.value = '';
  };

  const handleImageUrlAdd = () => {
    const url = prompt('Enter image URL:');
    if (url && url.trim() !== '') {
      const newImage = {
        id: Date.now() + Math.random(),
        url: url.trim(),
        name: 'External Image',
        type: 'url'
      };

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImage]
      }));
    }
  };

  const removeImage = (imageId) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== imageId)
    }));
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Project Management</h1>
          <p className="text-gray-600 mt-1">Manage foundation projects and initiatives</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-900 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-blue-800 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Project</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
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
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="on-hold">On Hold</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Projects Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Project</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Progress</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Timeline</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Volunteers</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => (
                <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                        {project.images && project.images.length > 0 ? (
                          <img 
                            src={project.images[0].url} 
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">{project.title}</div>
                        <div className="text-sm text-gray-500 line-clamp-1">{project.description}</div>
                        {project.donationLink && (
                          <a
                            href={project.donationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-xs"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Donate</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {project.category}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="w-24">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{project.currentProgress || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getProgressColor(project.currentProgress || 0)}`}
                          style={{ width: `${project.currentProgress || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {project.startDate ? (
                      <div>
                        <div>{new Date(project.startDate).toLocaleDateString()}</div>
                        {project.endDate && (
                          <div className="text-gray-500">to {new Date(project.endDate).toLocaleDateString()}</div>
                        )}
                      </div>
                    ) : (
                      'Not set'
                    )}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {project.volunteersRequired || '-'}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleView(project)}
                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(project)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="Edit"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => deleteProject(project.id)}
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
          {filteredProjects.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {projects.length === 0 ? 'No projects created yet' : 'No projects match your search'}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Project Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Project Details */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Project Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Title *</label>
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                        required
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                        required
                      >
                        <option value="planning">Planning</option>
                        <option value="active">Active</option>
                        <option value="on-hold">On Hold</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Progress (%)</label>
                      <input
                        type="number"
                        value={formData.currentProgress}
                        onChange={(e) => setFormData({ ...formData, currentProgress: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                        min="0"
                        max="100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Volunteers Required</label>
                      <input
                        type="number"
                        value={formData.volunteersRequired}
                        onChange={(e) => setFormData({ ...formData, volunteersRequired: e.target.value })}
                        placeholder="Number of volunteers needed"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Donation Link</label>
                    <input
                      type="url"
                      value={formData.donationLink}
                      onChange={(e) => setFormData({ ...formData, donationLink: e.target.value })}
                      placeholder="https://example.com/donate"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Project Images Section */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Project Images</h3>
                
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Upload Images */}
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Upload Images</label>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                      />
                      <p className="text-xs text-gray-500 mt-1">Select multiple images to upload</p>
                    </div>

                    {/* Add Image URL */}
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Add Image URL</label>
                      <button
                        type="button"
                        onClick={handleImageUrlAdd}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add URL</span>
                      </button>
                    </div>
                  </div>

                  {/* Image Preview Grid */}
                  {formData.images.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Selected Images ({formData.images.length})
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {formData.images.map((image) => (
                          <div key={image.id} className="relative group">
                            <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                              <img 
                                src={image.url} 
                                alt={image.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeImage(image.id)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                            <div className="text-xs text-gray-500 mt-1 truncate">
                              {image.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
                  {editingProject ? 'Update' : 'Add'} Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Project Modal */}
      {viewModal && (
        <ViewProjectModal
          project={viewingProject}
          onClose={() => setViewModal(false)}
        />
      )}
    </div>
  );
}