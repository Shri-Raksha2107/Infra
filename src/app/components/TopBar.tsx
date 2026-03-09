import { Cloud } from 'lucide-react';

export function TopBar({ title }: { title: string }) {
  return (
    <div className="bg-slate-950 border-b border-emerald-500/20 px-8 py-4 flex items-center justify-between">
      <h1 className="text-2xl font-semibold text-white">{title}</h1>
      <div className="flex items-center space-x-3 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
        <Cloud className="w-5 h-5 text-emerald-400" />
        <span className="text-emerald-400 font-medium">Google Cloud Connected</span>
      </div>
    </div>
  );
}
