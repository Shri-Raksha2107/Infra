import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Cloud, Check, ChevronRight, ChevronLeft } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassPanel } from '../components/ui/GlassPanel';

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
        <div className="min-h-screen bg-[#050704] font-['Inter',sans-serif] text-slate-100 antialiased overflow-y-auto animate-mesh relative">
            <div className="absolute inset-0 pointer-events-none opacity-30 fixed">
                <svg className="w-full h-full" preserveAspectRatio="none">
                    <path className="data-stream" d="M 0 50 Q 250 150 500 0" fill="none" stroke="#10b981" strokeWidth="0.5" />
                    <path className="data-stream" d="M 0 200 Q 400 300 800 100" fill="none" stroke="#10b981" strokeWidth="0.8" style={{ animationDelay: '-2s' }} />
                </svg>
            </div>
            <div className="container mx-auto px-6 py-10 max-w-4xl relative z-10">

                {/* Logo */}
                <div className="flex items-center gap-3 mb-10">
                    <div className="p-2.5 rounded-xl bg-[#10b981]/10 border border-[#10b981]/30 shadow-[0_0_15px_rgba(72,183,16,0.2)]">
                        <Cloud className="w-6 h-6 text-[#10b981]" strokeWidth={2} />
                    </div>
                    <span className="text-2xl font-black tracking-tight text-white drop-shadow-md">Infra</span>
                </div>

                {/* ── Progress Bar ─────────────────────────────────────────────── */}
                <div className="mb-10">
                    <div className="flex items-center justify-between mb-3">
                        {STEPS.map((label, i) => (
                            <div key={label} className="flex items-center flex-1 last:flex-none">
                                <div className="flex flex-col items-center">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${i < currentStep
                                            ? 'bg-[#10b981] border-[#10b981] text-[#050704] shadow-[0_0_15px_rgba(72,183,16,0.4)]'
                                            : i === currentStep
                                                ? 'bg-[#10b981]/10 border-[#10b981] text-[#10b981] shadow-[0_0_15px_rgba(72,183,16,0.2)]'
                                                : 'bg-white/5 border-white/20 text-slate-500'
                                            }`}
                                    >
                                        {i < currentStep ? <Check className="w-5 h-5" strokeWidth={3} /> : i + 1}
                                    </div>
                                    <span
                                        className={`text-[11px] uppercase tracking-wider mt-3 font-bold transition-colors ${i === currentStep ? 'text-[#10b981]' : i < currentStep ? 'text-slate-300' : 'text-slate-600'
                                            }`}
                                    >
                                        {label}
                                    </span>
                                </div>
                                {i < STEPS.length - 1 && (
                                    <div className={`h-1 flex-1 mx-4 mb-6 rounded-full transition-all duration-500 ${i < currentStep ? 'bg-[#10b981] shadow-[0_0_8px_rgba(72,183,16,0.5)]' : 'bg-white/10'}`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Step Content ─────────────────────────────────────────────── */}
                <GlassPanel className="p-8 md:p-12 min-h-[500px] flex flex-col justify-between">
                    <div>

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
                            <div className="text-center py-16 flex flex-col items-center">
                                <div className="w-24 h-24 mb-8 bg-[#10b981]/20 rounded-full flex items-center justify-center relative shadow-[0_0_30px_rgba(72,183,16,0.3)]">
                                    <div className="absolute inset-0 bg-[#10b981]/30 rounded-full animate-ping" />
                                    <Check className="w-12 h-12 text-[#10b981] relative z-10" strokeWidth={3} />
                                </div>
                                <h2 className="text-4xl font-black text-white mb-4 drop-shadow-md">Account Ready!</h2>
                                <p className="text-slate-400 text-lg max-w-lg leading-relaxed font-medium">Your user profile has been created successfully. Let's configure your cloud environments to start optimizing your infrastructure.</p>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="mb-12 text-center">
                                    <h2 className="text-3xl font-black text-white mb-3 drop-shadow-md">Optimization Preferences</h2>
                                    <p className="text-slate-400 text-lg font-medium">Customize how Infra monitors and optimizes your infrastructure.</p>
                                </div>
                                <div className="space-y-4 max-w-2xl mx-auto">
                                    {[
                                        { title: 'Enable daily cost reports', desc: 'Receive a daily summary of your cloud spending and optimization suggestions directly in your inbox.' },
                                        { title: 'Auto-apply low-risk optimizations', desc: 'Allow Infra to automatically execute safe, reversible changes like right-sizing idle instances.' },
                                        { title: 'Slack notifications for critical alerts', desc: 'Get instantly notified in your preferred Slack channels when spending spikes occur.' },
                                        { title: 'Weekly performance digest', desc: 'A comprehensive weekly report analyzing your infrastructure efficiency score.' },
                                    ].map((pref, i) => (
                                        <label key={i} className="flex items-start gap-5 p-6 rounded-[1.5rem] bg-white/5 border border-white/10 hover:border-[#10b981]/50 hover:bg-[#10b981]/5 cursor-pointer transition-all duration-300 group shadow-lg hover:shadow-[0_0_20px_rgba(72,183,16,0.15)] relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#10b981]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <div className="relative flex items-center mt-1">
                                                <input type="checkbox" defaultChecked className="w-6 h-6 rounded border-white/20 bg-black/20 border-2 checked:border-[#10b981] checked:bg-[#10b981] hover:border-[#10b981] transition-colors focus:ring-[#10b981] focus:ring-offset-[#050704]" />
                                            </div>
                                            <div>
                                                <div className="text-white text-lg font-bold mb-1.5 group-hover:text-[#10b981] transition-colors">{pref.title}</div>
                                                <div className="text-slate-400 text-sm leading-relaxed font-medium">{pref.desc}</div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="mb-12 text-center">
                                    <h2 className="text-3xl font-black text-white mb-3 drop-shadow-md">Review &amp; Launch</h2>
                                    <p className="text-slate-400 text-lg font-medium">Everything looks great. You're ready to start optimizing.</p>
                                </div>
                                <div className="max-w-xl mx-auto space-y-4">
                                    {[
                                        { label: 'Cloud Provider', value: selectedProvider.toUpperCase(), highlight: true },
                                        { label: 'Active Regions', value: [...enabledRegions].length > 0 ? [...enabledRegions].join(', ') : 'None selected', highlight: false },
                                        { label: 'Billing Access', value: billingAccess ? 'Granted' : 'Revoked', highlight: billingAccess },
                                        { label: 'Cost Alerts', value: costAlerts ? 'Enabled' : 'Disabled', highlight: costAlerts },
                                    ].map(({ label, value, highlight }, i) => (
                                        <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/10 shadow-lg hover:border-white/20 transition-colors">
                                            <span className="text-slate-400 font-semibold mb-2 sm:mb-0">{label}</span>
                                            <span className={`text-sm font-bold px-4 py-1.5 rounded-lg ${highlight ? 'bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20 shadow-[0_0_10px_rgba(72,183,16,0.1)]' : 'bg-black/20 text-slate-300 border border-white/5'}`}>
                                                {value}
                                            </span>
                                        </div>
                                    ))}

                                    <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-[#10b981]/10 to-transparent border border-[#10b981]/30 shadow-[0_0_20px_rgba(72,183,16,0.05)] flex gap-5 items-start relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#10b981] to-transparent shadow-[0_0_10px_#10b981]"></div>
                                        <div className="bg-[#10b981]/20 p-2.5 rounded-xl border border-[#10b981]/40 shrink-0 shadow-[0_0_15px_rgba(72,183,16,0.2)]">
                                            <Cloud className="w-6 h-6 text-[#10b981]" strokeWidth={2} />
                                        </div>
                                        <div>
                                            <h4 className="text-[#10b981] font-black tracking-wide mb-1.5 text-lg drop-shadow-sm">We're ready to connect</h4>
                                            <p className="text-slate-300 text-sm leading-relaxed font-medium">Once you launch, Infra will begin securely analyzing your environments. The initial sync usually takes less than 5 minutes.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                    {/* ── Navigation ───────────────────────────────────────────────── */}
                    <div className="flex flex-col md:flex-row items-center justify-between mt-12 pt-8 border-t border-white/10 gap-6">
                        <button
                            onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
                            disabled={currentStep === 0}
                            className="flex items-center gap-2 text-slate-400 hover:text-white font-bold transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed px-4 py-2 rounded-lg hover:bg-white/5"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            Back to Step {Math.max(1, currentStep)}
                        </button>

                        <div className="flex flex-col items-center">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Step {currentStep + 1} of {STEPS.length}</span>
                        </div>

                        <button
                            onClick={handleContinue}
                            className="flex items-center gap-3 px-10 py-3.5 rounded-xl bg-[#10b981] hover:bg-[#3ea00e] text-[#050704] font-black shadow-[0_0_20px_rgba(72,183,16,0.3)] hover:shadow-[0_0_30px_rgba(72,183,16,0.5)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                        >
                            {currentStep === STEPS.length - 1 ? 'Launch Dashboard' : 'Continue'}
                            <ChevronRight className="w-5 h-5" strokeWidth={3} />
                        </button>
                    </div>
                </GlassPanel>
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
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-12 text-center">
                <h2 className="text-3xl md:text-3xl font-black text-white mb-3 drop-shadow-md">Connect Your Cloud Provider</h2>
                <p className="text-slate-400 text-lg font-medium">Choose the cloud platforms you want to optimize for maximum performance and cost efficiency.</p>
            </div>

            {/* Provider cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {providers.map((p) => (
                    <GlassCard
                        key={p.id}
                        glow={selectedProvider === p.id}
                        onClick={() => setSelectedProvider(p.id)}
                        className={`cursor-pointer transition-all duration-300 group ${selectedProvider === p.id
                            ? 'border-[#10b981]/50 bg-[#10b981]/5 scale-[1.02]'
                            : 'border-white/10 hover:border-white/30 hover:bg-white/5'
                            }`}
                    >
                        <div className="p-6 flex flex-col items-center text-center h-full">
                            {selectedProvider === p.id && (
                                <div className="absolute top-4 right-4 text-[#10b981] bg-[#10b981]/10 p-1 rounded-full border border-[#10b981]/30 shadow-[0_0_10px_rgba(72,183,16,0.3)]">
                                    <Check className="w-4 h-4" strokeWidth={3} />
                                </div>
                            )}
                            <div className="w-20 h-20 mb-5 flex items-center justify-center rounded-2xl bg-white/5 p-4 overflow-hidden border border-white/10 group-hover:bg-white/10 transition-colors shadow-inner">
                                <img alt={p.name} className="w-full h-full object-contain filter drop-shadow-md" src={p.logo} />
                            </div>
                            <h3 className="text-white font-black mb-2 text-lg tracking-tight">{p.name}</h3>
                            <span className={`text-[10px] uppercase tracking-widest font-bold mb-6 ${selectedProvider === p.id ? 'text-[#10b981]' : 'text-slate-500 group-hover:text-slate-400 transition-colors'}`}>
                                {selectedProvider === p.id ? 'Connected' : 'Not Connected'}
                            </span>
                            {selectedProvider === p.id ? (
                                <div className="mt-auto w-full py-2.5 bg-[#10b981]/10 border border-[#10b981]/30 rounded-xl text-[#10b981] text-sm font-bold shadow-inner">Selected</div>
                            ) : (
                                <button className="mt-auto w-full py-2.5 bg-white/5 border border-white/10 group-hover:bg-white/10 group-hover:border-white/20 transition-all rounded-xl text-white text-sm font-bold">Connect</button>
                            )}
                        </div>
                    </GlassCard>
                ))}
            </div>

            {/* Regions & Permissions */}
            <div className="border-t border-white/10 pt-10">
                <h3 className="text-2xl font-black text-white mb-8 tracking-tight drop-shadow-md">Regions &amp; Permissions</h3>

                <div className="mb-10">
                    <p className="text-slate-400 text-sm mb-5 font-bold uppercase tracking-wider">Active Regions to Monitor</p>

                    <div className="flex flex-wrap gap-4">
                        {regions.map((r) => (
                            <label
                                key={r}
                                className={`flex items-center gap-3 border px-5 py-2.5 rounded-xl cursor-pointer transition-all duration-300 font-medium ${enabledRegions.has(r) ? 'border-[#10b981]/50 bg-[#10b981]/10 shadow-[0_0_15px_rgba(72,183,16,0.1)]' : 'border-white/10 bg-white/5 hover:bg-white/10'
                                    }`}
                            >
                                <span className={`text-sm ${enabledRegions.has(r) ? 'text-white' : 'text-slate-300'}`}>{r}</span>
                                <div className="relative inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={enabledRegions.has(r)}
                                        onChange={() => toggleRegion(r)}
                                        className="sr-only peer"
                                    />
                                    <div className={`w-10 h-6 rounded-full transition-colors flex items-center px-[3px] shadow-inner ${enabledRegions.has(r) ? 'bg-[#10b981]' : 'bg-black/40'}`}>
                                        <div className={`w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${enabledRegions.has(r) ? 'translate-x-[18px]' : 'translate-x-[2px]'}`}></div>
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
                        <label key={label} className="flex items-start gap-4 p-5 rounded-[1.5rem] bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 cursor-pointer transition-all duration-300">
                            <div className="relative flex items-center mt-1">
                                <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={(e) => toggle(e.target.checked)}
                                    className="w-6 h-6 rounded border-white/20 bg-black/20 border-2 checked:border-[#10b981] checked:bg-[#10b981] hover:border-[#10b981] transition-colors focus:ring-[#10b981] focus:ring-offset-[#050704]"
                                />
                            </div>
                            <div>
                                <div className="text-white font-bold text-lg mb-1">{label}</div>
                                <div className="text-slate-400 text-sm font-medium leading-relaxed">{desc}</div>
                            </div>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}
