import { apiService } from './api';

class DonationService {
  constructor() {
    this.baseEndpoint = '/Donation';
  }

  // CREATE - Create a new donation
  async createDonation(donationData) {
    try {
      console.log('Creating donation:', donationData);
      
      // Transform frontend data to match backend model
      const transformedData = this.transformDonationToBackend(donationData);
      
      const response = await apiService.post(this.baseEndpoint, transformedData);
      console.log('Donation created successfully:', response);
      return response;
    } catch (error) {
      console.error('Error creating donation:', error);
      throw new Error(`Failed to create donation: ${error.message}`);
    }
  }

  // READ - Get all donations
  async getAllDonations(filters = {}) {
    try {
      console.log('Fetching all donations with filters:', filters);
      
      let endpoint = this.baseEndpoint;
      
      // Add query parameters if filters provided
      if (Object.keys(filters).length > 0) {
        const queryParams = new URLSearchParams();
        Object.keys(filters).forEach(key => {
          if (filters[key]) {
            queryParams.append(key, filters[key]);
          }
        });
        endpoint += `?${queryParams.toString()}`;
      }
      
      const response = await apiService.get(endpoint);
      console.log('Donations fetched successfully:', response);
      return response;
    } catch (error) {
      console.error('Error fetching donations:', error);
      throw new Error(`Failed to fetch donations: ${error.message}`);
    }
  }

  // READ - Get donation by ID
  async getDonationById(id) {
    try {
      console.log('Fetching donation by ID:', id);
      const response = await apiService.get(`${this.baseEndpoint}/${id}`);
      console.log('Donation fetched successfully:', response);
      return response;
    } catch (error) {
      console.error('Error fetching donation:', error);
      throw new Error(`Failed to fetch donation: ${error.message}`);
    }
  }

  // UPDATE - Update donation
  async updateDonation(id, donationData) {
    try {
      console.log('Updating donation:', id, donationData);
      
      // Transform frontend data to match backend model
      const transformedData = this.transformDonationToBackend(donationData);
      
      const response = await apiService.put(`${this.baseEndpoint}/${id}`, transformedData);
      console.log('Donation updated successfully:', response);
      return response;
    } catch (error) {
      console.error('Error updating donation:', error);
      throw new Error(`Failed to update donation: ${error.message}`);
    }
  }

  // DELETE - Delete donation
  async deleteDonation(id) {
    try {
      console.log('Deleting donation:', id);
      const response = await apiService.delete(`${this.baseEndpoint}/${id}`);
      console.log('Donation deleted successfully:', response);
      return response;
    } catch (error) {
      console.error('Error deleting donation:', error);
      throw new Error(`Failed to delete donation: ${error.message}`);
    }
  }

  // PAYMENT - Create Razorpay order
  async createRazorpayOrder(orderData) {
    try {
      console.log('Creating Razorpay order:', orderData);
      const response = await apiService.post(`${this.baseEndpoint}/create-order`, orderData);
      console.log('Razorpay order created successfully:', response);
      return response;
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      throw new Error(`Failed to create payment order: ${error.message}`);
    }
  }

  // PAYMENT - Verify payment
  async verifyPayment(paymentData) {
    try {
      console.log('Verifying payment:', paymentData);
      const response = await apiService.post(`${this.baseEndpoint}/verify-payment`, paymentData);
      console.log('Payment verified successfully:', response);
      return response;
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw new Error(`Failed to verify payment: ${error.message}`);
    }
  }

  // PAYMENT - Generate QR code for UPI
  async generateQRCode(qrData) {
    try {
      console.log('Generating QR code:', qrData);
      const response = await apiService.post(`${this.baseEndpoint}/generate-qrcode`, qrData);
      console.log('QR code generated successfully:', response);
      return response;
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw new Error(`Failed to generate QR code: ${error.message}`);
    }
  }

  // PAYMENT - Mark UPI payment as completed
  async markUPIPaymentCompleted(paymentData) {
    try {
      console.log('Marking UPI payment as completed:', paymentData);
      const response = await apiService.post(`${this.baseEndpoint}/complete-upi-payment`, paymentData);
      console.log('UPI payment marked as completed:', response);
      return response;
    } catch (error) {
      console.error('Error marking UPI payment as completed:', error);
      throw new Error(`Failed to update UPI payment: ${error.message}`);
    }
  }

  // ANALYTICS - Get payment summary
  async getPaymentSummary() {
    try {
      console.log('Fetching payment summary');
      const response = await apiService.get(`${this.baseEndpoint}/payment/summary`);
      console.log('Payment summary fetched successfully:', response);
      return response;
    } catch (error) {
      console.error('Error fetching payment summary:', error);
      throw new Error(`Failed to fetch payment summary: ${error.message}`);
    }
  }

