import React from 'react';
import { PayslipRecord } from '../../types';
import { X, Printer, ShieldCheck, Building2 } from 'lucide-react';

interface PayslipModalProps {
  payslip: PayslipRecord | null;
  onClose: () => void;
}

export const PayslipModal: React.FC<PayslipModalProps> = ({ payslip, onClose }) => {
  if (!payslip) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
        
        {/* Controls Header */}
        <div className="print:hidden bg-[#0F172A] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-sky-400" />
            <h3 className="font-bold text-sm tracking-wide">OFFICIAL STATUTORY PAYSLIP</h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Payslip Body */}
        <div className="p-6 sm:p-8 text-slate-900 space-y-6 print:p-0">
          
          {/* Company Masthead */}
          <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-slate-900 text-white rounded-xl">
                <Building2 className="w-6 h-6 text-sky-400" />
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight">
                  PAPPU DA COMPANY ENTERPRISE HRMS
                </h1>
                <p className="text-xs text-slate-500">
                  Registered Office: Silchar, Assam 788001 | Central Workforce & Payroll System
                </p>
              </div>
            </div>
            <div className="sm:text-right">
              <span className="inline-block px-3 py-1 bg-slate-100 border border-slate-200 rounded-md text-xs font-bold text-slate-800">
                SALARY SLIP: {payslip.month.toUpperCase()}
              </span>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">Status: DISBURSED & CREDITED</p>
            </div>
          </div>

          {/* Employee Metadata */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-y-3 gap-x-4 text-xs">
            <div>
              <p className="text-slate-500 text-[10px] uppercase font-bold">Employee Name</p>
              <p className="font-bold text-slate-900">{payslip.employeeName}</p>
            </div>
            <div>
              <p className="text-slate-500 text-[10px] uppercase font-bold">Employee Code</p>
              <p className="font-bold text-slate-900">{payslip.employeeCode}</p>
            </div>
            <div>
              <p className="text-slate-500 text-[10px] uppercase font-bold">Designation</p>
              <p className="font-medium text-slate-900">{payslip.designation}</p>
            </div>
            <div>
              <p className="text-slate-500 text-[10px] uppercase font-bold">Department</p>
              <p className="font-medium text-slate-900">{payslip.department}</p>
            </div>
            <div>
              <p className="text-slate-500 text-[10px] uppercase font-bold">Bank Account</p>
              <p className="font-medium text-slate-900">{payslip.bankName} - {payslip.bankAccount}</p>
            </div>
            <div>
              <p className="text-slate-500 text-[10px] uppercase font-bold">PAN Card</p>
              <p className="font-medium text-slate-900">{payslip.panNumber}</p>
            </div>
            <div>
              <p className="text-slate-500 text-[10px] uppercase font-bold">EPFO UAN</p>
              <p className="font-medium text-slate-900">{payslip.uanNumber}</p>
            </div>
            <div>
              <p className="text-slate-500 text-[10px] uppercase font-bold">Payable Days</p>
              <p className="font-bold text-emerald-700">{payslip.presentDays + payslip.paidLeaveDays} / {payslip.totalWorkingDays} Days</p>
            </div>
          </div>

          {/* Earnings vs Deductions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Earnings */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-[#0F172A] text-white px-4 py-2 font-bold text-xs uppercase tracking-wide flex justify-between">
                <span>Gross Monthly Earnings</span>
                <span>Amount (₹)</span>
              </div>
              <div className="p-3 text-xs divide-y divide-slate-100">
                <div className="py-1.5 flex justify-between">
                  <span className="text-slate-600">Basic Pay</span>
                  <span className="font-medium text-slate-900">₹ {payslip.earnings.basic.toLocaleString('en-IN')}</span>
                </div>
                <div className="py-1.5 flex justify-between">
                  <span className="text-slate-600">House Rent Allowance (HRA)</span>
                  <span className="font-medium text-slate-900">₹ {payslip.earnings.hra.toLocaleString('en-IN')}</span>
                </div>
                <div className="py-1.5 flex justify-between">
                  <span className="text-slate-600">Dearness Allowance (DA)</span>
                  <span className="font-medium text-slate-900">₹ {payslip.earnings.da.toLocaleString('en-IN')}</span>
                </div>
                <div className="py-1.5 flex justify-between">
                  <span className="text-slate-600">Conveyance Allowance</span>
                  <span className="font-medium text-slate-900">₹ {payslip.earnings.conveyance.toLocaleString('en-IN')}</span>
                </div>
                <div className="py-1.5 flex justify-between">
                  <span className="text-slate-600">Medical Allowance</span>
                  <span className="font-medium text-slate-900">₹ {payslip.earnings.medicalAllowance.toLocaleString('en-IN')}</span>
                </div>
                <div className="py-1.5 flex justify-between">
                  <span className="text-slate-600">Special Executive Allowance</span>
                  <span className="font-medium text-slate-900">₹ {payslip.earnings.specialAllowance.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <div className="bg-slate-100 px-4 py-2.5 border-t border-slate-200 flex justify-between items-center text-xs font-bold text-slate-900">
                <span>Total Gross Earnings</span>
                <span className="text-sky-700 text-sm">₹ {payslip.earnings.grossEarnings.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Deductions */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-700 text-white px-4 py-2 font-bold text-xs uppercase tracking-wide flex justify-between">
                <span>Statutory Deductions</span>
                <span>Amount (₹)</span>
              </div>
              <div className="p-3 text-xs divide-y divide-slate-100">
                <div className="py-1.5 flex justify-between">
                  <span className="text-slate-600">Provident Fund (EPF 12%)</span>
                  <span className="font-medium text-rose-700">₹ {payslip.deductions.epfEmployee.toLocaleString('en-IN')}</span>
                </div>
                <div className="py-1.5 flex justify-between">
                  <span className="text-slate-600">Employee State Insurance (ESIC 0.75%)</span>
                  <span className="font-medium text-rose-700">₹ {payslip.deductions.esicEmployee.toLocaleString('en-IN')}</span>
                </div>
                <div className="py-1.5 flex justify-between">
                  <span className="text-slate-600">Assam State Professional Tax</span>
                  <span className="font-medium text-rose-700">₹ {payslip.deductions.professionalTax.toLocaleString('en-IN')}</span>
                </div>
                <div className="py-1.5 flex justify-between">
                  <span className="text-slate-600">Income Tax TDS (Section 192)</span>
                  <span className="font-medium text-rose-700">₹ {payslip.deductions.tds.toLocaleString('en-IN')}</span>
                </div>
                <div className="py-1.5 flex justify-between">
                  <span className="text-slate-600">Other Deductions</span>
                  <span className="font-medium text-slate-500">₹ {payslip.deductions.otherDeductions.toLocaleString('en-IN')}</span>
                </div>
                <div className="py-1.5 flex justify-between opacity-0">
                  <span>-</span>
                  <span>-</span>
                </div>
              </div>
              <div className="bg-slate-100 px-4 py-2.5 border-t border-slate-200 flex justify-between items-center text-xs font-bold text-slate-900">
                <span>Total Deductions</span>
                <span className="text-rose-700 text-sm">₹ {payslip.deductions.totalDeductions.toLocaleString('en-IN')}</span>
              </div>
            </div>

          </div>

          {/* Employer Statutory Contributions */}
          <div className="border border-sky-100 bg-sky-50/70 rounded-xl p-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
            <div>
              <span className="font-bold text-slate-900">Employer Contributions (Statutory Benefit):</span>
              <p className="text-slate-600 text-[11px] mt-0.5">
                EPF (3.67%): ₹{payslip.employerContributions.epfEmployer} | EPS Pension (8.33%): ₹{payslip.employerContributions.epsEmployer} | Admin: ₹{payslip.employerContributions.epfAdminCharges} | ESIC: ₹{payslip.employerContributions.esicEmployer}
              </p>
            </div>
            <span className="px-2.5 py-1 bg-white border border-sky-200 rounded text-sky-800 font-bold text-[11px]">
              EPFO / ESIC Compliant
            </span>
          </div>

          {/* Net Pay Banner */}
          <div className="bg-[#0F172A] text-white rounded-xl p-5 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">NET TAKE-HOME SALARY</p>
              <h2 className="text-3xl font-black text-sky-400 tracking-tight mt-0.5">
                ₹ {payslip.netPay.toLocaleString('en-IN')}
              </h2>
            </div>
            <div className="text-right text-xs text-slate-300">
              <p>Direct Bank Deposit to: <span className="font-bold text-white">{payslip.bankName}</span></p>
              <p className="text-[11px] text-slate-400 mt-0.5">Payment Date: {payslip.paymentDate || '01-10-2026'}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-between items-end text-[11px] text-slate-500">
            <div>
              <p className="font-semibold text-slate-800">Notice:</p>
              <p>Computer generated document. Valid without physical signature.</p>
            </div>
            <div className="text-right">
              <div className="h-8 border-b border-dashed border-slate-300 w-32 mb-1"></div>
              <p className="font-bold text-slate-800">Authorized Officer</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
