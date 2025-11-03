import { jsPDF } from 'jspdf';

class DonationReceiptPDF {
  static generatePDF(donation) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Add background color for header
    doc.setFillColor(25, 55, 109); // Blue color
    doc.rect(0, 0, pageWidth, 60, 'F');
    
    // Company Logo and Name
    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('Maha Shree Rudra Samsthanam Foundation', pageWidth / 2, 25, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Registered Non-Profit Organization', pageWidth / 2, 35, { align: 'center' });
    
    // Receipt Title
    doc.setFontSize(20);
    doc.setTextColor(25, 55, 109);
    doc.setFont('helvetica', 'bold');
    doc.text('DONATION RECEIPT', pageWidth / 2, 80, { align: 'center' });
    
    // Receipt Details
    const receiptData = [
      { label: 'Receipt Number', value: `REC-${donation.id}-${new Date().getFullYear()}` },
      { label: 'Date', value: new Date(donation.donationDate).toLocaleDateString() },
      { label: 'Transaction ID', value: donation.transactionId || 'N/A' }
    ];
    
    let yPosition = 100;
    
    // Receipt details
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    
    receiptData.forEach(item => {
      doc.text(`${item.label}:`, 20, yPosition);
      doc.setTextColor(25, 55, 109);
      doc.text(item.value, 80, yPosition);
      doc.setTextColor(100, 100, 100);
      yPosition += 8;
    });
    
    yPosition += 10;
    
    // Donor Information
    doc.setFontSize(14);
    doc.setTextColor(25, 55, 109);
    doc.setFont('helvetica', 'bold');
    doc.text('DONOR INFORMATION', 20, yPosition);
    
    yPosition += 15;
    
    const donorData = [
      { label: 'Name', value: donation.donorName },
      { label: 'Email', value: donation.donorEmail },
      { label: 'Phone', value: donation.donorPhone || 'N/A' },
      { label: 'PAN Number', value: donation.panNumber || 'N/A' }
    ];
    
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    
    donorData.forEach(item => {
      doc.text(`${item.label}:`, 20, yPosition);
      doc.setTextColor(25, 55, 109);
      doc.text(item.value, 60, yPosition);
      doc.setTextColor(100, 100, 100);
      yPosition += 8;
    });
    
    yPosition += 10;
    
    // Donation Details
    doc.setFontSize(14);
    doc.setTextColor(25, 55, 109);
    doc.setFont('helvetica', 'bold');
    doc.text('DONATION DETAILS', 20, yPosition);
    
    yPosition += 15;
    
    const donationDetails = [
      { label: 'Amount', value: `${donation.currency} ${Number(donation.amount).toLocaleString()}` },
      { label: 'Type', value: donation.type.charAt(0).toUpperCase() + donation.type.slice(1) },
      { label: 'Payment Method', value: donation.paymentGateway },
      { label: 'Purpose', value: donation.purpose || 'General Donation' },
      { label: 'Status', value: donation.status.charAt(0).toUpperCase() + donation.status.slice(1) }
    ];
    
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    
    donationDetails.forEach(item => {
      doc.text(`${item.label}:`, 20, yPosition);
      doc.setTextColor(25, 55, 109);
      doc.text(item.value, 60, yPosition);
      doc.setTextColor(100, 100, 100);
      yPosition += 8;
    });
    
    yPosition += 20;
    
    // Amount in Words
    const amountInWords = this.numberToWords(Number(donation.amount));
    doc.setFontSize(10);
    doc.setTextColor(25, 55, 109);
    doc.setFont('helvetica', 'bold');
    doc.text('Amount in Words:', 20, yPosition);
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text(`${amountInWords} ${donation.currency} only.`, 20, yPosition + 6);
    
    yPosition += 20;
    
    // Thank you message
    doc.setFontSize(12);
    doc.setTextColor(25, 55, 109);
    doc.setFont('helvetica', 'bold');
    doc.text('Thank you for your generous donation!', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 10;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text('Your contribution helps us continue our mission and make a difference.', pageWidth / 2, yPosition, { align: 'center' });
    
    // Signature section
    const signatureY = pageHeight - 80;
    
    // Add signature image or styled text signature
    this.addSignature(doc, pageWidth, signatureY);
    
    // Organization stamp
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('MAHA SHREE RUDRA FOUNDATION', pageWidth / 2, signatureY + 30, { align: 'center' });
    doc.text('Digital Receipt - This is a computer generated document', pageWidth / 2, signatureY + 35, { align: 'center' });
    doc.text('and does not require a physical signature.', pageWidth / 2, signatureY + 40, { align: 'center' });
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(200, 200, 200);
    doc.text(`Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    
    // Save the PDF
    const fileName = `Donation_Receipt_${donation.donorName.replace(/\s+/g, '_')}_${new Date(donation.donationDate).toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  }

  static addSignature(doc, pageWidth, yPosition) {
    // Method 1: Using text-based signature (No image required)
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Authorized Signatory', pageWidth - 70, yPosition);
    
    // Draw signature line
    doc.setDrawColor(25, 55, 109);
    doc.setLineWidth(0.5);
    doc.line(pageWidth - 70, yPosition + 2, pageWidth - 20, yPosition + 2);
    
    // Signature name
    doc.setFontSize(9);
    doc.setTextColor(25, 55, 109);
    doc.setFont('helvetica', 'bold');
    doc.text('srinivasa sai', pageWidth - 70, yPosition + 10);
    
    // Designation
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text('Founder', pageWidth - 70, yPosition + 15);
    doc.text('MAHA SHREE RUDRA FOUNDATION', pageWidth - 70, yPosition + 19);
  }

  // Alternative method with image signature
  static addSignatureWithImage(doc, pageWidth, yPosition) {
    // If you have a signature image, you can use this method
    // First, you need to convert your signature image to base64
    const signatureBase64 = 'data:image/png;base64,YOUR_SIGNATURE_IMAGE_BASE64_HERE';
    
    try {
      doc.addImage(signatureBase64, 'PNG', pageWidth - 70, yPosition - 5, 40, 15);
      
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text('Authorized Signatory', pageWidth - 70, yPosition + 15);
      
      doc.setFontSize(7);
      doc.text('MAHA SHREE RUDRA FOUNDATION', pageWidth - 70, yPosition + 19);
    } catch (error) {
      // Fallback to text signature if image fails
      this.addSignature(doc, pageWidth, yPosition);
    }
  }

  // Method to create a stylized signature using text
  static createStyledSignature(doc, x, y) {
    // Save current graphics state
    const originalColor = doc.getTextColor();
    
    // Create a stylized signature using text and lines
    doc.setDrawColor(25, 55, 109);
    doc.setLineWidth(0.8);
    
    // Signature underline
    doc.line(x, y + 2, x + 40, y + 2);
    
    // Signature text with custom styling
    doc.setFontSize(10);
    doc.setTextColor(25, 55, 109);
    doc.setFont('helvetica', 'bold');
    doc.text('R. Kumar', x + 5, y);
    
    // Restore original color
    doc.setTextColor(originalColor);
  }
  
  static numberToWords(num) {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    if (num === 0) return 'Zero';
    
    function convertLessThanThousand(n) {
      if (n === 0) return '';
      
      let words = '';
      
      if (n >= 100) {
        words += ones[Math.floor(n / 100)] + ' Hundred ';
        n %= 100;
      }
      
      if (n >= 20) {
        words += tens[Math.floor(n / 10)] + ' ';
        n %= 10;
      } else if (n >= 10) {
        words += teens[n - 10] + ' ';
        n = 0;
      }
      
      if (n > 0) {
        words += ones[n] + ' ';
      }
      
      return words.trim();
    }
    
    let result = '';
    const crore = Math.floor(num / 10000000);
    const lakh = Math.floor((num % 10000000) / 100000);
    const thousand = Math.floor((num % 100000) / 1000);
    const remainder = num % 1000;
    
    if (crore > 0) {
      result += convertLessThanThousand(crore) + ' Crore ';
    }
    
    if (lakh > 0) {
      result += convertLessThanThousand(lakh) + ' Lakh ';
    }
    
    if (thousand > 0) {
      result += convertLessThanThousand(thousand) + ' Thousand ';
    }
    
    if (remainder > 0) {
      result += convertLessThanThousand(remainder);
    }
    
    return result.trim() || 'Zero';
  }
}

export default DonationReceiptPDF;