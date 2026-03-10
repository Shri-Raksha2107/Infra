import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Cloud, Check, ChevronRight, ChevronLeft } from 'lucide-react';

const STEPS = ['Account', 'Cloud Setup', 'Preferences', 'Review'];

const REGIONS = ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1'];

export function OnboardingPage() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1); // 0-indexed, starts at step 2 (Cloud Setup)
    const [selectedProvider, setSelectedProvider] = useState<string>('gcp');
    const [enabledRegions, setEnabledRegions] = useState<Set<string>>(
        new Set(['us-east-1', 'us-west-2', 'eu-west-1'])
    );
    const [billingAccess, setBillingAccess] = useState(true);
    const [costAlerts, setCostAlerts] = useState(true);

    const toggleRegion = (r: string) =>
        setEnabledRegions((prev) => {
            const next = new Set(prev);
            next.has(r) ? next.delete(r) : next.add(r);
            return next;
        });

    const handleContinue = () => {
        if (currentStep < STEPS.length - 1) setCurrentStep(currentStep + 1);
        else navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 font-['Inter',sans-serif]">
            <div className="container mx-auto px-6 py-10 max-w-4xl">

                {/* Logo */}
                <div className="flex items-center gap-3 mb-10">
                    <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
                        <Cloud className="w-6 h-6 text-emerald-400" strokeWidth={1.5} />
                    </div>
                    <span className="text-xl font-bold text-white">Infra</span>
                </div>

                {/* ── Progress Bar ─────────────────────────────────────────────── */}
                <div className="mb-10">
                    <div className="flex items-center justify-between mb-3">
                        {STEPS.map((label, i) => (
                            <div key={label} className="flex items-center flex-1 last:flex-none">
                                <div className="flex flex-col items-center">
                                    <div
                                        className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all ${i < currentStep
                                            ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                                            : i === currentStep
                                                ? 'bg-transparent border-emerald-400 text-emerald-400'
                                                : 'bg-transparent border-slate-700 text-slate-600'
                                            }`}
                                    >
                                        {i < currentStep ? <Check className="w-4 h-4" /> : i + 1}
                                    </div>
                                    <span
                                        className={`text-xs mt-2 font-medium ${i === currentStep ? 'text-emerald-400' : i < currentStep ? 'text-slate-300' : 'text-slate-600'
                                            }`}
                                    >
                                        {label}
                                    </span>
                                </div>
                                {i < STEPS.length - 1 && (
                                    <div className={`h-0.5 flex-1 mx-2 mb-5 rounded-full transition-all ${i < currentStep ? 'bg-emerald-500' : 'bg-slate-800'}`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Step Content ─────────────────────────────────────────────── */}
                <div className="bg-slate-900/80 border border-emerald-500/20 rounded-xl p-8 md:p-12 shadow-[0_0_20px_rgba(16,185,129,0.05)] backdrop-blur-md relative overflow-hidden">

                    {currentStep === 1 && <CloudSetupStep
                        selectedProvider={selectedProvider}
                        setSelectedProvider={setSelectedProvider}
                        enabledRegions={enabledRegions}
                        toggleRegion={toggleRegion}
                        regions={REGIONS}
                        billingAccess={billingAccess}
                        setBillingAccess={setBillingAccess}
                        costAlerts={costAlerts}
                        setCostAlerts={setCostAlerts}
                    />}

                    {currentStep === 0 && (
                        <div className="text-center py-12 flex flex-col items-center">
                            <div className="w-20 h-20 mb-6 bg-emerald-500/20 rounded-full flex items-center justify-center relative">
                                <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping" />
                                <Check className="w-10 h-10 text-emerald-500 relative z-10" strokeWidth={3} />
                            </div>
                            <h2 className="text-3xl font-black text-white mb-3">Account Ready!</h2>
                            <p className="text-slate-400 text-lg max-w-md">Your user profile has been created successfully. Let's configure your cloud environments to start optimizing your infrastructure.</p>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="">
                            <div className="mb-10 text-center">
                                <h2 className="text-3xl font-black text-white mb-2">Optimization Preferences</h2>
                                <p className="text-slate-400 text-lg">Customize how Infra monitors and optimizes your infrastructure.</p>
                            </div>
                            <div className="space-y-4 max-w-2xl mx-auto">
                                {[
                                    { title: 'Enable daily cost reports', desc: 'Receive a daily summary of your cloud spending and optimization suggestions directly in your inbox.' },
                                    { title: 'Auto-apply low-risk optimizations', desc: 'Allow Infra to automatically execute safe, reversible changes like right-sizing idle instances.' },
                                    { title: 'Slack notifications for critical alerts', desc: 'Get instantly notified in your preferred Slack channels when spending spikes occur.' },
                                    { title: 'Weekly performance digest', desc: 'A comprehensive weekly report analyzing your infrastructure efficiency score.' },
                                ].map((pref, i) => (
                                    <label key={i} className="flex items-start gap-4 p-5 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:border-emerald-500/50 cursor-pointer transition-all group shadow-sm hover:shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                                        <div className="relative flex items-center mt-1">
                                            <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-slate-700 bg-slate-900 border-2 checked:border-emerald-500 checked:bg-emerald-500 hover:border-emerald-500 transition-colors focus:ring-emerald-500 focus:ring-offset-slate-900" />
                                        </div>
                                        <div>
                                            <div className="text-white font-bold mb-1 group-hover:text-emerald-400 transition-colors">{pref.title}</div>
                                            <div className="text-slate-400 text-sm leading-relaxed">{pref.desc}</div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="">
                            <div className="mb-10 text-center">
                                <h2 className="text-3xl font-black text-white mb-2">Review &amp; Launch</h2>
                                <p className="text-slate-400 text-lg">Everything looks great. You're ready to start optimizing.</p>
                            </div>
                            <div className="max-w-xl mx-auto space-y-4">
                                {[
                                    { label: 'Cloud Provider', value: selectedProvider.toUpperCase(), highlight: true },
                                    { label: 'Active Regions', value: [...enabledRegions].length > 0 ? [...enabledRegions].join(', ') : 'None selected', highlight: false },
                                    { label: 'Billing Access', value: billingAccess ? 'Granted' : 'Revoked', highlight: billingAccess },
                                    { label: 'Cost Alerts', value: costAlerts ? 'Enabled' : 'Disabled', highlight: costAlerts },
                                ].map(({ label, value, highlight }, i) => (
                                    <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-xl bg-slate-800/60 border border-slate-700/50 shadow-sm">
                                        <span className="text-slate-400 font-medium mb-1 sm:mb-0">{label}</span>
                                        <span className={`text-sm font-bold px-3 py-1 rounded-md ${highlight ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-700 text-slate-300'}`}>
                                            {value}
                                        </span>
                                    </div>
                                ))}

                                <div className="mt-8 p-5 rounded-xl bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/20 flex gap-4 items-start">
                                    <div className="bg-emerald-500/20 p-2 rounded-lg shrink-0 mt-0.5">
                                        <Cloud className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-emerald-400 font-bold mb-1">We're ready to connect</h4>
                                        <p className="text-slate-400 text-sm leading-relaxed">Once you launch, Infra will begin securely analyzing your environments. The initial sync usually takes less than 5 minutes.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── Navigation ───────────────────────────────────────────────── */}
                    <div className="flex flex-col md:flex-row items-center justify-between mt-10 pt-8 border-t border-slate-800 gap-6">
                        <button
                            onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
                            disabled={currentStep === 0}
                            className="flex items-center gap-2 text-slate-400 hover:text-white font-bold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            Back to Step {Math.max(1, currentStep)}
                        </button>

                        <div className="flex flex-col items-center">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Step {currentStep + 1} of {STEPS.length}</span>
                        </div>

                        <button
                            onClick={handleContinue}
                            className="flex items-center gap-2 px-10 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold shadow-lg shadow-emerald-500/20 transition-all hover:shadow-emerald-500/40"
                        >
                            {currentStep === STEPS.length - 1 ? 'Launch Dashboard' : 'Continue'}
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ── Cloud Setup Step Component ──────────────────────────────────────────── */
function CloudSetupStep({
    selectedProvider, setSelectedProvider,
    enabledRegions, toggleRegion, regions,
    billingAccess, setBillingAccess,
    costAlerts, setCostAlerts,
}: {
    selectedProvider: string; setSelectedProvider: (p: string) => void;
    enabledRegions: Set<string>; toggleRegion: (r: string) => void; regions: string[];
    billingAccess: boolean; setBillingAccess: (v: boolean) => void;
    costAlerts: boolean; setCostAlerts: (v: boolean) => void;
}) {
    const providers = [
        {
            id: 'gcp', name: 'Google Cloud',
            logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA90m-yo0NLbKtf4V2yNsHMtkW-ZGPzQ20mFxqyhLsO-8y7nW7pxaLJSrf9YFrQ3qkkvqwj45bHEQUlbZ3Ctys5pSrA8xg2e026AL5MIHzC8r93wxknYW-d36hrzlmlecA93cor326wMPl80rIv_gFOcOmXQybHcX8wXQuheoXSo3oXAKJj1CCyNHIsfK6sE2d0YDJSdPBSkkfW5rrBcWZ_Kw7OCQ-TaJvMlK8YqAlzA2PZWBctjx7T7k086UKUyzhnlL5hsiy62HA'
        },
        {
            id: 'aws', name: 'AWS',
            logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDPjdHqMuMqlqfQJVUlCZKyOIhbs_srBeeYl4pyC97FYpeaI7KlarofKIj2HvId4VrnO7zuoknz4y1EIuv1z4CH9DD9a8bZ0JXGjjD-5zP5qUpi478M63hb433buAjHuZBfint7IGJqvAINurdF7vUgn8tFndAmxQmy7bOFcAxRD9c9cELo3d3MNqm13pTJkELVnJ2jHpycJeZMC3JvdJCVYB3nIWrt0mW09v6D7iYDR7J9Nb7oUgeN0HGbc4iandkmWcH-snTmvA'
        },
        {
            id: 'azure', name: 'Microsoft Azure',
            logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXA1eSYPR5KMpcI2SBnjSAbpjEdXWWFxSW7FpoWP4SEGfJjWpwNx7qr3xxlnPcFMfz7Gc9hAsKhcIEDLDozw3tioPp9j6yTJLRHNo5iwW3lytEJd0ER_Khgpta6qW3pp3jY5pGkuGy3HKtnRbWLZobWsX4K9jX3Y34OGS9kLSuZL12xasvPalh0L1fws4a0fqr3HC5kznMIzA6bjUvPEbWUocvo-MZw1x265jHycBQyNFvBdzirJvc_Iki4m5-3LRRKyfTkB5KhEc'
        },
    ];

    return (
        <div>
            <div className="mb-10 text-center">
                <h2 className="text-3xl md:text-3xl font-black text-white mb-2">Connect Your Cloud Provider</h2>
                <p className="text-slate-400 text-lg">Choose the cloud platforms you want to optimize for maximum performance and cost efficiency.</p>
            </div>

            {/* Provider cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {providers.map((p) => (
                    <div
                        key={p.id}
                        onClick={() => setSelectedProvider(p.id)}
                        className={`relative group cursor-pointer border-2 rounded-xl p-6 flex flex-col items-center text-center transition-all ${selectedProvider === p.id
                            ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                            : 'border-slate-700 hover:border-emerald-500/50 bg-slate-800/40'
                            }`}
                    >
                        {selectedProvider === p.id && (
                            <div className="absolute top-3 right-3 text-emerald-500">
                                <Check className="w-5 h-5" />
                            </div>
                        )}
                        <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-lg bg-white/10 p-2 overflow-hidden">
                            <img alt={p.name} className="w-full h-full object-contain" src={p.logo} />
                        </div>
                        <h3 className="text-white font-bold mb-1">{p.name}</h3>
                        <span className={`text-[10px] uppercase tracking-widest font-bold mb-4 ${selectedProvider === p.id ? 'text-emerald-500' : 'text-slate-500'}`}>
                            {selectedProvider === p.id ? 'Connected' : 'Not Connected'}
                        </span>
                        {selectedProvider === p.id ? (
                            <div className="mt-auto w-full py-2 bg-emerald-500/20 rounded-lg text-emerald-500 text-xs font-bold">Selected</div>
                        ) : (
                            <button className="mt-auto w-full py-2 bg-slate-700 group-hover:bg-emerald-500 transition-colors rounded-lg text-white text-xs font-bold">Connect</button>
                        )}
                    </div>
                ))}
            </div>

            {/* Regions & Permissions */}
            <div className="border-t border-slate-800 pt-10">
                <h3 className="text-xl font-bold text-white mb-6">Regions &amp; Permissions</h3>

                <div className="mb-8">
                    <p className="text-slate-400 text-sm mb-5">Active Regions to Monitor</p>

                    <div className="flex flex-wrap gap-4">
                        {regions.map((r) => (
                            <label
                                key={r}
                                className={`flex items-center gap-3 border px-4 py-2 rounded-lg cursor-pointer transition-all ${enabledRegions.has(r) ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-slate-700 bg-slate-800/50'
                                    }`}
                            >
                                <span className="text-sm font-medium text-slate-200">{r}</span>
                                <div className="relative inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={enabledRegions.has(r)}
                                        onChange={() => toggleRegion(r)}
                                        className="sr-only peer"
                                    />
                                    <div className={`w-9 h-5 rounded-full transition-colors flex items-center px-[2px] ${enabledRegions.has(r) ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${enabledRegions.has(r) ? 'translate-x-[16px]' : 'translate-x-0'}`}></div>
                                    </div>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    {[
                        {
                            checked: billingAccess, toggle: setBillingAccess,
                            label: 'Grant read-only access to billing data',
                            desc: 'Allows Infra to analyze historical spending and provide cost-saving recommendations.',
                        },
                        {
                            checked: costAlerts, toggle: setCostAlerts,
                            label: 'Enable automated cost alerts',
                            desc: 'Receive instant notifications if your spending exceeds predefined thresholds.',
                        },
                    ].map(({ checked, toggle, label, desc }) => (
                        <label key={label} className="flex items-start gap-3 cursor-pointer group">
                            <div className="relative flex items-center mt-1">
                                <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={(e) => toggle(e.target.checked)}
                                    className="w-5 h-5 rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-950"
                                />
                            </div>
                            <div>
                                <div className="text-white font-medium">{label}</div>
                                <div className="text-slate-500 text-sm">{desc}</div>
                            </div>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}
