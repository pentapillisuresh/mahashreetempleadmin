import jsPDF from 'jspdf';

export default class DonationReceiptPDF {
  static async generatePDFBlob(donation) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 14;
        let yPosition = margin;
        
        // Add header with background
        doc.setFillColor(30, 64, 175);
        doc.rect(0, 0, pageWidth, 30, 'F');
        
        // Title
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('DONATION RECEIPT', pageWidth / 2, 18, { align: 'center' });
        
        doc.setFontSize(8);
        doc.text('Official Receipt for Tax Purposes', pageWidth / 2, 24, { align: 'center' });
        
        yPosition = 40;
        
        // Organization Info
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Maha Shree Rudra Samsthanam Foundation', margin, yPosition);
        
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        yPosition += 6;
        doc.text('Registered Non-Profit Organization', margin, yPosition);
        yPosition += 4;
        doc.text('PAN: AAAAA1234A | Trust Registration No: E-12345', margin, yPosition);
        yPosition += 4;
        doc.text('80G Registration No: AAAAA1234AE12345', margin, yPosition);
        
        yPosition += 10;
        
        // Receipt Details
        this.addSectionHeader(doc, 'Receipt Details', margin, yPosition);
        yPosition += 6;
        
        const receiptDetails = [
          { label: 'Receipt No:', value: `REC-${donation.id}-${new Date().getFullYear()}` },
          { label: 'Date:', value: new Date(donation.donationDate).toLocaleDateString() },
          { label: 'Transaction ID:', value: donation.transactionId || 'N/A' },
          { label: 'Payment Method:', value: donation.paymentGateway },
          { label: 'Donation Type:', value: donation.type },
          { label: 'Status:', value: donation.status }
        ];
        
        receiptDetails.forEach(detail => {
          doc.setFont('helvetica', 'bold');
          doc.text(detail.label, margin, yPosition);
          doc.setFont('helvetica', 'normal');
          doc.text(detail.value, margin + 40, yPosition);
          yPosition += 5;
        });
        
        yPosition += 5;
        
        // Donor Information
        this.addSectionHeader(doc, 'Donor Information', margin, yPosition);
        yPosition += 6;
        
        const donorDetails = [
          { label: 'Donor Name:', value: donation.donorName },
          { label: 'Email:', value: donation.donorEmail },
          { label: 'Phone:', value: donation.donorPhone || 'N/A' },
          { label: 'PAN Number:', value: donation.panNumber || 'N/A' }
        ];
        
        donorDetails.forEach(detail => {
          doc.setFont('helvetica', 'bold');
          doc.text(detail.label, margin, yPosition);
          doc.setFont('helvetica', 'normal');
          doc.text(detail.value, margin + 40, yPosition);
          yPosition += 5;
        });
        
        yPosition += 10;
        
        // Amount Section
        doc.setFillColor(239, 246, 255);
        doc.roundedRect(margin, yPosition, pageWidth - (2 * margin), 25, 3, 3, 'F');
        doc.setDrawColor(59, 130, 246);
        doc.roundedRect(margin, yPosition, pageWidth - (2 * margin), 25, 3, 3, 'S');
        
        doc.setTextColor(30, 64, 175);
        doc.setFontSize(8);
        doc.text('DONATION AMOUNT', pageWidth / 2, yPosition + 8, { align: 'center' });
        
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(`${donation.currency} ${Number(donation.amount).toLocaleString()}`, pageWidth / 2, yPosition + 16, { align: 'center' });
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        const amountWords = this.numberToWords(Number(donation.amount));
        doc.text(`(${amountWords} ${donation.currency} only)`, pageWidth / 2, yPosition + 22, { align: 'center' });
        
        yPosition += 35;
        
        // Purpose
        if (donation.purpose) {
          doc.setTextColor(0, 0, 0);
          doc.setFontSize(10);
          doc.setFont('helvetica', 'bold');
          doc.text('Purpose of Donation:', margin, yPosition);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          
          yPosition += 4;
          const splitPurpose = doc.splitTextToSize(donation.purpose, pageWidth - (2 * margin));
          doc.text(splitPurpose, margin, yPosition);
          yPosition += (splitPurpose.length * 4) + 5;
        } else {
          yPosition += 5;
        }
        
