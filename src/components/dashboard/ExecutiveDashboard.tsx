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
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-teal-400">Field Performance Cockpit</span>
          <h2 className="text-2xl font-bold mt-1 text-white">Pharma Sales Force Command Center</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Live territory synchronization, automated 15-minute GPS tracking, and doctor geofence visit verification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <button
              onClick={() => onNavigateToTab('fleet_tracking')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 transition-all"
            >
              <Radio className="w-4 h-4 text-slate-950" />
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
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-teal-600" />
                Recent Daily Call Reports (DCR)
              </h3>
              <p className="text-xs text-slate-500">Live doctor visits logged by field medical representatives.</p>
            </div>
            <button
              onClick={() => onNavigateToTab('dcr')}
              className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
            >
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {dcrLogs.map((dcr) => (
              <div
                key={dcr.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{dcr.clientName}</span>
                    {dcr.isGeofenceVerified && (
                      <Badge variant="success" size="sm">
                        <CheckCircle2 className="w-3 h-3" /> Geofence Verified ({dcr.distanceFromClinicMeters}m)
                      </Badge>
                    )}
                  </div>
                  <p className="text-slate-500 mt-0.5">
                    Visited by <strong>{dcr.userName}</strong> • {dcr.checkInTime} to {dcr.checkOutTime}
                  </p>
                  {dcr.doctorFeedback && (
                    <p className="text-[11px] text-slate-600 mt-1 italic">
                      "{dcr.doctorFeedback}"
                    </p>
                  )}
                </div>

                <div className="text-right shrink-0">
                  {dcr.pobAmount ? (
                    <span className="font-bold text-teal-700 bg-teal-50 px-2 py-1 rounded text-xs">
                      POB: ₹{dcr.pobAmount.toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-slate-400 text-[11px]">No POB</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Doctor Coverage by Specialty */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 mb-1">Coverage by Specialty</h3>
            <p className="text-xs text-slate-500 mb-4">Doctor relationship density in active territories.</p>

            <div className="space-y-3">
              {doctors.length === 0 ? (
                <div className="py-6 text-center text-slate-400 text-xs">
                  No doctors registered yet. Add doctors in Doctor Master to see specialty breakdown.
                </div>
              ) : (
                Object.entries(
                  doctors.reduce((acc: Record<string, number>, d) => {
                    acc[d.specialty] = (acc[d.specialty] || 0) + 1;
                    return acc;
                  }, {})
                ).map(([specialty, count], idx) => {
                  const colors = ['bg-teal-500', 'bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-amber-500'];
                  const color = colors[idx % colors.length];
                  const percent = Math.min(100, Math.round((count / (doctors.length || 1)) * 100));
                  return (
                    <div key={specialty} className="text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-slate-700">{specialty}</span>
                        <span className="font-bold text-slate-900">{count} Clinics ({percent}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div className={`${color} h-full rounded-full`} style={{ width: `${percent}%` }}></div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="mt-6 p-3 rounded-xl bg-teal-50/60 border border-teal-100 text-xs text-teal-800">
            <p className="font-semibold">🚀 Ready for Field Deployment</p>
            <p className="text-[11px] text-teal-700 mt-0.5">
              100% of doctor records are linked with GPS geofences.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
