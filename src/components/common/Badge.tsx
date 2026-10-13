import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'purple';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral', size = 'sm' }) => {
  const variantStyles = {
    primary: 'bg-[#181711] text-[#B99D73] border-[#6C5636]/60 shadow-[inset_1px_1px_3px_#040403,1px_1px_3px_#181711]',
    success: 'bg-[#121811] text-[#A6C48A] border-[#384D2B]/60 shadow-[inset_1px_1px_3px_#040403,1px_1px_3px_#141913]',
    warning: 'bg-[#1a160d] text-[#D4BD95] border-[#8A7049]/60 shadow-[inset_1px_1px_3px_#040403,1px_1px_3px_#1c1811]',
    danger: 'bg-[#1c0f0f] text-[#E08A8A] border-[#662B2B]/60 shadow-[inset_1px_1px_3px_#040403,1px_1px_3px_#1e1212]',
    neutral: 'bg-[#11110e] text-[#857866] border-[#282319] shadow-[inset_1px_1px_3px_#040403,1px_1px_3px_#181711]',
    purple: 'bg-[#18121a] text-[#C4A6D4] border-[#5E3B6E]/60 shadow-[inset_1px_1px_3px_#040403,1px_1px_3px_#1c141e]',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-lg border ${variantStyles[variant]} ${sizeStyles[size]}`}
    >
      {children}
    </span>
  );
};
