import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: string; isPositive: boolean };
  color?: 'teal' | 'blue' | 'emerald' | 'amber' | 'purple';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'teal'
}) => {
  return (
    <div className="bg-white rounded-xl border border-[#DCE4EB] hover:border-[#18A6A6] p-5 shadow-2xs hover:shadow-xs transition-all group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">{title}</p>
          <h3 className="text-2xl font-black text-[#10243A] mt-1 tracking-tight group-hover:text-[#18A6A6] transition-colors">{value}</h3>
          {subtitle && <p className="text-xs text-[#64748B] mt-0.5">{subtitle}</p>}
        </div>
        <div className="p-2.5 rounded-xl bg-[#F1F6F8] border border-[#DCE4EB] text-[#18A6A6] group-hover:bg-[#10243A] group-hover:text-white transition-colors">
          <Icon className="w-5 h-5 stroke-[2]" />
        </div>
      </div>
      {trend && (
        <div className="mt-3.5 pt-3 border-t border-[#F1F6F8] flex items-center gap-1.5 text-xs">
          <span className={trend.isPositive ? 'text-emerald-700 font-semibold' : 'text-rose-600 font-semibold'}>
            {trend.isPositive ? '↑' : '↓'} {trend.value}
          </span>
          <span className="text-[#64748B]">vs last month</span>
        </div>
      )}
    </div>
  );
};
