import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Download, Mail } from 'lucide-react';
import { useData } from '../contexts/DataContext';

export default function DonationManagement() {
  const { donations, addDonation, updateDonation, deleteDonation } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingDonation, setEditingDonation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const [formData, setFormData] = useState({
    donorName: '',
    donorEmail: '',
    donorPhone: '',
    amount: '',
    currency: 'INR',
    type: 'domestic',
    purpose: '',
    paymentGateway: 'Razorpay',
    transactionId: '',
    status: 'completed',
    receiptSent: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingDonation) {
      updateDonation(editingDonation.id, formData);
    } else {
      addDonation(formData);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      donorName: '',
      donorEmail: '',
      donorPhone: '',
      amount: '',
      currency: 'INR',
      type: 'domestic',
      purpose: '',
      paymentGateway: 'Razorpay',
      transactionId: '',
      status: 'completed',
      receiptSent: false
    });
    setEditingDonation(null);
    setShowModal(false);
  };

  const handleEdit = (donation) => {
    setEditingDonation(donation);
    setFormData({ ...donation });
    setShowModal(true);
  };

  const handleSendReceipt = (id) => {
    updateDonation(id, { receiptSent: true });
    alert('Receipt sent to donor email successfully!');
  };

  const filteredDonations = donations.filter(donation => {
    const matchesSearch = donation.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donation.donorEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || donation.type === filterType;
    return matchesSearch && matchesType;
  });

  const totalAmount = filteredDonations.reduce((sum, d) => sum + Number(d.amount), 0);

  const exportData = () => {
    const csvData = donations.map(d => ({
      Date: new Date(d.donationDate).toLocaleDateString(),
      Donor: d.donorName,
      Email: d.donorEmail,
      Amount: d.amount,
      Currency: d.currency,
      Type: d.type,
      Purpose: d.purpose,
      Status: d.status,
      TransactionID: d.transactionId
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `donations_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Donation Management</h1>
          <p className="text-gray-600 mt-1">Track and manage donations</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={exportData}
            className="bg-green-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            <span>Export</span>
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-900 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-blue-800 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Donation</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-600">Total Donations</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">₹{totalAmount.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">{filteredDonations.length} donations</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-600">Domestic</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            ₹{donations.filter(d => d.type === 'domestic').reduce((sum, d) => sum + Number(d.amount), 0).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-1">{donations.filter(d => d.type === 'domestic').length} donations</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-600">International</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            ₹{donations.filter(d => d.type === 'international').reduce((sum, d) => sum + Number(d.amount), 0).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-1">{donations.filter(d => d.type === 'international').length} donations</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search donors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
          >
            <option value="all">All Types</option>
            <option value="domestic">Domestic</option>
            <option value="international">International</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Donor</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Purpose</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDonations.map((donation) => (
                <tr key={donation.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {new Date(donation.donationDate).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium text-gray-800">{donation.donorName}</div>
                      <div className="text-sm text-gray-500">{donation.donorEmail}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-gray-800">
                      {donation.currency} {Number(donation.amount).toLocaleString()}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      donation.type === 'domestic' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {donation.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{donation.purpose || '-'}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      donation.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {donation.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      {!donation.receiptSent && (
                        <button
                          onClick={() => handleSendReceipt(donation.id)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                          title="Send Receipt"
                        >
                          <Mail className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleEdit(donation)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="Edit"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => deleteDonation(donation.id)}
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
          {filteredDonations.length === 0 && (
            <div className="text-center py-8 text-gray-500">No donations found</div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingDonation ? 'Edit Donation' : 'Add New Donation'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Donor Name</label>
                  <input
                    type="text"
                    value={formData.donorName}
                    onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.donorEmail}
                    onChange={(e) => setFormData({ ...formData, donorEmail: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.donorPhone}
                    onChange={(e) => setFormData({ ...formData, donorPhone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                  >
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                  >
                    <option value="domestic">Domestic</option>
                    <option value="international">International</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Gateway</label>
                  <select
                    value={formData.paymentGateway}
                    onChange={(e) => setFormData({ ...formData, paymentGateway: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                  >
                    <option value="Razorpay">Razorpay</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Stripe">Stripe</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Transaction ID</label>
                  <input
                    type="text"
                    value={formData.transactionId}
                    onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                    placeholder="Transaction reference number"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Purpose</label>
                  <textarea
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                    placeholder="e.g., Temple construction, Medical aid"
                  ></textarea>
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
                  {editingDonation ? 'Update' : 'Add'} Donation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
