import { useEffect, useState, useCallback } from 'react';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import {
  RefreshCw, AlertCircle, Database, TrendingUp,
  Layers, BarChart2, CheckCircle2, ExternalLink,
} from 'lucide-react';
import {
  fetchBqStatus, fetchBqCostTrend, fetchBqDailyCost,
  fetchBqTopServices, fetchBqProjectCosts,
  type BqStatus, type BqCostTrend, type BqDailyCost,
  type BqTopServices, type BqProjectCosts,
} from '../lib/gcpApi';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassPanel } from '../components/ui/GlassPanel';
import { GlassBadge } from '../components/ui/GlassBadge';

// service colours
const SERVICE_COLORS = ['#10b981', '#34d399', '#6ee7b7', '#059669', '#047857', '#a7f3d0', '#065f46', '#d1fae5'];

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmtUSD(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });
}

function fmtMonth(ym: string) {
  // "2025-10" → "Oct 25"
  const [y, m] = ym.split('-');
  const d = new Date(Number(y), Number(m) - 1, 1);
  return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
}

function fmtDay(dateStr: string) {
  // "2025-10-01" → "Oct 1"
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ── Setup Banner ──────────────────────────────────────────────────────────────
function SetupBanner({ status }: { status: BqStatus }) {
  const isError = !!status.error && !status.error.includes('notFound') && !status.error.includes('404');
  return (
    <GlassPanel className={`p-6 mb-8 flex items-start gap-4 ${isError
      ? 'border-red-500/30'
      : 'border-blue-500/30'
      }`}>
      <Database className={`w-6 h-6 shrink-0 mt-0.5 ${isError ? 'text-red-400' : 'text-blue-400'}`} />
      <div className="flex-1">
        <p className={`font-semibold text-sm ${isError ? 'text-red-300' : 'text-blue-300'}`}>
          {isError ? 'BigQuery connection error' : 'BigQuery export not configured yet'}
        </p>
        {isError && (
          <p className="text-red-300/70 text-xs mt-1 font-mono">{status.error}</p>
        )}
        {!isError && (
          <ol className="mt-2 text-blue-200/80 text-xs space-y-1 list-decimal list-inside">
            <li>
              Go to{' '}
              <a
                href="https://console.cloud.google.com/billing/linkedaccount"
                target="_blank" rel="noreferrer"
                className="underline text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"
              >
                GCP Console → Billing → Billing Export <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>Under <strong>BigQuery export</strong>, click <em>Edit settings</em></li>
            <li>
              Select project <code className="bg-slate-800 px-1 rounded">{status.project || 'infra-backend-489717'}</code>,
              dataset <code className="bg-slate-800 px-1 rounded">{status.dataset || 'billing_export'}</code>
            </li>
            <li>Click <strong>Save</strong> — GCP starts exporting within 24–48 hours</li>
            <li>
              Grant the service account{' '}
              <code className="bg-slate-800 px-1 rounded">roles/bigquery.dataViewer</code> +{' '}
              <code className="bg-slate-800 px-1 rounded">roles/bigquery.jobUser</code>
            </li>
          </ol>
        )}
      </div>
    </GlassPanel>
  );
}

// ── Chart card wrapper ────────────────────────────────────────────────────────
function ChartCard({ title, icon, children, badge }: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  badge?: string;
}) {
  return (
    <GlassPanel>
      <div className="flex items-center justify-between mb-6 relative">
        <div className="flex items-center gap-3">
          <div className="bg-[#10b981]/10 p-2 rounded-xl border border-[#10b981]/20 text-[#10b981]">
            {icon}
          </div>
          <h2 className="text-xl font-semibold text-white tracking-tight">{title}</h2>
        </div>
        {badge && (
          <GlassBadge variant="success" pulse>
            {badge}
          </GlassBadge>
        )}
      </div>
      {children}
    </GlassPanel>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-40 text-slate-600">
      <Database className="w-9 h-9 mb-2 opacity-30" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function Skeleton({ h = 200 }: { h?: number }) {
  return (
    <div className={`rounded-xl bg-white/5 animate-pulse`} style={{ height: h }} />
  );
}

// ── Custom tooltip ────────────────────────────────────────────────────────────
const TooltipStyle = { backgroundColor: '#0f172a', border: '1px solid #10b981', borderRadius: 8 };
function CostTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ ...TooltipStyle, padding: '8px 12px' }}>
      <p className="text-slate-400 text-xs mb-1">{label}</p>
      <p className="text-emerald-400 font-semibold text-sm">{fmtUSD(payload[0].value)}</p>
    </div>
  );
}

