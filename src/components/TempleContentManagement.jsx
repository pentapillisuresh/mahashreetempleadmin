import { useState } from 'react';
import { Plus, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';
import { useData } from '../contexts/DataContext';

export default function TempleContentManagement() {
  const { templeContent, addTempleContent, updateTempleContent, deleteTempleContent, gallery, addGalleryItem, deleteGalleryItem, importantDates, addImportantDate, updateImportantDate, deleteImportantDate } = useData();
  const [activeTab, setActiveTab] = useState('content');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [modalType, setModalType] = useState('content');

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
    category: ''
  });

  const [dateForm, setDateForm] = useState({
    date: '',
    title: '',
    description: '',
    type: 'festival'
  });

  const handleContentSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      updateTempleContent(editingItem.id, contentForm);
    } else {
      addTempleContent(contentForm);
    }
    resetForms();
  };

  const handleGallerySubmit = (e) => {
    e.preventDefault();
    addGalleryItem(galleryForm);
    resetForms();
  };

  const handleDateSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      updateImportantDate(editingItem.id, dateForm);
    } else {
      addImportantDate(dateForm);
    }
    resetForms();
  };

  const resetForms = () => {
    setContentForm({ section: 'about', title: '', content: '', imageUrl: '', orderPosition: 0 });
    setGalleryForm({ type: 'photo', title: '', url: '', thumbnailUrl: '', category: '' });
    setDateForm({ date: '', title: '', description: '', type: 'festival' });
    setEditingItem(null);
    setShowModal(false);
  };

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const handleEditContent = (item) => {
    setEditingItem(item);
    setContentForm(item);
    setModalType('content');
    setShowModal(true);
  };

  const handleEditDate = (item) => {
    setEditingItem(item);
    setDateForm(item);
    setModalType('date');
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Temple Content Management</h1>
        <p className="text-gray-600 mt-1">Manage temple information, gallery, and important dates</p>
      </div>

      <div className="bg-white rounded-xl shadow-md">
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('content')}
              className={`py-4 font-medium border-b-2 transition-colors ${
                activeTab === 'content' ? 'border-blue-900 text-blue-900' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Temple Content
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`py-4 font-medium border-b-2 transition-colors ${
                activeTab === 'gallery' ? 'border-blue-900 text-blue-900' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Gallery
            </button>
            <button
              onClick={() => setActiveTab('dates')}
              className={`py-4 font-medium border-b-2 transition-colors ${
                activeTab === 'dates' ? 'border-blue-900 text-blue-900' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Important Dates
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'content' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button
                  onClick={() => openModal('content')}
                  className="bg-blue-900 text-white px-6 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-800 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Content</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {templeContent.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                            {item.section}
                          </span>
                          <span className="text-sm text-gray-500">Order: {item.orderPosition}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                        <p className="text-gray-600 mt-1 line-clamp-2">{item.content}</p>
                        {item.imageUrl && (
                          <div className="mt-2 text-sm text-gray-500 flex items-center space-x-2">
                            <ImageIcon className="w-4 h-4" />
                            <span>Image attached</span>
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => handleEditContent(item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => deleteTempleContent(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {templeContent.length === 0 && (
                  <div className="text-center py-8 text-gray-500">No content added yet</div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button
                  onClick={() => openModal('gallery')}
                  className="bg-blue-900 text-white px-6 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-800 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Gallery Item</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {gallery.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-video bg-gray-200 flex items-center justify-center">
                      {item.type === 'photo' ? (
                        <ImageIcon className="w-12 h-12 text-gray-400" />
                      ) : (
                        <div className="text-gray-400">Video</div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">{item.title}</h3>
                          {item.category && (
                            <span className="text-sm text-gray-500">{item.category}</span>
                          )}
                        </div>
                        <button
                          onClick={() => deleteGalleryItem(item.id)}
                          className="text-red-600 hover:bg-red-50 rounded p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {gallery.length === 0 && (
                  <div className="col-span-full text-center py-8 text-gray-500">No gallery items added yet</div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'dates' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button
                  onClick={() => openModal('date')}
                  className="bg-blue-900 text-white px-6 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-800 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Important Date</span>
                </button>
              </div>

              <div className="space-y-2">
                {importantDates.sort((a, b) => new Date(a.date) - new Date(b.date)).map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow flex justify-between items-center">
                    <div>
                      <div className="flex items-center space-x-3">
                        <span className="text-lg font-semibold text-blue-900">
                          {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                          {item.type}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-800 mt-2">{item.title}</h3>
                      {item.description && (
                        <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditDate(item)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => deleteImportantDate(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
                {importantDates.length === 0 && (
                  <div className="text-center py-8 text-gray-500">No important dates added yet</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">
                {modalType === 'content' && (editingItem ? 'Edit Content' : 'Add Temple Content')}
                {modalType === 'gallery' && 'Add Gallery Item'}
                {modalType === 'date' && (editingItem ? 'Edit Date' : 'Add Important Date')}
              </h2>
            </div>

            {modalType === 'content' && (
              <form onSubmit={handleContentSubmit} className="p-6 space-y-4">
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
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Order Position</label>
                    <input
                      type="number"
                      value={contentForm.orderPosition}
                      onChange={(e) => setContentForm({ ...contentForm, orderPosition: e.target.value })}
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
                  >
                    {editingItem ? 'Update' : 'Add'} Content
                  </button>
                </div>
              </form>
            )}

            {modalType === 'gallery' && (
              <form onSubmit={handleGallerySubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <input
                      type="text"
                      value={galleryForm.category}
                      onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                      placeholder="e.g., Festival, Ritual"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={galleryForm.title}
                    onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
                  <input
                    type="url"
                    value={galleryForm.url}
                    onChange={(e) => setGalleryForm({ ...galleryForm, url: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                    placeholder="https://example.com/media.jpg"
                    required
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
                  >
                    Add Item
                  </button>
                </div>
              </form>
            )}

            {modalType === 'date' && (
              <form onSubmit={handleDateSubmit} className="p-6 space-y-4">
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
                  >
                    {editingItem ? 'Update' : 'Add'} Date
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
