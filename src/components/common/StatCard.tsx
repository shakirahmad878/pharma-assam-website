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
    <div className="neu-card p-5 transition-all hover:border-[#6C5636]/80 group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#B99D73]">{title}</p>
          <h3 className="text-2xl font-black text-[#F2ECE1] mt-1.5 tracking-tight group-hover:text-[#D4BD95] transition-colors">{value}</h3>
          {subtitle && <p className="text-xs text-[#857866] mt-0.5">{subtitle}</p>}
        </div>
        <div className="p-3 rounded-xl bg-[#0c0c09] border border-[#6C5636]/50 shadow-[inset_2px_2px_5px_#040403,inset_-2px_-2px_5px_#1c1a14] text-[#B99D73] group-hover:text-[#D4BD95] transition-colors">
          <Icon className="w-5 h-5 stroke-[2.2]" />
        </div>
      </div>
      {trend && (
        <div className="mt-3.5 pt-3 border-t border-[#282319] flex items-center gap-1.5 text-xs">
          <span className={trend.isPositive ? 'text-[#B99D73] font-bold' : 'text-[#df7a7a] font-bold'}>
            {trend.isPositive ? '↑' : '↓'} {trend.value}
          </span>
          <span className="text-[#857866]">vs last month</span>
        </div>
      )}
    </div>
  );
};
