import React, { useState } from 'react';
import { RCPAAuditRecord, Doctor, Chemist } from '../../types';
import { Badge } from '../common/Badge';
import { FileSpreadsheet, Plus, TrendingUp, Stethoscope, Store, X, CheckCircle2 } from 'lucide-react';

interface RCPAAuditViewProps {
  doctors: Doctor[];
  chemists: Chemist[];
}

export const RCPAAuditView: React.FC<RCPAAuditViewProps> = ({ doctors, chemists }) => {
  const [rcpaRecords, setRcpaRecords] = useState<RCPAAuditRecord[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [selectedDocId, setSelectedDocId] = useState(doctors[0]?.id || '');
  const [selectedChemId, setSelectedChemId] = useState(chemists[0]?.id || '');
  const [productBrand, setProductBrand] = useState('');
  const [ourRxCount, setOurRxCount] = useState<number>(30);
  const [competitorBrand, setCompetitorBrand] = useState('');
  const [competitorCompany, setCompetitorCompany] = useState('');
  const [competitorRxCount, setCompetitorRxCount] = useState<number>(20);
  const [remarks, setRemarks] = useState('');

  const handleAddAudit = (e: React.FormEvent) => {
    e.preventDefault();
    const doc = doctors.find(d => d.id === selectedDocId) || { name: 'Doctor', specialty: 'General' };
    const chem = chemists.find(c => c.id === selectedChemId) || { shopName: 'Chemist' };
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
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-teal-600" />
            Retail Chemist Prescription Audit (RCPA)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Analyze doctor prescribing market share at chemist counters against competitor pharmaceutical brands.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="primary" size="md">{rcpaRecords.length} Audits Completed</Badge>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Log RCPA Audit
          </button>
        </div>
      </div>

      {/* RCPA Records */}
      {rcpaRecords.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm">No Chemist Prescription Audits Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click "Log RCPA Audit" to analyze brand prescription share vs competitor molecules at chemist counters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {rcpaRecords.map((rcpa) => (
            <div key={rcpa.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">{rcpa.doctorName}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Store className="w-3.5 h-3.5 text-slate-400" />
                      Audited at: <strong>{rcpa.chemistName}</strong>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-teal-700 bg-teal-50 px-2 py-1 rounded">
                      {rcpa.ourMarketSharePercent.toFixed(1)}% Rx Share
                    </span>
                  </div>
                </div>

                {/* Progress Bar of Market Share */}
                <div className="mt-3 space-y-1 text-xs">
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Our Brand: <strong>{rcpa.ourProductBrand}</strong> ({rcpa.ourRxCountPerMonth} Rx)</span>
                    <span>Total Rx: {rcpa.totalMarketRx}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
                    <div
                      className="bg-teal-600 h-full"
                      style={{ width: `${rcpa.ourMarketSharePercent}%` }}
                      title={`Our Brand: ${rcpa.ourMarketSharePercent}%`}
                    />
                    <div
                      className="bg-slate-400 h-full"
                      style={{ width: `${100 - rcpa.ourMarketSharePercent}%` }}
                      title="Competitor Share"
                    />
                  </div>
                </div>

                {/* Competitor Breakdown */}
                {rcpa.competitorDrugs.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                    <span className="font-semibold text-slate-700 block">Competitor Prescriptions:</span>
                    {rcpa.competitorDrugs.map((comp, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                        <div>
                          <span className="font-semibold text-slate-800">{comp.competitorBrandName}</span>
                          <span className="text-[10px] text-slate-400 block">{comp.competitorCompany}</span>
                        </div>
                        <span className="font-mono font-bold text-slate-700">{comp.prescriptionCountPerMonth} Rx / mo</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {rcpa.chemistRemarks && (
                <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 italic">
                  "{rcpa.chemistRemarks}"
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add RCPA Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">New Chemist Prescription Audit (RCPA)</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAudit} className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Doctor</label>
                  <select
                    value={selectedDocId}
                    onChange={(e) => setSelectedDocId(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200"
                  >
                    {doctors.length === 0 ? <option value="">No doctors registered</option> : doctors.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Chemist Counter</label>
                  <select
                    value={selectedChemId}
                    onChange={(e) => setSelectedChemId(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200"
                  >
                    {chemists.length === 0 ? <option value="">No chemists registered</option> : chemists.map(c => (
                      <option key={c.id} value={c.id}>{c.shopName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Our Product / Brand Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CardioPulse-AM"
                  value={productBrand}
                  onChange={(e) => setProductBrand(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Our Monthly Rx Count</label>
                  <input
                    type="number"
                    min="0"
                    value={ourRxCount}
                    onChange={(e) => setOurRxCount(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Competitor Rx Count</label>
                  <input
                    type="number"
                    min="0"
                    value={competitorRxCount}
                    onChange={(e) => setCompetitorRxCount(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Competitor Brand Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Atorva 20"
                    value={competitorBrand}
                    onChange={(e) => setCompetitorBrand(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Competitor Company</label>
                  <input
                    type="text"
                    placeholder="e.g. Zydus"
                    value={competitorCompany}
                    onChange={(e) => setCompetitorCompany(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Chemist Remarks</label>
                <textarea
                  rows={2}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="e.g. Chemist reported high patient adherence..."
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200"
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
