import { X, Download, FileText, Calendar, User, File } from 'lucide-react';

export default function ViewELibraryModal({ item, onClose }) {
  if (!item) return null;

  const getAccessTypeColor = (accessType) => {
    return accessType === 'public' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const handleDownload = () => {
    // Create a temporary anchor element for download
    const link = document.createElement('a');
    link.href = item.fileUrl;
    link.target = '_blank';
    link.download = item.title || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Book Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Header Section */}
          <div className="border-b border-gray-200 pb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-blue-100 rounded-lg">
                  <FileText className="w-8 h-8 text-blue-900" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{item.title}</h3>
                  {item.author && (
                    <div className="flex items-center space-x-2 text-gray-600 mt-1">
                      <User className="w-4 h-4" />
                      <span>By {item.author}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getAccessTypeColor(item.accessType)}`}>
                  {item.accessType}
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {item.category}
                </span>
              </div>
            </div>

            {item.description && (
              <p className="text-gray-600 text-lg leading-relaxed">{item.description}</p>
            )}
          </div>

          {/* Book Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* File Type */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <File className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-gray-800">File Type</h4>
              </div>
              <p className="text-gray-700">{item.fileType}</p>
            </div>

            {/* Downloads */}
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <Download className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-gray-800">Downloads</h4>
              </div>
              <p className="text-2xl font-bold text-gray-800">{item.downloadCount || 0}</p>
            </div>

            {/* File Size */}
            {item.fileSize && (
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <File className="w-5 h-5 text-purple-600" />
                  <h4 className="font-semibold text-gray-800">File Size</h4>
                </div>
                <p className="text-gray-700">{item.fileSize}</p>
              </div>
            )}

            {/* Pages */}
            {item.pages && (
              <div className="bg-teal-50 p-4 rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <FileText className="w-5 h-5 text-teal-600" />
                  <h4 className="font-semibold text-gray-800">Pages</h4>
                </div>
                <p className="text-gray-700">{item.pages} pages</p>
              </div>
            )}
          </div>

          {/* File Preview */}
          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Book Preview</h4>
            
            {item.fileUrl && item.fileType === 'PDF' ? (
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="aspect-[4/3] bg-white border border-gray-200 rounded-lg flex items-center justify-center">
                  <iframe
                    src={item.fileUrl}
                    className="w-full h-full rounded-lg"
                    title={item.title}
                  ></iframe>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Preview not available for this file type</p>
                <p className="text-sm text-gray-500">Click download to view the book</p>
              </div>
            )}
          </div>

          {/* File URL */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">File URL</h4>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={item.fileUrl}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
              />
              <button
                onClick={() => navigator.clipboard.writeText(item.fileUrl)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                Copy
              </button>
            </div>
          </div>

          {/* Additional Information */}
          <div className="border-t border-gray-200 pt-6">
            <h4 className="font-semibold text-gray-800 mb-3">Additional Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <div>
                  <span className="font-medium text-gray-700">Created Date:</span>{' '}
                  <span className="text-gray-600">
                    {new Date(item.createdDate || Date.now()).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <div>
                  <span className="font-medium text-gray-700">Last Updated:</span>{' '}
                  <span className="text-gray-600">
                    {new Date(item.updatedDate || Date.now()).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleDownload}
              className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}