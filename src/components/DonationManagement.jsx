import { useState, useMemo } from 'react';
import { Plus, Search, Edit2, Trash2, Download, Mail, Calendar, ChevronDown, FileText } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import DonationReceiptPDF from '../pages/DonationReceiptPDF';

export default function DonationManagement() {
  const { donations, addDonation, updateDonation, deleteDonation } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingDonation, setEditingDonation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterYear, setFilterYear] = useState('all');
  const [filterMonth, setFilterMonth] = useState('all');
  const [showMonthFilter, setShowMonthFilter] = useState(false);

  const [formData, setFormData] = useState({
    donorName: '',
    donorEmail: '',
    donorPhone: '',
    panNumber: '',
    amount: '',
    currency: 'INR',
    type: 'domestic',
    purpose: '',
    paymentGateway: 'Razorpay',
    transactionId: '',
    status: 'completed',
    receiptSent: false
  });

  // Get unique years and months from donations
  const { availableYears, availableMonths } = useMemo(() => {
    const yearsSet = new Set();
    const monthsMap = new Map(); // year -> Set(months)
    
    donations.forEach(donation => {
      const date = new Date(donation.donationDate);
      const year = date.getFullYear().toString();
      const month = date.getMonth() + 1; // 1-12
      
      yearsSet.add(year);
      
      if (!monthsMap.has(year)) {
        monthsMap.set(year, new Set());
      }
      monthsMap.get(year).add(month);
    });
    
    const years = Array.from(yearsSet).sort((a, b) => parseInt(b) - parseInt(a));
    const months = new Map();
    
    // Convert months to sorted arrays for each year
    monthsMap.forEach((monthSet, year) => {
      const sortedMonths = Array.from(monthSet).sort((a, b) => a - b);
      months.set(year, sortedMonths);
    });
    
    return { availableYears: years, availableMonths: months };
  }, [donations]);

  // Get available months for selected year
  const getAvailableMonthsForYear = (year) => {
    return availableMonths.get(year) || [];
  };

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
      panNumber: '',
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

  const handleDownloadPDF = (donation) => {
    DonationReceiptPDF.generatePDF(donation);
  };

  const filteredDonations = donations.filter(donation => {
    const matchesSearch = donation.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donation.donorEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (donation.panNumber && donation.panNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || donation.type === filterType;
    
    // Year and month filter logic
    const donationDate = new Date(donation.donationDate);
    const donationYear = donationDate.getFullYear().toString();
    const donationMonth = donationDate.getMonth() + 1;
    
    const matchesYear = filterYear === 'all' || donationYear === filterYear;
    const matchesMonth = filterMonth === 'all' || donationMonth === parseInt(filterMonth);
    
    return matchesSearch && matchesType && matchesYear && matchesMonth;
  });

  // Calculate statistics based on filtered donations
  const totalAmount = filteredDonations.reduce((sum, d) => sum + Number(d.amount), 0);
  const domesticAmount = filteredDonations
    .filter(d => d.type === 'domestic')
    .reduce((sum, d) => sum + Number(d.amount), 0);
  const internationalAmount = filteredDonations
    .filter(d => d.type === 'international')
    .reduce((sum, d) => sum + Number(d.amount), 0);

  // Format month for display
  const formatMonthDisplay = (monthNumber) => {
    const date = new Date(2000, monthNumber - 1, 1);
    return date.toLocaleDateString('en-US', { month: 'short' });
  };

  const getCurrentFilterDisplay = () => {
    if (filterYear === 'all') return 'All Time';
    if (filterMonth === 'all') return `${filterYear}`;
    return `${formatMonthDisplay(parseInt(filterMonth))} ${filterYear}`;
  };

  const handleYearChange = (year) => {
    setFilterYear(year);
    if (year === 'all') {
      setFilterMonth('all');
    } else {
      // Set to first available month or 'all'
      const months = getAvailableMonthsForYear(year);
      if (months.length > 0 && filterMonth !== 'all') {
        // Keep current month if available in new year, otherwise set to all
        if (!months.includes(parseInt(filterMonth))) {
          setFilterMonth('all');
        }
      }
    }
  };

  const handleMonthChange = (month) => {
    setFilterMonth(month);
  };

  const clearDateFilter = () => {
    setFilterYear('all');
    setFilterMonth('all');
    setShowMonthFilter(false);
  };

  const exportData = () => {
    const dataToExport = filterYear === 'all' ? donations : filteredDonations;
    
    const csvData = dataToExport.map(d => ({
      Date: new Date(d.donationDate).toLocaleDateString(),
      Donor: d.donorName,
      Email: d.donorEmail,
      PAN: d.panNumber || '-',
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
    a.download = `donations_${filterYear === 'all' ? 'all_time' : `${filterYear}${filterMonth !== 'all' ? `_${filterMonth}` : ''}`}.csv`;
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
            <span>Export CSV</span>
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

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-600">Total Donations</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">₹{totalAmount.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">{filteredDonations.length} donations</p>
          <p className="text-xs text-gray-400 mt-1">{getCurrentFilterDisplay()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-600">Domestic</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            ₹{domesticAmount.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {filteredDonations.filter(d => d.type === 'domestic').length} donations
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-600">International</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            ₹{internationalAmount.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {filteredDonations.filter(d => d.type === 'international').length} donations
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-600">Average Donation</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">
            ₹{filteredDonations.length > 0 ? Math.round(totalAmount / filteredDonations.length).toLocaleString() : '0'}
          </p>
          <p className="text-sm text-gray-500 mt-1">per donation</p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search donors, email, or PAN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
            />
          </div>
          
          <div className="flex gap-3">
            {/* Date Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowMonthFilter(!showMonthFilter)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">{getCurrentFilterDisplay()}</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {showMonthFilter && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-64">
                  <div className="p-3 border-b border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Filter by Date</span>
                      <button
                        onClick={clearDateFilter}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Clear
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {/* Year Selector */}
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Year</label>
                        <select
                          value={filterYear}
                          onChange={(e) => handleYearChange(e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-900 outline-none"
                          size="6"
                        >
                          <option value="all">All Years</option>
                          {availableYears.map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                      </div>

                      {/* Month Selector */}
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Month</label>
                        <select
                          value={filterMonth}
                          onChange={(e) => handleMonthChange(e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-900 outline-none"
                          size="6"
                          disabled={filterYear === 'all'}
                        >
                          <option value="all">All Months</option>
                          {filterYear !== 'all' && 
                            getAvailableMonthsForYear(filterYear).map(month => (
                              <option key={month} value={month}>
                                {formatMonthDisplay(month)}
                              </option>
                            ))
                          }
                        </select>
                        {filterYear === 'all' && (
                          <div className="text-xs text-gray-500 mt-1 text-center">
                            Select year first
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
        </div>

        {/* Donations Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Donor</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">PAN</th>
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
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {donation.panNumber || '-'}
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
                      donation.status === 'completed' ? 'bg-green-100 text-green-800' : 
                      donation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {donation.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDownloadPDF(donation)}
                        className="p-1 text-purple-600 hover:bg-purple-50 rounded"
                        title="Download Receipt PDF"
                      >
                        <FileText className="w-5 h-5" />
                      </button>
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
            <div className="text-center py-8 text-gray-500">
              No donations found for the selected filters
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Donation Modal */}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Donor Name *</label>
                  <input
                    type="text"
                    value={formData.donorName}
                    onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">PAN Number</label>
                  <input
                    type="text"
                    value={formData.panNumber}
                    onChange={(e) => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                    placeholder="ABCDE1234F"
                    maxLength="10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount *</label>
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