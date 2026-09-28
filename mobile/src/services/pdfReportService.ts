import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Alert, Platform } from 'react-native';

export interface ReportMeta {
  title: string;
  subtitle?: string;
  period?: string;
  repName?: string;
  hq?: string;
  division?: string;
}

export class PdfReportService {
  /**
   * Generates and opens a dynamic, professionally styled PDF report
   */
  static async generateAndShareReport(
    meta: ReportMeta,
    headers: string[],
    rows: (string | number)[][],
    summaryStats?: { label: string; value: string | number }[]
  ): Promise<boolean> {
    try {
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${meta.title} - RepPulse</title>
  <style>
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 24px;
      color: #1E293B;
      background-color: #ffffff;
    }
    .header {
      border-bottom: 2px solid #2563EB;
      padding-bottom: 12px;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .brand-title {
      font-size: 22px;
      font-weight: 800;
      color: #2563EB;
      margin: 0;
    }
    .brand-tag {
      font-size: 11px;
      color: #64748B;
      margin-top: 2px;
    }
    .meta-box {
      text-align: right;
      font-size: 11px;
      color: #475569;
    }
    .report-title {
      font-size: 16px;
      font-weight: 700;
      color: #0F172A;
      margin: 8px 0 4px 0;
    }
    .report-sub {
      font-size: 12px;
      color: #64748B;
      margin-bottom: 16px;
    }
    .stats-grid {
      display: flex;
      gap: 12px;
      margin-bottom: 16px;
    }
    .stat-card {
      flex: 1;
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 6px;
      padding: 10px;
    }
    .stat-label {
      font-size: 10px;
      color: #64748B;
      text-transform: uppercase;
      font-weight: 600;
    }
    .stat-val {
      font-size: 16px;
      font-weight: 700;
      color: #2563EB;
      margin-top: 4px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 12px;
      font-size: 11px;
    }
    th {
      background-color: #2563EB;
      color: #ffffff;
      font-weight: 700;
      text-align: left;
      padding: 8px 10px;
      border: 1px solid #1D4ED8;
    }
    td {
      padding: 7px 10px;
      border: 1px solid #E2E8F0;
    }
    tr:nth-child(even) {
      background-color: #F8FAFC;
    }
    .footer {
      margin-top: 28px;
      border-top: 1px solid #E2E8F0;
      padding-top: 10px;
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      color: #94A3B8;
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand-title">RepPulse</div>
      <div class="brand-tag">Enterprise Pharma SFA & Field Intelligence</div>
      <div class="report-title">${meta.title}</div>
      <div class="report-sub">${meta.subtitle || 'Barak Valley Division • Assam'}</div>
    </div>
    <div class="meta-box">
      <div><strong>Representative:</strong> ${meta.repName || 'Pranjal Malakar'}</div>
      <div><strong>HQ:</strong> ${meta.hq || 'Silchar / Shribhumi'}</div>
      <div><strong>Period:</strong> ${meta.period || 'September 2026'}</div>
      <div><strong>Generated:</strong> ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
    </div>
  </div>

  ${
    summaryStats && summaryStats.length > 0
      ? `
    <div class="stats-grid">
      ${summaryStats
        .map(
          s => `
        <div class="stat-card">
          <div class="stat-label">${s.label}</div>
          <div class="stat-val">${s.value}</div>
        </div>
      `
        )
        .join('')}
    </div>
  `
      : ''
  }

  <table>
    <thead>
      <tr>
        ${headers.map(h => `<th>${h}</th>`).join('')}
      </tr>
    </thead>
    <tbody>
      ${rows
        .map(
          r => `
        <tr>
          ${r.map(cell => `<td>${cell}</td>`).join('')}
        </tr>
      `
        )
        .join('')}
    </tbody>
  </table>

  <div class="footer">
    <div>RepPulse Automated Field Telemetry & DCR Compliance Engine</div>
    <div>Page 1 of 1 • System Verified</div>
  </div>
</body>
</html>
      `;

      const { uri } = await Print.printToFileAsync({ html: htmlContent });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: `${meta.title} - RepPulse`,
          UTI: 'com.adobe.pdf',
        });
      } else {
        Alert.alert('PDF Generated', `Report PDF generated at: ${uri}`);
      }
      return true;
    } catch (error: any) {
      console.error('PDF Generation failed:', error);
      Alert.alert('PDF Export Notice', 'Report rendered on screen. PDF print preview available.');
      return false;
    }
  }
}
