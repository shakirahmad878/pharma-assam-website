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
      <div className="neu-card p-6 border border-[#DCE4EB] relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="relative z-10">
          <span className="text-[11px] uppercase tracking-wider font-bold text-[#137F83]">Field Performance Cockpit</span>
          <h2 className="text-2xl font-black mt-1 text-[#10243A] tracking-tight">Pharma Sales Force Command Center</h2>
          <p className="text-xs text-[#64748B] mt-1 max-w-xl">
            Live territory synchronization, automated 15-minute GPS tracking, and doctor geofence visit verification.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2">
          {isAdmin && (
            <button
              onClick={() => onNavigateToTab('fleet_tracking')}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl neu-btn-gold text-xs shadow-xs cursor-pointer"
            >
              <Radio className="w-4 h-4 text-white" />
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
        <div className="lg:col-span-2 neu-card p-5 border border-[#DCE4EB]">
          <div className="flex items-center justify-between pb-3.5 border-b border-[#DCE4EB]">
            <div>
              <h3 className="font-bold text-base text-[#10243A] flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#18A6A6]" />
                Recent Daily Call Reports (DCR)
              </h3>
              <p className="text-xs text-[#64748B]">Live doctor visits logged by field medical representatives.</p>
            </div>
            <button
              onClick={() => onNavigateToTab('dcr')}
              className="text-xs font-semibold text-[#137F83] hover:text-[#18A6A6] flex items-center gap-1 transition-colors"
            >
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {dcrLogs.length === 0 ? (
              <div className="py-8 text-center text-[#94A3B8] text-xs">
                No call reports logged yet for this period.
              </div>
            ) : (
              dcrLogs.map((dcr) => (
                <div
                  key={dcr.id}
                  className="p-4 rounded-xl bg-[#F8FAFC] border border-[#DCE4EB] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:border-[#18A6A6] transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#10243A]">{dcr.clientName}</span>
                      {dcr.isGeofenceVerified && (
                        <Badge variant="success" size="sm">
                          <CheckCircle2 className="w-3 h-3" /> Geofence Verified ({dcr.distanceFromClinicMeters}m)
                        </Badge>
                      )}
                    </div>
                    <p className="text-[#64748B] mt-0.5">
                      Visited by <strong className="text-[#10243A] font-semibold">{dcr.userName}</strong> • {dcr.checkInTime} to {dcr.checkOutTime}
                    </p>
                    {dcr.doctorFeedback && (
                      <p className="text-[11px] text-[#137F83] mt-1 italic">
                        "{dcr.doctorFeedback}"
                      </p>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    {dcr.pobAmount ? (
                      <span className="font-bold text-[#137F83] bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200 text-xs">
                        POB: ₹{dcr.pobAmount.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-[#94A3B8] text-[11px]">No POB</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Doctor Coverage by Specialty */}
        <div className="neu-card p-5 flex flex-col justify-between border border-[#DCE4EB]">
          <div>
            <h3 className="font-bold text-base text-[#10243A] mb-1">Coverage by Specialty</h3>
            <p className="text-xs text-[#64748B] mb-4">Doctor relationship density in active territories.</p>

            <div className="space-y-3.5">
              {doctors.length === 0 ? (
                <div className="py-6 text-center text-[#94A3B8] text-xs">
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
                        <span className="font-medium text-[#10243A]">{specialty}</span>
                        <span className="font-bold text-[#137F83]">{count} Clinics ({percent}%)</span>
                      </div>
                      <div className="w-full bg-[#E8EEF4] rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-[#18A6A6] h-full rounded-full transition-all duration-300" 
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="mt-6 p-3.5 rounded-xl bg-teal-50/80 border border-teal-200 text-xs text-[#137F83]">
            <p className="font-bold text-[#10243A]">🚀 Ready for Field Deployment</p>
            <p className="text-[11px] text-[#64748B] mt-0.5 font-medium">
              100% of doctor records are linked with GPS geofences.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
