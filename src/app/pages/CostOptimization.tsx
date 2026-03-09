import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { DollarSign, TrendingDown, Server, Database, Network, HardDrive } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const costTrendData = [
  { month: 'Sep', cost: 11800 },
  { month: 'Oct', cost: 12400 },
  { month: 'Nov', cost: 13200 },
  { month: 'Dec', cost: 14800 },
  { month: 'Jan', cost: 15600 },
  { month: 'Feb', cost: 14200 },
  { month: 'Mar', cost: 13800 },
];

const serviceCostData = [
  { service: 'Compute', cost: 6210, color: '#10b981' },
  { service: 'Storage', cost: 4140, color: '#34d399' },
  { service: 'Networking', cost: 2070, color: '#6ee7b7' },
  { service: 'Databases', cost: 1380, color: '#a7f3d0' },
];

const optimizationInsights = [
  {
    id: 1,
    type: 'Idle Virtual Machines',
    resource: 'vm-prod-worker-03',
    change: 'Stop or delete idle VM',
    savings: '$450/month',
    confidence: 94,
    severity: 'high',
  },
  {
    id: 2,
    type: 'Overprovisioned Instances',
    resource: 'vm-web-server-01',
    change: 'Downgrade from n1-standard-8 to n1-standard-4',
    savings: '$380/month',
    confidence: 89,
    severity: 'medium',
  },
  {
    id: 3,
    type: 'Unused Storage Volumes',
    resource: 'disk-backup-2023-Q1',
    change: 'Delete unattached storage volume',
    savings: '$240/month',
    confidence: 98,
    severity: 'high',
  },
  {
    id: 4,
    type: 'Idle Virtual Machines',
    resource: 'vm-staging-db-02',
    change: 'Schedule shutdown during off-hours',
    savings: '$320/month',
    confidence: 86,
    severity: 'medium',
  },
  {
    id: 5,
    type: 'Overprovisioned Instances',
    resource: 'vm-api-gateway',
    change: 'Switch to spot/preemptible instances',
    savings: '$580/month',
    confidence: 91,
    severity: 'high',
  },
];

export function CostOptimization() {
  return (
    <div className="flex h-screen bg-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar title="Cost Optimization" />
        <main className="flex-1 overflow-y-auto p-8">
          {/* Top Section - Cost Summary */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-950 border border-emerald-500/20 rounded-xl p-8 shadow-lg shadow-emerald-500/10">
              <div className="flex items-center justify-between mb-4">
                <div className="text-emerald-400">
                  <DollarSign className="w-8 h-8" />
                </div>
              </div>
              <div className="text-5xl font-bold text-white mb-2">$13,800</div>
              <div className="text-lg text-slate-400 mb-4">Total Monthly Cloud Cost</div>
              <div className="flex items-center text-sm">
                <span className="text-red-400">↑ 8.2%</span>
                <span className="text-slate-500 ml-2">vs last month</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-950 to-emerald-900/20 border border-emerald-500/30 rounded-xl p-8 shadow-lg shadow-emerald-500/20">
              <div className="flex items-center justify-between mb-4">
                <div className="text-emerald-400">
                  <TrendingDown className="w-8 h-8" />
                </div>
              </div>
              <div className="text-5xl font-bold text-emerald-400 mb-2">$2,420</div>
              <div className="text-lg text-white mb-4">Estimated Savings Potential</div>
              <div className="flex items-center text-sm">
                <span className="text-emerald-400">17.5% reduction possible</span>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-950 border border-emerald-500/20 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Cost Trends Over Time</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={costTrendData} id="cost-trend-line-chart">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #10b981' }}
                    labelStyle={{ color: '#10b981' }}
                  />
                  <Line type="monotone" dataKey="cost" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-slate-950 border border-emerald-500/20 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Cost Distribution Across Services</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={serviceCostData} id="service-cost-bar-chart">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="service" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #10b981' }}
                    labelStyle={{ color: '#10b981' }}
                  />
                  <Bar dataKey="cost" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Service Breakdown */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <ServiceCard icon={<Server className="w-6 h-6" />} name="Compute" cost="$6,210" percentage="45%" />
            <ServiceCard icon={<HardDrive className="w-6 h-6" />} name="Storage" cost="$4,140" percentage="30%" />
            <ServiceCard icon={<Network className="w-6 h-6" />} name="Networking" cost="$2,070" percentage="15%" />
            <ServiceCard icon={<Database className="w-6 h-6" />} name="Databases" cost="$1,380" percentage="10%" />
          </div>

          {/* Optimization Insights Panel */}
          <div className="bg-slate-950 border border-emerald-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Optimization Insights</h2>
              <span className="text-sm text-slate-400">{optimizationInsights.length} opportunities detected</span>
            </div>

            <div className="space-y-4">
              {optimizationInsights.map((insight) => (
                <OptimizationCard key={insight.id} insight={insight} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function ServiceCard({ icon, name, cost, percentage }: { icon: React.ReactNode; name: string; cost: string; percentage: string }) {
  return (
    <div className="bg-slate-950 border border-emerald-500/20 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-emerald-400">{icon}</div>
        <span className="text-xs text-slate-400">{percentage}</span>
      </div>
      <div className="text-2xl font-bold text-white mb-1">{cost}</div>
      <div className="text-sm text-slate-400">{name}</div>
    </div>
  );
}

function OptimizationCard({ insight }: { insight: typeof optimizationInsights[0] }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-emerald-500/30 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-white">{insight.type}</h3>
            <span
              className={`px-2 py-1 rounded text-xs font-semibold ${
                insight.severity === 'high'
                  ? 'bg-orange-500/20 text-orange-400'
                  : 'bg-yellow-500/20 text-yellow-400'
              }`}
            >
              {insight.severity.toUpperCase()}
            </span>
          </div>
          <div className="text-sm text-slate-400 mb-1">Resource: <span className="text-emerald-400">{insight.resource}</span></div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-emerald-400">{insight.savings}</div>
          <div className="text-xs text-slate-400">potential savings</div>
        </div>
      </div>

      <div className="bg-slate-950 rounded-lg p-4 mb-4">
        <div className="text-sm text-slate-300 mb-1">Recommended Change:</div>
        <div className="text-white">{insight.change}</div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-400">Confidence Score</span>
          <span className="text-sm font-semibold text-emerald-400">{insight.confidence}%</span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50"
            style={{ width: `${insight.confidence}%` }}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors font-medium">
          Simulate Optimization
        </button>
        <button className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 rounded-lg transition-all font-medium shadow-lg shadow-emerald-500/30">
          Apply Fix
        </button>
      </div>
    </div>
  );
}