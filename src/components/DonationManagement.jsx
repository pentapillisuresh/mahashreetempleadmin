import { useState, useMemo, useRef, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Download, Mail, Calendar, ChevronDown, Eye, Share2, Loader2 } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import PDFPreviewModal from '../pages/PDFPreviewModal';
import DonationReceiptPDF from '../pages/DonationReceiptPDF';

export default function DonationManagement() {
  const { 
    donations, 
    addDonation, 
    updateDonation, 
    deleteDonation, 
    loadDonationsFromAPI,
    loading 
  } = useData();
  
  const [showModal, setShowModal] = useState(false);
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  const [previewDonation, setPreviewDonation] = useState(null);
  const [editingDonation, setEditingDonation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterYear, setFilterYear] = useState('all');
  const [filterMonth, setFilterMonth] = useState('all');
  const [showMonthFilter, setShowMonthFilter] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

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
    receiptSent: false,
    donationDate: new Date().toISOString().split('T')[0],
    donorAddress: ''
  });

  // Purpose dropdown options - 11 services
  const purposeOptions = [
    'Temple Activities',
    'Annaprasadham',
    'Education Support',
    'Goshala Seva',
    'Indian Culture Development',
    'Infrastructure Progression',
    'Medical Assistance',
    'Sanathana Sangeetham',
    'Social Welfare Drives',
    'Vedic Sanskrit',
    'Yoga Wellbeing'
  ];

  // Load donations on component mount
  useEffect(() => {
    loadDonationsFromAPI();
  }, [loadDonationsFromAPI]);

  const { availableYears, availableMonths } = useMemo(() => {
    const yearsSet = new Set();
    const monthsMap = new Map();

    donations.forEach(donation => {
      const date = new Date(donation.donationDate);
      const year = date.getFullYear().toString();
      const month = date.getMonth() + 1;

      yearsSet.add(year);

      if (!monthsMap.has(year)) {
        monthsMap.set(year, new Set());
      }
      monthsMap.get(year).add(month);
    });

    const years = Array.from(yearsSet).sort((a, b) => parseInt(b) - parseInt(a));
    const months = new Map();

    monthsMap.forEach((monthSet, year) => {
      const sortedMonths = Array.from(monthSet).sort((a, b) => a - b);
      months.set(year, sortedMonths);
    });

    return { availableYears: years, availableMonths: months };
  }, [donations]);

  const getAvailableMonthsForYear = (year) => {
    return availableMonths.get(year) || [];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    
    try {
      if (editingDonation) {
        await updateDonation(editingDonation.id, formData);
      } else {
        await addDonation(formData);
      }
      resetForm();
    } catch (error) {
      console.error('Error submitting donation:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setSubmitLoading(false);
    }
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
      receiptSent: false,
      donationDate: new Date().toISOString().split('T')[0],
      donorAddress: ''
    });
    setEditingDonation(null);
    setShowModal(false);
  };

  const handleEdit = (donation) => {
    setEditingDonation(donation);
    setFormData({ 
      ...donation,
      donationDate: donation.donationDate ? donation.donationDate.split('T')[0] : new Date().toISOString().split('T')[0]
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this donation?')) {
      return;
    }

    setActionLoading(id);
    try {
      await deleteDonation(id);
      alert('Donation deleted successfully!');
    } catch (error) {
      console.error('Error deleting donation:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleSendReceipt = async (id) => {
    const donation = donations.find(d => d.id === id);
    if (donation) {
      setIsGeneratingPDF(true);
      try {
        const pdfBlob = await DonationReceiptPDF.generatePDFBlob(donation);
        await sharePDFViaEmail(pdfBlob, donation);
        await updateDonation(id, { receiptSent: true });
        alert('Receipt sent to donor email successfully!');
      } catch (error) {
        console.error('Error sending receipt:', error);
        alert('Error sending receipt. Please try again.');
      } finally {
        setIsGeneratingPDF(false);
      }
    }
  };

  const handlePreviewPDF = (donation) => {
    setPreviewDonation(donation);
    setShowPDFPreview(true);
  };

  const sharePDFViaWhatsApp = async (donation) => {
    setIsGeneratingPDF(true);
    try {
      const pdfBlob = await DonationReceiptPDF.generatePDFBlob(donation);
      const pdfFile = new File([pdfBlob], `Donation_Receipt_${donation.id}.pdf`, { 
        type: 'application/pdf' 
      });
      
      // Create a shareable message
      const message = `🎉 *Donation Receipt*\n\n` +
        `*Donor Name:* ${donation.donorName}\n` +
        `*Amount:* ${donation.currency} ${Number(donation.amount).toLocaleString()}\n` +
        `*Date:* ${new Date(donation.donationDate).toLocaleDateString()}\n` +
        `*Transaction ID:* ${donation.transactionId || 'N/A'}\n\n` +
        `Please find your donation receipt attached.\n` +
        `🙏 *Thank you for your generous support!*`;
      
      // For mobile devices with Web Share API
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
        await navigator.share({
          title: 'Donation Receipt',
          text: message,
          files: [pdfFile],
        });
      } else {
        // Fallback for desktop - download and suggest manual sharing
        const url = window.URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Donation_Receipt_${donation.donorName}_${donation.id}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        // Show WhatsApp share link with message
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        alert('PDF downloaded. Please attach it manually to your WhatsApp message.');
      }
    } catch (error) {
      console.error('Error sharing via WhatsApp:', error);
      
      // Fallback: Download PDF and show WhatsApp share
      const pdfBlob = await DonationReceiptPDF.generatePDFBlob(donation);
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Donation_Receipt_${donation.donorName}_${donation.id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      const message = `Donation Receipt for ${donation.donorName} - ${donation.currency} ${donation.amount}`;
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    } finally {
      setIsGeneratingPDF(false);
      setShowShareMenu(null);
    }
  };

  const sharePDFViaEmail = async (pdfBlob, donation) => {
    const subject = `Donation Receipt - ${donation.donorName}`;
    const body = `Dear ${donation.donorName},\n\nThank you for your generous donation of ${donation.currency} ${Number(donation.amount).toLocaleString()}.\n\nPlease find your donation receipt attached.\n\nBest regards,\nShri Siddhivinayak Temple Trust`;
    
    const pdfFile = new File([pdfBlob], `Donation_Receipt_${donation.id}.pdf`, { 
      type: 'application/pdf' 
    });

    if (navigator.share && navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
      await navigator.share({
        title: subject,
        text: body,
        files: [pdfFile],
      });
    } else {
      // Fallback for desktop email
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Donation_Receipt_${donation.donorName}_${donation.id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      const mailtoUrl = `mailto:${donation.donorEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoUrl;
    }
  };

  const handleSharePDF = async (donation, platform) => {
    setIsGeneratingPDF(true);
    try {
      const pdfBlob = await DonationReceiptPDF.generatePDFBlob(donation);
      
      switch (platform) {
        case 'whatsapp':
          await sharePDFViaWhatsApp(donation);
          break;
        case 'email':
          await sharePDFViaEmail(pdfBlob, donation);
          break;
        case 'download':
          const url = window.URL.createObjectURL(pdfBlob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `Donation_Receipt_${donation.donorName}_${donation.id}.pdf`;
          a.click();
          window.URL.revokeObjectURL(url);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error sharing PDF:', error);
      alert('Error sharing PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
      setShowShareMenu(null);
    }
  };

  const filteredDonations = donations.filter(donation => {
    const matchesSearch = donation.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donation.donorEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (donation.panNumber && donation.panNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || donation.type === filterType;

    const donationDate = new Date(donation.donationDate);
    const donationYear = donationDate.getFullYear().toString();
    const donationMonth = donationDate.getMonth() + 1;

    const matchesYear = filterYear === 'all' || donationYear === filterYear;
    const matchesMonth = filterMonth === 'all' || donationMonth === parseInt(filterMonth);

    return matchesSearch && matchesType && matchesYear && matchesMonth;
  });

  const totalAmount = filteredDonations.reduce((sum, d) => sum + Number(d.amount), 0);
  const domesticAmount = filteredDonations
    .filter(d => d.type === 'domestic')
    .reduce((sum, d) => sum + Number(d.amount), 0);
  const internationalAmount = filteredDonations
    .filter(d => d.type === 'international')
    .reduce((sum, d) => sum + Number(d.amount), 0);

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
      const months = getAvailableMonthsForYear(year);
      if (months.length > 0 && filterMonth !== 'all') {
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
      Phone: d.donorPhone || '-',
      PAN: d.panNumber || '-',
      Amount: d.amount,
      Currency: d.currency,
      Type: d.type,
      Purpose: d.purpose,
      Status: d.status,
      TransactionID: d.transactionId,
      PaymentGateway: d.paymentGateway
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

        <div className="overflow-x-auto">
          {loading && donations.length === 0 ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-900" />
              <p className="text-gray-600 mt-2">Loading donations...</p>
            </div>
          ) : (
            <>
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
                          {donation.donorPhone && (
                            <div className="text-sm text-gray-500">{donation.donorPhone}</div>
                          )}
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
                            onClick={() => handlePreviewPDF(donation)}
                            className="p-1 text-purple-600 hover:bg-purple-50 rounded"
                            title="Preview & Download Receipt"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          
                          <div className="relative">
                            <button
                              onClick={() => setShowShareMenu(showShareMenu === donation.id ? null : donation.id)}
                              className="p-1 text-green-600 hover:bg-green-50 rounded disabled:opacity-50"
                              title="Share Receipt"
                              disabled={isGeneratingPDF}
                            >
                              <Share2 className="w-5 h-5" />
                            </button>

                            {showShareMenu === donation.id && (
                              <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-48">
                                <div className="p-2">
                                  <div className="text-xs font-medium text-gray-500 mb-2 px-2">Share PDF via:</div>
                                  <button
                                    onClick={() => handleSharePDF(donation, 'whatsapp')}
                                    className="w-full text-left px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded flex items-center space-x-2 disabled:opacity-50"
                                    disabled={isGeneratingPDF}
                                  >
                                    {isGeneratingPDF ? (
                                      <span>Generating PDF...</span>
                                    ) : (
                                      <span>WhatsApp</span>
                                    )}
                                  </button>
                                  <button
                                    onClick={() => handleSharePDF(donation, 'email')}
                                    className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded flex items-center space-x-2 disabled:opacity-50"
                                    disabled={isGeneratingPDF}
                                  >
                                    {isGeneratingPDF ? (
                                      <span>Generating PDF...</span>
                                    ) : (
                                      <span>Email</span>
                                    )}
                                  </button>
                                  <button
                                    onClick={() => handleSharePDF(donation, 'download')}
                                    className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded flex items-center space-x-2 disabled:opacity-50"
                                    disabled={isGeneratingPDF}
                                  >
                                    {isGeneratingPDF ? (
                                      <span>Generating PDF...</span>
                                    ) : (
                                      <span>Download PDF</span>
                                    )}
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>

                          {!donation.receiptSent && (
                            <button
                              onClick={() => handleSendReceipt(donation.id)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded disabled:opacity-50"
                              title="Send Receipt"
                              disabled={isGeneratingPDF}
                            >
                              {isGeneratingPDF ? (
                                <span className="animate-spin">⏳</span>
                              ) : (
                                <Mail className="w-5 h-5" />
                              )}
                            </button>
                          )}
                          <button
                            onClick={() => handleEdit(donation)}
                            className="p-1 text-orange-600 hover:bg-orange-50 rounded"
                            title="Edit"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(donation.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
                            title="Delete"
                            disabled={actionLoading === donation.id}
                          >
                            {actionLoading === donation.id ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <Trash2 className="w-5 h-5" />
                            )}
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
            </>
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
                    placeholder="+91 9876543210"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Donation Date</label>
                  <input
                    type="date"
                    value={formData.donationDate}
                    onChange={(e) => setFormData({ ...formData, donationDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                    required
                  />
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Donor Address</label>
                  <textarea
                    value={formData.donorAddress}
                    onChange={(e) => setFormData({ ...formData, donorAddress: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                    placeholder="Enter donor's address"
                    rows="3"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Purpose</label>
                  <select
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                  >
                    <option value="">Select Purpose</option>
                    {purposeOptions.map((purpose, index) => (
                      <option key={index} value={purpose}>
                        {purpose}
                      </option>
                    ))}
                    <option value="other">Other</option>
                  </select>
                  {formData.purpose === 'other' && (
                    <input
                      type="text"
                      value={formData.purpose}
                      onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                      className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                      placeholder="Enter custom purpose"
                    />
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={submitLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors flex items-center space-x-2 disabled:opacity-50"
                  disabled={submitLoading}
                >
                  {submitLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editingDonation ? 'Update' : 'Add'} Donation</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPDFPreview && previewDonation && (
        <PDFPreviewModal
          donation={previewDonation}
          isOpen={showPDFPreview}
          onClose={() => setShowPDFPreview(false)}
          onDownload={() => handleSharePDF(previewDonation, 'download')}
          onShare={(platform) => handleSharePDF(previewDonation, platform)}
          isGeneratingPDF={isGeneratingPDF}
        />
      )}
    </div>
  );
}