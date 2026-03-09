import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Cloud, Check } from 'lucide-react';

export function ConnectCloud() {
  const navigate = useNavigate();
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = () => {
    if (!selectedProvider) return;
    
    setIsConnecting(true);
    // Simulate connection process
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950">
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Cloud className="w-16 h-16 text-emerald-400 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-white mb-4">Connect Your Cloud</h1>
            <p className="text-lg text-slate-400">
              Select your cloud provider to start optimizing your infrastructure
            </p>
          </div>

          {/* Cloud Providers */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <ProviderCard
              name="Google Cloud"
              logo="GCP"
              selected={selectedProvider === 'gcp'}
              onClick={() => setSelectedProvider('gcp')}
            />
            <ProviderCard
              name="AWS"
              logo="AWS"
              selected={selectedProvider === 'aws'}
              onClick={() => setSelectedProvider('aws')}
            />
            <ProviderCard
              name="Azure"
              logo="Azure"
              selected={selectedProvider === 'azure'}
              onClick={() => setSelectedProvider('azure')}
            />
          </div>

          {/* Connection Steps */}
          {selectedProvider && (
            <div className="bg-slate-900/50 border border-emerald-500/20 rounded-xl p-8 mb-8">
              <h2 className="text-xl font-semibold text-white mb-6">Connection Steps</h2>
              <div className="space-y-4">
                <StepItem number={1} text="Authenticate with your cloud provider" completed />
                <StepItem number={2} text="Grant read-only access to Infra" completed />
                <StepItem number={3} text="Start scanning your infrastructure" />
              </div>
            </div>
          )}

          {/* Connect Button */}
          <div className="text-center">
            <button
              onClick={handleConnect}
              disabled={!selectedProvider || isConnecting}
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 rounded-lg text-lg font-semibold shadow-lg shadow-emerald-500/50 transition-all duration-300 hover:shadow-emerald-500/70 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 hover:scale-105"
            >
              {isConnecting ? 'Connecting...' : 'Connect & Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProviderCard({ name, logo, selected, onClick }: { name: string; logo: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`p-8 rounded-xl border-2 transition-all duration-300 ${
        selected
          ? 'bg-emerald-500/10 border-emerald-500 shadow-lg shadow-emerald-500/30'
          : 'bg-slate-900/50 border-slate-700 hover:border-emerald-500/50'
      }`}
    >
      <div className="text-4xl font-bold text-emerald-400 mb-4">{logo}</div>
      <div className="text-lg font-semibold text-white mb-2">{name}</div>
      {selected && (
        <div className="flex items-center justify-center text-emerald-400 text-sm">
          <Check className="w-4 h-4 mr-1" />
          Selected
        </div>
      )}
    </button>
  );
}

function StepItem({ number, text, completed }: { number: number; text: string; completed?: boolean }) {
  return (
    <div className="flex items-center">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
          completed ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
        }`}
      >
        {completed ? <Check className="w-5 h-5" /> : number}
      </div>
      <span className={completed ? 'text-white' : 'text-slate-400'}>{text}</span>
    </div>
  );
}
