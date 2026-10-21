import React, { useState } from 'react';
import { HrmsUser, PayslipRecord } from '../../types';
import { HrmsService } from '../../services/hrmsService';
import { PayslipModal } from '../ess/PayslipModal';
import { 
  FileText, 
  Download, 
  Eye, 
  Calendar, 
  Receipt, 
  ShieldCheck, 
  CheckCircle2, 
  Printer, 
  Sparkles,
  ChevronDown
} from 'lucide-react';

interface PayrollSlipsViewProps {
  currentUser: HrmsUser;
}

export const PayrollSlipsView: React.FC<PayrollSlipsViewProps> = ({ currentUser }) => {
  const [payslips, setPayslips] = useState<PayslipRecord[]>(() => HrmsService.getPayslips());
  const [selectedPayslip, setSelectedPayslip] = useState<PayslipRecord | null>(null);

  // Salary Slip selectors
  const [salaryYear, setSalaryYear] = useState<number>(2026);
  const [salaryMonth, setSalaryMonth] = useState<string>('September 2026');

  // Reimbursement Slip selectors
  const [reimbYear, setReimbYear] = useState<number>(2026);
  const [reimbMonth, setReimbMonth] = useState<string>('September 2026');

  // Form 16 selector
  const [form16AY, setForm16AY] = useState<string>('AY 2026-27 (FY 2025-26)');

  const [notification, setNotification] = useState<string | null>(null);

  // Find matching user payslip
  const userPayslips = payslips.filter(p => p.employeeId === currentUser.id || p.employeeCode === currentUser.employeeCode);
  const currentSlip = userPayslips.find(p => p.month === salaryMonth) || userPayslips[0];

  const handleDownloadAll = () => {
    setNotification('Downloading annual payslips zip package (Apr 2026 - Sep 2026)...');
    setTimeout(() => setNotification(null), 4000);
  };

  const handleRunPayroll = () => {
    const updated = HrmsService.runMonthlyPayroll('October 2026', 2026);
    setPayslips(updated);
    setSalaryMonth('October 2026');
    setNotification('October 2026 Payroll calculated and disbursed successfully!');
    setTimeout(() => setNotification(null), 4000);
  };

  const handleDownloadSlip = (slipType: string) => {
    if (currentSlip) {
      setSelectedPayslip(currentSlip);
    } else {
      setNotification(`Generating ${slipType} PDF download...`);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {notification && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center justify-between text-xs font-semibold shadow-2xs animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-emerald-500 hover:text-emerald-700">
            &times;
          </button>
        </div>
      )}

      {/* Top Header Card (Darwinbox Screen 5: "My Slips" + "Download All") */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            My Slips & Tax Certificates
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Central repository for statutory salary payslips, reimbursement summaries, and Form 16
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRunPayroll}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-amber-50 text-amber-800 hover:bg-amber-100 transition-all border border-amber-200 cursor-pointer shadow-2xs"
            title="Generate October 2026 Payroll"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Run Oct 2026 Payroll
          </button>

          <button
            onClick={handleDownloadAll}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#E0E7FF] text-[#3730A3] hover:bg-[#C7D2FE] transition-all cursor-pointer shadow-2xs hover:scale-102"
          >
            <Download className="w-4 h-4 text-[#4F46E5]" />
            Download All
          </button>
        </div>
      </div>

      {/* Tri-Fold Document Hub (Darwinbox Screen 5) */}
      <div className="space-y-4">
        
        {/* 1. Salary Slip Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Left Info */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">Salary Slip</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Statutory EPF & ESIC Compliant
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 max-w-xl">
                  Monthly computation of Basic, HRA, Allowances, PF deduction (12%), Professional Tax (₹200), and Net Credit.
                </p>
                {currentSlip && (
                  <div className="mt-2 text-xs font-mono text-slate-700 flex items-center gap-3">
                    <span>Gross: <strong className="text-slate-900">₹{currentSlip.earnings.grossEarnings.toLocaleString('en-IN')}</strong></span>
                    <span>•</span>
                    <span>Deductions: <strong className="text-rose-600">₹{currentSlip.deductions.totalDeductions.toLocaleString('en-IN')}</strong></span>
                    <span>•</span>
                    <span>Net Pay: <strong className="text-emerald-700 font-black">₹{currentSlip.netPay.toLocaleString('en-IN')}</strong></span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Selectors & Actions */}
            <div className="flex items-center gap-2.5 flex-wrap shrink-0">
              {/* Year Dropdown */}
              <select
                value={salaryYear}
                onChange={e => setSalaryYear(Number(e.target.value))}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 text-slate-700 font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value={2026}>2026</option>
                <option value={2025}>2025</option>
                <option value={2024}>2024</option>
              </select>

              {/* Month Dropdown */}
              <select
                value={salaryMonth}
                onChange={e => setSalaryMonth(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 text-slate-700 font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="October 2026">October 2026</option>
                <option value="September 2026">September 2026</option>
                <option value="August 2026">August 2026</option>
                <option value="July 2026">July 2026</option>
                <option value="June 2026">June 2026</option>
                <option value="May 2026">May 2026</option>
              </select>

              {/* View Action */}
              <button
                onClick={() => {
                  if (currentSlip) setSelectedPayslip(currentSlip);
                }}
                title="View Payslip"
                className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
              >
                <Eye className="w-4 h-4" />
              </button>

              {/* Download Action */}
              <button
                onClick={() => handleDownloadSlip('Salary Slip')}
                title="Download / Print Payslip PDF"
                className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer shadow-2xs"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* 2. Reimbursement Slip Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Left Info */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
                <Receipt className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">Reimbursement Slip</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800">
                    Direct Account Credit
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 max-w-xl">
                  Summary statement of non-taxable expense disbursements including business travel, client meals, and fuel allowance.
                </p>
                <div className="mt-2 text-xs font-mono text-slate-700 flex items-center gap-3">
                  <span>Approved Claims: <strong className="text-emerald-700">₹8,750</strong></span>
                  <span>•</span>
                  <span>Disbursement Date: <strong className="text-slate-800">01 Oct 2026 via NEFT</strong></span>
                </div>
              </div>
            </div>

            {/* Right Selectors & Actions */}
            <div className="flex items-center gap-2.5 flex-wrap shrink-0">
              <select
                value={reimbYear}
                onChange={e => setReimbYear(Number(e.target.value))}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 text-slate-700 font-semibold focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value={2026}>2026</option>
                <option value={2025}>2025</option>
              </select>

              <select
                value={reimbMonth}
                onChange={e => setReimbMonth(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 text-slate-700 font-semibold focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="September 2026">September 2026</option>
                <option value="August 2026">August 2026</option>
                <option value="July 2026">July 2026</option>
              </select>

              <button
                onClick={() => {
                  setNotification('Displaying approved reimbursement statement for September 2026 (₹8,750)...');
                  setTimeout(() => setNotification(null), 4000);
                }}
                title="View Reimbursement Summary"
                className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
              >
                <Eye className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setNotification('Downloading Reimbursement Voucher PDF...');
                  setTimeout(() => setNotification(null), 3000);
                }}
                title="Download Reimbursement Slip"
                className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors cursor-pointer shadow-2xs"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* 3. Form 16 (Tax Deduction Certificate) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Left Info */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">Form 16 (TDS Certificate)</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                    TRACES Digitally Signed
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 max-w-xl">
                  Certificate under Section 203 of the Income-tax Act, 1961 for tax deducted at source on salary by the employer.
                </p>
                <div className="mt-2 text-xs font-mono text-slate-700 flex items-center gap-3">
                  <span>PAN: <strong className="text-slate-900">ABCPA4820K</strong></span>
                  <span>•</span>
                  <span>TAN: <strong className="text-slate-900">BLRA12345E</strong></span>
                  <span>•</span>
                  <span>Total TDS Deposited: <strong className="text-indigo-700">₹57,600</strong></span>
                </div>
              </div>
            </div>

            {/* Right Form 16 Downloads */}
            <div className="flex items-center gap-2.5 flex-wrap shrink-0">
              <select
                value={form16AY}
                onChange={e => setForm16AY(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 text-slate-700 font-semibold focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="AY 2026-27 (FY 2025-26)">AY 2026-27 (FY 2025-26)</option>
                <option value="AY 2025-26 (FY 2024-25)">AY 2025-26 (FY 2024-25)</option>
              </select>

              <button
                onClick={() => {
                  setNotification('Downloading Form 16 Part A (Quarterly TDS summary from TRACES)...');
                  setTimeout(() => setNotification(null), 3000);
                }}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Part A
              </button>

              <button
                onClick={() => {
                  setNotification('Downloading Form 16 Part B (Salary computation & chapter VI-A deductions)...');
                  setTimeout(() => setNotification(null), 3000);
                }}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                Part B
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Printable / Viewable Official Payslip Modal */}
      {selectedPayslip && (
        <PayslipModal
          payslip={selectedPayslip}
          onClose={() => setSelectedPayslip(null)}
        />
      )}

    </div>
  );
};
