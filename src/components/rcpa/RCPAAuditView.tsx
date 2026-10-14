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
      <div className="neu-card p-5 border border-[#282319] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#F2ECE1] flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#6C5636]/20 border border-[#6C5636]/40 text-[#B99D73] flex items-center justify-center font-bold shadow-neu-sunken">
              <FileSpreadsheet className="w-4 h-4 text-[#B99D73]" />
            </div>
            Retail Chemist Prescription Audit (RCPA)
          </h2>
          <p className="text-xs text-[#857866] mt-1">
            Analyze doctor prescribing market share at chemist counters against competitor pharmaceutical brands.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="primary" size="md">{rcpaRecords.length} Audits Completed</Badge>
          <button
            onClick={() => setIsModalOpen(true)}
            className="neu-btn-gold flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            Log RCPA Audit
          </button>
        </div>
      </div>

      {/* RCPA Records */}
      {rcpaRecords.length === 0 ? (
        <div className="neu-card border border-[#282319] p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#181712] border border-[#282319] text-[#B99D73] mx-auto flex items-center justify-center shadow-neu-sunken">
            <FileSpreadsheet className="w-6 h-6 text-[#B99D73]" />
          </div>
          <h3 className="font-bold text-[#F2ECE1] text-sm">No Chemist Prescription Audits Yet</h3>
          <p className="text-xs text-[#857866] max-w-sm mx-auto">
            Click "Log RCPA Audit" to analyze brand prescription share vs competitor molecules at chemist counters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {rcpaRecords.map((rcpa) => (
            <div key={rcpa.id} className="neu-card border border-[#282319] p-5 space-y-4 flex flex-col justify-between hover:border-[#6C5636]/60 transition-all duration-200">
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-base text-[#F2ECE1]">{rcpa.doctorName}</h3>
                    <p className="text-xs text-[#857866] flex items-center gap-1 mt-0.5">
                      <Store className="w-3.5 h-3.5 text-[#B99D73]" />
                      Audited at: <strong className="text-[#F2ECE1]">{rcpa.chemistName}</strong>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#B99D73] bg-[#181712] border border-[#282319] px-2.5 py-1 rounded-xl shadow-neu-sunken">
                      {rcpa.ourMarketSharePercent.toFixed(1)}% Rx Share
                    </span>
                  </div>
                </div>

                {/* Progress Bar of Market Share */}
                <div className="mt-3.5 space-y-1.5 text-xs">
                  <div className="flex justify-between text-[11px] text-[#857866]">
                    <span>Our Brand: <strong className="text-[#B99D73]">{rcpa.ourProductBrand}</strong> ({rcpa.ourRxCountPerMonth} Rx)</span>
                    <span>Total Rx: <strong className="text-[#F2ECE1]">{rcpa.totalMarketRx}</strong></span>
                  </div>
                  <div className="w-full bg-[#0c0c09] border border-[#282319] rounded-full h-2.5 overflow-hidden flex shadow-neu-sunken">
                    <div
                      className="bg-gradient-to-r from-[#6C5636] to-[#B99D73] h-full"
                      style={{ width: `${rcpa.ourMarketSharePercent}%` }}
                      title={`Our Brand: ${rcpa.ourMarketSharePercent}%`}
                    />
                    <div
                      className="bg-[#282319] h-full"
                      style={{ width: `${100 - rcpa.ourMarketSharePercent}%` }}
                      title="Competitor Share"
                    />
                  </div>
                </div>

                {/* Competitor Breakdown */}
                {rcpa.competitorDrugs.length > 0 && (
                  <div className="mt-4 pt-3.5 border-t border-[#282319] space-y-2 text-xs">
                    <span className="font-semibold text-[#857866] block">Competitor Prescriptions:</span>
                    {rcpa.competitorDrugs.map((comp, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-[#0c0c09] border border-[#282319] shadow-neu-sunken">
                        <div>
                          <span className="font-semibold text-[#F2ECE1]">{comp.competitorBrandName}</span>
                          <span className="text-[10px] text-[#857866] block">{comp.competitorCompany}</span>
                        </div>
                        <span className="font-mono font-bold text-[#D4BD95]">{comp.prescriptionCountPerMonth} Rx / mo</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {rcpa.chemistRemarks && (
                <div className="pt-3 border-t border-[#282319] text-xs text-[#857866] italic bg-[#0c0c09] p-2.5 rounded-xl border border-[#282319] shadow-neu-sunken">
                  "{rcpa.chemistRemarks}"
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add RCPA Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#090907]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="neu-card border border-[#282319] max-w-lg w-full p-6 shadow-neu-raised animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3.5 border-b border-[#282319]">
              <h3 className="text-base font-bold text-[#F2ECE1]">New Chemist Prescription Audit (RCPA)</h3>
              <button onClick={() => setIsModalOpen(false)} className="neu-btn p-1.5 rounded-xl text-[#857866] hover:text-[#F2ECE1]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddAudit} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#B99D73] block mb-1">Doctor</label>
                  <select
                    value={selectedDocId}
                    onChange={(e) => setSelectedDocId(e.target.value)}
                    className="neu-input w-full px-3 py-2 bg-[#0c0c09] cursor-pointer"
                  >
                    {safeDoctors.length === 0 ? <option value="">No doctors registered</option> : safeDoctors.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-[#B99D73] block mb-1">Chemist Counter</label>
                  <select
                    value={selectedChemId}
                    onChange={(e) => setSelectedChemId(e.target.value)}
                    className="neu-input w-full px-3 py-2 bg-[#0c0c09] cursor-pointer"
                  >
                    {safeChemists.length === 0 ? <option value="">No chemists registered</option> : safeChemists.map(c => (
                      <option key={c.id} value={c.id}>{c.shopName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#B99D73] block mb-1">Our Product / Brand Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CardioPulse-AM"
                  value={productBrand}
                  onChange={(e) => setProductBrand(e.target.value)}
                  className="neu-input w-full px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#B99D73] block mb-1">Our Monthly Rx Count</label>
                  <input
                    type="number"
                    min="0"
                    value={ourRxCount}
                    onChange={(e) => setOurRxCount(parseInt(e.target.value) || 0)}
                    className="neu-input w-full px-3 py-2 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#B99D73] block mb-1">Competitor Rx Count</label>
                  <input
                    type="number"
                    min="0"
                    value={competitorRxCount}
                    onChange={(e) => setCompetitorRxCount(parseInt(e.target.value) || 0)}
                    className="neu-input w-full px-3 py-2 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#B99D73] block mb-1">Competitor Brand Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Atorva 20"
                    value={competitorBrand}
                    onChange={(e) => setCompetitorBrand(e.target.value)}
                    className="neu-input w-full px-3 py-2"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#B99D73] block mb-1">Competitor Company</label>
                  <input
                    type="text"
                    placeholder="e.g. Zydus"
                    value={competitorCompany}
                    onChange={(e) => setCompetitorCompany(e.target.value)}
                    className="neu-input w-full px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#B99D73] block mb-1">Chemist Remarks</label>
                <textarea
                  rows={2}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="e.g. Chemist reported high patient adherence..."
                  className="neu-input w-full px-3 py-2"
                />
              </div>

              <div className="pt-3.5 border-t border-[#282319] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="neu-btn px-4 py-2 rounded-xl text-[#857866] hover:text-[#F2ECE1] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="neu-btn-gold px-4 py-2 rounded-xl font-bold cursor-pointer"
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
