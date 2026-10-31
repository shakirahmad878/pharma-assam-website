import React, { useState, useRef } from 'react';
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
  DollarSign,
  Camera,
  Check,
  Ban,
  Clock,
  Sparkles,
  ExternalLink,
  Users,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface ReimbursementViewProps {
  currentUser: HrmsUser;
}

type ViewTab = 'MY_CLAIMS' | 'TEAM_APPROVALS';

export const ReimbursementView: React.FC<ReimbursementViewProps> = ({ currentUser }) => {
  const [claims, setClaims] = useState<ReimbursementClaim[]>(() => HrmsService.getReimbursementClaims());
  const [isEmpInfoExpanded, setIsEmpInfoExpanded] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Tab State
  const [activeTab, setActiveTab] = useState<ViewTab>('MY_CLAIMS');

  // Selected Claim ID within the active tab
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);

  // Form State for new Claim Item
  const [expenseHead, setExpenseHead] = useState('Travel - Intercity Flight/Train');
  const [billNumber, setBillNumber] = useState('');
  const [billDate, setBillDate] = useState(new Date().toISOString().split('T')[0]);
  const [billPeriod, setBillPeriod] = useState('October 2026');
  const [claimAmount, setClaimAmount] = useState<number>(1500);

  // Receipt Upload & Preview
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [receiptFileName, setReceiptFileName] = useState<string>('');
  const [selectedReceiptView, setSelectedReceiptView] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Role Checks
  const isApprover = 
    currentUser.role === 'HR_SUPER_ADMIN' || 
    currentUser.role === 'HR_MANAGER' || 
    currentUser.employeeCode === 'NLCL-0001' || // Samsuj Sadiol (Director)
    currentUser.employeeCode === 'NLCL-0002' || // Shakir Ahmad (HR Manager)
    currentUser.employeeCode === 'NLCL-0003';   // Bodrud Jaman (RSM)

  // 1. My Personal Claims (Strictly filtered by current user)
  const myClaims = claims.filter(
    c => c.employeeCode === currentUser.employeeCode || c.employeeId === currentUser.id
  );

  // 2. Team Claims for Approvers
  const teamClaims = claims.filter(c => {
    if (currentUser.employeeCode === 'NLCL-0003') {
      // Bodrud (RSM) reviews field reps (Pranjal NLCL-0004, Satyam NLCL-0005)
      return c.employeeCode === 'NLCL-0004' || c.employeeCode === 'NLCL-0005';
    }
    if (currentUser.role === 'HR_SUPER_ADMIN' || currentUser.employeeCode === 'NLCL-0001' || currentUser.employeeCode === 'NLCL-0002') {
      // Director & HR Super Admin can review all team submissions
      return c.employeeCode !== currentUser.employeeCode;
    }
    return false;
  });

  const pendingApprovalsCount = teamClaims.filter(c => c.status === 'SUBMITTED').length;

  // Active claims array depending on current tab
  const currentClaimsList = activeTab === 'MY_CLAIMS' ? myClaims : teamClaims;

  // Active Claim Dossier
  const activeClaim = currentClaimsList.find(c => c.id === selectedClaimId) || currentClaimsList[0] || null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setReceiptPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
      receiptUrl: receiptPreview || 'https://images.unsplash.com/photo-1554415707-9e49fa402e37?w=600',
    };

    // If currentUser already has a draft/submitted claim in "My Claims", add item to it
    if (activeTab === 'MY_CLAIMS' && activeClaim && activeClaim.employeeCode === currentUser.employeeCode && activeClaim.status !== 'APPROVED') {
      const updatedItems = [newItem, ...activeClaim.items];
      const updatedTotal = updatedItems.reduce((acc, curr) => acc + curr.claimAmount, 0);
      const updatedClaims = claims.map(c => c.id === activeClaim.id ? {
        ...c,
        items: updatedItems,
        totalClaimAmount: updatedTotal,
        totalEligibleAmount: updatedTotal,
      } : c);
      setClaims(updatedClaims);
      // Persist in localStorage
      localStorage.setItem('pdc_hrms_reimbursements_v2', JSON.stringify(updatedClaims));
    } else {
      // Create a brand new claim for currentUser
      const newClaim = HrmsService.submitReimbursementClaim({
        employeeId: currentUser.id,
        employeeName: currentUser.name,
        employeeCode: currentUser.employeeCode,
        costCenter: currentUser.costCenter,
        expenseCategory: 'Official Business Travel & Per Diem',
        totalClaimAmount: claimAmount,
        totalEligibleAmount: claimAmount,
        items: [newItem],
      });
      const freshList = HrmsService.getReimbursementClaims();
      setClaims(freshList);
      setSelectedClaimId(newClaim.id);
    }

    setShowAddModal(false);
    setBillNumber('');
    setClaimAmount(1500);
    setReceiptPreview(null);
    setReceiptFileName('');
    setSuccessToast(`Claim item for ${expenseHead} added with receipt voucher!`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleApproveClaim = (claimId: string) => {
    const updated = HrmsService.updateClaimStatus(claimId, 'APPROVED', currentUser.name);
    setClaims(updated);
    setSuccessToast(`Claim approved successfully by ${currentUser.name}! Direct account credit queued.`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleRejectClaim = (claimId: string) => {
    const updated = HrmsService.updateClaimStatus(claimId, 'REJECTED', currentUser.name);
    setClaims(updated);
    setSuccessToast(`Claim status updated to REJECTED.`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleDeleteItem = (itemId: string) => {
    if (!activeClaim) return;
    const updatedItems = activeClaim.items.filter(i => i.id !== itemId);
    const updatedTotal = updatedItems.reduce((acc, curr) => acc + curr.claimAmount, 0);
    const updatedClaims = claims.map(c => c.id === activeClaim.id ? {
      ...c,
      items: updatedItems,
      totalClaimAmount: updatedTotal,
      totalEligibleAmount: updatedTotal,
    } : c);
    setClaims(updatedClaims);
    localStorage.setItem('pdc_hrms_reimbursements_v2', JSON.stringify(updatedClaims));
  };

  const handleSubmitClaim = () => {
    if (!activeClaim) return;
    setSuccessToast(`Claim ${activeClaim.claimNumber} submitted to L1 Manager for approval.`);
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
          {activeClaim && activeClaim.employeeCode === currentUser.employeeCode && (
            <button
              onClick={handleSubmitClaim}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-sky-600 text-white hover:bg-sky-700 transition-all cursor-pointer shadow-2xs hover:scale-102"
            >
              <Send className="w-3.5 h-3.5" />
              Submit Claim
            </button>
          )}
        </div>
      </div>

      {/* Approver / Manager Dual Tabs */}
      {isApprover && (
        <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
          <button
            type="button"
            onClick={() => {
              setActiveTab('MY_CLAIMS');
              setSelectedClaimId(null);
            }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'MY_CLAIMS'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>My Expense Claims ({myClaims.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('TEAM_APPROVALS');
              setSelectedClaimId(null);
            }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'TEAM_APPROVALS'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Team Approvals Queue</span>
            {pendingApprovalsCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                {pendingApprovalsCount}
              </span>
            )}
          </button>
        </div>
      )}

      {/* 1. Collapsible Employee & Accounting Information */}
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

      {/* Multiple Claim Selector Bar if user has more than 1 claim in this tab */}
      {currentClaimsList.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
            Select Dossier:
          </span>
          {currentClaimsList.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedClaimId(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                activeClaim?.id === c.id
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{c.claimNumber}</span>
              <span className="ml-1.5 text-[10px] opacity-75 font-mono">₹{c.totalClaimAmount.toLocaleString('en-IN')}</span>
              {activeTab === 'TEAM_APPROVALS' && (
                <span className="ml-1.5 text-[10px] text-sky-300 font-sans">({c.employeeName})</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* 2. Claim Detail Summary Cards & Ledger */}
      {!activeClaim ? (
        // Clean Empty State when user has no claims
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <Receipt className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            {activeTab === 'MY_CLAIMS' 
              ? `No Reimbursement Claims for ${currentUser.name}`
              : 'No Subordinate Claims in Approval Queue'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            {activeTab === 'MY_CLAIMS'
              ? `You currently have no submitted or pending reimbursement claims. Click "+ ADD EXPENSE LINE" to attach receipts and create your claim.`
              : 'All reimbursement claims submitted by your field representatives have been actioned.'}
          </p>
          {activeTab === 'MY_CLAIMS' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-sky-600 text-white hover:bg-sky-700 transition-all cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Create Expense Claim
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          
          {/* Claim Dossier Header */}
          <div className="px-5 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900 tracking-tight">Claim Detail Summary</h2>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  activeClaim.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                  activeClaim.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {activeClaim.status}
                </span>
                {activeClaim.approverComments && (
                  <span className="text-[11px] text-slate-500 italic hidden sm:inline">
                    ({activeClaim.approverComments})
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5 font-mono">
                Claim ID: {activeClaim.claimNumber} • Category: {activeClaim.expenseCategory}
                {activeTab === 'TEAM_APPROVALS' && (
                  <span className="ml-2 font-sans font-bold text-sky-700">
                    • Submitter: {activeClaim.employeeName} ({activeClaim.employeeCode})
                  </span>
                )}
              </p>
            </div>

            <div className="flex items-center gap-4 text-right">
              {/* Approver Action Buttons (Only in Approval Queue) */}
              {isApprover && activeTab === 'TEAM_APPROVALS' && activeClaim.status === 'SUBMITTED' && (
                <div className="flex items-center gap-2 mr-2">
                  <button
                    onClick={() => handleApproveClaim(activeClaim.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 cursor-pointer shadow-2xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Approve Claim
                  </button>
                  <button
                    onClick={() => handleRejectClaim(activeClaim.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 flex items-center gap-1 cursor-pointer"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    Reject
                  </button>
                </div>
              )}

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Claim Amount</span>
                <span className="text-lg font-black text-slate-900">₹{activeClaim.totalClaimAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="border-l border-slate-200 pl-4">
                <span className="text-[10px] uppercase font-bold text-emerald-600 block">Approved / Eligible</span>
                <span className="text-lg font-black text-emerald-700">₹{activeClaim.totalEligibleAmount.toLocaleString('en-IN')}</span>
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
                  {activeTab === 'MY_CLAIMS' && (
                    <th className="py-3 px-5 text-right">ACTION</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeClaim.items.length === 0 ? (
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
                        <button
                          onClick={() => setSelectedReceiptView(item.receiptUrl || 'https://images.unsplash.com/photo-1554415707-9e49fa402e37?w=600')}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-600 hover:text-sky-800 cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          View
                        </button>
                      </td>
                      {activeTab === 'MY_CLAIMS' && (
                        <td className="py-3.5 px-5 text-right">
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Delete Line Item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

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
                <label className="block font-bold text-slate-700 mb-1">Upload Receipt (Photo / Voucher Image / PDF)</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*,application/pdf"
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-emerald-500 hover:bg-emerald-50/30 transition-all cursor-pointer bg-slate-50/50"
                >
                  {receiptPreview ? (
                    <div className="flex items-center justify-center gap-3">
                      <img src={receiptPreview} alt="Receipt preview" className="w-12 h-12 object-cover rounded-lg border border-slate-200 shadow-2xs" />
                      <div className="text-left">
                        <span className="text-xs font-bold text-emerald-700 block">✓ {receiptFileName || 'Receipt Attached'}</span>
                        <span className="text-[10px] text-slate-500">Click to change photo</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-center gap-2 mb-1 text-slate-500">
                        <UploadCloud className="w-5 h-5 text-emerald-600" />
                        <Camera className="w-4 h-4 text-slate-400" />
                      </div>
                      <span className="text-[11px] text-slate-700 font-bold block">Take Photo or Choose File</span>
                      <span className="text-[10px] text-slate-400">JPEG, PNG, or PDF up to 5MB</span>
                    </>
                  )}
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

      {/* MODAL: View Receipt Photo */}
      {selectedReceiptView && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Receipt className="w-4 h-4 text-emerald-600" />
                Attached Receipt Voucher
              </h3>
              <button onClick={() => setSelectedReceiptView(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="my-4 max-h-[70vh] overflow-auto rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center p-2">
              <img src={selectedReceiptView} alt="Attached bill receipt" className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-xs" />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setSelectedReceiptView(null)}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
