import React, { useState } from 'react';
import { HrmsUser, WishesItem, HolidayItem } from '../../types';
import { HrmsService } from '../../services/hrmsService';
import { 
  Calendar, 
  Clock, 
  Receipt, 
  FileText, 
  Target, 
  Cake, 
  Sparkles, 
  Users, 
  PartyPopper, 
  Camera, 
  ShieldCheck, 
  ArrowRight,
  Gift
} from 'lucide-react';
import { ActiveModule } from '../layout/Navbar';

interface DashboardViewProps {
  currentUser: HrmsUser;
  onNavigateModule: (mod: ActiveModule) => void;
  onOpenGeoSelfie: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ 
  currentUser, 
  onNavigateModule,
  onOpenGeoSelfie
}) => {
  const wishes = HrmsService.getWishes();
  const holidays = HrmsService.getHolidays();
  const [wishesTab, setWishesTab] = useState<'BIRTHDAY' | 'WORK_ANNIVERSARY' | 'NEW_JOINER'>('BIRTHDAY');

  const filteredWishes = wishes.filter(w => w.type === wishesTab);

  return (
    <div className="space-y-6">
      
      {/* 1. "Suggested for you" Action Pills (Darwinbox Signature Row) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <h3 className="text-xs font-bold text-slate-900 mb-3 tracking-tight">Suggested for you</h3>
        <div className="flex flex-wrap gap-3">
          
          {/* New Leave */}
          <button
            onClick={() => onNavigateModule('LEAVE')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#FDE8E8] text-[#9B1C1C] hover:bg-[#FBD5D5] transition-all cursor-pointer shadow-2xs hover:scale-102"
          >
            <Calendar className="w-4 h-4 text-[#E02424]" />
            New Leave
          </button>

          {/* My Attendance */}
          <button
            onClick={() => onNavigateModule('ATTENDANCE')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#FEF08A]/50 text-[#854D0E] hover:bg-[#FEF08A] transition-all cursor-pointer shadow-2xs hover:scale-102"
          >
            <Clock className="w-4 h-4 text-[#CA8A04]" />
            My Attendance
          </button>

          {/* Reimbursement */}
          <button
            onClick={() => onNavigateModule('REIMBURSEMENT')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#DCFCE7] text-[#166534] hover:bg-[#BBF7D0] transition-all cursor-pointer shadow-2xs hover:scale-102"
          >
            <Receipt className="w-4 h-4 text-[#16A34A]" />
            Reimbursement...
          </button>

          {/* My Slips */}
          <button
            onClick={() => onNavigateModule('PAYROLL')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#E0E7FF] text-[#3730A3] hover:bg-[#C7D2FE] transition-all cursor-pointer shadow-2xs hover:scale-102"
          >
            <FileText className="w-4 h-4 text-[#4F46E5]" />
            My Slips
          </button>

          {/* My Goals */}
          <button
            onClick={() => onNavigateModule('PERFORMANCE')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#E0F2FE] text-[#075985] hover:bg-[#BAE6FD] transition-all cursor-pointer shadow-2xs hover:scale-102"
          >
            <Target className="w-4 h-4 text-[#0284C7]" />
            My Goals
          </button>

          {/* Geo-Selfie Quick Launch */}
          <button
            onClick={onOpenGeoSelfie}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#0B192C] text-white hover:bg-slate-800 transition-all cursor-pointer shadow-2xs hover:scale-102 ml-auto"
          >
            <Camera className="w-4 h-4 text-emerald-400" />
            Geo-Selfie Check-In
          </button>

        </div>
      </div>

      {/* 2. Dual Grid: Left Wishes & Holidays | Right Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Section (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Wishes Card */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
              <div>
                {/* Red Wishes Header */}
                <div className="bg-[#E53935] text-white px-4 py-2.5 flex items-center justify-between">
                  <span className="font-bold text-xs">Today (21 Oct 2026)</span>
                  <Sparkles className="w-4 h-4" />
                </div>

                {/* Subtabs: Birthdays, Work Anniversary, New Joiners */}
                <div className="flex border-b border-slate-100 text-[11px] font-bold text-slate-500 bg-slate-50/60">
                  <button
                    onClick={() => setWishesTab('BIRTHDAY')}
                    className={`flex-1 py-2 text-center transition-colors cursor-pointer border-b-2 ${
                      wishesTab === 'BIRTHDAY' ? 'border-[#E53935] text-[#E53935] bg-white' : 'border-transparent'
                    }`}
                  >
                    Birthdays
                  </button>
                  <button
                    onClick={() => setWishesTab('WORK_ANNIVERSARY')}
                    className={`flex-1 py-2 text-center transition-colors cursor-pointer border-b-2 ${
                      wishesTab === 'WORK_ANNIVERSARY' ? 'border-[#E53935] text-[#E53935] bg-white' : 'border-transparent'
                    }`}
                  >
                    Work Anniversary
                  </button>
                  <button
                    onClick={() => setWishesTab('NEW_JOINER')}
                    className={`flex-1 py-2 text-center transition-colors cursor-pointer border-b-2 ${
                      wishesTab === 'NEW_JOINER' ? 'border-[#E53935] text-[#E53935] bg-white' : 'border-transparent'
                    }`}
                  >
                    New Joiners
                  </button>
                </div>

                {/* Wishes List */}
                <div className="p-3.5 space-y-3">
                  {filteredWishes.map(item => (
                    <div key={item.id} className="flex items-center justify-between text-xs py-1 border-b border-slate-50 last:border-none">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {item.name[0]}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-xs">{item.name}</h4>
                          <p className="text-[10px] text-slate-400">{item.employeeCode} | {item.designation}</p>
                        </div>
                      </div>
                      <span className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
                        <Cake className="w-4 h-4" />
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-2.5 border-t border-slate-100 text-center">
                <span className="text-[11px] font-bold text-sky-600 hover:underline cursor-pointer">
                  +2 more wishes
                </span>
              </div>
            </div>

            {/* Upcoming Holidays Card */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
              <div>
                {/* Coral Orange Header */}
                <div className="bg-[#FF6E40] text-white px-4 py-2.5 flex items-center justify-between">
                  <span className="font-bold text-xs">Next 2 holidays</span>
                  <Calendar className="w-4 h-4" />
                </div>

                <div className="p-4 divide-y divide-slate-100 text-xs">
                  {holidays.slice(0, 2).map(hol => (
                    <div key={hol.id} className="py-3 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-800 text-xs">{hol.name}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">National Holiday</p>
                      </div>
                      <span className="font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg text-[11px]">
                        {hol.dateStr}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                <button
                  onClick={() => onNavigateModule('LEAVE')}
                  className="text-[11px] font-bold text-sky-600 hover:underline cursor-pointer"
                >
                  View full holiday calendar →
                </button>
              </div>
            </div>

          </div>

          {/* Quick Geo-Selfie Telemetry Summary */}
          <div className="bg-gradient-to-r from-[#0B192C] to-slate-900 text-white rounded-2xl p-5 border border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-sky-500/20 text-sky-400 rounded-xl border border-sky-500/30">
                <Camera className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm">Geo-Selfie Attendance Ready</h4>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-full">
                    GPS Active
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  100m geofence lock verified for {currentUser.locationHierarchy.split('>').slice(-2).join(' - ')}.
                </p>
              </div>
            </div>
            <button
              onClick={onOpenGeoSelfie}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shrink-0"
            >
              Punch Now
            </button>
          </div>

        </div>

        {/* Right Section: Announcements (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col items-center justify-center text-center">
          <div className="w-32 h-32 mb-4 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
            <FileText className="w-12 h-12 text-slate-400" />
          </div>
          <h4 className="font-bold text-slate-800 text-sm">There are no announcements for you at the moment</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            Company broadcasts, policy revisions, and town hall invites will show up here.
          </p>
        </div>

      </div>

    </div>
  );
};
