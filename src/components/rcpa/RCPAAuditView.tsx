import React, { useState } from 'react';
import { RCPAAuditRecord, Doctor, Chemist } from '../../types';
import { Badge } from '../common/Badge';
import { FileSpreadsheet, Plus, Store, X } from 'lucide-react';

interface RCPAAuditViewProps {
  doctors: Doctor[];
  chemists: Chemist[];
}

export const RCPAAuditView: React.FC<RCPAAuditViewProps> = ({ doctors = [], chemists = [] }) => {
  const safeDoctors = Array.isArray(doctors) ? doctors : [];
  const safeChemists = Array.isArray(chemists) ? chemists : [];

  const [rcpaRecords, setRcpaRecords] = useState<RCPAAuditRecord[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [selectedDocId, setSelectedDocId] = useState(safeDoctors[0]?.id || '');
  const [selectedChemId, setSelectedChemId] = useState(safeChemists[0]?.id || '');
  const [productBrand, setProductBrand] = useState('');
  const [ourRxCount, setOurRxCount] = useState<number>(30);
  const [competitorBrand, setCompetitorBrand] = useState('');
  const [competitorCompany, setCompetitorCompany] = useState('');
  const [competitorRxCount, setCompetitorRxCount] = useState<number>(20);
  const [remarks, setRemarks] = useState('');

  const handleAddAudit = (e: React.FormEvent) => {
    e.preventDefault();
    const doc = safeDoctors.find(d => d.id === selectedDocId) || { name: 'Doctor', specialty: 'General' as any };
    const chem = safeChemists.find(c => c.id === selectedChemId) || { shopName: 'Chemist' };
    const totalRx = ourRxCount + competitorRxCount;
    const share = totalRx > 0 ? (ourRxCount / totalRx) * 100 : 0;

    const newRecord: RCPAAuditRecord = {
      id: `rcpa-${Date.now()}`,
      userId: 'usr-admin-01',
      userName: 'Representative',
      chemistId: selectedChemId,
      chemistName: chem.shopName,
      doctorId: selectedDocId,
      doctorName: doc.name,
      specialty: doc.specialty,
      auditDate: new Date().toISOString().split('T')[0],
      ourProductBrand: productBrand || 'Our Formulation',
      ourRxCountPerMonth: ourRxCount,
      competitorDrugs: competitorBrand ? [
        {
          competitorBrandName: competitorBrand,
          competitorCompany: competitorCompany || 'Competitor Pharma',
          prescriptionCountPerMonth: competitorRxCount,
          estimatedPrice: 0,
        }
      ] : [],
      totalMarketRx: totalRx,
      ourMarketSharePercent: share,
      chemistRemarks: remarks,
    };

    setRcpaRecords(prev => [newRecord, ...prev]);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="neu-card p-5 border border-[#DCE4EB] bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-[#10243A] flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 text-[#137F83] flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-4 h-4 text-[#137F83]" />
            </div>
            Retail Chemist Prescription Audit (RCPA)
          </h2>
          <p className="text-xs text-[#64748B] mt-1">
            Analyze doctor prescribing market share at chemist counters against competitor pharmaceutical brands.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="primary" size="md">{rcpaRecords.length} Audits Completed</Badge>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold cursor-pointer bg-[#10243A] hover:bg-[#182F49] text-white transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            Log RCPA Audit
          </button>
        </div>
      </div>

      {/* RCPA Records */}
      {rcpaRecords.length === 0 ? (
        <div className="neu-card border border-[#DCE4EB] bg-white p-12 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-[#137F83] mx-auto flex items-center justify-center">
            <FileSpreadsheet className="w-6 h-6 text-[#137F83]" />
          </div>
          <h3 className="font-bold text-[#10243A] text-sm">No Chemist Prescription Audits Yet</h3>
          <p className="text-xs text-[#64748B] max-w-sm mx-auto">
            Click "Log RCPA Audit" to analyze brand prescription share vs competitor molecules at chemist counters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {rcpaRecords.map((rcpa) => (
            <div key={rcpa.id} className="neu-card border border-[#DCE4EB] bg-white p-5 space-y-4 flex flex-col justify-between hover:border-teal-500/50 shadow-xs transition-all duration-200">
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-base text-[#10243A]">{rcpa.doctorName}</h3>
                    <p className="text-xs text-[#64748B] flex items-center gap-1 mt-0.5">
                      <Store className="w-3.5 h-3.5 text-[#137F83]" />
                      Audited at: <strong className="text-[#10243A]">{rcpa.chemistName}</strong>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#137F83] bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-xl">
                      {rcpa.ourMarketSharePercent.toFixed(1)}% Rx Share
                    </span>
                  </div>
                </div>

                {/* Progress Bar of Market Share */}
                <div className="mt-3.5 space-y-1.5 text-xs">
                  <div className="flex justify-between text-[11px] text-[#64748B]">
                    <span>Our Brand: <strong className="text-[#137F83]">{rcpa.ourProductBrand}</strong> ({rcpa.ourRxCountPerMonth} Rx)</span>
                    <span>Total Rx: <strong className="text-[#10243A]">{rcpa.totalMarketRx}</strong></span>
                  </div>
                  <div className="w-full bg-[#E8EEF4] rounded-full h-2.5 overflow-hidden flex">
                    <div
                      className="bg-[#18A6A6] h-full"
                      style={{ width: `${rcpa.ourMarketSharePercent}%` }}
                      title={`Our Brand: ${rcpa.ourMarketSharePercent}%`}
                    />
                    <div
                      className="bg-[#CBD5E1] h-full"
                      style={{ width: `${100 - rcpa.ourMarketSharePercent}%` }}
                      title="Competitor Share"
                    />
                  </div>
                </div>

                {/* Competitor Breakdown */}
                {rcpa.competitorDrugs.length > 0 && (
                  <div className="mt-4 pt-3.5 border-t border-[#DCE4EB] space-y-2 text-xs">
                    <span className="font-semibold text-[#64748B] block">Competitor Prescriptions:</span>
                    {rcpa.competitorDrugs.map((comp, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAFC] border border-[#DCE4EB]">
                        <div>
                          <span className="font-semibold text-[#10243A]">{comp.competitorBrandName}</span>
                          <span className="text-[10px] text-[#64748B] block">{comp.competitorCompany}</span>
                        </div>
                        <span className="font-mono font-bold text-[#10243A]">{comp.prescriptionCountPerMonth} Rx / mo</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {rcpa.chemistRemarks && (
                <div className="pt-3 border-t border-[#DCE4EB] text-xs text-[#64748B] italic bg-[#F8FAFC] p-2.5 rounded-xl border border-[#DCE4EB]">
                  "{rcpa.chemistRemarks}"
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add RCPA Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#10243A]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#DCE4EB] rounded-2xl max-w-lg w-full p-6 shadow-xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3.5 border-b border-[#DCE4EB]">
              <h3 className="text-base font-bold text-[#10243A]">New Chemist Prescription Audit (RCPA)</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-xl text-[#64748B] hover:text-[#10243A]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddAudit} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#10243A] block mb-1">Doctor</label>
                  <select
                    value={selectedDocId}
                    onChange={(e) => setSelectedDocId(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#DCE4EB] rounded-xl text-[#10243A] cursor-pointer focus:outline-none focus:border-[#18A6A6]"
                  >
                    {safeDoctors.length === 0 ? <option value="">No doctors registered</option> : safeDoctors.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-[#10243A] block mb-1">Chemist Counter</label>
                  <select
                    value={selectedChemId}
                    onChange={(e) => setSelectedChemId(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#DCE4EB] rounded-xl text-[#10243A] cursor-pointer focus:outline-none focus:border-[#18A6A6]"
                  >
                    {safeChemists.length === 0 ? <option value="">No chemists registered</option> : safeChemists.map(c => (
                      <option key={c.id} value={c.id}>{c.shopName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#10243A] block mb-1">Our Product / Brand Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CardioPulse-AM"
                  value={productBrand}
                  onChange={(e) => setProductBrand(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#DCE4EB] rounded-xl text-[#10243A] focus:outline-none focus:border-[#18A6A6]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#10243A] block mb-1">Our Monthly Rx Count</label>
                  <input
                    type="number"
                    min="0"
                    value={ourRxCount}
                    onChange={(e) => setOurRxCount(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-white border border-[#DCE4EB] rounded-xl text-[#10243A] font-mono focus:outline-none focus:border-[#18A6A6]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#10243A] block mb-1">Competitor Rx Count</label>
                  <input
                    type="number"
                    min="0"
                    value={competitorRxCount}
                    onChange={(e) => setCompetitorRxCount(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-white border border-[#DCE4EB] rounded-xl text-[#10243A] font-mono focus:outline-none focus:border-[#18A6A6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#10243A] block mb-1">Competitor Brand Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Atorva 20"
                    value={competitorBrand}
                    onChange={(e) => setCompetitorBrand(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#DCE4EB] rounded-xl text-[#10243A] focus:outline-none focus:border-[#18A6A6]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#10243A] block mb-1">Competitor Company</label>
                  <input
                    type="text"
                    placeholder="e.g. Zydus"
                    value={competitorCompany}
                    onChange={(e) => setCompetitorCompany(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#DCE4EB] rounded-xl text-[#10243A] focus:outline-none focus:border-[#18A6A6]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#10243A] block mb-1">Chemist Remarks</label>
                <textarea
                  rows={2}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="e.g. Chemist reported high patient adherence..."
                  className="w-full px-3 py-2 bg-white border border-[#DCE4EB] rounded-xl text-[#10243A] focus:outline-none focus:border-[#18A6A6]"
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
                  className="px-4 py-2 rounded-xl text-xs font-bold cursor-pointer bg-[#10243A] hover:bg-[#182F49] text-white shadow-xs"
                >
                  Save RCPA Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
