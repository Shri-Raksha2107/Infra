import { useEffect, useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { Shield, AlertTriangle, Lock, Globe, Database } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { fetchGcpResources } from '../lib/gcpApi';

const securityRisks = [
  {
    id: 1,
    resource: 'storage-bucket-prod-assets',
    riskType: 'Public Storage Bucket',
    severity: 'high',
    fix: 'Set bucket access to private and configure IAM roles',
  },
  {
    id: 2,
    resource: 'vm-web-server-01',
    riskType: 'Open Firewall Ports',
    severity: 'critical',
    fix: 'Close ports 22, 3389 and allow only specific IPs',
  },
  {
    id: 3,
    resource: 'db-user-analytics',
    riskType: 'Unencrypted Database',
    severity: 'high',
    fix: 'Enable encryption at rest using Cloud KMS',
  },
  {
    id: 4,
    resource: 'service-account-legacy',
    riskType: 'Misconfigured IAM Permissions',
    severity: 'medium',
    fix: 'Remove overly permissive roles and apply principle of least privilege',
  },
  {
    id: 5,
    resource: 'storage-bucket-backups',
    riskType: 'Public Storage Bucket',
    severity: 'critical',
    fix: 'Immediately restrict public access and audit access logs',
  },
  {
    id: 6,
    resource: 'vm-api-gateway',
    riskType: 'Open Firewall Ports',
    severity: 'medium',
    fix: 'Implement VPC firewall rules and disable default allow rules',
  },
  {
    id: 7,
    resource: 'db-customer-data',
    riskType: 'Unencrypted Database',
    severity: 'critical',
    fix: 'Enable SSL/TLS encryption for data in transit',
  },
];

const riskDistributionData = [
  { name: 'Critical', value: 3, color: '#ef4444' },
  { name: 'High', value: 2, color: '#f97316' },
  { name: 'Medium', value: 2, color: '#eab308' },
  { name: 'Low', value: 0, color: '#22c55e' },
];

const riskCategories = [
  { name: 'Misconfigured IAM Permissions', count: 1, icon: Lock },
  { name: 'Public Storage Buckets', count: 2, icon: Globe },
  { name: 'Open Firewall Ports', count: 2, icon: AlertTriangle },
  { name: 'Unencrypted Databases', count: 2, icon: Database },
];

export function SecurityScanner() {
  const securityScore = 68;

  const [resources, setResources] = useState<Record<string, number>>({});
  const [loadingResources, setLoadingResources] = useState(true);

  useEffect(() => {
    fetchGcpResources().then((data) => {
      if (data) setResources(data.byType);
      setLoadingResources(false);
    });
  }, []);

  // Build live risk categories from real resource counts
  const liveCategories = [
    {
      name: 'IAM Service Accounts',
      count: resources['ServiceAccount'] ?? null,
      icon: Lock,
    },
    {
      name: 'Storage Buckets',
      count: resources['Bucket'] ?? null,
      icon: Globe,
    },
    {
      name: 'VM Instances',
      count: resources['Instance'] ?? null,
      icon: AlertTriangle,
    },
    {
      name: 'SQL Instances',
      count: resources['Instance'] !== undefined ? (resources['Instance'] ?? 0) : null,
      icon: Database,
    },
  ];

  return (
    <div className="flex h-screen bg-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar title="Security Scanner" />
        <main className="flex-1 overflow-y-auto p-8">

          {/* ── Live Resource Inventory Banner ──────────────── */}
          <div className="mb-6 p-4 bg-slate-950 border border-emerald-500/20 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Live Resource Inventory (GCP Cloud Asset API)</p>
              <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Live Data</span>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {liveCategories.map((cat) => (
                <div key={cat.name} className="flex items-center gap-3 p-3 bg-slate-900 border border-slate-800 rounded-lg">
                  <cat.icon className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500">{cat.name}</p>
                    {loadingResources ? (
                      <div className="h-5 w-8 bg-slate-800 animate-pulse rounded mt-0.5" />
                    ) : (
                      <p className="text-lg font-bold text-white">
                        {cat.count !== null ? cat.count : '—'}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {!loadingResources && Object.keys(resources).length === 0 && (
              <p className="text-xs text-slate-600 mt-2">No assets found — grant Cloud Asset Viewer role to the service account.</p>
            )}
          </div>

          {/* Security Score Card */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="col-span-1 bg-gradient-to-br from-slate-950 to-red-950/20 border border-red-500/30 rounded-xl p-8 shadow-lg shadow-red-500/10">
              <div className="flex items-center justify-center mb-6">
                <Shield className="w-16 h-16 text-red-400" />
              </div>
              <div className="text-center">
                <div className="text-6xl font-bold text-white mb-2">{securityScore}</div>
                <div className="text-lg text-slate-400 mb-4">Security Score</div>
                <div className="text-sm text-red-400">Needs Improvement</div>
              </div>
              <div className="mt-6">
                <div className="h-3 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-500 to-yellow-500 rounded-full"
                    style={{ width: `${securityScore}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="col-span-2 bg-slate-950 border border-emerald-500/20 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Risk Categories</h2>
              <div className="grid grid-cols-2 gap-4">
                {riskCategories.map((category) => (
                  <div
                    key={category.name}
                    className="p-4 bg-slate-900 border border-slate-800 rounded-lg hover:border-red-500/30 transition-all"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <category.icon className="w-5 h-5 text-red-400" />
                      <span className="text-2xl font-bold text-white">{category.count}</span>
                    </div>
                    <div className="text-sm text-slate-400">{category.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Visualization and Stats */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-950 border border-emerald-500/20 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Security Risk Distribution</h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart id="security-risk-pie-chart">
                  <Pie
                    data={riskDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {riskDistributionData.map((entry) => (
                      <Cell key={`risk-${entry.name}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="col-span-2 bg-slate-950 border border-emerald-500/20 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Recommended Security Improvements</h2>
              <div className="space-y-3">
                <RecommendationCard
                  title="Enable Multi-Factor Authentication"
                  impact="High Security Improvement"
                  status="Recommended"
                />
                <RecommendationCard
                  title="Implement Network Segmentation"
                  impact="Medium Security Improvement"
                  status="Recommended"
                />
                <RecommendationCard
                  title="Enable Cloud Security Posture Management"
                  impact="High Security Improvement"
                  status="Recommended"
                />
              </div>
            </div>
          </div>

          {/* Risk Table */}
          <div className="bg-slate-950 border border-emerald-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Detected Security Risks</h2>
              <span className="text-sm text-slate-400">{securityRisks.length} risks found</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-400">Resource</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-400">Risk Type</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-400">Severity</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-400">Recommended Fix</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {securityRisks.map((risk) => (
                    <tr key={risk.id} className="border-b border-slate-800 hover:bg-slate-900/50 transition-colors">
                      <td className="px-4 py-4 text-sm text-emerald-400 font-mono">{risk.resource}</td>
                      <td className="px-4 py-4 text-sm text-white">{risk.riskType}</td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${risk.severity === 'critical'
                            ? 'bg-red-500/20 text-red-400'
                            : risk.severity === 'high'
                              ? 'bg-orange-500/20 text-orange-400'
                              : risk.severity === 'medium'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-green-500/20 text-green-400'
                            }`}
                        >
                          {risk.severity.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-300">{risk.fix}</td>
                      <td className="px-4 py-4">
                        <button className="px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded text-xs transition-colors">
                          Apply Fix
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function RecommendationCard({ title, impact, status }: { title: string; impact: string; status: string }) {
  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg hover:border-emerald-500/30 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="text-white font-medium mb-1">{title}</div>
          <div className="text-sm text-slate-400">{impact}</div>
        </div>
        <button className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg text-sm transition-colors">
          {status}
        </button>
      </div>
    </div>
  );
}