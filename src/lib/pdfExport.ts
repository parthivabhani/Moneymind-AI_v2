import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface PDFOptions {
  filename?: string;
  title?: string;
  includeCharts?: boolean;
  includeMetrics?: boolean;
  dateRange?: string;
}

export class PDFExportService {
  private static instance: PDFExportService;

  static getInstance(): PDFExportService {
    if (!PDFExportService.instance) {
      PDFExportService.instance = new PDFExportService();
    }
    return PDFExportService.instance;
  }

  async exportComprehensiveReport(
    dashboardData: any, 
    recommendations: any[], 
    options: PDFOptions = {}
  ): Promise<void> {
    const {
      filename = `comprehensive-report-${new Date().toISOString().split('T')[0]}.pdf`,
      title = 'Clarity Finance - Comprehensive Financial Report',
      dateRange = new Date().toLocaleDateString()
    } = options;

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    let yPosition = 20;

    // Add header
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text(title, pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 15;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Generated on: ${dateRange}`, pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 25;

    // Add Dashboard Section
    if (dashboardData && dashboardData.hasData) {
      yPosition = this.addDashboardSection(pdf, dashboardData, yPosition, pageWidth, pageHeight);
    }

    // Add Recommendations Section
    if (recommendations && recommendations.length > 0) {
      yPosition = this.addRecommendationsSection(pdf, recommendations, yPosition, pageWidth, pageHeight);
    }

    // Add footer
    const totalPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    }

    // Save the PDF
    pdf.save(filename);
  }

  private addDashboardSection(pdf: jsPDF, dashboardData: any, yPosition: number, pageWidth: number, pageHeight: number): number {
    // Section Header
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Dashboard Analysis', 20, yPosition);
    yPosition += 15;

    // Executive Summary
    if (dashboardData.executiveSummary) {
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('AI Executive Summary:', 20, yPosition);
      yPosition += 8;
      
      pdf.setFont('helvetica', 'normal');
      const summaryLines = pdf.splitTextToSize(dashboardData.executiveSummary, pageWidth - 40);
      pdf.text(summaryLines, 20, yPosition);
      yPosition += summaryLines.length * 5 + 10;
    }

    // Key Metrics
    if (dashboardData.metricCards && dashboardData.metricCards.length > 0) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('Key Financial Metrics:', 20, yPosition);
      yPosition += 8;

      dashboardData.metricCards.forEach((metric: any) => {
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(11);
        pdf.text(`${metric.title}: ${metric.value} (${metric.change} ${metric.description})`, 25, yPosition);
        yPosition += 7;
      });
      yPosition += 10;
    }

    // Risk Indicators
    if (dashboardData.riskIndicators && dashboardData.riskIndicators.length > 0) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('Risk Assessment:', 20, yPosition);
      yPosition += 8;

      dashboardData.riskIndicators.forEach((risk: any) => {
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(11);
        const riskText = `${risk.title}: ${risk.message} (${risk.trend})`;
        const riskLines = pdf.splitTextToSize(riskText, pageWidth - 50);
        pdf.text(riskLines, 25, yPosition);
        yPosition += riskLines.length * 5 + 5;
      });
      yPosition += 15;
    }

    return yPosition;
  }

  private addRecommendationsSection(pdf: jsPDF, recommendations: any[], yPosition: number, pageWidth: number, pageHeight: number): number {
    // Section Header
    if (yPosition > pageHeight - 50) {
      pdf.addPage();
      yPosition = 20;
    }

    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('AI Recommendations', 20, yPosition);
    yPosition += 15;

    recommendations.forEach((rec, index) => {
      if (yPosition > pageHeight - 100) {
        pdf.addPage();
        yPosition = 20;
      }

      // Recommendation number and title
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${index + 1}. ${rec.title}`, 20, yPosition);
      yPosition += 10;

      // Priority badge
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const priorityColor = rec.priority === 'high' ? [255, 0, 0] : 
                           rec.priority === 'medium' ? [255, 165, 0] : [0, 128, 0];
      pdf.setTextColor(...priorityColor);
      pdf.text(`Priority: ${rec.priority.toUpperCase()}`, 20, yPosition);
      pdf.setTextColor(0, 0, 0);
      yPosition += 8;

      // Description
      pdf.setFontSize(11);
      const descriptionLines = pdf.splitTextToSize(rec.description, pageWidth - 40);
      pdf.text(descriptionLines, 20, yPosition);
      yPosition += descriptionLines.length * 5 + 5;

      // Action items
      if (rec.actionItems && rec.actionItems.length > 0) {
        pdf.setFont('helvetica', 'bold');
        pdf.text('Action Items:', 20, yPosition);
        yPosition += 6;
        
        pdf.setFont('helvetica', 'normal');
        rec.actionItems.forEach((item: string) => {
          const itemLines = pdf.splitTextToSize(`• ${item}`, pageWidth - 50);
          pdf.text(itemLines, 25, yPosition);
          yPosition += itemLines.length * 5 + 2;
        });
      }

      // Impact
      if (rec.impact) {
        yPosition += 5;
        pdf.setFont('helvetica', 'bold');
        pdf.text('Expected Impact:', 20, yPosition);
        yPosition += 6;
        
        pdf.setFont('helvetica', 'normal');
        const impactText = `Timeframe: ${rec.impact.timeframe} | Confidence: ${Math.round(rec.impact.confidence * 100)}%`;
        if (rec.impact.savings) {
          const savingsText = ` | Potential Savings: $${rec.impact.savings.toLocaleString()}`;
          pdf.text(impactText + savingsText, 20, yPosition);
        } else {
          pdf.text(impactText, 20, yPosition);
        }
        yPosition += 15;
      }

      // Add separator
      if (index < recommendations.length - 1) {
        pdf.setDrawColor(200, 200, 200);
        pdf.line(20, yPosition, pageWidth - 20, yPosition);
        yPosition += 10;
      }
    });

    return yPosition;
  }

  async exportDashboard(elementIds: string[], options: PDFOptions = {}): Promise<void> {
    const {
      filename = `financial-report-${new Date().toISOString().split('T')[0]}.pdf`,
      title = 'Financial Analysis Report',
      includeCharts = true,
      includeMetrics = true,
      dateRange = new Date().toLocaleDateString()
    } = options;

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    let yPosition = 20;

    // Add header
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text(title, pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 15;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Generated on: ${dateRange}`, pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 20;

    // Process each element
    for (const elementId of elementIds) {
      const element = document.getElementById(elementId);
      if (!element) {
        console.warn(`Element with id "${elementId}" not found`);
        continue;
      }

      // Check if we need a new page
      if (yPosition > pageHeight - 100) {
        pdf.addPage();
        yPosition = 20;
      }

      try {
        // Capture element as canvas
        const canvas = await html2canvas(element, {
          backgroundColor: '#ffffff',
          scale: 2,
          useCORS: true,
          allowTaint: true
        });

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pageWidth - 40; // 20mm margin on each side
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Add section title if element has a heading
        const heading = element.querySelector('h1, h2, h3');
        if (heading && yPosition > 30) {
          yPosition += 10;
          pdf.setFontSize(14);
          pdf.setFont('helvetica', 'bold');
          pdf.text(heading.textContent || '', 20, yPosition);
          yPosition += 15;
        }

        // Add image to PDF
        if (yPosition + imgHeight > pageHeight - 20) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.addImage(imgData, 'PNG', 20, yPosition, imgWidth, imgHeight);
        yPosition += imgHeight + 20;

      } catch (error) {
        console.error(`Error capturing element ${elementId}:`, error);
      }
    }

    // Add footer
    const totalPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    }

    // Save the PDF
    pdf.save(filename);
  }

  async exportElement(elementId: string, filename?: string): Promise<void> {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id "${elementId}" not found`);
    }

    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgWidth = pageWidth - 40;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 20, 20, imgWidth, imgHeight);
    pdf.save(filename || `export-${elementId}-${Date.now()}.pdf`);
  }

  async exportRecommendations(recommendations: any[], filename?: string): Promise<void> {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    let yPosition = 20;

    // Header
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Financial Recommendations', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 15;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 25;

    // Process recommendations
    recommendations.forEach((rec, index) => {
      if (yPosition > 200) {
        pdf.addPage();
        yPosition = 20;
      }

      // Title
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${index + 1}. ${rec.title}`, 20, yPosition);
      yPosition += 10;

      // Priority badge
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const priorityColor = rec.priority === 'high' ? [255, 0, 0] : 
                           rec.priority === 'medium' ? [255, 165, 0] : [0, 128, 0];
      pdf.setTextColor(...priorityColor);
      pdf.text(`Priority: ${rec.priority.toUpperCase()}`, 20, yPosition);
      pdf.setTextColor(0, 0, 0);
      yPosition += 8;

      // Description
      pdf.setFontSize(11);
      const descriptionLines = pdf.splitTextToSize(rec.description, pageWidth - 40);
      pdf.text(descriptionLines, 20, yPosition);
      yPosition += descriptionLines.length * 5 + 5;

      // Action items
      if (rec.actionItems && rec.actionItems.length > 0) {
        pdf.setFont('helvetica', 'bold');
        pdf.text('Action Items:', 20, yPosition);
        yPosition += 6;
        
        pdf.setFont('helvetica', 'normal');
        rec.actionItems.forEach((item: string) => {
          const itemLines = pdf.splitTextToSize(`• ${item}`, pageWidth - 50);
          pdf.text(itemLines, 25, yPosition);
          yPosition += itemLines.length * 5 + 2;
        });
      }

      // Impact
      if (rec.impact) {
        yPosition += 5;
        pdf.setFont('helvetica', 'bold');
        pdf.text('Expected Impact:', 20, yPosition);
        yPosition += 6;
        
        pdf.setFont('helvetica', 'normal');
        const impactText = `Timeframe: ${rec.impact.timeframe} | Confidence: ${Math.round(rec.impact.confidence * 100)}%`;
        if (rec.impact.savings) {
          const savingsText = ` | Potential Savings: $${rec.impact.savings.toLocaleString()}`;
          pdf.text(impactText + savingsText, 20, yPosition);
        } else {
          pdf.text(impactText, 20, yPosition);
        }
        yPosition += 15;
      }

      // Add separator
      if (index < recommendations.length - 1) {
        pdf.setDrawColor(200, 200, 200);
        pdf.line(20, yPosition, pageWidth - 20, yPosition);
        yPosition += 10;
      }
    });

    pdf.save(filename || `recommendations-${new Date().toISOString().split('T')[0]}.pdf`);
  }
}

export const pdfExportService = PDFExportService.getInstance();
