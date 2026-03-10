import { NavLink } from 'react-router';
import { Cloud, LayoutDashboard, Database, TrendingDown, Shield, Sparkles, Settings, FileText, Zap } from 'lucide-react';

export function Sidebar() {
  return (
    <div className="w-64 glass-premium border-r border-white/5 flex flex-col relative z-20 shadow-[4px_0_24px_rgba(0,0,0,0.3)]">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center space-x-3 group cursor-pointer">
          <div className="bg-[var(--color-accent-green)]/10 p-2 rounded-xl border border-[var(--color-accent-green)]/30 text-[var(--color-accent-green)] group-hover:border-[var(--color-accent-green)]/60 transition-colors shadow-[0_0_15px_rgba(5,150,105,0.1)]">
            <Cloud className="w-6 h-6" />
          </div>
          <span className="text-2xl font-black text-white tracking-tight drop-shadow-sm font-['Outfit',sans-serif]">Infra</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <NavItem to="/dashboard" icon={<LayoutDashboard className="w-5 h-5" />} label="Dashboard" />
        <NavItem to="/resources" icon={<Database className="w-5 h-5" />} label="Resources" />
        <NavItem to="/cost-optimization" icon={<TrendingDown className="w-5 h-5" />} label="Cost Optimizer" />
        <NavItem to="/security-scanner" icon={<Shield className="w-5 h-5" />} label="Security Scanner" />
        <NavItem to="/ai-recommendations" icon={<Sparkles className="w-5 h-5" />} label="Recommendations" />
        <NavItem to="/automation" icon={<Zap className="w-5 h-5" />} label="Automation" />
        <NavItem to="/reports" icon={<FileText className="w-5 h-5" />} label="Reports" />
        <NavItem to="/settings" icon={<Settings className="w-5 h-5" />} label="Settings" />
      </nav>
    </div>
  );
}

function NavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${isActive
          ? 'bg-[var(--color-accent-green)]/15 text-[var(--color-accent-green)] shadow-[0_0_15px_rgba(5,150,105,0.15)] border border-[var(--color-accent-green)]/30'
          : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent'
        }`
      }
    >
      <div className={`transition-colors ${/* using inline active state handling for icon color */ ''}`}>{icon}</div>
      <span className="tracking-wide">{label}</span>
      {/* 
        Tailwind applies classes recursively. To ensure the icon takes the appropriate color based on active state,
        the parent class applies the color. Since icon passes an instantiated component <Icon className="w-5 h-5"/>
        we rely on currentcolor.
      */}
    </NavLink>
  );
}
