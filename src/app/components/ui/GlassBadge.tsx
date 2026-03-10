import React from 'react';

interface GlassBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    variant?: 'success' | 'warning' | 'danger' | 'neutral';
    pulse?: boolean;
}

const variantStyles = {
    success: 'bg-[var(--color-accent-green)]/10 border-[var(--color-accent-green)]/30 text-[var(--color-accent-green)]',
    warning: 'bg-amber-500/10 border-amber-500/30 text-amber-500',
    danger: 'bg-red-500/10 border-red-500/30 text-red-500',
    neutral: 'bg-white/10 border-white/20 text-slate-300',
};

const pulseColors = {
    success: 'bg-[var(--color-accent-green)] shadow-[0_0_8px_var(--color-accent-green)]',
    warning: 'bg-amber-500 shadow-[0_0_8px_#f59e0b]',
    danger: 'bg-red-500 shadow-[0_0_8px_#ef4444]',
    neutral: 'bg-slate-400 shadow-[0_0_8px_#94a3b8]',
};
export function GlassBadge({ children, className = '', variant = 'success', pulse = false, ...props }: GlassBadgeProps) {
    return (
        <div
            className={`flex items-center gap-2 px-3 py-1 rounded-full border backdrop-blur-md text-[10px] font-bold uppercase tracking-wider ${variantStyles[variant]} ${className}`}
            {...props}
        >
            {pulse && (
                <span className="relative flex h-2 w-2">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${pulseColors[variant].split(' ')[0]}`}></span>
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${pulseColors[variant]}`}></span>
                </span>
            )}
            {children}
        </div>
    );
}
