import { X, Download } from 'lucide-react';
import DonationReceiptPDF from '../pages/DonationReceiptPDF';

export default function PDFPreviewModal({ donation, isOpen, onClose, onDownload }) {
  if (!isOpen || !donation) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-gray-800">Receipt Preview</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="p-8 bg-gray-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl mx-auto">
            <div className="bg-blue-900 text-white p-8 rounded-t-lg -mx-8 -mt-8 mb-8">
              <h1 className="text-3xl font-bold text-center">Maha Shree Rudra Samsthanam Foundation</h1>
              <p className="text-center mt-2 text-blue-100">Registered Non-Profit Organization</p>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-blue-900">DONATION RECEIPT</h2>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4 pb-6 border-b border-gray-200">
                <div>
                  <p className="text-sm text-gray-600">Receipt Number</p>
                  <p className="font-semibold text-blue-900">REC-{donation.id}-{new Date().getFullYear()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-semibold text-blue-900">{new Date(donation.donationDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Transaction ID</p>
                  <p className="font-semibold text-blue-900">{donation.transactionId || 'N/A'}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-blue-900 mb-4">DONOR INFORMATION</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-semibold text-gray-800">{donation.donorName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold text-gray-800">{donation.donorEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-semibold text-gray-800">{donation.donorPhone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">PAN Number</p>
                    <p className="font-semibold text-gray-800">{donation.panNumber || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-blue-900 mb-4">DONATION DETAILS</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Amount</p>
                    <p className="font-bold text-2xl text-blue-900">{donation.currency} {Number(donation.amount).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Type</p>
                    <p className="font-semibold text-gray-800 capitalize">{donation.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment Method</p>
                    <p className="font-semibold text-gray-800">{donation.paymentGateway}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Purpose</p>
                    <p className="font-semibold text-gray-800">{donation.purpose || 'General Donation'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="font-semibold text-gray-800 capitalize">{donation.status}</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm font-bold text-blue-900">Amount in Words:</p>
                <p className="text-gray-800">{DonationReceiptPDF.numberToWords(Number(donation.amount))} {donation.currency} only.</p>
              </div>

              <div className="text-center py-6 border-t border-gray-200">
                <h3 className="text-xl font-bold text-blue-900 mb-2">Thank you for your generous donation!</h3>
                <p className="text-gray-600">Your contribution helps us continue our mission and make a difference.</p>
              </div>

              <div className="flex justify-end pt-6 border-t border-gray-200">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Authorized Signatory</p>
                  <div className="border-t-2 border-blue-900 w-48 mt-8 mb-2"></div>
                  <p className="font-bold text-blue-900">Srinivasa Sai</p>
                  <p className="text-xs text-gray-600">Founder</p>
                  <p className="text-xs text-gray-600">MAHA SHREE RUDRA FOUNDATION</p>
                </div>
              </div>

              <div className="text-center text-xs text-gray-400 pt-4 border-t border-gray-200">
                <p className="font-semibold">MAHA SHREE RUDRA FOUNDATION</p>
                <p>Digital Receipt - This is a computer generated document</p>
                <p>and does not require a physical signature.</p>
                <p className="mt-2">Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3 sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button
            onClick={onDownload}
            className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors flex items-center space-x-2"
          >
            <Download className="w-5 h-5" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
