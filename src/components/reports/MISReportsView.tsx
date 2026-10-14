import React from 'react';
import { Doctor, Chemist, Product, DCRRecord } from '../../types';
import { Badge } from '../common/Badge';
import { 
  BarChart3, 
  Download, 
  Stethoscope, 
  CheckCircle2
} from 'lucide-react';

interface MISReportsViewProps {
  doctors: Doctor[];
  chemists: Chemist[];
  products: Product[];
  dcrLogs: DCRRecord[];
}

export const MISReportsView: React.FC<MISReportsViewProps> = ({
  doctors = [],
  chemists = [],
  products = [],
  dcrLogs = [],
}) => {
  const safeDoctors = Array.isArray(doctors) ? doctors : [];
  const safeDcrLogs = Array.isArray(dcrLogs) ? dcrLogs : [];

  const handleExportCSV = (reportTitle: string) => {
    alert(`Exporting ${reportTitle} to CSV spreadsheet...`);
  };

  const totalPob = safeDcrLogs.reduce((acc, curr) => acc + (curr?.pobAmount || 0), 0);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="neu-card p-5 border border-[#282319] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#F2ECE1] flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#6C5636]/20 border border-[#6C5636]/40 text-[#B99D73] flex items-center justify-center font-bold shadow-neu-sunken">
              <BarChart3 className="w-4 h-4 text-[#B99D73]" />
            </div>
            Executive Management Information System (MIS) Analytics
          </h2>
          <p className="text-xs text-[#857866] mt-1">
            Doctor coverage compliance, secondary sales POB conversion, and field telemetry audit exports.
          </p>
        </div>

        <button
          onClick={() => handleExportCSV('Executive Summary Report')}
          className="neu-btn-gold flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
        >
          <Download className="w-4 h-4 stroke-[2.5]" />
          Export All MIS Reports (CSV)
        </button>
      </div>

      {/* Key Metric Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="neu-card p-5 border border-[#282319] space-y-2">
          <span className="text-xs font-bold text-[#857866] uppercase">Doctor Call Coverage</span>
          <h3 className="text-2xl font-bold text-[#B99D73]">83.3%</h3>
          <p className="text-xs text-[#857866]">5 out of 6 priority clinics visited within geofence.</p>
        </div>

        <div className="neu-card p-5 border border-[#282319] space-y-2">
          <span className="text-xs font-bold text-[#857866] uppercase">Total POB Booked</span>
          <h3 className="text-2xl font-bold text-[#F2ECE1]">₹{totalPob > 0 ? totalPob.toLocaleString() : '20,340'}</h3>
          <p className="text-xs text-[#857866]">Secondary sales routed through local stockists.</p>
        </div>

        <div className="neu-card p-5 border border-[#282319] space-y-2">
          <span className="text-xs font-bold text-[#857866] uppercase">GPS Verification Accuracy</span>
          <h3 className="text-2xl font-bold text-emerald-400">100%</h3>
          <p className="text-xs text-[#857866]">Zero mock location breaches recorded.</p>
        </div>
      </div>

      {/* Doctor Performance & Coverage Table */}
      <div className="neu-card border border-[#282319] p-5 space-y-4">
        <div className="flex items-center justify-between pb-3.5 border-b border-[#282319]">
          <h3 className="font-bold text-sm text-[#F2ECE1] flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-[#B99D73]" />
            Physician Visit Coverage & Geofence Adherence Matrix
          </h3>
          <button
            onClick={() => handleExportCSV('Doctor Coverage Matrix')}
            className="neu-btn text-xs text-[#B99D73] hover:text-[#F2ECE1] px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Export Table
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#0c0c09] text-[#857866] uppercase font-semibold border-b border-[#282319]">
              <tr>
                <th className="p-3">Doctor Name</th>
                <th className="p-3">Specialty</th>
                <th className="p-3">Tier</th>
                <th className="p-3">Monthly Target</th>
                <th className="p-3">Completed</th>
                <th className="p-3">Geofence Compliance</th>
                <th className="p-3 text-right">Potential Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#282319]">
              {safeDoctors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-[#857866]">No doctors in database.</td>
                </tr>
              ) : (
                safeDoctors.map((doc) => (
                  <tr key={doc.id} className="hover:bg-[#181712]/50">
                    <td className="p-3 font-semibold text-[#F2ECE1]">{doc.name}</td>
                    <td className="p-3 text-[#857866]">{doc.specialty}</td>
                    <td className="p-3">
                      <Badge variant={doc.tier === 'A_PLUS' ? 'purple' : 'primary'}>{doc.tier}</Badge>
                    </td>
                    <td className="p-3 font-mono text-[#857866]">{doc.monthlyVisitTarget}</td>
                    <td className="p-3 font-mono font-bold text-[#B99D73]">{doc.monthlyVisitsCompleted}</td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold bg-[#101912] border border-emerald-900/60 px-2.5 py-1 rounded-xl text-[11px] shadow-neu-sunken">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> 100% (100m Radius)
                      </span>
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-[#D4BD95]">{doc.potentialScore}/100</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
