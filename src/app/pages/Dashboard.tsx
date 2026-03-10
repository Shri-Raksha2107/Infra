import { useEffect, useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { DollarSign, Shield, Server, TrendingUp, AlertCircle, RefreshCw, BarChart2 } from 'lucide-react';
import {
  LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { fetchGcpSummary, fetchBqCostTrend, type GcpSummary } from '../lib/gcpApi';

// Colour palette for pie chart slices
const SLICE_COLORS = ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#047857', '#059669', '#64748b', '#475569'];

function fmtMonth(ym: string) {
  const [y, m] = ym.split('-');
  return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
}

export function Dashboard() {
  const [summary, setSummary] = useState<GcpSummary | null>(null);
  const [costTrend, setCostTrend] = useState<{ label: string; cost: number }[]>([]);
  const [bqReady, setBqReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [data, bq] = await Promise.all([
        fetchGcpSummary(),
        fetchBqCostTrend(),
      ]);
      if (data) {
        setSummary(data);
        setLastUpdated(new Date(data.fetchedAt).toLocaleTimeString());
      } else {
        setError('Unable to connect to GCP backend. Start the backend server on port 3001.');
      }
      setBqReady(bq.ready);
      setCostTrend(bq.data.map(r => ({ label: fmtMonth(r.month), cost: r.cost })));
    } catch {
      setError('Failed to load GCP data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Build chart data from summary
  const costDistributionData = summary
    ? summary.costDistribution.slice(0, 8).map((d, i) => ({
      ...d,
      color: SLICE_COLORS[i % SLICE_COLORS.length],
    }))
    : [];

  const activeVMs = summary?.vms.running ?? 0;
  const totalResources = summary?.totalResources ?? 0;
  const billingName = summary?.billing.accountName ?? '—';
  const projectCount = summary?.projectCount ?? 0;

  return (
    <div className="flex h-screen bg-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar title="Infra Cloud Dashboard" />
        <main className="flex-1 overflow-y-auto p-8">

          {/* ── Error Banner ─────────────────────────────────── */}
          {error && (
            <div className="mb-6 flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-400 font-medium text-sm">GCP Connection Error</p>
                <p className="text-red-300/70 text-xs mt-0.5">{error}</p>
              </div>
              <button
                onClick={loadData}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
              >
                <RefreshCw className="w-3 h-3" /> Retry
              </button>
            </div>
          )}

          {/* ── Last updated + Refresh ───────────────────────── */}
          {!error && (
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                {loading ? (
                  <span className="text-xs text-slate-500 animate-pulse">Fetching live GCP data…</span>
                ) : (
                  <span className="text-xs text-slate-500">
                    Live data from GCP · Updated {lastUpdated}
                  </span>
                )}
                <span className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-400 animate-pulse' : 'bg-emerald-400'}`} />
              </div>
              <button
                onClick={loadData}
                disabled={loading}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 rounded-lg transition-colors border border-slate-700"
              >
                <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          )}

          {/* ── Metric Cards ─────────────────────────────────── */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <MetricCard
              icon={<DollarSign className="w-6 h-6" />}
              title="Billing Account"
              value={loading ? '…' : billingName.split(' ').slice(0, 2).join(' ')}
              subtitle={loading ? 'loading…' : (summary?.billing.enabled ? 'billing enabled' : 'billing status unknown')}
              trend={summary?.billing.enabled ? 'Active' : '—'}
              loading={loading}
            />
            <MetricCard
              icon={<Shield className="w-6 h-6" />}
              title="GCP Projects"
              value={loading ? '…' : String(projectCount)}
              subtitle="accessible projects"
              trend={projectCount > 0 ? `+${projectCount} found` : '—'}
              loading={loading}
            />
            <MetricCard
              icon={<Server className="w-6 h-6" />}
              title="Active VMs"
              value={loading ? '…' : String(activeVMs)}
              subtitle={`of ${summary?.vms.total ?? 0} total instances`}
              trend={activeVMs > 0 ? `${activeVMs} running` : 'No VMs'}
              loading={loading}
            />
            <MetricCard
              icon={<TrendingUp className="w-6 h-6" />}
              title="Total Resources"
              value={loading ? '…' : String(totalResources)}
              subtitle="across all types"
              trend={totalResources > 0 ? `${Object.keys(summary?.resourcesByType ?? {}).length} types` : '—'}
              loading={loading}
            />
          </div>

          {/* ── Charts Section ───────────────────────────────── */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Cost Trend — live from BigQuery */}
            <div className="bg-slate-950 border border-emerald-500/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-xl font-semibold text-white">Cost Over Time</h2>
                </div>
                {bqReady ? (
                  <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Live · BigQuery</span>
                ) : (
                  <a href="/reports" className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700 hover:border-emerald-500/30 hover:text-emerald-400 transition-colors">
                    Setup in Reports →
                  </a>
                )}
              </div>
              {loading ? (
                <div className="h-[220px] bg-slate-900 rounded-lg animate-pulse" />
              ) : costTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={costTrend} id="dashboard-line-chart">
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="label" stroke="#64748b" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={v => `$${v}`} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #10b981', borderRadius: 8 }} formatter={(v: number) => [`$${v.toFixed(2)}`, 'Cost']} />
                    <Line type="monotone" dataKey="cost" stroke="#10b981" strokeWidth={2.5} dot={{ fill: '#10b981', r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-[220px] text-slate-600 gap-2">
                  <BarChart2 className="w-8 h-8 opacity-30" />
                  <p className="text-sm">No cost data yet</p>
                  <a href="/reports" className="text-xs text-emerald-500 hover:text-emerald-400 underline">Set up BigQuery export in Reports</a>
                </div>
              )}
            </div>

            {/* Resource Distribution (live) */}
            <div className="bg-slate-950 border border-emerald-500/20 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Resource Distribution</h2>
              {loading ? (
                <div className="flex items-center justify-center h-48">
                  <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : costDistributionData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart id="dashboard-pie-chart">
                      <Pie
                        data={costDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {costDistributionData.map((entry) => (
                          <Cell key={`pie-${entry.name}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #10b981' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap gap-2 mt-2 justify-center">
                    {costDistributionData.map((d, i) => (
                      <div key={d.name} className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: SLICE_COLORS[i % SLICE_COLORS.length] }} />
                        <span className="text-xs text-slate-400">{d.name} ({d.value})</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-slate-600">
                  <Server className="w-10 h-10 mb-2 opacity-30" />
                  <p className="text-sm">No resources found in this project</p>
                </div>
              )}
            </div>
          </div>

          {/* ── GCP Details ──────────────────────────────────── */}
          <div className="grid grid-cols-2 gap-6">
            {/* Resource breakdown table */}
            <div className="bg-slate-950 border border-emerald-500/20 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Resource Inventory</h2>
              {loading ? (
                <SkeletonList rows={4} />
              ) : Object.keys(summary?.resourcesByType ?? {}).length > 0 ? (
                <div className="space-y-3">
                  {Object.entries(summary!.resourcesByType).map(([type, count]) => (
                    <div
                      key={type}
                      className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-lg"
                    >
                      <span className="text-slate-300 text-sm font-medium">{type}</span>
                      <span className="text-emerald-400 font-semibold text-sm">{count}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-600 text-sm">No resources detected. Ensure the service account has Cloud Asset Viewer role.</p>
              )}
            </div>

            {/* VM instance summary */}
            <div className="bg-slate-950 border border-emerald-500/20 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Compute Summary</h2>
              {loading ? (
                <SkeletonList rows={3} />
              ) : (
                <div className="space-y-3">
                  {[
                    { label: 'Project ID', value: summary?.projectId ?? '—' },
                    { label: 'Total VMs', value: String(summary?.vms.total ?? 0) },
                    { label: 'Running VMs', value: String(summary?.vms.running ?? 0) },
                    { label: 'Stopped VMs', value: String(summary?.vms.stopped ?? 0) },
                    { label: 'Billing Account', value: summary?.billing.accountName ?? '—' },
                    { label: 'Billing Enabled', value: summary?.billing.enabled ? 'Yes' : 'Unknown' },
                    { label: 'Total Asset Types', value: String(Object.keys(summary?.resourcesByType ?? {}).length) },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-lg"
                    >
                      <span className="text-slate-400 text-sm">{label}</span>
                      <span className="text-emerald-400 text-sm font-medium truncate max-w-[180px]">{value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function MetricCard({
  icon, title, value, subtitle, trend, loading,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  trend: string;
  loading?: boolean;
}) {
  return (
    <div className="bg-slate-950 border border-emerald-500/20 rounded-xl p-6 hover:border-emerald-500/40 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="text-emerald-400">{icon}</div>
        <span className="text-xs text-emerald-400 font-semibold">{loading ? '…' : trend}</span>
      </div>
      {loading ? (
        <div className="space-y-2">
          <div className="h-8 w-24 bg-slate-800 rounded animate-pulse" />
          <div className="h-3 w-32 bg-slate-800 rounded animate-pulse" />
        </div>
      ) : (
        <>
          <div className="text-2xl font-bold text-white mb-1 truncate">{value}</div>
          <div className="text-sm text-slate-400">{title}</div>
          <div className="text-xs text-slate-500 mt-1">{subtitle}</div>
        </>
      )}
    </div>
  );
}

function SkeletonList({ rows }: { rows: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-10 bg-slate-900 rounded-lg animate-pulse" />
      ))}
    </div>
  );
}