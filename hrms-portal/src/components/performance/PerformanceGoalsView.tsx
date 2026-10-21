import React, { useState } from 'react';
import { HrmsUser, PerformanceGoal } from '../../types';
import { HrmsService } from '../../services/hrmsService';
import { 
  Target, 
  Plus, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  Award, 
  TrendingUp, 
  Calendar, 
  ChevronRight,
  BarChart3
} from 'lucide-react';

interface PerformanceGoalsViewProps {
  currentUser: HrmsUser;
}

export const PerformanceGoalsView: React.FC<PerformanceGoalsViewProps> = ({ currentUser }) => {
  const [goals, setGoals] = useState<PerformanceGoal[]>(() => HrmsService.getGoals());
  const [selectedCycle, setSelectedCycle] = useState<'H1' | 'H2'>('H2');
  const [fiscalYear, setFiscalYear] = useState('Apr 2026 - Mar 2027');
  const [showAddModal, setShowAddModal] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // New Goal Form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [weightPercent, setWeightPercent] = useState<number>(25);
  const [targetMetric, setTargetMetric] = useState('');
  const [achievedMetric, setAchievedMetric] = useState('');

  const filteredGoals = goals.filter(g => g.cycle === selectedCycle);
  const totalWeight = filteredGoals.reduce((sum, g) => sum + g.weightPercent, 0);
  const averageScore = filteredGoals.length > 0 
    ? (filteredGoals.reduce((sum, g) => sum + g.score, 0) / filteredGoals.length).toFixed(1)
    : '0.0';

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !targetMetric) return;

    if (filteredGoals.length >= 6) {
      alert('Policy Restriction: Maximum 6 goals are permitted biyearly.');
      return;
    }

    const newGoal = HrmsService.addGoal({
      employeeId: currentUser.id,
      fiscalYear,
      cycle: selectedCycle,
      title,
      description,
      weightPercent,
      targetMetric,
      achievedMetric: achievedMetric || '0',
      score: 3.5,
    });

    setGoals(HrmsService.getGoals());
    setShowAddModal(false);
    setTitle('');
    setDescription('');
    setTargetMetric('');
    setAchievedMetric('');
    setSuccessToast(`New goal added for ${selectedCycle}!`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {successToast && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center justify-between text-xs font-semibold shadow-2xs animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast(null)} className="text-emerald-500 hover:text-emerald-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Header Card (Darwinbox Screen 6: "My Goal") */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Target className="w-5 h-5 text-sky-600" />
            My Goal & Appraisal Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Key Result Areas (KRAs), weight allocations, and performance evaluations for {currentUser.name}
          </p>
        </div>

        {/* Controls: Fiscal Year Dropdown, H1/H2 Switcher, Add Goal */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Fiscal Year */}
          <select
            value={fiscalYear}
            onChange={e => setFiscalYear(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 text-slate-700 font-semibold focus:outline-none focus:border-sky-500 cursor-pointer"
          >
            <option value="Apr 2026 - Mar 2027">Apr 2026 - Mar 2027</option>
            <option value="Apr 2025 - Mar 2026">Apr 2025 - Mar 2026</option>
          </select>

          {/* H1 / H2 Cycle Buttons */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setSelectedCycle('H1')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCycle === 'H1' ? 'bg-white text-sky-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              H1
            </button>
            <button
              onClick={() => setSelectedCycle('H2')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCycle === 'H2' ? 'bg-white text-sky-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              H2
            </button>
          </div>

          {/* Add Goal Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#E0F2FE] text-[#075985] hover:bg-[#BAE6FD] transition-all cursor-pointer shadow-2xs hover:scale-102"
          >
            <Plus className="w-4 h-4 text-[#0284C7]" />
            Add Goal
          </button>
        </div>
      </div>

      {/* Mandatory Darwinbox Screen 6 Policy Alert Banner */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5 flex items-center justify-between text-xs text-amber-900 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="font-semibold">
            • You should have minimum 4 and maximum 6 Goal biyearly
          </span>
        </div>
        <div className="text-[11px] font-bold text-amber-800">
          Current Count: {filteredGoals.length} / 6 Goals (Weight: {totalWeight}%)
        </div>
      </div>

      {/* Goal Summary Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Active Goals</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-slate-800">{filteredGoals.length}</span>
            <span className="text-xs font-bold text-sky-600">Cycle {selectedCycle}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Weight Assigned</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className={`text-2xl font-black ${totalWeight === 100 ? 'text-emerald-600' : 'text-amber-600'}`}>
              {totalWeight}%
            </span>
            <span className="text-xs text-slate-400 font-semibold">Target: 100%</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Appraisal Rating Average</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-indigo-700">{averageScore} / 5.0</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
              Exceeds Expectations
            </span>
          </div>
        </div>
      </div>

      {/* Goal Cards Grid (Darwinbox Screen 6 Scorecards) */}
      <div className="space-y-4">
        {filteredGoals.map((g, idx) => {
          const scorePercent = Math.min(100, Math.round((g.score / 5.0) * 100));
          return (
            <div 
              key={g.id} 
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-xl bg-sky-50 text-sky-700 font-bold text-xs flex items-center justify-center shrink-0 border border-sky-100">
                    #{idx + 1}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight">{g.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{g.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start shrink-0">
                  <span className="px-2.5 py-1 rounded-full text-xs font-black bg-slate-100 text-slate-700">
                    Weight: {g.weightPercent}%
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                    Score: {g.score.toFixed(1)} / 5.0
                  </span>
                </div>
              </div>

              {/* Metrics & Target Row */}
              <div className="bg-slate-50 rounded-xl p-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Target Metric</span>
                  <span className="font-semibold text-slate-800">{g.targetMetric}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Achieved Outcome</span>
                  <span className="font-bold text-emerald-700">{g.achievedMetric}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between items-center text-[11px] mb-1">
                  <span className="text-slate-500 font-semibold">Performance Rating Index</span>
                  <span className="font-bold text-slate-800">{scorePercent}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-sky-500 to-indigo-600 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${scorePercent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: Add New Goal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-scale-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-sky-600" />
                <h3 className="font-bold text-slate-900 text-sm">Add New Goal ({selectedCycle})</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddGoal} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Goal / Objective Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Expand Pharma Distribution in Tier-2 Markets"
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description / Deliverables</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Specific actions and deliverables expected..."
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-sky-500 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Weightage (%)</label>
                  <input
                    type="number"
                    min="5"
                    max="50"
                    value={weightPercent}
                    onChange={e => setWeightPercent(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-sky-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Metric</label>
                  <input
                    type="text"
                    value={targetMetric}
                    onChange={e => setTargetMetric(e.target.value)}
                    placeholder="e.g. ₹50,00,000 Revenue"
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Current Achieved Metric (Optional)</label>
                <input
                  type="text"
                  value={achievedMetric}
                  onChange={e => setAchievedMetric(e.target.value)}
                  placeholder="e.g. ₹15,00,000 Achieved to date"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
