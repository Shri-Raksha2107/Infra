import { useEffect, useState, useMemo } from 'react';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { Server, Search, RefreshCw, AlertCircle, Play, Square, HelpCircle, Clock } from 'lucide-react';
import { fetchGcpInstances, fetchGcpResources, type GcpInstance } from '../lib/gcpApi';

const STATUS_CONFIG: Record<string, { label: string; color: string; Icon: typeof Play }> = {
  RUNNING: { label: 'Running', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', Icon: Play },
  TERMINATED: { label: 'Stopped', color: 'text-slate-400 bg-slate-800 border-slate-700', Icon: Square },
  STAGING: { label: 'Starting', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30', Icon: Clock },
  SUSPENDED: { label: 'Suspended', color: 'text-orange-400 bg-orange-500/10 border-orange-500/30', Icon: HelpCircle },
};

export function Resources() {
  const [instances, setInstances] = useState<GcpInstance[]>([]);
  const [resourcesByType, setResourcesByType] = useState<Record<string, number>>({});
  const [totalResources, setTotalResources] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [vmData, resData] = await Promise.all([
        fetchGcpInstances(),
        fetchGcpResources(),
      ]);
      if (vmData) {
        setInstances(vmData.instances);
      } else {
        setError('Could not fetch VM data. Make sure the backend is running on port 3001.');
      }
      if (resData) {
        setResourcesByType(resData.byType);
        setTotalResources(resData.total);
      }
      setLastUpdated(new Date().toLocaleTimeString());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const filtered = useMemo(() => {
    return instances.filter((vm) => {
      const matchesSearch =
        vm.name.toLowerCase().includes(search.toLowerCase()) ||
        vm.zone.toLowerCase().includes(search.toLowerCase()) ||
        vm.machineType.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || vm.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [instances, search, statusFilter]);

  const runningCount = instances.filter((v) => v.status === 'RUNNING').length;
  const stoppedCount = instances.filter((v) => v.status === 'TERMINATED').length;

  return (
    <div className="flex h-screen bg-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar title="Resources" />
        <main className="flex-1 overflow-y-auto p-8">

          {/* ── Summary cards ─────────────────────────────────── */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Resources', value: loading ? '…' : String(totalResources), color: 'text-white' },
              { label: 'VM Instances', value: loading ? '…' : String(instances.length), color: 'text-white' },
              { label: 'Running VMs', value: loading ? '…' : String(runningCount), color: 'text-emerald-400' },
              { label: 'Stopped VMs', value: loading ? '…' : String(stoppedCount), color: 'text-slate-400' },
            ].map((card) => (
              <div key={card.label} className="bg-slate-950 border border-emerald-500/20 rounded-xl p-5">
                <p className="text-xs text-slate-500 mb-2">{card.label}</p>
                {loading ? (
                  <div className="h-7 w-12 bg-slate-800 rounded animate-pulse" />
                ) : (
                  <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                )}
              </div>
            ))}
          </div>

          {/* ── Resource type breakdown ────────────────────────── */}
          {!loading && Object.keys(resourcesByType).length > 0 && (
            <div className="mb-6 p-4 bg-slate-950 border border-emerald-500/20 rounded-xl">
              <p className="text-xs text-slate-500 mb-3 font-medium uppercase tracking-wider">All Resources by Type</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(resourcesByType).map(([type, count]) => (
                  <div key={type} className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg">
                    <span className="text-sm text-slate-300">{type}</span>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── VM Table ──────────────────────────────────────── */}
          <div className="bg-slate-950 border border-emerald-500/20 rounded-xl overflow-hidden">
            {/* Table header + controls */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <Server className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-semibold text-white">Compute Engine Instances</h2>
                {!loading && (
                  <span className="text-xs text-slate-500">
                    · {filtered.length} of {instances.length} shown
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {lastUpdated && (
                  <span className="text-xs text-slate-600">Updated {lastUpdated}</span>
                )}
                <button
                  onClick={loadData}
                  disabled={loading}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 rounded-lg transition-colors border border-slate-700"
                >
                  <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>

            {/* Search + Filter */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-800 bg-slate-900/50">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search VMs…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="flex gap-2">
                {['ALL', 'RUNNING', 'TERMINATED', 'STAGING'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${statusFilter === s
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                      }`}
                  >
                    {s === 'ALL' ? 'All' : s === 'RUNNING' ? 'Running' : s === 'TERMINATED' ? 'Stopped' : 'Starting'}
                  </button>
                ))}
              </div>
            </div>

            {/* Error state */}
            {error && (
              <div className="flex items-center gap-3 px-6 py-4 bg-red-500/10 border-b border-red-500/20">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            {/* Table body */}
            {loading ? (
              <div className="p-6 space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-14 bg-slate-900 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : filtered.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-800">
                      {['Name', 'Zone', 'Machine Type', 'Status', 'Disks', 'Created'].map((h) => (
                        <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {filtered.map((vm) => {
                      const statusCfg = STATUS_CONFIG[vm.status] || STATUS_CONFIG.TERMINATED;
                      const StatusIcon = statusCfg.Icon;
                      return (
                        <tr key={vm.id} className="hover:bg-slate-900/50 transition-colors">
                          <td className="px-6 py-4">
                            <span className="text-white font-medium text-sm">{vm.name}</span>
                            {vm.tags.length > 0 && (
                              <div className="flex gap-1 mt-1">
                                {vm.tags.slice(0, 2).map((t) => (
                                  <span key={t} className="text-xs px-1.5 py-0.5 bg-slate-800 text-slate-500 rounded">{t}</span>
                                ))}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-slate-400 text-sm font-mono">{vm.zone}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-slate-300 text-sm">{vm.machineType}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusCfg.color}`}>
                              <StatusIcon className="w-3 h-3" />
                              {statusCfg.label}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-slate-400 text-sm">{vm.disks}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-slate-500 text-xs">
                              {vm.creationTimestamp
                                ? new Date(vm.creationTimestamp).toLocaleDateString('en-US', {
                                  year: 'numeric', month: 'short', day: 'numeric',
                                })
                                : '—'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-slate-600">
                <Server className="w-12 h-12 mb-3 opacity-30" />
                <p className="text-base font-medium text-slate-500">
                  {instances.length === 0
                    ? 'No VM instances found in this GCP project'
                    : 'No instances match your filter'}
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  {instances.length === 0
                    ? 'Create a Compute Engine VM in your project to see it here'
                    : 'Try changing the search or status filter'}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
