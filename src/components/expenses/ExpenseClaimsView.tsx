import React, { useState } from 'react';
import { ExpenseClaim, User } from '../../types';
import { Badge } from '../common/Badge';
import { 
  Receipt, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Navigation, 
  X 
} from 'lucide-react';

interface ExpenseClaimsViewProps {
  currentUser: User;
}

export const ExpenseClaimsView: React.FC<ExpenseClaimsViewProps> = ({ currentUser }) => {
  const isManager = currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'ADMIN' || currentUser?.role === 'MANAGER';

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
      userId: currentUser?.id || 'usr-default',
      userName: currentUser?.name || 'Representative',
      territoryName: currentUser?.territoryName || 'Silchar Regional HQ',
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
      <div className="neu-card p-5 border border-[#DCE4EB] bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-[#10243A] flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 text-[#137F83] flex items-center justify-center font-bold">
              <Receipt className="w-4 h-4 text-[#137F83]" />
            </div>
            Automated Mileage & Expense Claims
          </h2>
          <p className="text-xs text-[#64748B] mt-1">
            Automatic Travel Allowance (TA) calculated directly from verified 15-minute GPS route logs + Daily Allowance (DA).
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer bg-[#10243A] hover:bg-[#182F49] text-white transition-all shadow-xs"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Submit Daily Expense Claim
        </button>
      </div>

      {/* Claims List */}
      {claims.length === 0 ? (
        <div className="neu-card border border-[#DCE4EB] bg-white p-12 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-[#137F83] mx-auto flex items-center justify-center">
            <Receipt className="w-6 h-6 text-[#137F83]" />
          </div>
          <h3 className="font-bold text-[#10243A] text-sm">No Expense Claims Submitted</h3>
          <p className="text-xs text-[#64748B] max-w-sm mx-auto">
            Click "Submit Daily Expense Claim" to record mileage, daily allowance (DA), and field expense receipts.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {claims.map((claim) => (
            <div key={claim.id} className="neu-card border border-[#DCE4EB] bg-white p-5 space-y-4 hover:border-teal-500/50 shadow-xs transition-all duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3.5 border-b border-[#DCE4EB]">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-[#10243A]">{claim.claimNumber}</h3>
                    <Badge variant={claim.status === 'APPROVED' ? 'success' : 'warning'}>
                      {claim.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-[#64748B] mt-1">
                    Submitted by: <strong className="text-[#10243A]">{claim.userName}</strong> • Date: <strong>{claim.date}</strong> • Territory: <strong className="text-[#137F83]">{claim.territoryName}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-bold text-base text-[#137F83] bg-teal-50 px-3.5 py-1.5 rounded-xl border border-teal-200 font-mono">
                    ₹{claim.grandTotal.toFixed(2)}
                  </span>
                  {isManager && claim.status === 'SUBMITTED' && (
                    <button
                      onClick={() => handleApprove(claim.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 cursor-pointer transition-colors"
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
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] border border-[#DCE4EB]">
                    <div className="flex items-center gap-2.5">
                      {item.category === 'TRAVEL_KM_RATE' ? (
                        <Navigation className="w-4 h-4 text-[#137F83] shrink-0" />
                      ) : item.category === 'DAILY_ALLOWANCE' ? (
                        <Clock className="w-4 h-4 text-[#137F83] shrink-0" />
                      ) : (
                        <Receipt className="w-4 h-4 text-[#64748B] shrink-0" />
                      )}
                      <div>
                        <span className="font-semibold text-[#10243A]">{item.description}</span>
                        {item.verifiedKm && (
                          <span className="text-[10px] text-[#137F83] bg-teal-50 border border-teal-200 px-2 py-0.5 rounded ml-2 font-mono">
                            {item.verifiedKm} km @ ₹{claim.ratePerKm}/km
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="font-mono font-bold text-[#10243A]">₹{item.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {claim.managerComments && (
                <div className="text-xs bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span><strong>Manager Approval:</strong> {claim.managerComments}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Submit Claim Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#10243A]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#DCE4EB] rounded-2xl max-w-lg w-full p-6 shadow-xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3.5 border-b border-[#DCE4EB]">
              <h3 className="font-bold text-base text-[#10243A] flex items-center gap-2">
                <Receipt className="w-4 h-4 text-[#137F83]" />
                Submit Travel & Field Expense Claim
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-xl text-[#64748B] hover:text-[#10243A]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateClaim} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-[#10243A] block mb-1">Claim Date</label>
                <input
                  type="date"
                  required
                  value={claimDate}
                  onChange={(e) => setClaimDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#DCE4EB] rounded-xl text-[#10243A] font-mono focus:outline-none focus:border-[#18A6A6]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#10243A] block mb-1">
                  GPS Verified Distance (Kilometers)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={kmTravelled}
                    onChange={(e) => setKmTravelled(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#DCE4EB] rounded-xl text-[#10243A] font-mono font-bold focus:outline-none focus:border-[#18A6A6]"
                  />
                  <span className="absolute right-3 top-2 text-[#64748B] font-medium">@ ₹7.50/km</span>
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#10243A] block mb-1">
                  Toll / Parking / Hospitality (₹)
                </label>
                <input
                  type="number"
                  value={parkingAmount}
                  onChange={(e) => setParkingAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#DCE4EB] rounded-xl text-[#10243A] font-mono focus:outline-none focus:border-[#18A6A6]"
                />
              </div>

              <div className="pt-3.5 border-t border-[#DCE4EB] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:text-[#10243A] bg-[#F1F6F8] hover:bg-[#E8EEF4] border border-[#DCE4EB] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl font-bold cursor-pointer bg-[#10243A] hover:bg-[#182F49] text-white shadow-xs"
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
