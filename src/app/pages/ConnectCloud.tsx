import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth, SignIn } from '@clerk/react';
import { Cloud, Check } from 'lucide-react';
import { useState } from 'react';

export function ConnectCloud() {
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useAuth();
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  // If already signed in, go straight to dashboard
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate('/dashboard');
    }
  }, [isLoaded, isSignedIn, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950">
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Cloud className="w-16 h-16 text-emerald-400 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-white mb-4">Connect Your Cloud</h1>
            <p className="text-lg text-slate-400">
              Select your cloud provider and sign in to start optimizing your infrastructure
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
              comingSoon
              onClick={() => setSelectedProvider('aws')}
            />
            <ProviderCard
              name="Azure"
              logo="Azure"
              selected={selectedProvider === 'azure'}
              comingSoon
              onClick={() => setSelectedProvider('azure')}
            />
          </div>

          {/* Clerk Sign-In (GCP selected) */}
          {selectedProvider === 'gcp' && (
            <div className="flex flex-col items-center">
              {/* Clerk's full Sign-In component — handles Google, email, etc. */}
              <SignIn
                routing="hash"
                forceRedirectUrl="/dashboard"
                signUpForceRedirectUrl="/onboarding"
                appearance={{
                  variables: {
                    colorPrimary: '#10b981',
                    colorBackground: '#0f172a',
                    colorText: '#f8fafc',
                    colorTextSecondary: '#94a3b8',
                    colorInputBackground: '#1e293b',
                    colorInputText: '#f8fafc',
                    borderRadius: '0.75rem',
                  },
                  elements: {
                    card: 'bg-slate-950 border border-emerald-500/20 shadow-2xl shadow-emerald-500/10',
                    headerTitle: 'text-white',
                    headerSubtitle: 'text-slate-400',
                    socialButtonsBlockButton:
                      'bg-slate-900 border border-slate-700 hover:border-emerald-500/50 text-white transition-all',
                    formFieldInput:
                      'bg-slate-900 border-slate-700 text-white focus:border-emerald-500',
                    footerActionLink: 'text-emerald-400 hover:text-emerald-300',
                    formButtonPrimary:
                      'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-semibold shadow-lg shadow-emerald-500/30',
                  },
                }}
              />
            </div>
          )}

          {/* Coming Soon for AWS/Azure */}
          {(selectedProvider === 'aws' || selectedProvider === 'azure') && (
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-8 text-center">
              <div className="text-4xl mb-4">🚧</div>
              <h2 className="text-xl font-semibold text-white mb-2">Coming Soon</h2>
              <p className="text-slate-400">
                {selectedProvider === 'aws' ? 'AWS' : 'Azure'} integration is under development.
                Please use <span className="text-emerald-400 font-medium">Google Cloud</span> for now.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProviderCard({
  name,
  logo,
  selected,
  comingSoon,
  onClick,
}: {
  name: string;
  logo: string;
  selected: boolean;
  comingSoon?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={comingSoon}
      className={`relative p-8 rounded-xl border-2 transition-all duration-300 text-left w-full ${comingSoon
        ? 'bg-slate-900/20 border-slate-800 opacity-60 cursor-not-allowed'
        : selected
          ? 'bg-emerald-500/10 border-emerald-500 shadow-lg shadow-emerald-500/30'
          : 'bg-slate-900/50 border-slate-700 hover:border-emerald-500/50 cursor-pointer'
        }`}
    >
      {comingSoon && (
        <span className="absolute top-3 right-3 text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-400 font-medium">
          Soon
        </span>
      )}
      <div className="text-4xl font-bold text-emerald-400 mb-4">{logo}</div>
      <div className="text-lg font-semibold text-white mb-2">{name}</div>
      {selected && !comingSoon && (
        <div className="flex items-center text-emerald-400 text-sm">
          <Check className="w-4 h-4 mr-1" />
          Selected
        </div>
      )}
    </button>
  );
}
