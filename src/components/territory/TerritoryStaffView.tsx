import React from 'react';
import { Territory, User } from '../../types';
import { Badge } from '../common/Badge';
import { Map, Users, Stethoscope, Store, UserCheck } from 'lucide-react';

interface TerritoryStaffViewProps {
  territories: Territory[];
  users: User[];
}

export const TerritoryStaffView: React.FC<TerritoryStaffViewProps> = ({ territories, users }) => {
  return (
    <div className="space-y-6">
      <div className="neu-card p-5 border border-[#282319] flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#F2ECE1] flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#6C5636]/20 border border-[#6C5636]/40 text-[#B99D73] flex items-center justify-center font-bold shadow-neu-sunken">
              <Map className="w-4 h-4 text-[#B99D73]" />
            </div>
            Territory & Field Force Management
          </h2>
          <p className="text-xs text-[#857866] mt-1">
            Territory boundaries, headquarter allocations, and assigned field staff.
          </p>
        </div>
        <Badge variant="primary" size="md">{territories.length} Active Territories</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {territories.map((terr) => {
          const manager = users.find(u => u.id === terr.assignedManagerId);
          const reps = users.filter(u => terr.assignedMRIds.includes(u.id));

          return (
            <div key={terr.id} className="neu-card border border-[#282319] p-5 space-y-4 hover:border-[#6C5636]/60 transition-all duration-200">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-base text-[#F2ECE1]">{terr.name}</h3>
                  <p className="text-xs text-[#857866] font-mono mt-0.5">Code: {terr.code} • {terr.zone}</p>
                </div>
                <Badge variant="neutral">{terr.state}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-xl bg-[#0c0c09] border border-[#282319] shadow-neu-sunken">
                <div className="flex items-center gap-2 text-[#F2ECE1]">
                  <Stethoscope className="w-4 h-4 text-[#B99D73]" />
                  <span><strong className="text-[#B99D73]">{terr.doctorCount}</strong> Doctors</span>
                </div>
                <div className="flex items-center gap-2 text-[#F2ECE1]">
                  <Store className="w-4 h-4 text-[#B99D73]" />
                  <span><strong className="text-[#B99D73]">{terr.chemistCount}</strong> Chemists</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#282319] text-xs space-y-2">
                <div>
                  <span className="text-[#857866] text-[11px] block">Area Sales Manager (ASM):</span>
                  <span className="font-semibold text-[#F2ECE1] flex items-center gap-1.5 mt-0.5">
                    <UserCheck className="w-3.5 h-3.5 text-[#B99D73]" />
                    {manager?.name || 'Unassigned'}
                  </span>
                </div>

                <div>
                  <span className="text-[#857866] text-[11px] block">Assigned Medical Representatives (MRs):</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {reps.length > 0 ? (
                      reps.map(r => (
                        <span key={r.id} className="inline-flex items-center gap-1.5 bg-[#181712] border border-[#282319] text-[#F2ECE1] px-2.5 py-1 rounded-xl text-xs font-medium shadow-neu-sunken">
                          <Users className="w-3 h-3 text-[#B99D73]" />
                          {r.name} ({r.employeeCode})
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-[#857866] italic">No MRs directly mapped</span>
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
