import { useState } from 'react';
import { Plus, Edit2, Trash2, ExternalLink } from 'lucide-react';
import { useData } from '../contexts/DataContext';

export default function ProjectManagement() {
  const { projects, addProject, updateProject, deleteProject } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Medical',
    status: 'active',
    donationLink: '',
    imageUrl: ''
  });

  const categories = ['Medical', 'Education', 'Social Welfare', 'Infrastructure', 'Cultural', 'Other'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingProject) {
      updateProject(editingProject.id, formData);
    } else {
      addProject(formData);
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
      imageUrl: ''
    });
    setEditingProject(null);
    setShowModal(false);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({ ...project });
    setShowModal(true);
  };

  const filteredProjects = projects.filter(project => {
    return filterStatus === 'all' || project.status === filterStatus;
  });

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

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-end mb-6">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white text-2xl font-bold">
                {project.category}
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-800">{project.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    project.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {project.status}
                  </span>
                </div>

                <p className="text-sm text-gray-500 mb-3">{project.category}</p>
                <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>

                {project.donationLink && (
                  <a
                    href={project.donationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="text-sm">Donation Link</span>
                  </a>
                )}

                <div className="flex space-x-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleEdit(project)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => deleteProject(project.id)}
                    className="px-4 py-2 border border-red-300 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredProjects.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              No projects found
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
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
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Donation Link (optional)</label>
                <input
                  type="url"
                  value={formData.donationLink}
                  onChange={(e) => setFormData({ ...formData, donationLink: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                  placeholder="https://example.com/donate"
                />
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
    </div>
  );
}
