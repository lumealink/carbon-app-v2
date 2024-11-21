import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { EmissionData } from '../types/emissions';
import { Organization } from '../types/organization';

interface ReportData {
  organization: Organization;
  emissions: {
    scope1: EmissionData[];
    scope2: EmissionData[];
    scope3: EmissionData[];
  };
  aggregatedEmissions: {
    scope1Total: number;
    scope2Total: number;
    scope3Total: number;
    total: number;
  };
  period: {
    startDate: string;
    endDate: string;
  };
}

export const generateGHGReport = (data: ReportData, reportType: string): jsPDF => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.width;

  // Title
  pdf.setFontSize(20);
  pdf.text('GHG Emissions Inventory Report', pageWidth / 2, 20, { align: 'center' });

  // Organization Information
  pdf.setFontSize(12);
  pdf.text('Organization Information', 14, 35);
  autoTable(pdf, {
    startY: 40,
    head: [['Field', 'Value']],
    body: [
      ['Organization Name', data.organization.name],
      ['Reporting Period', `${new Date(data.period.startDate).toLocaleDateString()} to ${new Date(data.period.endDate).toLocaleDateString()}`],
      ['Boundary Approach', data.organization.boundaryApproach.replace('_', ' ')],
      ['Verification Status', data.organization.verificationStatus]
    ],
    theme: 'grid'
  });

  // Executive Summary
  pdf.addPage();
  pdf.setFontSize(16);
  pdf.text('Executive Summary', 14, 20);
  pdf.setFontSize(12);
  pdf.text([
    'This report presents the greenhouse gas (GHG) emissions inventory in accordance',
    'with the GHG Protocol Corporate Standard. The inventory includes direct and indirect',
    'emissions from operations within the defined organizational boundaries.'
  ], 14, 30);

  // Total Emissions Summary
  pdf.setFontSize(14);
  pdf.text('Total GHG Emissions Summary', 14, 60);
  autoTable(pdf, {
    startY: 65,
    head: [['Scope', 'Emissions (tCO₂e)', 'Percentage']],
    body: [
      ['Scope 1 (Direct)', data.aggregatedEmissions.scope1Total.toFixed(2), `${((data.aggregatedEmissions.scope1Total / data.aggregatedEmissions.total) * 100).toFixed(1)}%`],
      ['Scope 2 (Indirect)', data.aggregatedEmissions.scope2Total.toFixed(2), `${((data.aggregatedEmissions.scope2Total / data.aggregatedEmissions.total) * 100).toFixed(1)}%`],
      ['Scope 3 (Value Chain)', data.aggregatedEmissions.scope3Total.toFixed(2), `${((data.aggregatedEmissions.scope3Total / data.aggregatedEmissions.total) * 100).toFixed(1)}%`],
      ['Total', data.aggregatedEmissions.total.toFixed(2), '100%']
    ],
    theme: 'grid'
  });

  // Detailed Emissions by Scope
  if (reportType === 'detailed') {
    // Scope 1 Details
    pdf.addPage();
    pdf.setFontSize(16);
    pdf.text('Scope 1: Direct Emissions', 14, 20);
    autoTable(pdf, {
      startY: 30,
      head: [['Source', 'Activity', 'Quantity', 'Unit', 'Emissions (tCO₂e)']],
      body: data.emissions.scope1.map(e => [
        e.source,
        e.activity,
        e.quantity.toString(),
        e.unit,
        e.calculatedEmissions?.toFixed(2) || '0.00'
      ]),
      theme: 'grid'
    });

    // Scope 2 Details
    pdf.addPage();
    pdf.setFontSize(16);
    pdf.text('Scope 2: Indirect Emissions', 14, 20);
    autoTable(pdf, {
      startY: 30,
      head: [['Source', 'Activity', 'Quantity', 'Unit', 'Emissions (tCO₂e)']],
      body: data.emissions.scope2.map(e => [
        e.source,
        e.activity,
        e.quantity.toString(),
        e.unit,
        e.calculatedEmissions?.toFixed(2) || '0.00'
      ]),
      theme: 'grid'
    });

    // Scope 3 Details
    pdf.addPage();
    pdf.setFontSize(16);
    pdf.text('Scope 3: Value Chain Emissions', 14, 20);
    autoTable(pdf, {
      startY: 30,
      head: [['Category', 'Activity', 'Quantity', 'Unit', 'Emissions (tCO₂e)']],
      body: data.emissions.scope3.map(e => [
        e.category,
        e.activity,
        e.quantity.toString(),
        e.unit,
        e.calculatedEmissions?.toFixed(2) || '0.00'
      ]),
      theme: 'grid'
    });
  }

  // Methodology
  pdf.addPage();
  pdf.setFontSize(16);
  pdf.text('Methodology and Assumptions', 14, 20);
  pdf.setFontSize(12);
  pdf.text([
    'Emissions Calculation Methodology:',
    '• Direct measurements and calculations following GHG Protocol guidance',
    '• Use of standard emission factors from recognized sources',
    '• Application of Global Warming Potentials (GWPs) from IPCC AR5',
    '',
    'Data Quality and Verification:',
    '• Internal data verification procedures',
    '• Uncertainty assessment and data quality controls',
    '• Third-party verification status: ' + data.organization.verificationStatus
  ], 14, 30);

  return pdf;
};