import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Download, FileText, Video, Music } from 'lucide-react';
import { useData } from '../contexts/DataContext';

export default function ELibraryManagement() {
  const { elibrary, addELibraryItem, updateELibraryItem, deleteELibraryItem } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: 'Books',
    fileType: 'PDF',
    fileUrl: '',
    description: '',
    accessType: 'public'
  });

  const categories = ['Books', 'Videos', 'Audios', 'Articles', 'Scriptures'];
  const fileTypes = {
    Books: ['PDF'],
    Videos: ['MP4', 'YouTube'],
    Audios: ['MP3', 'WAV'],
    Articles: ['PDF', 'DOC'],
    Scriptures: ['PDF']
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      updateELibraryItem(editingItem.id, formData);
    } else {
      addELibraryItem(formData);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      category: 'Books',
      fileType: 'PDF',
      fileUrl: '',
      description: '',
      accessType: 'public'
    });
    setEditingItem(null);
    setShowModal(false);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({ ...item });
    setShowModal(true);
  };

  const handleDownload = (id) => {
    const item = elibrary.find(i => i.id === id);
    if (item) {
      updateELibraryItem(id, { downloadCount: (item.downloadCount || 0) + 1 });
      window.open(item.fileUrl, '_blank');
    }
  };

  const filteredItems = elibrary.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.author && item.author.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getIcon = (category) => {
    switch (category) {
      case 'Videos': return Video;
      case 'Audios': return Music;
      default: return FileText;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">E-Library Management</h1>
          <p className="text-gray-600 mt-1">Manage digital library content</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-900 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-blue-800 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Item</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {categories.map(cat => {
          const count = elibrary.filter(item => item.category === cat).length;
          return (
            <div key={cat} className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-600">{cat}</h3>
              <p className="text-3xl font-bold text-blue-900 mt-2">{count}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search library..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const Icon = getIcon(item.category);
            return (
              <div key={item.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Icon className="w-8 h-8 text-blue-900" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    item.accessType === 'public' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {item.accessType}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
                {item.author && (
                  <p className="text-sm text-gray-600 mb-2">By {item.author}</p>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span>{item.category}</span>
                  <span>{item.fileType}</span>
                </div>

                {item.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span className="flex items-center space-x-1">
                    <Download className="w-4 h-4" />
                    <span>{item.downloadCount || 0} downloads</span>
                  </span>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDownload(item.id)}
                    className="flex-1 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                  <button
                    onClick={() => handleEdit(item)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteELibraryItem(item.id)}
                    className="px-4 py-2 border border-red-300 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {filteredItems.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              No items found
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingItem ? 'Edit Library Item' : 'Add New Item'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                  placeholder="Optional"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value, fileType: fileTypes[e.target.value][0] })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">File Type</label>
                  <select
                    value={formData.fileType}
                    onChange={(e) => setFormData({ ...formData, fileType: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                  >
                    {fileTypes[formData.category].map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">File URL</label>
                <input
                  type="url"
                  value={formData.fileUrl}
                  onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                  placeholder="https://example.com/file.pdf"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                  placeholder="Optional description"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Access Type</label>
                <select
                  value={formData.accessType}
                  onChange={(e) => setFormData({ ...formData, accessType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
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
                  {editingItem ? 'Update' : 'Add'} Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
