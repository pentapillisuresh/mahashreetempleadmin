import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Download, FileText, Eye, X } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import ViewELibraryModal from '../pages/ViewELibraryModal';

export default function ELibraryManagement() {
  const { elibrary, addELibraryItem, updateELibraryItem, deleteELibraryItem } = useData();
  const [showModal, setShowModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: 'Books',
    fileType: 'PDF',
    fileUrl: '',
    file: null, // For file upload
    description: '',
    accessType: 'public',
    fileSize: '',
    pages: '' // For books
  });

  const categories = ['Books'];
  const fileTypes = {
    Books: ['PDF', 'DOC', 'DOCX', 'EPUB']
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Handle file upload
    let finalFileUrl = formData.fileUrl;
    if (formData.file) {
      // In a real application, you would upload the file to a server here
      // For demo purposes, we'll create a blob URL
      finalFileUrl = URL.createObjectURL(formData.file);
    }

    const itemData = {
      ...formData,
      fileUrl: finalFileUrl,
      file: undefined, // Remove file object from stored data
      id: editingItem ? editingItem.id : Date.now().toString(),
      createdDate: editingItem ? editingItem.createdDate : new Date().toISOString(),
      updatedDate: new Date().toISOString(),
      downloadCount: editingItem ? editingItem.downloadCount : 0
    };

    if (editingItem) {
      updateELibraryItem(editingItem.id, itemData);
    } else {
      addELibraryItem(itemData);
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
      file: null,
      description: '',
      accessType: 'public',
      fileSize: '',
      pages: ''
    });
    setEditingItem(null);
    setShowModal(false);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({ 
      ...item,
      file: null // Reset file when editing
    });
    setShowModal(true);
  };

  const handleView = (item) => {
    setViewingItem(item);
    setViewModal(true);
  };

  const handleDownload = (id) => {
    const item = elibrary.find(i => i.id === id);
    if (item) {
      updateELibraryItem(id, { downloadCount: (item.downloadCount || 0) + 1 });
      // Create a temporary anchor element for download
      const link = document.createElement('a');
      link.href = item.fileUrl;
      link.target = '_blank';
      link.download = item.title || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        file: file,
        fileUrl: '', // Clear URL when file is uploaded
        fileSize: formatFileSize(file.size)
      }));
    }
  };

  const handleFileUrlChange = (url) => {
    setFormData(prev => ({
      ...prev,
      fileUrl: url,
      file: null // Clear file when URL is entered
    }));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getIcon = () => FileText;

  const filteredItems = elibrary.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.author && item.author.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getAccessTypeColor = (accessType) => {
    return accessType === 'public' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
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
          <span>Add Book</span>
        </button>
      </div>

      {/* Category Stats */}
      <div className="grid grid-cols-1 gap-4">
        {categories.map(cat => {
          const count = elibrary.filter(item => item.category === cat).length;
          const Icon = getIcon();
          return (
            <div key={cat} className="bg-white rounded-xl shadow-md p-6 flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Icon className="w-6 h-6 text-blue-900" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600">{cat}</h3>
                <p className="text-2xl font-bold text-blue-900">{count}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search books..."
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
            <option value="all">All Books</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* E-Library Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Book</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">File Type</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Size/Pages</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Downloads</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Access</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => {
                const Icon = getIcon();
                return (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Icon className="w-5 h-5 text-blue-900" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{item.title}</div>
                          {item.author && (
                            <div className="text-sm text-gray-500">By {item.author}</div>
                          )}
                          {item.description && (
                            <div className="text-xs text-gray-400 line-clamp-1">{item.description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-sm">
                      {item.fileType}
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-sm">
                      {item.fileSize || item.pages ? `${item.fileSize}${item.fileSize && item.pages ? ' • ' : ''}${item.pages ? `${item.pages} pages` : ''}` : '-'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1 text-gray-600">
                        <Download className="w-4 h-4" />
                        <span className="text-sm">{item.downloadCount || 0}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getAccessTypeColor(item.accessType)}`}>
                        {item.accessType}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleView(item)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDownload(item.id)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="Download"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => deleteELibraryItem(item.id)}
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
          {filteredItems.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {elibrary.length === 0 ? 'No books in library yet' : 'No books match your search'}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingItem ? 'Edit Book' : 'Add New Book'}
              </h2>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Book Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value, fileType: fileTypes[e.target.value][0] })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                        required
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">File Type *</label>
                      <select
                        value={formData.fileType}
                        onChange={(e) => setFormData({ ...formData, fileType: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                        required
                      >
                        {fileTypes[formData.category].map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
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

                  {/* Additional Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Pages</label>
                      <input
                        type="number"
                        value={formData.pages}
                        onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                        placeholder="Number of pages"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                        min="0"
                      />
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
                  </div>
                </div>
              </div>

              {/* File Upload Section */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Book File</h3>
                
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* File Upload */}
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Upload Book File</label>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.epub"
                        onChange={handleFileUpload}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                      />
                      {formData.file && (
                        <div className="flex items-center justify-between mt-2 p-2 bg-green-50 rounded">
                          <span className="text-sm text-green-700">{formData.file.name}</span>
                          <span className="text-xs text-green-600">{formData.fileSize}</span>
                        </div>
                      )}
                    </div>

                    {/* OR Separator */}
                    <div className="flex items-center justify-center">
                      <div className="text-gray-500 font-medium">OR</div>
                    </div>

                    {/* File URL */}
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">File URL</label>
                      <input
                        type="url"
                        value={formData.fileUrl}
                        onChange={(e) => handleFileUrlChange(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                        placeholder="https://example.com/book.pdf"
                      />
                    </div>
                  </div>
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
                  {editingItem ? 'Update' : 'Add'} Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewModal && viewingItem && (
        <ViewELibraryModal
          item={viewingItem}
          onClose={() => setViewModal(false)}
        />
      )}
    </div>
  );
}