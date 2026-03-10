import { SignIn } from '@clerk/react';
import { Cloud, TrendingDown, Shield, Cpu } from 'lucide-react';

export function LoginPage() {
    return (
        <div className="min-h-screen flex bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 font-['Inter',sans-serif]">

            {/* ── Left: Branding Panel ─────────────────────────────────────── */}
            <div className="hidden lg:flex lg:w-3/5 flex-col justify-between p-16 relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-950 to-emerald-950/20 border-r border-emerald-500/10">
                {/* Decorative Background Element */}
                <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none" aria-hidden="true">
                    <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-emerald-900/30 rounded-full blur-[100px]" />
                </div>

                {/* Hero / Logo */}
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="bg-emerald-500 p-2 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                            <Cloud className="w-7 h-7 text-slate-950" strokeWidth={2.5} />
                        </div>
                        <h1 className="text-4xl font-black tracking-tight text-white">Infra</h1>
                    </div>
                    <h2 className="text-5xl font-extrabold text-white leading-tight max-w-xl">
                        AI-Powered <span className="text-emerald-500">Cloud Optimization</span> Platform
                    </h2>
                    <p className="mt-6 text-slate-400 text-lg max-w-lg mb-12">
                        Manage your infrastructure with precision. Automate scaling, enhance security, and drive efficiency across all your cloud providers.
                    </p>

                    {/* Features */}
                    <div className="space-y-4 mb-12">
                        {[
                            { icon: <TrendingDown className="w-5 h-5" />, title: 'Reduce costs by 60%', desc: 'Automated right-sizing and spot instance management.' },
                            { icon: <Shield className="w-5 h-5" />, title: 'Real-time security scanning', desc: 'Continuous monitoring for vulnerabilities and misconfigurations.' },
                            { icon: <Cpu className="w-5 h-5" />, title: 'AI-powered recommendations', desc: 'Predictive analytics for performance and availability.' },
                        ].map((f) => (
                            <div key={f.title} className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/40 border border-emerald-500/10 hover:border-emerald-500/30 transition-colors">
                                <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400 shrink-0 mt-0.5">
                                    {f.icon}
                                </div>
                                <div>
                                    <div className="text-white font-semibold text-sm">{f.title}</div>
                                    <div className="text-slate-400 text-sm mt-0.5">{f.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Floating Stat Cards (Hide on smaller lg screens) */}
                <div className="absolute right-10 top-1/2 -translate-y-1/2 space-y-6 pointer-events-none hidden xl:block z-10">
                    <div className="backdrop-blur-md bg-slate-900/50 border border-emerald-500/20 p-5 rounded-xl shadow-2xl translate-x-4">
                        <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Total Saved</p>
                        <p className="text-emerald-400 text-2xl font-black mt-1">$2.4M</p>
                    </div>
                    <div className="backdrop-blur-md bg-slate-900/50 border border-emerald-500/20 p-5 rounded-xl shadow-2xl -translate-x-8">
                        <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Uptime</p>
                        <p className="text-white text-2xl font-black mt-1">99.9%</p>
                    </div>
                    <div className="backdrop-blur-md bg-slate-900/50 border border-emerald-500/20 p-5 rounded-xl shadow-2xl translate-x-2">
                        <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Issues Fixed</p>
                        <p className="text-white text-2xl font-black mt-1">1,000+</p>
                    </div>
                </div>

                {/* Bottom Branding */}
                <div className="relative z-10 flex items-center gap-2 text-slate-500 text-sm">
                    <span>© 2024 Infra Systems Inc.</span>
                    <span className="mx-2">•</span>
                    <span>Trusted by 500+ enterprises worldwide</span>
                </div>
            </div>

            {/* ── Right: Clerk Sign-In ──────────────────────────────────────── */}
            <div className="w-full lg:w-2/5 flex flex-col items-center justify-center p-8 lg:p-12 relative">

                {/* Mobile logo */}
                <div className="flex items-center gap-2 mb-10 lg:hidden">
                    <Cloud className="w-7 h-7 text-emerald-400" strokeWidth={1.5} />
                    <span className="text-xl font-bold text-white">Infra</span>
                </div>

                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
                        <p className="text-slate-400">Sign in to your cloud dashboard</p>
                    </div>

                    {/* Clerk Sign-In embedded */}
                    <SignIn
                        routing="hash"
                        fallbackRedirectUrl="/onboarding"
                        signUpFallbackRedirectUrl="/onboarding"
                        appearance={{
                            variables: {
                                colorPrimary: '#10b981',
                                colorBackground: '#0f172a',
                                colorText: '#f8fafc',
                                colorTextSecondary: '#94a3b8',
                                colorInputBackground: '#1e293b',
                                colorInputText: '#f8fafc',
                                colorNeutral: '#475569',
                                borderRadius: '0.75rem',
                                fontFamily: 'Inter, sans-serif',
                            },
                            elements: {
                                rootBox: 'w-full',
                                card: 'bg-slate-900/80 border border-emerald-500/20 shadow-2xl shadow-emerald-500/10 backdrop-blur-sm w-full',
                                headerTitle: 'hidden',
                                headerSubtitle: 'hidden',
                                header: 'hidden',
                                socialButtonsBlockButton:
                                    'bg-white hover:bg-gray-50 text-gray-900 border-0 font-medium transition-all hover:shadow-lg',
                                formFieldInput:
                                    'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20',
                                formFieldLabel: 'text-slate-300',
                                footerActionLink: 'text-emerald-400 hover:text-emerald-300',
                                formButtonPrimary:
                                    'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-semibold shadow-lg shadow-emerald-500/30 transition-all',
                                identityPreviewEditButton: 'text-emerald-400',
                                dividerLine: 'bg-slate-700',
                                dividerText: 'text-slate-500',
                            },
                        }}
                    />

                    {/* Secured by Clerk badge */}
                    <div className="mt-6 flex items-center justify-center gap-2 text-slate-600 text-xs">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        Secured by Clerk
                    </div>
                </div>
            </div>
        </div>
    );
}
