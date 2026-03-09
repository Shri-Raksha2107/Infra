import { NavLink } from 'react-router';
import { Cloud, LayoutDashboard, Database, TrendingDown, Shield, Sparkles, Settings, FileText, Zap } from 'lucide-react';

export function Sidebar() {
  return (
    <div className="w-64 bg-slate-950 border-r border-emerald-500/20 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-emerald-500/20">
        <div className="flex items-center space-x-3">
          <Cloud className="w-8 h-8 text-emerald-400" />
          <span className="text-2xl font-bold text-white">Infra</span>
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
        `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
          isActive
            ? 'bg-emerald-500/20 text-emerald-400 shadow-lg shadow-emerald-500/20'
            : 'text-slate-400 hover:text-emerald-400 hover:bg-slate-900'
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}
