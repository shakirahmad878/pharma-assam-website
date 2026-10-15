import React, { useState } from 'react';
import { AttendanceRecord, User } from '../../types';
import { Badge } from '../common/Badge';
import { 
  UserCheck, 
  MapPin, 
  Clock, 
  Camera, 
  Battery, 
  Calendar
} from 'lucide-react';

interface GeoAttendanceViewProps {
  currentUser: User;
}

export const GeoAttendanceView: React.FC<GeoAttendanceViewProps> = ({ currentUser }) => {
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [punchInTime, setPunchInTime] = useState('');
  const [punchOutTime, setPunchOutTime] = useState<string | null>(null);
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([]);

  const handlePunchToggle = () => {
    if (isPunchedIn) {
      // Punch Out
      const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setPunchOutTime(timeNow);
      setIsPunchedIn(false);
      setAttendanceHistory(prev => {
        if (prev.length === 0) return prev;
        return [
          {
            ...prev[0],
            punchOutTime: timeNow,
          },
          ...prev.slice(1)
        ];
      });
    } else {
      // Punch In
      const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setPunchInTime(timeNow);
      setPunchOutTime(null);
      setIsPunchedIn(true);
      const newRec: AttendanceRecord = {
        id: `att-${Date.now()}`,
        userId: currentUser?.id || 'usr-default',
        userName: currentUser?.name || 'Representative',
        date: new Date().toISOString().split('T')[0],
        punchInTime: timeNow,
        punchInLocation: {
          latitude: 24.8146,
          longitude: 92.8037,
          address: currentUser?.territoryName || 'Silchar Regional HQ, Assam',
        },
        selfieUrl: '',
        batteryPercentage: 95,
        totalDistanceKm: 0,
        status: 'PRESENT',
      };
      setAttendanceHistory(prev => [newRec, ...prev]);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="neu-card p-5 border border-[#DCE4EB] bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-[#10243A] flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 text-[#137F83] flex items-center justify-center font-bold">
              <UserCheck className="w-4 h-4 text-[#137F83]" />
            </div>
            Field Geo-Attendance & Shift Controls
          </h2>
          <p className="text-xs text-[#64748B] mt-1">
            Geotagged punch-in, GPS shift start verification, and duty status for field personnel.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={isPunchedIn ? 'success' : 'neutral'} size="md">
            {isPunchedIn ? '🟢 On Duty (Active Shift)' : '⚪ Off Duty'}
          </Badge>
        </div>
      </div>

      {/* Main Action Banner */}
      <div className="neu-card p-6 border border-[#DCE4EB] bg-white shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="text-[10px] uppercase tracking-wider font-bold text-[#137F83] bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-full">
            Automated 15-Min Telemetry Linked
          </span>
          <h3 className="text-xl font-bold text-[#10243A]">{isPunchedIn ? 'Field Shift In Progress' : 'Ready to Start Field Duty'}</h3>
          <p className="text-xs text-[#64748B] max-w-lg">
            {isPunchedIn
              ? `Punched in today at ${punchInTime}. 15-minute background location pings are active and verifying doctor visits.`
              : 'Punch in with GPS verification to begin recording doctor calls and automated travel allowance.'}
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-[#64748B]">
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[#137F83]" /> Shift: 09:00 AM – 06:30 PM</span>
            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#137F83]" /> Territory: {currentUser?.territoryName || 'Silchar HQ, Assam'}</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 shrink-0">
          <button
            onClick={handlePunchToggle}
            className={`px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              isPunchedIn
                ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 shadow-xs'
                : 'bg-[#10243A] hover:bg-[#182F49] text-white shadow-xs'
            }`}
          >
            <Camera className="w-4 h-4" />
            {isPunchedIn ? 'Punch Out (End Duty)' : 'Geo-Punch In (Start Shift)'}
          </button>
          <span className="text-[11px] text-[#64748B]">Captures GPS coordinates & verification</span>
        </div>
      </div>

      {/* Attendance History Logs */}
      <div className="neu-card border border-[#DCE4EB] bg-white p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3.5 border-b border-[#DCE4EB]">
          <h3 className="font-bold text-sm text-[#10243A] flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#137F83]" />
            Attendance & GPS Shift Logbook
          </h3>
          <span className="text-xs text-[#64748B]">Total Shifts: <strong className="text-[#137F83]">{attendanceHistory.length}</strong></span>
        </div>

        {attendanceHistory.length === 0 ? (
          <div className="py-12 text-center text-[#64748B] space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center mx-auto text-[#137F83]">
              <UserCheck className="w-6 h-6" />
            </div>
            <p className="text-xs font-semibold text-[#10243A]">No shift records logged yet</p>
            <p className="text-[11px] text-[#64748B] max-w-sm mx-auto">
              Click "Geo-Punch In" above to start your daily shift and record GPS location attendance.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {attendanceHistory.map((att) => (
              <div
                key={att.id}
                className="p-4 rounded-xl bg-[#F8FAFC] border border-[#DCE4EB] flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-[#137F83] flex items-center justify-center font-bold">
                    {(att.userName || 'MR').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#10243A]">{att.date}</span>
                      <Badge variant="success">Present</Badge>
                    </div>
                    <p className="text-[#64748B] mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#137F83]" />
                      {att.punchInLocation.address}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t md:border-t-0 pt-2 md:pt-0 border-[#DCE4EB]">
                  <div>
                    <span className="text-[#64748B] text-[11px] block">In / Out Time:</span>
                    <span className="font-semibold text-[#10243A]">
                      {att.punchInTime} – {att.punchOutTime || 'Active'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#64748B] text-[11px] block">Verified GPS Route:</span>
                    <span className="font-semibold text-[#137F83] font-mono">
                      {att.totalDistanceKm} km
                    </span>
                  </div>
                  <div>
                    <span className="text-[#64748B] text-[11px] block">Battery at Start:</span>
                    <span className="font-semibold text-[#10243A] flex items-center gap-1">
                      <Battery className="w-3.5 h-3.5 text-emerald-600" /> {att.batteryPercentage}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