  // Transform frontend donation data to backend format
  transformDonationToBackend(frontendData) {
    // Map frontend category names to backend enum values
    const categoryMap = {
      'Temple Activities': 'others',
      'Annaprasadham': 'food_distribution',
      'Education Support': 'educational_resources',
      'Goshala Seva': 'goshala',
      'Indian Culture Development': 'vedic_sanskrit_education',
      'Infrastructure Progression': 'others',
      'Medical Assistance': 'medical_assistance',
      'Sanathana Sangeetham': 'others',
      'Social Welfare Drives': 'help_people',
      'Vedic Sanskrit': 'vedic_sanskrit_education',
      'Yoga Wellbeing': 'yoga_classes',
      'Other': 'others'
    };

    // Map frontend payment methods to backend enum values
    const paymentMethodMap = {
      'online': 'online',
      'upi': 'upi',
      'bank_transfer': 'bank_transfer',
      'cash': 'cash',
      'Razorpay': 'online',
      'PayPal': 'online',
      'Stripe': 'online',
      'Cash': 'cash',
      'Bank Transfer': 'bank_transfer'
    };

    // Map frontend status to backend status
    const statusMap = {
      'pending': 'pending',
      'completed': 'completed',
      'failed': 'failed'
    };

    return {
      category: categoryMap[frontendData.purpose] || 'others',
      donorName: frontendData.donorName,
      donorEmail: frontendData.donorEmail,
      donorPhoneNumber: frontendData.donorPhone,
      panNumber: frontendData.panNumber,
      amount: parseFloat(frontendData.amount),
      donorAddress: frontendData.donorAddress || '',
      paymentMethod: paymentMethodMap[frontendData.paymentGateway] || 'online',
      status: statusMap[frontendData.status] || 'pending',
      transactionDate: frontendData.donationDate ? new Date(frontendData.donationDate).toISOString() : new Date().toISOString(),
      // Additional fields that might be needed
      paymentId: frontendData.transactionId || null,
      orderId: frontendData.orderId || null,
      upiTransactionId: frontendData.upiTransactionId || null
    };
  }

  // Transform backend donation data to frontend format
  transformDonationFromBackend(backendData) {
    // Map backend category enum values to frontend category names
    const categoryMap = {
      'blood_bank': 'Medical Assistance',
      'educational_resources': 'Education Support',
      'food_distribution': 'Annaprasadham',
      'vedic_sanskrit_education': 'Vedic Sanskrit',
      'goshala': 'Goshala Seva',
      'help_people': 'Social Welfare Drives',
      'medical_assistance': 'Medical Assistance',
      'yoga_classes': 'Yoga Wellbeing',
      'book_bank': 'Education Support',
      'others': 'Temple Activities'
    };

    // Map backend payment methods to frontend values
    const paymentMethodMap = {
      'online': 'online',
      'upi': 'upi',
      'bank_transfer': 'bank_transfer',
      'cash': 'cash'
    };

    return {
      id: backendData.id,
      donorName: backendData.donorName,
      donorEmail: backendData.donorEmail,
      donorPhone: backendData.donorPhoneNumber,
      panNumber: backendData.panNumber,
      amount: backendData.amount,
      currency: 'INR', // Default currency
      type: backendData.donorEmail?.includes('.') ? 'international' : 'domestic', // Simple heuristic
      purpose: categoryMap[backendData.category] || 'Temple Activities',
      paymentGateway: this.getPaymentGatewayFromMethod(backendData.paymentMethod),
      transactionId: backendData.paymentId || backendData.upiTransactionId,
      status: backendData.status,
      receiptSent: false, // Default value
      donationDate: backendData.transactionDate || backendData.createdAt,
      // Additional fields for frontend
      paymentMethod: paymentMethodMap[backendData.paymentMethod] || 'online',
      orderId: backendData.orderId,
      upiTransactionId: backendData.upiTransactionId,
      createdAt: backendData.createdAt,
      updatedAt: backendData.updatedAt
    };
  }

  // Helper to determine payment gateway from payment method
  getPaymentGatewayFromMethod(paymentMethod) {
    const gatewayMap = {
      'online': 'Razorpay',
      'upi': 'UPI',
      'bank_transfer': 'Bank Transfer',
      'cash': 'Cash'
    };
    return gatewayMap[paymentMethod] || 'Razorpay';
  }
}

export const donationService = new DonationService();