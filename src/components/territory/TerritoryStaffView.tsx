import React from 'react';
import { Territory, User, Doctor, Chemist } from '../../types';
import { Badge } from '../common/Badge';
import { Map, Users, Stethoscope, Store, UserCheck } from 'lucide-react';

interface TerritoryStaffViewProps {
  territories: Territory[];
  users: User[];
  doctors?: Doctor[];
  chemists?: Chemist[];
}

export const TerritoryStaffView: React.FC<TerritoryStaffViewProps> = ({
  territories,
  users,
  doctors = [],
  chemists = [],
}) => {
  return (
    <div className="space-y-6">
      <div className="neu-card p-5 border border-[#DCE4EB] flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#10243A] flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 text-[#137F83] flex items-center justify-center font-bold shadow-xs">
              <Map className="w-4 h-4 text-[#137F83]" />
            </div>
            Territory & Field Force Management
          </h2>
          <p className="text-xs text-[#64748B] mt-1">
            Territory boundaries, headquarter allocations, and assigned field staff.
          </p>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-50 text-[#137F83] border border-teal-200">
          {territories.length} Active Territories
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {territories.map((terr) => {
          // Dynamic doctor count from live database
          const terrDocCount = doctors.filter((d) => {
            const docDist = (d.territoryName || d.clinicLocation?.address || '').toLowerCase();
            const terrDist = terr.headquarter.toLowerCase();
            if (terr.id.includes('karimganj') || terrDist.includes('karimganj')) {
              return docDist.includes('karimganj') || docDist.includes('patharkandi') || docDist.includes('badarpur') || docDist.includes('nilambazar') || docDist.includes('baraigram') || docDist.includes('maizdhi');
            }
            if (terr.id.includes('hailakandi') || terrDist.includes('hailakandi')) {
              return docDist.includes('hailakandi') || docDist.includes('s.k. roy') || docDist.includes('lala');
            }
            if (terr.id.includes('aizawl') || terrDist.includes('aizawl')) {
              return docDist.includes('aizawl') || docDist.includes('mizoram') || docDist.includes('dawrpui') || docDist.includes('chanmari');
            }
            if (terr.id.includes('tripura') || terrDist.includes('agartala') || terrDist.includes('tripura')) {
              return docDist.includes('tripura') || docDist.includes('agartala') || docDist.includes('kunjaban') || docDist.includes('agmc');
            }
            if (terr.id.includes('cachar-02') || terr.code === 'SIL-02') {
              return docDist.includes('ghungoor') || docDist.includes('smch') || docDist.includes('tarapur');
            }
            // default Silchar / Cachar
            return (docDist.includes('cachar') || docDist.includes('silchar')) && !docDist.includes('karimganj') && !docDist.includes('hailakandi') && !docDist.includes('aizawl') && !docDist.includes('tripura');
          }).length;

          // Dynamic chemist count from live database
          const terrChemCount = chemists.filter((c) => {
            const chemDist = (c.territoryName || c.shopName || c.location?.address || '').toLowerCase();
            const terrDist = terr.headquarter.toLowerCase();
            if (terr.id.includes('karimganj') || terrDist.includes('karimganj')) {
              return chemDist.includes('karimganj') || chemDist.includes('shribhumi') || chemDist.includes('kxj');
            }
            if (terr.id.includes('hailakandi') || terrDist.includes('hailakandi')) {
              return chemDist.includes('hailakandi') || chemDist.includes('hkd');
            }
            if (terr.id.includes('aizawl') || terrDist.includes('aizawl')) {
              return chemDist.includes('aizawl') || chemDist.includes('mizoram');
            }
            if (terr.id.includes('tripura') || terrDist.includes('agartala') || terrDist.includes('tripura')) {
              return chemDist.includes('tripura') || chemDist.includes('agartala');
            }
            if (terr.id.includes('cachar-02') || terr.code === 'SIL-02') {
              return chemDist.includes('ghungoor') || chemDist.includes('smch') || chemDist.includes('tarapur');
            }
            return chemDist.includes('cachar') || chemDist.includes('silchar') || chemDist.includes('ambicapatty');
          }).length;

          // Find manager or fallback to RSM Bodrud Jaman Sadiol
          const manager = users.find(u => u.role === 'REGIONAL_MANAGER' || u.role === 'AREA_MANAGER') || users.find(u => u.id === terr.assignedManagerId);
          
          // Match MRs by territory or district
          const reps = users.filter((u) => {
            if (u.role !== 'MEDICAL_REP') return false;
            const userTerr = (u.territoryName || '').toLowerCase();
            if (terr.id.includes('karimganj') || terr.code === 'KGJ-01') {
              return userTerr.includes('karimganj') || u.employeeCode === 'usr-mr-0002' || u.employeeCode === 'usr-mr-0004';
            }
            if (terr.id.includes('hailakandi') || terr.code === 'HLK-01') {
              return userTerr.includes('hailakandi') || u.employeeCode === 'usr-mr-0003';
            }
            if (terr.id.includes('aizawl') || terr.code === 'AIZ-01') {
              return userTerr.includes('aizawl') || userTerr.includes('mizoram');
            }
            if (terr.id.includes('tripura') || terr.code === 'AGR-01') {
              return userTerr.includes('tripura') || userTerr.includes('agartala');
            }
            if (terr.id.includes('cachar') || terr.code.startsWith('SIL')) {
              return (userTerr.includes('silchar') || userTerr.includes('cachar')) && !userTerr.includes('karimganj') && !userTerr.includes('hailakandi');
            }
            return terr.assignedMRIds.includes(u.id);
          });

          return (
            <div key={terr.id} className="neu-card border border-[#DCE4EB] p-5 space-y-4 hover:border-[#18A6A6] transition-all duration-200">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-base text-[#10243A]">{terr.name}</h3>
                  <p className="text-xs text-[#64748B] font-mono mt-0.5">Code: {terr.code} • {terr.zone}</p>
                </div>
                <Badge variant="neutral">{terr.state}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-xl bg-[#F8FAFC] border border-[#DCE4EB]">
                <div className="flex items-center gap-2 text-[#10243A]">
                  <Stethoscope className="w-4 h-4 text-[#18A6A6]" />
                  <span><strong className="text-[#137F83] font-bold">{terrDocCount}</strong> Doctors</span>
                </div>
                <div className="flex items-center gap-2 text-[#10243A]">
                  <Store className="w-4 h-4 text-[#18A6A6]" />
                  <span><strong className="text-[#137F83] font-bold">{terrChemCount}</strong> Chemists</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#DCE4EB] text-xs space-y-2">
                <div>
                  <span className="text-[#64748B] text-[11px] block font-medium">Area Sales Manager (ASM):</span>
                  <span className="font-semibold text-[#10243A] flex items-center gap-1.5 mt-0.5">
                    <UserCheck className="w-3.5 h-3.5 text-[#18A6A6]" />
                    {manager?.name || 'Unassigned'}
                  </span>
                </div>

                <div>
                  <span className="text-[#64748B] text-[11px] block font-medium">Assigned Medical Representatives (MRs):</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {reps.length > 0 ? (
                      reps.map(r => (
                        <span key={r.id} className="inline-flex items-center gap-1.5 bg-white border border-[#DCE4EB] text-[#10243A] px-2.5 py-1 rounded-lg text-xs font-medium shadow-xs">
                          <Users className="w-3 h-3 text-[#18A6A6]" />
                          {r.name} ({r.employeeCode})
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-[#94A3B8] italic">No MRs directly mapped</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
