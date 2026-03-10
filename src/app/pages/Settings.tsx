import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { GlassPanel } from '../components/ui/GlassPanel';

export function Settings() {
  return (
    <div className="flex h-screen bg-[#050704] font-['Inter',sans-serif] text-slate-100 antialiased overflow-hidden animate-mesh relative">
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <svg className="w-full h-full" preserveAspectRatio="none">
          <path className="data-stream" d="M 0 50 Q 250 150 500 0" fill="none" stroke="#10b981" strokeWidth="0.5" />
          <path className="data-stream" d="M 0 200 Q 400 300 800 100" fill="none" stroke="#10b981" strokeWidth="0.8" style={{ animationDelay: '-2s' }} />
        </svg>
      </div>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <TopBar title="Settings" />
        <main className="flex-1 overflow-y-auto p-8 flex items-center justify-center">
          <GlassPanel className="p-12 text-center border-white/5">
            <h2 className="text-3xl font-black text-white mb-4 drop-shadow-sm tracking-tight">Settings Page</h2>
            <p className="text-slate-400 font-medium tracking-wide">Coming Soon</p>
          </GlassPanel>
        </main>
      </div>
    </div>
  );
}
