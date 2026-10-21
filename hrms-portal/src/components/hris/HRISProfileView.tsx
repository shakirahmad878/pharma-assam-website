import React, { useState, useEffect } from 'react';
import { HrmsUser, EmployeeKYC } from '../../types';
import { HrmsService } from '../../services/hrmsService';
import { 
  User, 
  Building2, 
  MapPin, 
  ShieldCheck, 
  CreditCard, 
  Phone, 
  Mail, 
  Calendar, 
  Heart, 
  CheckCircle2, 
  Clock, 
  Edit3, 
  X, 
  Send, 
  AlertCircle,
  Briefcase,
  UserCheck
} from 'lucide-react';

interface HRISProfileViewProps {
  currentUser: HrmsUser;
}

export const HRISProfileView: React.FC<HRISProfileViewProps> = ({ currentUser }) => {
  const [kyc, setKyc] = useState<EmployeeKYC | null>(() => HrmsService.getKYC(currentUser.id));
  const [showEditModal, setShowEditModal] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form States
  const [panNumber, setPanNumber] = useState(kyc?.panNumber || '');
  const [aadhaarNumber, setAadhaarNumber] = useState(kyc?.aadhaarNumber || '');
  const [uanNumber, setUanNumber] = useState(kyc?.uanNumber || '');
  const [esicNumber, setEsicNumber] = useState(kyc?.esicNumber || '');
  const [bankName, setBankName] = useState(kyc?.bankName || '');
  const [accountNumber, setAccountNumber] = useState(kyc?.accountNumber || '');
  const [ifscCode, setIfscCode] = useState(kyc?.ifscCode || '');
  const [nomineeName, setNomineeName] = useState(kyc?.nomineeName || '');
  const [emergencyPhone, setEmergencyPhone] = useState(kyc?.emergencyContactPhone || '');
  const [bloodGroup, setBloodGroup] = useState(kyc?.bloodGroup || 'O +ve');

  useEffect(() => {
    const data = HrmsService.getKYC(currentUser.id);
    setKyc(data);
    if (data) {
      setPanNumber(data.panNumber);
      setAadhaarNumber(data.aadhaarNumber);
      setUanNumber(data.uanNumber);
      setEsicNumber(data.esicNumber);
      setBankName(data.bankName);
      setAccountNumber(data.accountNumber);
      setIfscCode(data.ifscCode);
      setNomineeName(data.nomineeName);
      setEmergencyPhone(data.emergencyContactPhone);
      setBloodGroup(data.bloodGroup);
    } else {
      setPanNumber('');
      setAadhaarNumber('');
      setUanNumber('');
      setEsicNumber('');
      setBankName('');
      setAccountNumber('');
      setIfscCode('');
      setNomineeName('');
      setEmergencyPhone('');
    }
  }, [currentUser.id]);

  const handleSaveKYC = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: EmployeeKYC = {
      employeeId: currentUser.id,
      panNumber: panNumber.trim().toUpperCase(),
      aadhaarNumber: aadhaarNumber.trim(),
      uanNumber: uanNumber.trim(),
      esicNumber: esicNumber.trim(),
      bankName: bankName.trim(),
      accountNumber: accountNumber.trim(),
      ifscCode: ifscCode.trim().toUpperCase(),
      accountType: 'SALARY',
      nomineeName: nomineeName.trim() || 'Primary Nominee',
      nomineeRelation: 'Family Member',
      emergencyContactName: 'Family Contact',
      emergencyContactPhone: emergencyPhone.trim() || currentUser.phone,
      bloodGroup,
      permanentAddress: currentUser.locationHierarchy,
      status: 'UNDER_REVIEW',
      updatedAt: new Date().toISOString(),
    };

    HrmsService.saveKYC(updated);
    setKyc(updated);
    setShowEditModal(false);
    setSuccessToast('KYC & Banking details submitted for HR review!');
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const getStatusBadge = () => {
    if (!kyc || !kyc.panNumber) {
      return (
        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          Pending Submission
        </span>
      );
    }
    if (kyc.status === 'VERIFIED') {
      return (
        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          HR Verified
        </span>
      );
    }
    return (
      <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 flex items-center gap-1.5">
        <Clock className="w-3.5 h-3.5 text-amber-600" />
        Submitted (Pending HR Review)
      </span>
    );
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

      {/* 1. Profile Hero Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-18 h-18 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-md border-4 border-white shrink-0">
              {currentUser.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">{currentUser.name}</h1>
                <span className="text-xs bg-slate-100 text-slate-800 font-bold px-2.5 py-0.5 rounded-full border border-slate-200 font-mono">
                  {currentUser.employeeCode}
                </span>
                <span className="text-xs bg-sky-50 text-sky-700 font-bold px-2.5 py-0.5 rounded-full border border-sky-100">
                  {currentUser.grade}
                </span>
                <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2.5 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Active Employee
                </span>
              </div>

              <p className="text-xs text-slate-500 font-medium mt-1">{currentUser.designation} • {currentUser.department}</p>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{currentUser.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{currentUser.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Joined {currentUser.joiningDate}</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowEditModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs self-start"
          >
            <Edit3 className="w-3.5 h-3.5 text-sky-600" />
            Update KYC & Bank Info
          </button>
        </div>
      </div>

      {/* 2. Employment & Reporting Hierarchy */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-sky-600" />
            Employment & Organizational Hierarchy
          </h2>
          <span className="text-xs font-bold text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-sky-600" />
            Reporting Direct: {currentUser.l1Manager.name}
          </span>
        </div>

        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Designation / Role</span>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block">
              {currentUser.designation}
            </span>
            <span className="text-[10px] text-slate-500 mt-1 inline-block">
              {currentUser.grade}
            </span>
          </div>

          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Employee ID</span>
            <span className="font-mono font-bold text-slate-900 text-sm mt-0.5 block">
              {currentUser.employeeCode}
            </span>
            <span className="text-[10px] text-slate-500 mt-1 inline-block">
              Internal Enterprise ID
            </span>
          </div>

          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Mobile Number</span>
            <span className="font-mono font-bold text-slate-900 text-sm mt-0.5 block">
              {currentUser.phone}
            </span>
            <span className="text-[10px] text-slate-500 mt-1 inline-block">
              Official Registered Contact
            </span>
          </div>

          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Reporting Manager</span>
            <span className="font-bold text-sky-700 text-sm mt-0.5 block flex items-center gap-1.5">
              <span>{currentUser.l1Manager.name}</span>
            </span>
            <span className="text-[10px] text-slate-500 mt-1 inline-block">
              L1 Approver & Direct Line
            </span>
          </div>
        </div>

        <div className="px-5 pb-5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 border-t border-slate-100 pt-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-semibold text-slate-500">Department:</span>
            <span className="truncate text-slate-800 font-medium">{currentUser.department}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-semibold text-slate-500">Location:</span>
            <span className="truncate text-slate-800 font-medium">{currentUser.locationHierarchy}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-semibold text-slate-500">Work Mode:</span>
            <span className="text-slate-800 font-medium">
              {currentUser.workMode === 'OFFICE_STAFF' ? 'Corporate Office Staff' : 'Field Sales Executive'}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Statutory KYC & Government Identifiers */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-600" />
            Statutory KYC & Government Identifiers
          </h2>
          {getStatusBadge()}
        </div>

        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Permanent Account Number (PAN)</span>
            <span className={`font-mono font-bold text-sm mt-0.5 block ${kyc?.panNumber ? 'text-slate-900' : 'text-slate-400 italic'}`}>
              {kyc?.panNumber || 'Not Provided'}
            </span>
            <span className="text-[10px] text-slate-400 mt-1 inline-block">
              {kyc?.panNumber ? 'Employee Submitted' : 'Required for Form 16 / TDS'}
            </span>
          </div>

          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Aadhaar Number (UIDAI)</span>
            <span className={`font-mono font-bold text-sm mt-0.5 block ${kyc?.aadhaarNumber ? 'text-slate-900' : 'text-slate-400 italic'}`}>
              {kyc?.aadhaarNumber ? `•••• •••• ${kyc.aadhaarNumber.slice(-4)}` : 'Not Provided'}
            </span>
            <span className="text-[10px] text-slate-400 mt-1 inline-block">
              {kyc?.aadhaarNumber ? 'Last 4 Digits Displayed' : 'Identity Verification'}
            </span>
          </div>

          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">EPFO Universal Account Number (UAN)</span>
            <span className={`font-mono font-bold text-sm mt-0.5 block ${kyc?.uanNumber ? 'text-slate-900' : 'text-slate-400 italic'}`}>
              {kyc?.uanNumber || 'Not Provided'}
            </span>
            <span className="text-[10px] text-slate-400 mt-1 inline-block">
              {kyc?.uanNumber ? 'PF Portal Linked' : 'Provident Fund Passbook'}
            </span>
          </div>

          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">ESIC IP Insurance Number</span>
            <span className={`font-mono font-bold text-sm mt-0.5 block ${kyc?.esicNumber ? 'text-slate-900' : 'text-slate-400 italic'}`}>
              {kyc?.esicNumber || 'Not Provided'}
            </span>
            <span className="text-[10px] text-slate-400 mt-1 inline-block">
              {kyc?.esicNumber ? 'ESIC Card Registered' : 'Social Security Scheme'}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Banking & Emergency Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Direct Credit Bank Account */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-sky-600" />
              Salary Disbursement Bank Account
            </h2>
            <span className={`text-[11px] font-bold ${kyc?.accountNumber ? 'text-emerald-700' : 'text-slate-400'}`}>
              {kyc?.accountNumber ? 'Linked' : 'Not Linked'}
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Bank Name</span>
              <span className={`font-bold ${kyc?.bankName ? 'text-slate-800' : 'text-slate-400 italic'}`}>
                {kyc?.bankName || 'Not Linked'}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Account Number</span>
              <span className={`font-mono font-bold ${kyc?.accountNumber ? 'text-slate-800' : 'text-slate-400 italic'}`}>
                {kyc?.accountNumber ? `••••${kyc.accountNumber.slice(-4)}` : 'Not Linked'}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">IFSC Code</span>
              <span className={`font-mono font-bold ${kyc?.ifscCode ? 'text-slate-800' : 'text-slate-400 italic'}`}>
                {kyc?.ifscCode || 'Not Linked'}
              </span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500 font-medium">Account Type</span>
              <span className="font-bold text-slate-800">Direct Salary NEFT</span>
            </div>
          </div>
        </div>

        {/* Emergency Contacts & Nominee */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500" />
            Emergency Contacts & Nominee Info
          </h2>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Blood Group</span>
              <span className="font-bold text-rose-700 font-mono">{bloodGroup}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Emergency Phone</span>
              <span className={`font-mono font-bold ${emergencyPhone ? 'text-slate-800' : 'text-slate-400 italic'}`}>
                {emergencyPhone || currentUser.phone}
              </span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500 font-medium">Statutory Nominee Name</span>
              <span className={`font-bold ${nomineeName ? 'text-slate-800' : 'text-slate-400 italic'}`}>
                {nomineeName || 'Not Registered'}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* MODAL: Update / Submit Real KYC */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-scale-up my-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-sky-600" />
                <h3 className="font-bold text-slate-900 text-sm">Update Real KYC & Bank Details</h3>
              </div>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveKYC} className="mt-4 space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">PAN Card Number</label>
                  <input
                    type="text"
                    maxLength={10}
                    value={panNumber}
                    onChange={e => setPanNumber(e.target.value.toUpperCase())}
                    placeholder="e.g. ABCDE1234F"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono font-bold focus:outline-none focus:border-sky-500 uppercase"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Aadhaar (12 Digits)</label>
                  <input
                    type="text"
                    maxLength={12}
                    value={aadhaarNumber}
                    onChange={e => setAadhaarNumber(e.target.value)}
                    placeholder="e.g. 123456789012"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">EPFO UAN (Optional)</label>
                  <input
                    type="text"
                    value={uanNumber}
                    onChange={e => setUanNumber(e.target.value)}
                    placeholder="e.g. 101284920194"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ESIC IP Number (Optional)</label>
                  <input
                    type="text"
                    value={esicNumber}
                    onChange={e => setEsicNumber(e.target.value)}
                    placeholder="e.g. 5200918239"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="font-bold text-slate-800 text-[11px] block mb-2">Direct Salary Bank Account:</span>
                <div className="space-y-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Bank Name</label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={e => setBankName(e.target.value)}
                      placeholder="e.g. State Bank of India / HDFC Bank"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Account Number</label>
                      <input
                        type="text"
                        value={accountNumber}
                        onChange={e => setAccountNumber(e.target.value)}
                        placeholder="e.g. 912010048129"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">IFSC Code</label>
                      <input
                        type="text"
                        value={ifscCode}
                        onChange={e => setIfscCode(e.target.value.toUpperCase())}
                        placeholder="e.g. SBIN0001234"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono uppercase focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nominee Name</label>
                  <input
                    type="text"
                    value={nomineeName}
                    onChange={e => setNomineeName(e.target.value)}
                    placeholder="e.g. Next of Kin"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Emergency Phone</label>
                  <input
                    type="tel"
                    value={emergencyPhone}
                    onChange={e => setEmergencyPhone(e.target.value)}
                    placeholder="+91 98765 00000"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 font-bold flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Save KYC Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