// ── Reports Page ──────────────────────────────────────────────────────────────
export function Reports() {
  const [status, setStatus] = useState<BqStatus | null>(null);
  const [costTrend, setCostTrend] = useState<BqCostTrend | null>(null);
  const [dailyCost, setDailyCost] = useState<BqDailyCost | null>(null);
  const [topServices, setTopServices] = useState<BqTopServices | null>(null);
  const [projectCosts, setProjectCosts] = useState<BqProjectCosts | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    const [s, ct, dc, ts, pc] = await Promise.all([
      fetchBqStatus(),
      fetchBqCostTrend(),
      fetchBqDailyCost(),
      fetchBqTopServices(),
      fetchBqProjectCosts(),
    ]);
    setStatus(s);
    setCostTrend(ct);
    setDailyCost(dc);
    setTopServices(ts);
    setProjectCosts(pc);
    setLastUpdated(new Date().toLocaleTimeString());
    setLoading(false);
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const ready = status?.ready ?? false;

  // Totals for summary cards
  const monthTotal = costTrend?.data.reduce((s, r) => s + r.cost, 0) ?? 0;
  const dailyAvg = dailyCost?.data.length
    ? dailyCost.data.reduce((s, r) => s + r.cost, 0) / dailyCost.data.length
    : 0;
  const topService = topServices?.data[0];
  const projectCount = projectCosts?.data.length ?? 0;

  // Formatted monthly labels
  const trendData = (costTrend?.data ?? []).map(r => ({ ...r, label: fmtMonth(r.month) }));
  const dailyData = (dailyCost?.data ?? []).map(r => ({ ...r, label: fmtDay(r.date) }));
  // Show every 5th day label to avoid crowding
  const dailyTick = (val: string, idx: number) => idx % 5 === 0 ? val : '';

  return (
    <div className="flex h-screen bg-[#050704] font-['Inter',sans-serif] text-slate-100 antialiased overflow-hidden animate-mesh relative">
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <svg className="w-full h-full" preserveAspectRatio="none">
          <path className="data-stream" d="M 0 50 Q 250 150 500 0" fill="none" stroke="#10b981" strokeWidth="0.5" />
          <path className="data-stream" d="M 0 200 Q 400 300 800 100" fill="none" stroke="#10b981" strokeWidth="0.8" style={{ animationDelay: '-2s' }} />
        </svg>
      </div>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar title="Cost Reports" />
        <main className="flex-1 overflow-y-auto p-8">

          {/* ── Header bar ──────────────────────────────── */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              {loading ? (
                <span className="text-xs text-slate-500 animate-pulse">Loading BigQuery data…</span>
              ) : (
                <>
                  <span className={`w-2 h-2 rounded-full ${ready ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                  <span className="text-xs text-slate-500">
                    {ready ? `Live BigQuery data · Updated ${lastUpdated}` : `BigQuery export pending · ${lastUpdated}`}
                  </span>
                </>
              )}
            </div>
            <button
              onClick={loadAll}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 rounded-lg transition-colors border border-slate-700"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {/* ── Setup / error banner ─────────────────────── */}
          {!loading && status && !ready && <SetupBanner status={status} />}

          {/* ── Ready badge ──────────────────────────────── */}
          {!loading && ready && (
            <div className="mb-6 flex items-center gap-2 px-4 py-2 bg-[#10b981]/10 border border-[#10b981]/20 rounded-lg w-fit shadow-[0_0_10px_rgba(72,183,16,0.1)]">
              <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
              <span className="text-xs text-[#10b981] font-semibold tracking-wide">
                BigQuery export is active · {status?.rowCount?.toLocaleString()} rows in table
              </span>
            </div>
          )}

          {/* ── Summary stat cards ───────────────────────── */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[
              {
                label: '6-month Total', icon: <TrendingUp className="w-5 h-5" />,
                value: loading ? '…' : fmtUSD(monthTotal), sub: 'last 6 months combined',
              },
              {
                label: 'Daily Average', icon: <BarChart2 className="w-5 h-5" />,
                value: loading ? '…' : fmtUSD(dailyAvg), sub: 'over last 30 days',
              },
              {
                label: 'Top Service', icon: <Layers className="w-5 h-5" />,
                value: loading ? '…' : (topService?.service ?? '—'),
                sub: topService ? fmtUSD(topService.cost) + ' this month' : 'no data',
              },
              {
                label: 'Projects Billed', icon: <Database className="w-5 h-5" />,
                value: loading ? '…' : String(projectCount),
                sub: 'billing this month',
              },
            ].map(({ label, icon, value, sub }) => (
              <GlassCard key={label} glow className="p-6 transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-[#10b981]/10 p-2.5 rounded-xl border border-[#10b981]/30 text-[#10b981] group-hover:border-[#10b981]/60 transition-colors">
                    {icon}
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{label}</span>
                </div>
                {loading ? (
                  <div className="space-y-3 mt-4">
                    <div className="h-8 w-24 bg-white/5 rounded-lg animate-pulse" />
                    <div className="h-3 w-32 bg-white/5 rounded-md animate-pulse" />
                  </div>
                ) : (
                  <div className="mt-4 relative z-10">
                    <div className="text-3xl font-black text-white mb-1 truncate drop-shadow-sm" title={value}>{value}</div>
                    <div className="text-[11px] font-medium text-slate-400 mt-1 uppercase tracking-wider">{sub}</div>
                  </div>
                )}
              </GlassCard>
            ))}
          </div>

          {/* ── Monthly cost trend ───────────────────────── */}
          <div className="mb-6">
            <ChartCard
              title="Monthly Cost Trend"
              icon={<TrendingUp className="w-5 h-5" />}
              badge="Last 6 months"
            >
              {loading ? (
                <Skeleton h={220} />
              ) : trendData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={trendData} id="reports-cost-trend">
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="label" stroke="#64748b" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={v => `$${v}`} />
                    <Tooltip content={<CostTooltip />} />
                    <Line
                      type="monotone" dataKey="cost" stroke="#10b981" strokeWidth={2.5}
                      dot={{ fill: '#10b981', r: 4 }} activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState message="No monthly data yet — export may still be propagating (24–48 h)" />
              )}
            </ChartCard>
          </div>

          {/* ── Daily spend + Top services ───────────────── */}
          <div className="grid grid-cols-2 gap-6 mb-6">

            {/* Daily spend bar chart */}
            <ChartCard
              title="Daily Spend"
              icon={<BarChart2 className="w-5 h-5" />}
              badge="Last 30 days"
            >
              {loading ? (
                <Skeleton h={200} />
              ) : dailyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={dailyData} id="reports-daily-cost">
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="label" stroke="#64748b" tick={{ fontSize: 9 }} tickFormatter={dailyTick} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 10 }} tickFormatter={v => `$${v}`} />
                    <Tooltip content={<CostTooltip />} />
                    <Bar dataKey="cost" fill="#10b981" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState message="No daily data yet" />
              )}
            </ChartCard>

            {/* Top services */}
            <ChartCard
              title="Top Services by Cost"
              icon={<Layers className="w-5 h-5" />}
              badge="This month"
            >
              {loading ? (
                <Skeleton h={200} />
              ) : (topServices?.data ?? []).length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={topServices!.data}
                    layout="vertical"
                    id="reports-top-services"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                    <XAxis type="number" stroke="#64748b" tick={{ fontSize: 10 }} tickFormatter={v => `$${v}`} />
                    <YAxis
                      type="category" dataKey="service" stroke="#64748b"
                      tick={{ fontSize: 10 }} width={110}
                      tickFormatter={v => v.length > 16 ? v.slice(0, 14) + '…' : v}
                    />
                    <Tooltip content={({ active, payload, label }) => (
                      <CostTooltip active={active} payload={payload as { value: number }[]} label={label} />
                    )} />
                    <Bar dataKey="cost" radius={[0, 3, 3, 0]}>
                      {topServices!.data.map((_, i) => (
                        <Cell key={i} fill={SERVICE_COLORS[i % SERVICE_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState message="No service cost data yet" />
              )}
            </ChartCard>
          </div>

          {/* ── Per-project cost table ───────────────────── */}
          <ChartCard
            title="Cost per Project"
            icon={<Database className="w-5 h-5" />}
            badge="This month"
          >
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => <div key={i} className="h-10 bg-white/5 rounded-xl animate-pulse" />)}
              </div>
            ) : (projectCosts?.data ?? []).length > 0 ? (
              <div className="space-y-2">
                {projectCosts!.data.map((row, i) => {
                  const maxCost = projectCosts!.data[0].cost || 1;
                  const pct = Math.round((row.cost / maxCost) * 100);
                  return (
                    <div
                      key={row.project}
                      className="flex items-center gap-4 px-5 py-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors shadow-sm"
                    >
                      <span className="text-xs text-slate-500 font-bold w-5 text-right">{i + 1}</span>
                      <span className="text-slate-200 text-sm flex-1 font-mono truncate font-semibold">{row.project}</span>
                      {/* progress bar */}
                      <div className="w-28 h-2 bg-black/40 rounded-full overflow-hidden shadow-inner">
                        <div
                          className="h-full rounded-full bg-[#10b981] shadow-[0_0_8px_#10b981]"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-[#10b981] font-black text-sm w-20 text-right">
                        {fmtUSD(row.cost)}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState message="No per-project billing data yet" />
            )}
          </ChartCard>

          {/* ── BigQuery config info footer ──────────────── */}
          {!loading && status && (
            <div className="mt-8 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-xs text-slate-500 font-medium flex items-center justify-between gap-6 shadow-sm">
              <div className="flex items-center gap-6">
                <span className="flex items-center gap-2 text-slate-400">
                  <Database className="w-4 h-4 text-[#10b981]" />
                  <span>Project: <span className="text-slate-300 font-mono tracking-wide">{status.project}</span></span>
                </span>
                <span>Dataset: <span className="text-slate-300 font-mono tracking-wide">{status.dataset}</span></span>
                <span>Table: <span className="text-slate-300 font-mono tracking-wide">{status.table}</span></span>
              </div>
              <span className="bg-black/20 px-3 py-1.5 rounded-lg border border-white/5 shadow-inner">Rows: <span className="text-slate-300 font-bold ml-1">{status.rowCount?.toLocaleString()}</span></span>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
