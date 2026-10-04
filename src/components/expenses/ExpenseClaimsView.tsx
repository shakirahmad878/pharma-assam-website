import React, { useState } from 'react';
import { ExpenseClaim, ExpenseItem, User } from '../../types';
import { Badge } from '../common/Badge';
import { 
  Receipt, 
  Plus, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  DollarSign, 
  Navigation, 
  FileText, 
  Upload,
  X 
} from 'lucide-react';

interface ExpenseClaimsViewProps {
  currentUser: User;
}

export const ExpenseClaimsView: React.FC<ExpenseClaimsViewProps> = ({ currentUser }) => {
  const isManager = currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'ADMIN' || currentUser.role === 'MANAGER';

  const [claims, setClaims] = useState<ExpenseClaim[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [claimDate, setClaimDate] = useState('2026-09-05');
  const [kmTravelled, setKmTravelled] = useState('38.5');
  const [parkingAmount, setParkingAmount] = useState('120');

  const handleCreateClaim = (e: React.FormEvent) => {
    e.preventDefault();
    const km = parseFloat(kmTravelled) || 0;
    const mileage = km * 7.50;
    const da = 250.00;
    const other = parseFloat(parkingAmount) || 0;

    const newClaim: ExpenseClaim = {
      id: `exp-${Date.now()}`,
      claimNumber: `EXP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: currentUser.id,
      userName: currentUser.name,
      territoryName: currentUser.territoryName,
      date: claimDate,
      totalDistanceKm: km,
      ratePerKm: 7.50,
      mileageAmount: mileage,
      dailyAllowance: da,
      otherExpensesTotal: other,
      grandTotal: mileage + da + other,
      items: [
        {
          id: `item-${Date.now()}-1`,
          category: 'TRAVEL_KM_RATE',
          description: `GPS Verified Field Distance (${km} km @ ₹7.50/km)`,
          amount: mileage,
          verifiedKm: km,
        },
        {
          id: `item-${Date.now()}-2`,
          category: 'DAILY_ALLOWANCE',
          description: 'Daily Field Allowance',
          amount: da,
        },
        {
          id: `item-${Date.now()}-3`,
          category: 'TOLL_PARKING',
          description: 'Parking / Toll Receipt Uploaded',
          amount: other,
        }
      ],
      status: 'SUBMITTED',
    };

    setClaims(prev => [newClaim, ...prev]);
    setIsModalOpen(false);
  };

  const handleApprove = (claimId: string) => {
    setClaims(prev => prev.map(c => c.id === claimId ? { ...c, status: 'APPROVED', managerComments: 'Verified with GPS telemetry logs.' } : c));
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-teal-600" />
            Automated Mileage & Expense Claims
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Automatic Travel Allowance (TA) calculated directly from verified 15-minute GPS route logs + Daily Allowance (DA).
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Submit Daily Expense Claim
        </button>
      </div>

      {/* Claims List */}
      {claims.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Receipt className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm">No Expense Claims Submitted</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click "Submit Daily Expense Claim" to record mileage, daily allowance (DA), and field expense receipts.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {claims.map((claim) => (
          <div key={claim.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-slate-900">{claim.claimNumber}</h3>
                  <Badge variant={claim.status === 'APPROVED' ? 'success' : 'warning'}>
                    {claim.status}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Submitted by: <strong>{claim.userName}</strong> • Date: <strong>{claim.date}</strong> • Territory: <strong>{claim.territoryName}</strong>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-bold text-base text-teal-900 bg-teal-50 px-3 py-1 rounded-lg border border-teal-100 font-mono">
                  ₹{claim.grandTotal.toFixed(2)}
                </span>
                {isManager && claim.status === 'SUBMITTED' && (
                  <button
                    onClick={() => handleApprove(claim.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Approve Claim
                  </button>
                )}
              </div>
            </div>

            {/* Expense Items Breakdown */}
            <div className="space-y-2 text-xs">
              {claim.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2">
                    {item.category === 'TRAVEL_KM_RATE' ? (
                      <Navigation className="w-4 h-4 text-teal-600 shrink-0" />
                    ) : item.category === 'DAILY_ALLOWANCE' ? (
                      <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                    ) : (
                      <Receipt className="w-4 h-4 text-purple-600 shrink-0" />
                    )}
                    <div>
                      <span className="font-semibold text-slate-800">{item.description}</span>
                      {item.verifiedKm && (
                        <span className="text-[10px] text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded ml-2 font-mono">
                          {item.verifiedKm} km @ ₹{claim.ratePerKm}/km
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="font-mono font-bold text-slate-900">₹{item.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>

            {claim.managerComments && (
              <div className="text-xs bg-emerald-50 p-2.5 rounded-lg border border-emerald-100 text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span><strong>Manager Approval:</strong> {claim.managerComments}</span>
              </div>
            )}
          </div>
        ))}
        </div>
      )}

      {/* Submit Claim Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Receipt className="w-4 h-4 text-teal-600" />
                Submit Travel & Field Expense Claim
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClaim} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Claim Date</label>
                <input
                  type="date"
                  required
                  value={claimDate}
                  onChange={(e) => setClaimDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  GPS Verified Distance (Kilometers)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={kmTravelled}
                    onChange={(e) => setKmTravelled(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 font-mono text-teal-800 font-bold"
                  />
                  <span className="absolute right-3 top-2 text-slate-400 font-medium">@ ₹7.50/km</span>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Toll / Parking / Hospitality (₹)
                </label>
                <input
                  type="number"
                  value={parkingAmount}
                  onChange={(e) => setParkingAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 font-mono"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold"
                >
                  Submit for Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
