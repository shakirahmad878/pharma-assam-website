import React, { useState } from 'react';
import { HrmsUser, ReimbursementClaim, ClaimItem } from '../../types';
import { HrmsService } from '../../services/hrmsService';
import { 
  Receipt, 
  Plus, 
  Trash2, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  X, 
  Send, 
  Building2, 
  MapPin, 
  CreditCard,
  UploadCloud,
  DollarSign
} from 'lucide-react';

interface ReimbursementViewProps {
  currentUser: HrmsUser;
}

export const ReimbursementView: React.FC<ReimbursementViewProps> = ({ currentUser }) => {
  const [claims, setClaims] = useState<ReimbursementClaim[]>(() => HrmsService.getReimbursementClaims());
  const [isEmpInfoExpanded, setIsEmpInfoExpanded] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form State for new Claim Item
  const [expenseHead, setExpenseHead] = useState('Travel - Intercity Flight/Train');
  const [billNumber, setBillNumber] = useState('');
  const [billDate, setBillDate] = useState(new Date().toISOString().split('T')[0]);
  const [billPeriod, setBillPeriod] = useState('October 2026');
  const [claimAmount, setClaimAmount] = useState<number>(1500);

  const activeClaim = claims[0]; // Active or latest claim dossier

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!billNumber || claimAmount <= 0) return;

    const newItem: ClaimItem = {
      id: `item-${Date.now()}`,
      expenseHead,
      billNumber,
      billPeriod,
      eligibleAmount: claimAmount,
      claimAmount,
      billDate,
      receiptUrl: 'https://images.unsplash.com/photo-1554415707-9e49fa402e37?w=150',
    };

    if (activeClaim) {
      const updatedItems = [newItem, ...activeClaim.items];
      const updatedTotal = updatedItems.reduce((acc, curr) => acc + curr.claimAmount, 0);
      const updatedClaims = claims.map((c, i) => i === 0 ? {
        ...c,
        items: updatedItems,
        totalClaimAmount: updatedTotal,
        totalEligibleAmount: updatedTotal,
      } : c);
      setClaims(updatedClaims);
    } else {
      HrmsService.submitReimbursementClaim({
        employeeId: currentUser.id,
        employeeName: currentUser.name,
        employeeCode: currentUser.employeeCode,
        costCenter: currentUser.costCenter,
        expenseCategory: 'Official Business Travel & Per Diem',
        totalClaimAmount: claimAmount,
        totalEligibleAmount: claimAmount,
        items: [newItem],
      });
      setClaims(HrmsService.getReimbursementClaims());
    }

    setShowAddModal(false);
    setBillNumber('');
    setClaimAmount(1500);
    setSuccessToast(`Claim item for ${expenseHead} added successfully!`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleDeleteItem = (itemId: string) => {
    if (!activeClaim) return;
    const updatedItems = activeClaim.items.filter(i => i.id !== itemId);
    const updatedTotal = updatedItems.reduce((acc, curr) => acc + curr.claimAmount, 0);
    const updatedClaims = claims.map((c, i) => i === 0 ? {
      ...c,
      items: updatedItems,
      totalClaimAmount: updatedTotal,
      totalEligibleAmount: updatedTotal,
    } : c);
    setClaims(updatedClaims);
  };

  const handleSubmitClaim = () => {
    setSuccessToast(`Claim ${activeClaim?.claimNumber || 'CLM-2026-8901'} submitted to L1 Manager for approval.`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {successToast && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center justify-between text-xs font-semibold shadow-2xs animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast(null)} className="text-emerald-500 hover:text-emerald-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-600" />
            Reimbursements & Claims
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Submit expense receipts, travel vouchers, and per-diem allowances for manager approval
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#DCFCE7] text-[#166534] hover:bg-[#BBF7D0] transition-all cursor-pointer shadow-2xs hover:scale-102"
          >
            <Plus className="w-4 h-4" />
            ADD EXPENSE LINE
          </button>
          <button
            onClick={handleSubmitClaim}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-sky-600 text-white hover:bg-sky-700 transition-all cursor-pointer shadow-2xs hover:scale-102"
          >
            <Send className="w-3.5 h-3.5" />
            Submit Claim
          </button>
        </div>
      </div>

      {/* 1. Collapsible Employee & Accounting Information (Darwinbox Screen 4) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <button
          onClick={() => setIsEmpInfoExpanded(!isEmpInfoExpanded)}
          className="w-full px-5 py-3.5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between text-left hover:bg-slate-100/80 transition-colors cursor-pointer"
        >
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            Employee & Accounting Information
            <span className="text-[10px] text-slate-400 font-normal">({currentUser.name} - {currentUser.employeeCode})</span>
          </span>
          {isEmpInfoExpanded ? (
            <ChevronUp className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          )}
        </button>

        {isEmpInfoExpanded && (
          <div className="p-5 text-xs divide-y divide-slate-100">
            {/* Upper Employee Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4">
              <div>
                <span className="text-slate-400 font-semibold block text-[11px]">Employee Name & Code</span>
                <span className="font-bold text-slate-800 text-xs">{currentUser.name} ({currentUser.employeeCode})</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block text-[11px]">Grade & Designation</span>
                <span className="font-bold text-slate-800 text-xs">{currentUser.grade} • {currentUser.designation}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block text-[11px]">Cost Center</span>
                <span className="font-bold text-sky-700 text-xs font-mono">{currentUser.costCenter}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block text-[11px]">L1 Reporting Manager</span>
                <span className="font-medium text-slate-800 text-xs">{currentUser.l1Manager.name} ({currentUser.l1Manager.code})</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block text-[11px]">L2 Reviewing Manager</span>
                <span className="font-medium text-slate-800 text-xs">{currentUser.l2Manager.name} ({currentUser.l2Manager.code})</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block text-[11px]">HR Business Partner</span>
                <span className="font-medium text-slate-800 text-xs">{currentUser.hrbp.name} ({currentUser.hrbp.code})</span>
              </div>
            </div>

            {/* Accounting / Direct Bank Disbursement Info */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 text-xs">
              <div>
                <span className="text-slate-400 font-semibold block text-[11px]">Direct Credit Bank</span>
                <span className="font-bold text-slate-800">
                  {HrmsService.getKYC(currentUser.id)?.bankName || 'Not Linked'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block text-[11px]">Account Number</span>
                <span className="font-mono text-slate-700 font-bold">
                  {HrmsService.getKYC(currentUser.id)?.accountNumber 
                    ? `••••${HrmsService.getKYC(currentUser.id)!.accountNumber.slice(-4)}` 
                    : 'Not Linked'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block text-[11px]">IFSC Code</span>
                <span className="font-mono text-slate-700 font-bold">
                  {HrmsService.getKYC(currentUser.id)?.ifscCode || 'Not Linked'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block text-[11px]">PAN Status</span>
                <span className="font-mono text-slate-700 font-bold">
                  {HrmsService.getKYC(currentUser.id)?.panNumber || 'Not Linked'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Claim Detail Summary Cards & Ledger (Darwinbox Screen 4 Replica) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Claim Dossier Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">Claim Detail Summary</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                {activeClaim?.status || 'DRAFT'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-mono">
              Claim ID: {activeClaim?.claimNumber || 'CLM-2026-8901'} • Category: {activeClaim?.expenseCategory || 'Official Business Travel & Per Diem'}
            </p>
          </div>

          <div className="flex items-center gap-4 text-right">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Claim Amount</span>
              <span className="text-lg font-black text-slate-900">₹{(activeClaim?.totalClaimAmount || 0).toLocaleString('en-IN')}</span>
            </div>
            <div className="border-l border-slate-200 pl-4">
              <span className="text-[10px] uppercase font-bold text-emerald-600 block">Approved / Eligible</span>
              <span className="text-lg font-black text-emerald-700">₹{(activeClaim?.totalEligibleAmount || 0).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Claim Line Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold text-[10px] uppercase tracking-wider">
                <th className="py-3 px-5">EXPENSE HEAD</th>
                <th className="py-3 px-4">BILL NUMBER</th>
                <th className="py-3 px-4">BILL PERIOD</th>
                <th className="py-3 px-4">BILL DATE</th>
                <th className="py-3 px-4 text-right">ELIGIBLE AMOUNT</th>
                <th className="py-3 px-4 text-right">CLAIM AMOUNT</th>
                <th className="py-3 px-4 text-center">RECEIPT</th>
                <th className="py-3 px-5 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(!activeClaim || activeClaim.items.length === 0) ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No expense line items added. Click "+ ADD EXPENSE LINE" to attach receipts.
                  </td>
                </tr>
              ) : (
                activeClaim.items.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-5 font-bold text-slate-900">{item.expenseHead}</td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-700">{item.billNumber}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">{item.billPeriod}</td>
                    <td className="py-3.5 px-4 text-slate-600">{item.billDate}</td>
                    <td className="py-3.5 px-4 text-right font-semibold text-slate-700">₹{item.eligibleAmount.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-900">₹{item.claimAmount.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-600 hover:text-sky-800 cursor-pointer">
                        <FileText className="w-3.5 h-3.5" />
                        View
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1 rounded text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete Line Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* MODAL: Add Expense Line */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-scale-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">Add Expense Line Item</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Expense Head</label>
                <select
                  value={expenseHead}
                  onChange={e => setExpenseHead(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Travel - Intercity Flight/Train">Travel - Intercity Flight/Train</option>
                  <option value="Local Conveyance - Cab/Fuel">Local Conveyance - Cab/Fuel</option>
                  <option value="Client Hospitality & Meals">Client Hospitality & Meals</option>
                  <option value="Mobile & Internet Allowance">Mobile & Internet Allowance</option>
                  <option value="Hotel Lodging & Accommodation">Hotel Lodging & Accommodation</option>
                  <option value="Stationery & Courier Expenses">Stationery & Courier Expenses</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bill / Invoice Number</label>
                  <input
                    type="text"
                    value={billNumber}
                    onChange={e => setBillNumber(e.target.value)}
                    placeholder="e.g. INV-9042"
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bill Date</label>
                  <input
                    type="date"
                    value={billDate}
                    onChange={e => setBillDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bill Period</label>
                  <input
                    type="text"
                    value={billPeriod}
                    onChange={e => setBillPeriod(e.target.value)}
                    placeholder="e.g. October 2026"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Claim Amount (₹)</label>
                  <input
                    type="number"
                    min="1"
                    value={claimAmount}
                    onChange={e => setClaimAmount(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Upload Receipt (PDF / JPEG)</label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-emerald-400 transition-colors cursor-pointer bg-slate-50/50">
                  <UploadCloud className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <span className="text-[11px] text-slate-600 font-semibold block">Click to upload bill voucher</span>
                  <span className="text-[10px] text-slate-400">Max size: 5MB</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Add Line Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
