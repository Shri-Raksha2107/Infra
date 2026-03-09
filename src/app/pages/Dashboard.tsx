import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { DollarSign, Shield, Server, TrendingUp } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const costTrendData = [
  { month: 'Oct', cost: 12400 },
  { month: 'Nov', cost: 13200 },
  { month: 'Dec', cost: 14800 },
  { month: 'Jan', cost: 15600 },
  { month: 'Feb', cost: 14200 },
  { month: 'Mar', cost: 13800 },
];

const costDistributionData = [
  { name: 'Compute', value: 45, color: '#10b981' },
  { name: 'Storage', value: 30, color: '#34d399' },
  { name: 'Networking', value: 25, color: '#6ee7b7' },
];

const issues = [
  { id: 1, type: 'Overprovisioned VM Instances', severity: 'high', impact: '$1,200/mo' },
  { id: 2, type: 'Public Storage Bucket', severity: 'critical', impact: 'Security Risk' },
  { id: 3, type: 'Idle Compute Instances', severity: 'medium', impact: '$800/mo' },
];

const recommendations = [
  { id: 1, title: 'Resize Compute Instance', savings: '$400/month', confidence: 95 },
  { id: 2, title: 'Delete Idle Storage', savings: '$120/month', confidence: 88 },
  { id: 3, title: 'Fix Public Port Exposure', savings: 'Security', confidence: 92 },
];

export function Dashboard() {
  return (
    <div className="flex h-screen bg-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar title="Infra Cloud Dashboard" />
        <main className="flex-1 overflow-y-auto p-8">
          {/* Metric Cards */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <MetricCard
              icon={<DollarSign className="w-6 h-6" />}
              title="Total Cloud Cost"
              value="$13,800"
              subtitle="per month"
              trend="-8.2%"
            />
            <MetricCard
              icon={<Shield className="w-6 h-6" />}
              title="Security Score"
              value="78"
              subtitle="out of 100"
              trend="+12%"
            />
            <MetricCard
              icon={<Server className="w-6 h-6" />}
              title="Active Resources"
              value="247"
              subtitle="instances"
              trend="+3"
            />
            <MetricCard
              icon={<TrendingUp className="w-6 h-6" />}
              title="Optimization Potential"
              value="$2,400"
              subtitle="monthly savings"
              trend="Available"
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-950 border border-emerald-500/20 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Cloud Cost Over Time</h2>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={costTrendData} id="dashboard-line-chart">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #10b981' }}
                    labelStyle={{ color: '#10b981' }}
                  />
                  <Line type="monotone" dataKey="cost" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-slate-950 border border-emerald-500/20 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Cost Distribution</h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart id="dashboard-pie-chart">
                  <Pie
                    data={costDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {costDistributionData.map((entry) => (
                      <Cell key={`pie-${entry.name}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #10b981' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Issues and Recommendations */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-slate-950 border border-emerald-500/20 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Detected Issues</h2>
              <div className="space-y-4">
                {issues.map((issue) => (
                  <div
                    key={issue.id}
                    className="p-4 bg-slate-900 border border-slate-800 rounded-lg hover:border-emerald-500/30 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">{issue.type}</span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          issue.severity === 'critical'
                            ? 'bg-red-500/20 text-red-400'
                            : issue.severity === 'high'
                            ? 'bg-orange-500/20 text-orange-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {issue.severity.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-slate-400">Impact: {issue.impact}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-950 border border-emerald-500/20 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Recommendations</h2>
              <div className="space-y-4">
                {recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-4 bg-slate-900 border border-slate-800 rounded-lg hover:border-emerald-500/30 transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-white font-medium">{rec.title}</span>
                      <span className="text-emerald-400 font-semibold">{rec.savings}</span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1">
                        <div className="text-xs text-slate-400 mb-1">Confidence: {rec.confidence}%</div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${rec.confidence}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-sm transition-colors">
                        Simulate
                      </button>
                      <button className="flex-1 px-3 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded text-sm transition-colors">
                        Apply Fix
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function MetricCard({
  icon,
  title,
  value,
  subtitle,
  trend,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  trend: string;
}) {
  return (
    <div className="bg-slate-950 border border-emerald-500/20 rounded-xl p-6 hover:border-emerald-500/40 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="text-emerald-400">{icon}</div>
        <span className="text-xs text-emerald-400 font-semibold">{trend}</span>
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-slate-400">{title}</div>
      <div className="text-xs text-slate-500 mt-1">{subtitle}</div>
    </div>
  );
}