        // Tax Exemption
        doc.setFillColor(220, 252, 231);
        doc.roundedRect(margin, yPosition, pageWidth - (2 * margin), 20, 3, 3, 'F');
        doc.setDrawColor(34, 197, 94);
        doc.roundedRect(margin, yPosition, pageWidth - (2 * margin), 20, 3, 3, 'S');
        
        doc.setTextColor(22, 101, 52);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text('TAX EXEMPTION CERTIFICATE', margin + 5, yPosition + 8);
        
        doc.setFont('helvetica', 'normal');
        const taxText = 'This donation is eligible for tax deduction under Section 80G of the Income Tax Act, 1961. Donors can claim 50% of the donated amount as deduction.';
        const splitTax = doc.splitTextToSize(taxText, pageWidth - (2 * margin + 10));
        doc.text(splitTax, margin + 5, yPosition + 15);
        
        yPosition += 30;
        
        // Thank You Message
        doc.setTextColor(30, 64, 175);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Thank you for your generous donation!', pageWidth / 2, yPosition, { align: 'center' });
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.text('Your contribution helps us continue our mission and make a difference.', pageWidth / 2, yPosition + 5, { align: 'center' });
        
        yPosition += 15;
        
        // Footer
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, yPosition, pageWidth - margin, yPosition);
        
        yPosition += 10;
        
        // Signatures
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(8);
        doc.text('Authorized Signatory', margin + 25, yPosition);
        doc.text("Donor's Signature", pageWidth - margin - 55, yPosition);
        
        doc.line(margin + 15, yPosition - 5, margin + 65, yPosition - 5);
        doc.line(pageWidth - margin - 65, yPosition - 5, pageWidth - margin - 15, yPosition - 5);
        
        yPosition += 15;
        
        // Authorized Signatory Details
        doc.setFont('helvetica', 'bold');
        doc.text('Srinivasa Sai', margin + 25, yPosition);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.text('Founder, Maha Shree Rudra Foundation', margin + 25, yPosition + 4);
        
        yPosition += 10;
        
        // Contact Info
        doc.setFontSize(7);
        doc.setTextColor(100, 100, 100);
        doc.text('This is a computer-generated receipt. No physical signature is required.', pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 4;
        doc.text('Generated on ' + new Date().toLocaleDateString() + ' at ' + new Date().toLocaleTimeString(), pageWidth / 2, yPosition, { align: 'center' });
        
        // Generate blob
        const pdfBlob = doc.output('blob');
        resolve(pdfBlob);
      } catch (error) {
        console.error('PDF generation error:', error);
        reject(error);
      }
    });
  }

  static addSectionHeader(doc, text, x, y) {
    doc.setFillColor(59, 130, 246);
    doc.rect(x, y, 50, 4, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(text, x + 2, y + 2.5);
    doc.setTextColor(0, 0, 0);
  }

  static numberToWords(num) {
    // Simple number to words conversion for Indian numbering system
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

    if (num === 0) return 'Zero';

    function convertMillions(n) {
      if (n >= 10000000) {
        return convertMillions(Math.floor(n / 10000000)) + ' Crore ' + convertLakhs(n % 10000000);
      } else {
        return convertLakhs(n);
      }
    }

    function convertLakhs(n) {
      if (n >= 100000) {
        return convertLakhs(Math.floor(n / 100000)) + ' Lakh ' + convertThousands(n % 100000);
      } else {
        return convertThousands(n);
      }
    }

    function convertThousands(n) {
      if (n >= 1000) {
        return convertHundreds(Math.floor(n / 1000)) + ' Thousand ' + convertHundreds(n % 1000);
      } else {
        return convertHundreds(n);
      }
    }

    function convertHundreds(n) {
      if (n > 99) {
        return ones[Math.floor(n / 100)] + ' Hundred ' + convertTens(n % 100);
      } else {
        return convertTens(n);
      }
    }

    function convertTens(n) {
      if (n < 10) return ones[n];
      else if (n >= 10 && n < 20) return teens[n - 10];
      else {
        return tens[Math.floor(n / 10)] + ' ' + ones[n % 10];
      }
    }

    let result = convertMillions(num).trim();
    // Clean up double spaces
    result = result.replace(/\s+/g, ' ');
    return result + ' Rupees';
  }

  static generatePDF(donation) {
    this.generatePDFBlob(donation).then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Donation_Receipt_${donation.donorName}_${donation.id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    }).catch(error => {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    });
  }
}