import { useState } from 'react';
import { Plus, Edit2, Trash2, Image as ImageIcon, Eye, X, Calendar, FileText } from 'lucide-react';
import { useData } from '../contexts/DataContext';

export default function ContentTable({ activeTab, data }) {
  const { 
    addTempleContent, 
    updateTempleContent, 
    deleteTempleContent, 
    addGalleryItem, 
    deleteGalleryItem, 
    addImportantDate, 
    updateImportantDate, 
    deleteImportantDate 
  } = useData();

  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const categories = [
    'Architecture', 'Events', 'Activities', 'Service', 
    'Culture', 'Education', 'People', 'Community', 
    'Rituals', 'Festivals'
  ];

  // Initial forms
  const [contentForm, setContentForm] = useState({
    section: 'about',
    title: '',
    content: '',
    imageUrl: '',
    orderPosition: 0
  });

  const [galleryForm, setGalleryForm] = useState({
    type: 'photo',
    title: '',
    url: '',
    thumbnailUrl: '',
    category: 'Architecture',
    description: ''
  });

  const [dateForm, setDateForm] = useState({
    date: '',
    title: '',
    description: '',
    type: 'festival'
  });

  // Table columns configuration
  const getColumns = () => {
    const baseColumns = {
      content: [
        { key: 'section', label: 'Section', className: 'whitespace-nowrap' },
        { key: 'title', label: 'Title', className: 'min-w-48' },
        { key: 'content', label: 'Content', className: 'min-w-64 max-w-md' },
        { key: 'orderPosition', label: 'Order', className: 'whitespace-nowrap' }
      ],
      gallery: [
        { key: 'preview', label: 'Preview', className: 'whitespace-nowrap' },
        { key: 'title', label: 'Title', className: 'min-w-48' },
        { key: 'category', label: 'Category', className: 'whitespace-nowrap' },
        { key: 'type', label: 'Type', className: 'whitespace-nowrap' },
        { key: 'uploadDate', label: 'Upload Date', className: 'whitespace-nowrap' }
      ],
      dates: [
        { key: 'date', label: 'Date', className: 'whitespace-nowrap' },
        { key: 'title', label: 'Title', className: 'min-w-48' },
        { key: 'type', label: 'Type', className: 'whitespace-nowrap' },
        { key: 'description', label: 'Description', className: 'min-w-64 max-w-md' }
      ]
    };
    return baseColumns[activeTab] || [];
  };

  // Render table cell content based on column key
  const renderTableCell = (item, columnKey) => {
    switch (columnKey) {
      case 'preview':
        return (
          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
            {item.thumbnailUrl ? (
              <img 
                src={item.thumbnailUrl} 
                alt={item.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <ImageIcon className="w-6 h-6 text-gray-400" />
            )}
          </div>
        );
      
      case 'section':
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
            {item.section}
          </span>
        );
      
      case 'category':
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
            {item.category}
          </span>
        );
      
      case 'type':
        return (
          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded capitalize">
            {item.type}
          </span>
        );
      
      case 'date':
        return new Date(item.date).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        });
      
      case 'uploadDate':
        return item.uploadDate ? new Date(item.uploadDate).toLocaleDateString() : 'N/A';
      
      case 'content':
        return (
          <div className="text-sm text-gray-600 line-clamp-2">
            {item.content}
          </div>
        );
      
      case 'description':
        return (
          <div className="text-sm text-gray-600 line-clamp-2">
            {item.description}
          </div>
        );
      
      default:
        return item[columnKey];
    }
  };

  // Form handlers
  const handleSubmit = (e) => {
    e.preventDefault();
    
    switch (activeTab) {
      case 'content':
        if (editingItem) {
          updateTempleContent(editingItem.id, contentForm);
        } else {
          addTempleContent(contentForm);
        }
        break;
      
      case 'gallery':
        if (selectedFiles.length > 0) {
          selectedFiles.forEach(file => {
            const galleryItem = {
              type: 'photo',
              title: file.name.split('.')[0] || galleryForm.title,
              url: URL.createObjectURL(file),
              thumbnailUrl: URL.createObjectURL(file),
              category: galleryForm.category,
              description: galleryForm.description,
              fileName: file.name,
              fileSize: file.size,
              uploadDate: new Date().toISOString()
            };
            addGalleryItem(galleryItem);
          });
        } else {
          addGalleryItem(galleryForm);
        }
        break;
      
      case 'dates':
        if (editingItem) {
          updateImportantDate(editingItem.id, dateForm);
        } else {
          addImportantDate(dateForm);
        }
        break;
    }
    
    resetForms();
    setSelectedFiles([]);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    switch (activeTab) {
      case 'content':
        setContentForm(item);
        break;
      case 'dates':
        setDateForm(item);
        break;
    }
    setShowModal(true);
  };

  const handleDelete = (itemId) => {
    switch (activeTab) {
      case 'content':
        deleteTempleContent(itemId);
        break;
      case 'gallery':
        deleteGalleryItem(itemId);
        break;
      case 'dates':
        deleteImportantDate(itemId);
        break;
    }
  };

  const handleView = (item) => {
    setViewingItem(item);
    setShowViewModal(true);
  };

  const resetForms = () => {
    setContentForm({ section: 'about', title: '', content: '', imageUrl: '', orderPosition: 0 });
    setGalleryForm({ type: 'photo', title: '', url: '', thumbnailUrl: '', category: 'Architecture', description: '' });
    setDateForm({ date: '', title: '', description: '', type: 'festival' });
    setEditingItem(null);
    setViewingItem(null);
    setShowModal(false);
    setShowViewModal(false);
    setSelectedFiles([]);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    
    if (!galleryForm.title && files.length === 1) {
      setGalleryForm(prev => ({
        ...prev,
        title: files[0].name.split('.')[0]
      }));
    }
  };

  const removeSelectedFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Modal titles
  const getModalTitle = () => {
    const action = editingItem ? 'Edit' : 'Add';
    switch (activeTab) {
      case 'content': return `${action} Temple Content`;
      case 'gallery': return 'Add Gallery Items';
      case 'dates': return `${action} Important Date`;
      default: return '';
    }
  };

  const getButtonText = () => {
    switch (activeTab) {
      case 'content': return `${editingItem ? 'Update' : 'Add'} Content`;
      case 'gallery': return `Add ${selectedFiles.length > 0 ? `${selectedFiles.length} Items` : 'Item'}`;
      case 'dates': return `${editingItem ? 'Update' : 'Add'} Date`;
      default: return 'Save';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 capitalize">
            {activeTab === 'content' ? 'Temple Content' : 
             activeTab === 'gallery' ? 'Gallery Items' : 
             'Important Dates'} ({data.length})
          </h2>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-900 text-white px-6 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-800 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>
            {activeTab === 'content' ? 'Add Content' : 
             activeTab === 'gallery' ? 'Add Gallery Items' : 
             'Add Important Date'}
          </span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {getColumns().map((column) => (
                <th 
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.className || ''}`}
                >
                  {column.label}
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                {getColumns().map((column) => (
                  <td key={column.key} className="px-6 py-4">
                    {renderTableCell(item, column.key)}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleView(item)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {activeTab !== 'gallery' && (
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-green-600 hover:text-green-900 p-1 rounded"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-900 p-1 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {data.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <div className="flex justify-center mb-3">
              {activeTab === 'content' && <FileText className="w-12 h-12 text-gray-300" />}
              {activeTab === 'gallery' && <ImageIcon className="w-12 h-12 text-gray-300" />}
              {activeTab === 'dates' && <Calendar className="w-12 h-12 text-gray-300" />}
            </div>
            <p className="text-lg font-medium">No {activeTab} items found</p>
            <p className="text-sm mt-1">Get started by adding your first item</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">
                {getModalTitle()}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Content Form */}
              {activeTab === 'content' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
                      <select
                        value={contentForm.section}
                        onChange={(e) => setContentForm({ ...contentForm, section: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                      >
                        <option value="about">About</option>
                        <option value="schedule">Schedule</option>
                        <option value="activities">Activities</option>
                        <option value="architecture">Architecture</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Order Position</label>
                      <input
                        type="number"
                        value={contentForm.orderPosition}
                        onChange={(e) => setContentForm({ ...contentForm, orderPosition: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                        min="0"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      value={contentForm.title}
                      onChange={(e) => setContentForm({ ...contentForm, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                    <textarea
                      value={contentForm.content}
                      onChange={(e) => setContentForm({ ...contentForm, content: e.target.value })}
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                      required
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Image URL (optional)</label>
                    <input
                      type="url"
                      value={contentForm.imageUrl}
                      onChange={(e) => setContentForm({ ...contentForm, imageUrl: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </>
              )}

              {/* Gallery Form */}
              {activeTab === 'gallery' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Images (Multiple files supported)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="gallery-upload"
                      />
                      <label
                        htmlFor="gallery-upload"
                        className="cursor-pointer block"
                      >
                        <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm text-gray-600 mb-1">
                          Click to upload images or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB each
                        </p>
                      </label>
                    </div>
                    
                    {selectedFiles.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Selected Files ({selectedFiles.length})
                        </h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {selectedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div className="flex items-center space-x-3">
                                <ImageIcon className="w-8 h-8 text-gray-400" />
                                <div>
                                  <p className="text-sm font-medium text-gray-800">{file.name}</p>
                                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeSelectedFile(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select
                        value={galleryForm.category}
                        onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                      <select
                        value={galleryForm.type}
                        onChange={(e) => setGalleryForm({ ...galleryForm, type: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                      >
                        <option value="photo">Photo</option>
                        <option value="video">Video</option>
                      </select>
                    </div>
                  </div>

                  {selectedFiles.length <= 1 && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                        <input
                          type="text"
                          value={galleryForm.title}
                          onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                          placeholder={selectedFiles.length === 1 ? selectedFiles[0].name.split('.')[0] : ''}
                          required={selectedFiles.length === 0}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                          value={galleryForm.description}
                          onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })}
                          rows="3"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                          placeholder="Optional description"
                        ></textarea>
                      </div>
                    </>
                  )}

                  {selectedFiles.length === 0 && (
                    <div className="border-t pt-4">
                      <p className="text-sm text-gray-600 mb-3">Or add via URL:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Media URL</label>
                          <input
                            type="url"
                            value={galleryForm.url}
                            onChange={(e) => setGalleryForm({ ...galleryForm, url: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail URL (optional)</label>
                          <input
                            type="url"
                            value={galleryForm.thumbnailUrl}
                            onChange={(e) => setGalleryForm({ ...galleryForm, thumbnailUrl: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                            placeholder="https://example.com/thumbnail.jpg"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Dates Form */}
              {activeTab === 'dates' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                      <input
                        type="date"
                        value={dateForm.date}
                        onChange={(e) => setDateForm({ ...dateForm, date: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                      <select
                        value={dateForm.type}
                        onChange={(e) => setDateForm({ ...dateForm, type: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                      >
                        <option value="festival">Festival</option>
                        <option value="event">Event</option>
                        <option value="holiday">Holiday</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      value={dateForm.title}
                      onChange={(e) => setDateForm({ ...dateForm, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={dateForm.description}
                      onChange={(e) => setDateForm({ ...dateForm, description: e.target.value })}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                    ></textarea>
                  </div>
                </>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForms}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
                  disabled={activeTab === 'gallery' && selectedFiles.length === 0 && !galleryForm.url}
                >
                  {getButtonText()}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {showViewModal && viewingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                {activeTab === 'content' ? 'Content Details' : 
                 activeTab === 'gallery' ? 'Gallery Item Details' : 
                 'Important Date Details'}
              </h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Preview for gallery */}
              {activeTab === 'gallery' && (
                <div className="flex justify-center">
                  <div className="w-64 h-64 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                    {viewingItem.thumbnailUrl || viewingItem.url ? (
                      <img 
                        src={viewingItem.thumbnailUrl || viewingItem.url} 
                        alt={viewingItem.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-16 h-16 text-gray-400" />
                    )}
                  </div>
                </div>
              )}

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Common fields */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <p className="text-lg font-semibold text-gray-900">{viewingItem.title}</p>
                </div>

                {/* Type-specific fields */}
                {activeTab === 'content' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                        {viewingItem.section}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Order Position</label>
                      <p className="text-gray-900">{viewingItem.orderPosition}</p>
                    </div>
                  </>
                )}

                {activeTab === 'gallery' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                        {viewingItem.category}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                      <p className="text-gray-900 capitalize">{viewingItem.type}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Upload Date</label>
                      <p className="text-gray-900">
                        {viewingItem.uploadDate ? new Date(viewingItem.uploadDate).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </>
                )}

                {activeTab === 'dates' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <p className="text-gray-900">
                        {new Date(viewingItem.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                      <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full capitalize">
                        {viewingItem.type}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Content/Description */}
              {(viewingItem.content || viewingItem.description) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {activeTab === 'content' ? 'Content' : 'Description'}
                  </label>
                  <p className="text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                    {viewingItem.content || viewingItem.description}
                  </p>
                </div>
              )}

              {/* Additional fields for gallery */}
              {activeTab === 'gallery' && viewingItem.fileName && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">File Name</label>
                    <p className="text-gray-900">{viewingItem.fileName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">File Size</label>
                    <p className="text-gray-900">{viewingItem.fileSize ? formatFileSize(viewingItem.fileSize) : 'N/A'}</p>
                  </div>
                </div>
              )}

              {/* URL fields */}
              {(viewingItem.url || viewingItem.imageUrl) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {activeTab === 'gallery' ? 'Media URL' : 'Image URL'}
                  </label>
                  <a 
                    href={viewingItem.url || viewingItem.imageUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 break-all"
                  >
                    {viewingItem.url || viewingItem.imageUrl}
                  </a>
                </div>
              )}

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}