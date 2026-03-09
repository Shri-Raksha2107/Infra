import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';

export function Settings() {
  return (
    <div className="flex h-screen bg-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar title="Settings" />
        <main className="flex-1 overflow-y-auto p-8 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-white mb-4">Settings Page</h2>
            <p className="text-slate-400">Coming Soon</p>
          </div>
        </main>
      </div>
    </div>
  );
}
