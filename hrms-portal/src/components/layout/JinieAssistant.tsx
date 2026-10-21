import React, { useState } from 'react';
import { HrmsUser } from '../../types';
import { HrmsService } from '../../services/hrmsService';
import { 
  X, 
  Send, 
  Sparkles, 
  Calendar, 
  Clock, 
  FileText, 
  ShieldCheck, 
  MessageSquare 
} from 'lucide-react';
import { ActiveModule } from './Navbar';

interface JinieAssistantProps {
  currentUser: HrmsUser;
  onNavigateModule: (mod: ActiveModule) => void;
  onTriggerGeoPunch: () => void;
}

export const JinieAssistant: React.FC<JinieAssistantProps> = ({ 
  currentUser, 
  onNavigateModule,
  onTriggerGeoPunch
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [chatLog, setChatLog] = useState<{ sender: 'jinie' | 'user'; text: string; action?: () => void; actionLabel?: string }[]>([
    {
      sender: 'jinie',
      text: `Hi ${currentUser.name}! I am Jinie, your 24/7 AI HR Assistant. How can I assist you with your leaves, attendance, slips, or claims today?`,
    }
  ]);

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query) return;

    const userEntry = { sender: 'user' as const, text: query };
    const lower = query.toLowerCase();

    let botResponse: {
      sender: 'jinie';
      text: string;
      action?: () => void;
      actionLabel?: string;
    } = {
      sender: 'jinie',
      text: "I can help you with your leaves, geo-attendance, salary slips, reimbursements, or performance goals. Feel free to choose one of the quick options below!",
      action: undefined,
      actionLabel: undefined,
    };

    if (lower.includes('leave') || lower.includes('casual') || lower.includes('sick') || lower.includes('balance')) {
      const balances = HrmsService.getLeaveBalances(currentUser.id);
      const earned = balances.find(b => b.leaveType === 'Earned Leave')?.currentBalance || 12;
      const casual = balances.find(b => b.leaveType === 'Casual Leave')?.currentBalance || 0.5;
      const sick = balances.find(b => b.leaveType === 'Sick Leave')?.currentBalance || 0.5;
      botResponse = {
        sender: 'jinie',
        text: `Your current leave balances are: Earned Leave: ${earned}d, Casual Leave: ${casual}d, Sick Leave: ${sick}d. Would you like to submit a new leave application?`,
        action: () => {
          setIsOpen(false);
          onNavigateModule('LEAVE');
        },
        actionLabel: 'Open Leave Module',
      };
    } else if (lower.includes('punch') || lower.includes('attendance') || lower.includes('selfie') || lower.includes('geo')) {
      botResponse = {
        sender: 'jinie',
        text: "You can punch in or punch out with your Geo-Selfie camera verification and 100m geofence lock right now!",
        action: () => {
          setIsOpen(false);
          onTriggerGeoPunch();
        },
        actionLabel: 'Open Geo-Selfie Camera',
      };
    } else if (lower.includes('payslip') || lower.includes('salary') || lower.includes('slip') || lower.includes('form 16')) {
      botResponse = {
        sender: 'jinie',
        text: "Your September 2026 Salary Slip is generated and available for download. Net Pay: ₹71,200 (credited to HDFC Bank).",
        action: () => {
          setIsOpen(false);
          onNavigateModule('PAYROLL');
        },
        actionLabel: 'View My Slips',
      };
    } else if (lower.includes('holiday')) {
      botResponse = {
        sender: 'jinie',
        text: "Next 2 company holidays are: Diwali (Deepavali) on Mon, 09 Nov and Christmas on Fri, 25 Dec.",
      };
    } else if (lower.includes('manager') || lower.includes('l1') || lower.includes('hrbp')) {
      botResponse = {
        sender: 'jinie',
        text: `Your reporting chain: L1 Manager: ${currentUser.l1Manager.name} (${currentUser.l1Manager.code}), L2 Manager: ${currentUser.l2Manager.name}, and HRBP: ${currentUser.hrbp.name}.`,
      };
    }

    setChatLog(prev => [...prev, userEntry, botResponse]);
    setInputMessage('');
  };

  return (
    <>
      {/* Floating Jinie Button (Exact replica of Darwinbox bottom-right widget) */}
      <button
        onClick={() => setIsOpen(true)}
        title="Ask Jinie - AI HR Assistant"
        className="fixed bottom-5 right-5 z-40 bg-[#E53935] hover:bg-[#D32F2F] text-white p-3.5 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer border-2 border-white/80"
      >
        <span className="font-black text-sm tracking-tighter">Jinie</span>
      </button>

      {/* Interactive Modal Drawer */}
      {isOpen && (
        <div className="fixed bottom-20 right-5 z-50 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col h-[520px] animate-in fade-in slide-in-from-bottom-5">
          
          {/* Header */}
          <div className="bg-[#E53935] text-white px-4 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-black text-xs">
                J
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight">Jinie Virtual Assistant</h3>
                <p className="text-[10px] text-white/80">Darwinbox HR Copilot</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Prompt Suggestions */}
          <div className="p-2.5 bg-slate-50 border-b border-slate-100 flex gap-1.5 overflow-x-auto no-scrollbar text-[11px]">
            <button
              onClick={() => handleSend("What is my leave balance?")}
              className="px-2.5 py-1 bg-white border border-slate-200 rounded-full hover:bg-sky-50 hover:text-sky-700 transition-colors shrink-0 cursor-pointer font-medium text-slate-700"
            >
              Leave Balances
            </button>
            <button
              onClick={() => handleSend("Punch in with Geo-Selfie")}
              className="px-2.5 py-1 bg-white border border-slate-200 rounded-full hover:bg-sky-50 hover:text-sky-700 transition-colors shrink-0 cursor-pointer font-medium text-slate-700"
            >
              Geo-Selfie Punch
            </button>
            <button
              onClick={() => handleSend("Download my salary slip")}
              className="px-2.5 py-1 bg-white border border-slate-200 rounded-full hover:bg-sky-50 hover:text-sky-700 transition-colors shrink-0 cursor-pointer font-medium text-slate-700"
            >
              My Payslip
            </button>
            <button
              onClick={() => handleSend("Upcoming holidays")}
              className="px-2.5 py-1 bg-white border border-slate-200 rounded-full hover:bg-sky-50 hover:text-sky-700 transition-colors shrink-0 cursor-pointer font-medium text-slate-700"
            >
              Holidays
            </button>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 p-3.5 space-y-3 overflow-y-auto text-xs bg-[#FAFBFD]">
            {chatLog.map((msg, i) => (
              <div 
                key={i} 
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#E53935] text-white rounded-br-xs'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-2xs'
                }`}>
                  {msg.text}
                </div>

                {msg.action && (
                  <button
                    onClick={msg.action}
                    className="mt-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-[11px] font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    {msg.actionLabel} →
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              placeholder="Ask Jinie anything about HR..."
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-red-500 focus:bg-white text-slate-900"
            />
            <button
              type="submit"
              className="p-2 bg-[#E53935] hover:bg-[#D32F2F] text-white rounded-xl transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};
