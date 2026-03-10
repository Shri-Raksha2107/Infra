import { useNavigate } from 'react-router';
import { Cloud, Shield, TrendingDown, Cpu, Zap } from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Cloud className="w-16 h-16 text-emerald-400" strokeWidth={1.5} />
          </div>
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white via-emerald-100 to-emerald-400 bg-clip-text text-transparent">
            Infra
          </h1>
          <p className="text-2xl text-emerald-400 mb-4">
            AI-Powered Cloud Optimization Platform
          </p>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-12">
            Reduce cloud costs by up to 60% with intelligent optimization recommendations, security scanning, and automated fixes.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 rounded-lg text-lg font-semibold shadow-lg shadow-emerald-500/50 transition-all duration-300 hover:shadow-emerald-500/70 hover:scale-105"
          >
            Get Started
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          <FeatureCard
            icon={<TrendingDown className="w-8 h-8" />}
            title="Cost Optimization"
            description="Identify and eliminate wasteful spending across your cloud infrastructure"
          />
          <FeatureCard
            icon={<Shield className="w-8 h-8" />}
            title="Security Scanning"
            description="Detect and fix security vulnerabilities before they become threats"
          />
          <FeatureCard
            icon={<Cpu className="w-8 h-8" />}
            title="AI Recommendations"
            description="Get intelligent suggestions powered by machine learning"
          />
          <FeatureCard
            icon={<Zap className="w-8 h-8" />}
            title="Auto Remediation"
            description="Apply fixes automatically with one-click optimization"
          />
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <StatCard value="60%" label="Average Cost Reduction" />
          <StatCard value="99.9%" label="Security Score Improvement" />
          <StatCard value="1000+" label="Issues Detected Daily" />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-6 rounded-xl bg-slate-900/50 border border-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10">
      <div className="text-emerald-400 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400">{description}</p>
    </div>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center p-8 rounded-xl bg-gradient-to-br from-slate-900/80 to-emerald-900/20 border border-emerald-500/30">
      <div className="text-5xl font-bold text-emerald-400 mb-2">{value}</div>
      <div className="text-slate-300">{label}</div>
    </div>
  );
}
