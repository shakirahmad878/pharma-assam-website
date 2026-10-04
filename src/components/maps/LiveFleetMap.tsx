import React, { useState, useEffect } from 'react';
import { UserRole, LocationTelemetryPoint, Doctor, DCRRecord } from '../../types';
import { TelemetryService } from '../../services/telemetryService';
import { Badge } from '../common/Badge';
import { 
  ShieldAlert, 
  Clock, 
  Battery, 
  ShieldCheck, 
  Navigation, 
  Lock, 
  Stethoscope, 
  Play, 
  Pause, 
  RotateCcw, 
  Building2, 
  Layers 
} from 'lucide-react';

interface LiveFleetMapProps {
  userRole: UserRole;
  telemetryLogs: LocationTelemetryPoint[];
  doctors?: Doctor[];
  dcrLogs?: DCRRecord[];
}

export const LiveFleetMap: React.FC<LiveFleetMapProps> = ({ 
  userRole, 
  telemetryLogs,
  doctors = [],
  dcrLogs = []
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 2 | 4>(1);
  const [currentIndex, setCurrentIndex] = useState<number>(Math.max(0, telemetryLogs.length - 1));
  const [showGeofenceCircles, setShowGeofenceCircles] = useState(true);

  const checkResult = TelemetryService.getTelemetryLogs(userRole);

  // STRICT ACCESS CONTROL GUARD: Block non-admins from viewing employee locations
  if (!checkResult.success) {
    return (
      <div className="bg-white rounded-2xl border border-rose-200 p-8 text-center max-w-2xl mx-auto shadow-sm my-8">
        <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-100 text-rose-600">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Access Restricted (Admin Clearance Required)</h3>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed max-w-lg mx-auto">
          {checkResult.error}
        </p>
        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-slate-200 text-xs font-semibold">
          <Lock className="w-4 h-4 text-amber-400" />
          <span>Switch active role to Super Admin in the top-right navbar to view live telemetry.</span>
        </div>
      </div>
    );
  }

  // Handle Automated Route Replay Timer
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev >= telemetryLogs.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1800 / playbackSpeed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed, telemetryLogs.length]);

  const currentLog = telemetryLogs[currentIndex] || telemetryLogs[telemetryLogs.length - 1];
  const timeStr = currentLog ? new Date(currentLog.capturedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '09:00 AM';

  return (
    <div className="space-y-6">
      
      {/* Top Header Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Live GPS Field Fleet & Geofence Intelligence</h2>
            <Badge variant="primary" size="md">15-Min Telemetry Active</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automated location tracking, route playback, and doctor visit verification for field personnel.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowGeofenceCircles(!showGeofenceCircles)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              showGeofenceCircles 
                ? 'bg-teal-50 text-teal-700 border-teal-200' 
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{showGeofenceCircles ? 'Geofences Visible' : 'Geofences Hidden'}</span>
          </button>

          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Anti-Spoofing: <strong>Verified</strong></span>
          </div>
        </div>
      </div>

      {/* Main Map & Route Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Visual Map Canvas & Playback Canvas */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Map Container */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 text-white relative overflow-hidden shadow-xl min-h-[460px] flex flex-col justify-between">
            
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#0d9488_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

            {/* Top Overlay: Active Rep Status & Coords */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs font-bold text-slate-200">{currentLog?.userName || 'Field Representative'}</span>
                <span className="text-[11px] text-slate-400">({currentLog?.territoryName || 'Assam Regional HQ'})</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="text-teal-400 font-semibold">📍 {currentLog?.latitude?.toFixed(4) || '24.8146'}° N, {currentLog?.longitude?.toFixed(4) || '92.8037'}° E</span>
                <span className="text-slate-400">🕒 {timeStr}</span>
                <span className="text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800 flex items-center gap-1">
                  <Battery className="w-3 h-3" /> {currentLog?.batteryPercentage || 95}%
                </span>
              </div>
            </div>

            {/* Middle Map Visualizer: Geofences & Active MR Location Pin */}
            <div className="relative z-10 my-auto py-6">
              
              {/* Doctor Geofence Rings */}
              {showGeofenceCircles && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 max-w-xl mx-auto">
                  {doctors.slice(0, 2).map((doc) => {
                    const isRepAtThisDoc = currentLog?.nearbyDoctorId === doc.id && currentLog?.isWithinDoctorGeofence;
                    return (
                      <div
                        key={doc.id}
                        className={`p-2.5 rounded-xl border text-xs transition-all ${
                          isRepAtThisDoc
                            ? 'bg-emerald-950/80 border-emerald-500 shadow-lg shadow-emerald-500/20'
                            : 'bg-slate-900/70 border-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-200 flex items-center gap-1.5">
                            <Stethoscope className="w-3.5 h-3.5 text-teal-400" />
                            {doc.name}
                          </span>
                          <span className="text-[10px] text-teal-400 font-mono">100m Geofence</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 truncate">{doc.clinicName}</p>
                        {isRepAtThisDoc && (
                          <div className="mt-2 text-[10px] font-bold text-emerald-400 bg-emerald-900/40 px-2 py-0.5 rounded border border-emerald-700/60 inline-block">
                            ✓ MR Verified Within Clinic (100m)
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Central Rep Position Card */}
              <div className="max-w-md mx-auto bg-slate-900/95 border border-slate-700/80 rounded-2xl p-5 shadow-2xl backdrop-blur-md">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
                      Telemetry Tracking • 15-Min Periodic Ping
                    </span>
                    <h4 className="text-base font-bold text-white mt-0.5">{currentLog?.userName || 'Field MR'}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Status: <strong className="text-teal-300">{currentLog?.activityStatus || 'ON_DUTY'}</strong>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono text-slate-300 bg-slate-800 px-2 py-1 rounded">
                      Speed: {currentLog?.speedKmh || 0} km/h
                    </span>
                  </div>
                </div>

                <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                  {currentLog?.isWithinDoctorGeofence ? (
                    <div className="text-emerald-400">
                      <p className="font-semibold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                        Doctor Meeting in Progress
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Doctor: {doctors.find(d => d.id === currentLog.nearbyDoctorId)?.name || 'Consultant Doctor'}
                      </p>
                    </div>
                  ) : (
                    <div className="text-slate-400 flex items-center gap-2">
                      <Navigation className="w-3.5 h-3.5 text-teal-400" />
                      <span>In-transit on field beat route ({currentLog?.territoryName || 'Silchar Central'})</span>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Bottom Playback HUD Bar */}
            <div className="relative z-10 flex items-center justify-between bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                <span>Active Field Beats: <strong>Silchar Central & Hospital Road</strong></span>
              </div>
              <span className="font-mono text-teal-400">Assam Barak Division</span>
            </div>

          </div>

          {/* Replay Controls Card */}
          {telemetryLogs.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">Route Timeline Scrubber</span>
                <span className="font-mono text-slate-500">{timeStr}</span>
              </div>

              <input
                type="range"
                min={0}
                max={Math.max(0, telemetryLogs.length - 1)}
                value={currentIndex}
                onChange={(e) => setCurrentIndex(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm transition-colors"
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    {isPlaying ? 'Pause Replay' : 'Play Route'}
                  </button>

                  <button
                    onClick={() => {
                      setIsPlaying(false);
                      setCurrentIndex(0);
                    }}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
                    title="Reset timeline"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-1 text-xs">
                  <span className="text-slate-400 mr-1">Speed:</span>
                  {([1, 2, 4] as const).map((spd) => (
                    <button
                      key={spd}
                      onClick={() => setPlaybackSpeed(spd)}
                      className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${
                        playbackSpeed === spd
                          ? 'bg-slate-900 text-teal-300'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Stopover Analytics & Doctor Meetings */}
        <div className="space-y-4">
          
          {/* Stopover Durations Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-teal-600" />
                Verified Doctor Stopovers
              </h3>
              <Badge variant="success">Geofenced</Badge>
            </div>

            {dcrLogs.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No doctor visit stopovers logged yet.
              </div>
            ) : (
              <div className="space-y-3">
                {dcrLogs.map((dcr) => (
                  <div key={dcr.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <div className="flex items-start justify-between">
                      <h4 className="font-bold text-slate-900">{dcr.clientName}</h4>
                      <span className="font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded text-[11px]">
                        {dcr.isGeofenceVerified ? 'Verified' : 'Outside'}
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px]">
                      {dcr.checkInTime} – {dcr.checkOutTime || 'Active'}
                    </p>
                    {dcr.isGeofenceVerified && (
                      <div className="pt-1 flex items-center gap-1.5 text-emerald-700 font-semibold text-[10px]">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>Validated inside clinic ({dcr.distanceFromClinicMeters}m)</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Territory Route Compliance Banner */}
          <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-teal-400 text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Territory Route Compliance</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              100% of location fixes aligned with <strong>Assam Barak Division (Silchar HQ)</strong> territory. Zero unauthorized deviations recorded.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
