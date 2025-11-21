import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Download, FileText, Eye, X, Upload } from 'lucide-react';
import { useData } from '../contexts/DataContext';

export default function ELibraryManagement() {
  const { 
    elibrary, 
    addELibraryItem, 
    updateELibraryItem, 
    deleteELibraryItem, 
    downloadBook,
    loadELibraryFromAPI,
    loading,
    error 
  } = useData();
  
  const [showModal, setShowModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    category: 'Books',
    language: 'English',
    fileType: 'PDF',
    fileUrl: '',
    file: null,
    fileSize: '',
    publicationYear: '',
    publisher: '',
    isbn: '',
    tags: [],
    isActive: true,
    sortOrder: 0
  });

  const categories = [
    'Books', 'Puranas', 'Vedic Texts', 'Spiritual Books', 
    'Social Welfare', 'Economics', 'Philosophy', 'Others'
  ];

  const languages = ['English', 'Hindi', 'Sanskrit', 'Tamil', 'Telugu', 'Other'];
  const fileTypes = ['PDF', 'EPUB', 'AUDIO', 'VIDEO'];

  useEffect(() => {
    loadELibraryFromAPI();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let finalData = { ...formData };

      // Handle file upload if a file is selected
      if (formData.file) {
        setUploading(true);
        // In a real application, you would upload the file to your server here
        // For demo purposes, we'll simulate file upload
        await new Promise(resolve => setTimeout(resolve, 1000));
        finalData.fileUrl = URL.createObjectURL(formData.file);
      }

      if (editingItem) {
        await updateELibraryItem(editingItem.id, finalData);
      } else {
        await addELibraryItem(finalData);
      }
      
      resetForm();
    } catch (err) {
      console.error('Error saving book:', err);
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      description: '',
      category: 'Books',
      language: 'English',
      fileType: 'PDF',
      fileUrl: '',
      file: null,
      fileSize: '',
      publicationYear: '',
      publisher: '',
      isbn: '',
      tags: [],
      isActive: true,
      sortOrder: 0
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

  const handleDownload = async (id) => {
    try {
      const response = await downloadBook(id);
      if (response.data && response.data.downloadUrl) {
        // Create a temporary anchor element for download
        const link = document.createElement('a');
        link.href = response.data.downloadUrl;
        link.target = '_blank';
        link.download = response.data.book.title || 'download';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error('Download failed:', err);
      alert('Download failed. Please try again.');
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
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getIcon = (fileType) => {
    switch (fileType) {
      case 'PDF': return FileText;
      case 'EPUB': return FileText;
      case 'AUDIO': return FileText;
      case 'VIDEO': return FileText;
      default: return FileText;
    }
  };

  const filteredItems = elibrary.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.author && item.author.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category) => {
    const colors = {
      'Books': 'bg-blue-100 text-blue-800',
      'Puranas': 'bg-purple-100 text-purple-800',
      'Vedic Texts': 'bg-green-100 text-green-800',
      'Spiritual Books': 'bg-yellow-100 text-yellow-800',
      'Social Welfare': 'bg-red-100 text-red-800',
      'Economics': 'bg-indigo-100 text-indigo-800',
      'Philosophy': 'bg-pink-100 text-pink-800',
      'Others': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getFileTypeColor = (fileType) => {
    const colors = {
      'PDF': 'bg-red-100 text-red-800',
      'EPUB': 'bg-blue-100 text-blue-800',
      'AUDIO': 'bg-green-100 text-green-800',
      'VIDEO': 'bg-purple-100 text-purple-800'
    };
    return colors[fileType] || 'bg-gray-100 text-gray-800';
  };

  if (loading && elibrary.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading E-Library...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">E-Library Management</h1>
          <p className="text-gray-600 mt-1">Manage digital library content</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-900 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-blue-800 transition-colors"
          disabled={loading}
        >
          <Plus className="w-5 h-5" />
          <span>Add Book</span>
        </button>
      </div>

      {/* Category Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {categories.map(cat => {
          const count = elibrary.filter(item => item.category === cat).length;
          const Icon = getIcon('PDF');
          return (
            <div key={cat} className="bg-white rounded-xl shadow-md p-4 flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Icon className="w-5 h-5 text-blue-900" />
              </div>
              <div>
                <h3 className="text-xs font-medium text-gray-600">{cat}</h3>
                <p className="text-lg font-bold text-blue-900">{count}</p>
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
              placeholder="Search books by title, author, or description..."
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

        {/* E-Library Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Book</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">File Type</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Language</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Size</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Downloads</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => {
                const Icon = getIcon(item.fileType);
                return (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Icon className="w-5 h-5 text-blue-900" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-gray-800 truncate">{item.title}</div>
                          {item.author && (
                            <div className="text-sm text-gray-500 truncate">By {item.author}</div>
                          )}
                          {item.description && (
                            <div className="text-xs text-gray-400 line-clamp-1">{item.description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getFileTypeColor(item.fileType)}`}>
                        {item.fileType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-sm">
                      {item.language}
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-sm">
                      {item.fileSize || '-'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1 text-gray-600">
                        <Download className="w-4 h-4" />
                        <span className="text-sm font-medium">{item.downloadCount || 0}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        item.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {item.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleView(item)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDownload(item.id)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Download"
                          disabled={loading}
                        >
                          <Download className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-1 text-orange-600 hover:bg-orange-50 rounded transition-colors"
                          title="Edit"
                          disabled={loading}
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => deleteELibraryItem(item.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                          disabled={loading}
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
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">
                {elibrary.length === 0 ? 'No books in library yet' : 'No books match your search'}
              </p>
              <p className="text-sm mt-2">
                {elibrary.length === 0 ? 'Add your first book to get started' : 'Try adjusting your search or filters'}
              </p>
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
                disabled={uploading}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Book Information</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                        required
                        disabled={uploading}
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
                        disabled={uploading}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                        required
                        disabled={uploading}
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Language *</label>
                      <select
                        value={formData.language}
                        onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                        required
                        disabled={uploading}
                      >
                        {languages.map(lang => (
                          <option key={lang} value={lang}>{lang}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">File Type *</label>
                      <select
                        value={formData.fileType}
                        onChange={(e) => setFormData({ ...formData, fileType: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                        required
                        disabled={uploading}
                      >
                        {fileTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Publication Year</label>
                      <input
                        type="number"
                        value={formData.publicationYear}
                        onChange={(e) => setFormData({ ...formData, publicationYear: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                        placeholder="YYYY"
                        min="1000"
                        max="2030"
                        disabled={uploading}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                      placeholder="Book description (optional)"
                      disabled={uploading}
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Publisher</label>
                      <input
                        type="text"
                        value={formData.publisher}
                        onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                        placeholder="Optional"
                        disabled={uploading}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ISBN</label>
                      <input
                        type="text"
                        value={formData.isbn}
                        onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                        placeholder="Optional"
                        disabled={uploading}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Sort Order</label>
                      <input
                        type="number"
                        value={formData.sortOrder}
                        onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                        min="0"
                        disabled={uploading}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-3 pt-6">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="w-4 h-4 text-blue-900 rounded focus:ring-blue-900"
                        disabled={uploading}
                      />
                      <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                        Active (visible to users)
                      </label>
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Book File
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <input
                          type="file"
                          accept=".pdf,.epub,.mp3,.mp4,.m4a,.mov,.avi"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="file-upload"
                          disabled={uploading}
                        />
                        <label
                          htmlFor="file-upload"
                          className="cursor-pointer flex flex-col items-center space-y-2"
                        >
                          <Upload className="w-8 h-8 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            Click to upload or drag and drop
                          </span>
                          <span className="text-xs text-gray-500">
                            PDF, EPUB, Audio, Video files
                          </span>
                        </label>
                      </div>
                      {formData.file && (
                        <div className="flex items-center justify-between mt-2 p-3 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex items-center space-x-3">
                            <FileText className="w-5 h-5 text-green-600" />
                            <div>
                              <span className="text-sm font-medium text-green-700 block">
                                {formData.file.name}
                              </span>
                              <span className="text-xs text-green-600">
                                {formData.fileSize}
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, file: null, fileSize: '' }))}
                            className="text-red-500 hover:text-red-700"
                            disabled={uploading}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* OR Separator */}
                    <div className="flex items-center justify-center">
                      <div className="text-gray-500 font-medium">OR</div>
                    </div>

                    {/* File URL */}
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        File URL
                      </label>
                      <input
                        type="url"
                        value={formData.fileUrl}
                        onChange={(e) => handleFileUrlChange(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                        placeholder="https://example.com/book.pdf"
                        disabled={uploading}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Enter direct download URL for the file
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50 flex items-center space-x-2"
                  disabled={uploading || !formData.title || (!formData.file && !formData.fileUrl)}
                >
                  {uploading && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  )}
                  <span>
                    {uploading ? 'Uploading...' : editingItem ? 'Update Book' : 'Add Book'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewModal && viewingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Book Details</h2>
              <button
                onClick={() => setViewModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  {(() => {
                    const Icon = getIcon(viewingItem.fileType);
                    return <Icon className="w-8 h-8 text-blue-900" />;
                  })()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{viewingItem.title}</h3>
                  {viewingItem.author && (
                    <p className="text-gray-600">By {viewingItem.author}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Category</label>
                  <p className="text-gray-800">{viewingItem.category}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">File Type</label>
                  <p className="text-gray-800">{viewingItem.fileType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Language</label>
                  <p className="text-gray-800">{viewingItem.language}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">File Size</label>
                  <p className="text-gray-800">{viewingItem.fileSize || 'Not specified'}</p>
                </div>
                {viewingItem.publicationYear && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Publication Year</label>
                    <p className="text-gray-800">{viewingItem.publicationYear}</p>
                  </div>
                )}
                {viewingItem.publisher && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Publisher</label>
                    <p className="text-gray-800">{viewingItem.publisher}</p>
                  </div>
                )}
                {viewingItem.isbn && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">ISBN</label>
                    <p className="text-gray-800">{viewingItem.isbn}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-500">Downloads</label>
                  <p className="text-gray-800">{viewingItem.downloadCount || 0}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <p className={`font-medium ${
                    viewingItem.isActive ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {viewingItem.isActive ? 'Active' : 'Inactive'}
                  </p>
                </div>
              </div>

              {viewingItem.description && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Description</label>
                  <p className="text-gray-800 mt-1">{viewingItem.description}</p>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => handleDownload(viewingItem.id)}
                  className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}