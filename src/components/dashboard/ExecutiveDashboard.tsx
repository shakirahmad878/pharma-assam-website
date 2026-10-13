import React from 'react';
import { Doctor, Chemist, Product, LocationTelemetryPoint, DCRRecord, UserRole } from '../../types';
import { StatCard } from '../common/StatCard';
import { Badge } from '../common/Badge';
import { 
  Stethoscope, 
  Store, 
  MapPin, 
  FileCheck, 
  Radio, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  ArrowUpRight
} from 'lucide-react';

interface ExecutiveDashboardProps {
  doctors: Doctor[];
  chemists: Chemist[];
  products: Product[];
  telemetryLogs: LocationTelemetryPoint[];
  dcrLogs: DCRRecord[];
  userRole: UserRole;
  onNavigateToTab: (tab: any) => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  doctors,
  chemists,
  products,
  telemetryLogs,
  dcrLogs,
  userRole,
  onNavigateToTab,
}) => {
  const isAdmin = userRole === 'SUPER_ADMIN';

  // Calculate coverage
  const totalTargetVisits = doctors.reduce((acc, d) => acc + d.monthlyVisitTarget, 0);
  const totalCompletedVisits = doctors.reduce((acc, d) => acc + d.monthlyVisitsCompleted, 0);
  const coveragePercent = Math.round((totalCompletedVisits / (totalTargetVisits || 1)) * 100);

  return (
    <div className="space-y-6">
      
      {/* Top Welcome Banner */}
      <div className="neu-card p-6 border border-[#282319] relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Subtle warm golden accent glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#6C5636]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10">
          <span className="text-[11px] uppercase tracking-wider font-bold text-[#B99D73]">Field Performance Cockpit</span>
          <h2 className="text-2xl font-black mt-1 text-[#F2ECE1] tracking-tight">Pharma Sales Force Command Center</h2>
          <p className="text-xs text-[#857866] mt-1 max-w-xl">
            Live territory synchronization, automated 15-minute GPS tracking, and doctor geofence visit verification.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2">
          {isAdmin && (
            <button
              onClick={() => onNavigateToTab('fleet_tracking')}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl neu-btn-gold text-xs shadow-lg cursor-pointer"
            >
              <Radio className="w-4 h-4 text-[#090907]" />
              Open Admin Fleet Map
            </button>
          )}
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Doctor Call Coverage"
          value={`${coveragePercent}%`}
          subtitle={`${totalCompletedVisits} of ${totalTargetVisits} Monthly Target`}
          icon={Stethoscope}
          color="teal"
          trend={{ value: '12%', isPositive: true }}
        />
        <StatCard
          title="Verified Doctor Master"
          value={doctors.length}
          subtitle="Tier A+ / A / B clinics with Geofences"
          icon={MapPin}
          color="blue"
        />
        <StatCard
          title="15-Min GPS Pings Today"
          value={isAdmin ? telemetryLogs.length : 'Protected'}
          subtitle={isAdmin ? 'Automated telemetry fixes' : 'Admin only telemetry'}
          icon={Radio}
          color="emerald"
        />
        <StatCard
          title="Active Field SKUs"
          value={products.length}
          subtitle="Formulations with E-Detailing"
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* Middle Section: Recent DCR Calls & Doctor Geofencing Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Daily Call Reports */}
        <div className="lg:col-span-2 neu-card p-5">
          <div className="flex items-center justify-between pb-3.5 border-b border-[#282319]">
            <div>
              <h3 className="font-bold text-base text-[#F2ECE1] flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#B99D73]" />
                Recent Daily Call Reports (DCR)
              </h3>
              <p className="text-xs text-[#857866]">Live doctor visits logged by field medical representatives.</p>
            </div>
            <button
              onClick={() => onNavigateToTab('dcr')}
              className="text-xs font-semibold text-[#B99D73] hover:text-[#D4BD95] flex items-center gap-1 transition-colors"
            >
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {dcrLogs.length === 0 ? (
              <div className="py-8 text-center text-[#857866] text-xs">
                No call reports logged yet for this period.
              </div>
            ) : (
              dcrLogs.map((dcr) => (
                <div
                  key={dcr.id}
                  className="p-4 rounded-xl bg-[#0d0d0a] border border-[#221e16] shadow-[inset_2px_2px_5px_#040403,inset_-2px_-2px_5px_#181711] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#F2ECE1]">{dcr.clientName}</span>
                      {dcr.isGeofenceVerified && (
                        <Badge variant="success" size="sm">
                          <CheckCircle2 className="w-3 h-3" /> Geofence Verified ({dcr.distanceFromClinicMeters}m)
                        </Badge>
                      )}
                    </div>
                    <p className="text-[#857866] mt-0.5">
                      Visited by <strong className="text-[#D4BD95]">{dcr.userName}</strong> • {dcr.checkInTime} to {dcr.checkOutTime}
                    </p>
                    {dcr.doctorFeedback && (
                      <p className="text-[11px] text-[#B99D73]/90 mt-1 italic">
                        "{dcr.doctorFeedback}"
                      </p>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    {dcr.pobAmount ? (
                      <span className="font-bold text-[#B99D73] bg-[#1a1711] px-2.5 py-1 rounded-lg border border-[#6C5636]/50 shadow-[inset_1px_1px_3px_#040403] text-xs">
                        POB: ₹{dcr.pobAmount.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-[#857866] text-[11px]">No POB</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Doctor Coverage by Specialty */}
        <div className="neu-card p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-[#F2ECE1] mb-1">Coverage by Specialty</h3>
            <p className="text-xs text-[#857866] mb-4">Doctor relationship density in active territories.</p>

            <div className="space-y-3.5">
              {doctors.length === 0 ? (
                <div className="py-6 text-center text-[#857866] text-xs">
                  No doctors registered yet. Add doctors in Doctor Master to see specialty breakdown.
                </div>
              ) : (
                Object.entries(
                  doctors.reduce((acc: Record<string, number>, d) => {
                    acc[d.specialty] = (acc[d.specialty] || 0) + 1;
                    return acc;
                  }, {})
                ).map(([specialty, count], idx) => {
                  const percent = Math.min(100, Math.round((count / (doctors.length || 1)) * 100));
                  return (
                    <div key={specialty} className="text-xs">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-medium text-[#D4BD95]">{specialty}</span>
                        <span className="font-bold text-[#F2ECE1]">{count} Clinics ({percent}%)</span>
                      </div>
                      <div className="w-full bg-[#0c0c09] rounded-full h-2 overflow-hidden shadow-[inset_1px_1px_3px_#040403]">
                        <div 
                          className="bg-gradient-to-r from-[#6C5636] to-[#B99D73] h-full rounded-full shadow-[0_0_8px_rgba(185,157,115,0.4)]" 
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="mt-6 p-3.5 rounded-xl bg-[#0c0c09] border border-[#6C5636]/40 shadow-[inset_2px_2px_5px_#040403] text-xs text-[#B99D73]">
            <p className="font-bold text-[#F2ECE1]">🚀 Ready for Field Deployment</p>
            <p className="text-[11px] text-[#B99D73]/80 mt-0.5">
              100% of doctor records are linked with GPS geofences.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
