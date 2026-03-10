import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    glow?: boolean;
    animated?: boolean;
    delay?: string;
}

export function GlassCard({ children, className = '', glow = false, animated = false, delay, ...props }: GlassCardProps) {
    return (
        <div
            className={`glass-card-effect rounded-2xl relative ${animated ? 'animate-[float_6s_ease-in-out_infinite]' : ''} ${className}`}
            style={delay ? { animationDelay: delay } : undefined}
            {...props}
        >
            <div className="absolute -inset-0.5 bg-gradient-to-br from-[var(--color-accent-green)]/20 to-transparent rounded-2xl blur-sm opacity-30 pointer-events-none z-0"></div>
            <div className="relative z-10 w-full h-full">
                {children}
            </div>
            {glow && (
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 max-w-[150px] h-6 bg-[var(--color-accent-green)]/20 blur-xl rounded-full z-0 pointer-events-none"></div>
            )}
        </div>
    );
}
