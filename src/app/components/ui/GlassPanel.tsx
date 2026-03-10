import React from 'react';

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export function GlassPanel({ children, className = '', ...props }: GlassPanelProps) {
    return (
        <div
            className={`glass-premium p-6 md:p-8 rounded-[2rem] border-[var(--color-accent-green)]/20 shadow-2xl relative overflow-hidden ${className}`}
            {...props}
        >
            <div className="absolute inset-0 rounded-[2rem] border border-white/5 pointer-events-none z-0"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-accent-green)]/30 to-transparent z-0"></div>
            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </div>
    );
}
