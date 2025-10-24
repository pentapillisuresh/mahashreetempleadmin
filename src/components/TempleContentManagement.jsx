import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import ContentTable from '../pages/ContentTable';

export default function TempleContentManagement() {
  const { templeContent, gallery, importantDates } = useData();
  const [activeTab, setActiveTab] = useState('content');

  const getTableData = () => {
    switch (activeTab) {
      case 'content':
        return templeContent;
      case 'gallery':
        return gallery;
      case 'dates':
        return importantDates;
      default:
        return [];
    }
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
          <ContentTable 
            activeTab={activeTab}
            data={getTableData()}
          />
        </div>
      </div>
    </div>
  );
}