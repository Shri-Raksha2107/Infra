import { SignIn } from '@clerk/react';
import { Cloud, TrendingDown, Shield, Zap, CheckCircle } from 'lucide-react';

export function LoginPage() {
    return (
        <div className="flex h-screen w-full relative bg-[#050704] font-['Inter',sans-serif] text-slate-100 antialiased overflow-hidden">
            {/* Left Side: Branding Panel (60%) */}
            <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden animate-mesh p-16 flex-col justify-between border-r border-white/5">
                {/* Data Streams SVG Background */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" preserveAspectRatio="none">
                    <path className="data-stream" d="M 100 100 Q 300 150 500 400" fill="none" stroke="#10b981" strokeWidth="1" />
                    <path className="data-stream" d="M 100 100 Q 200 300 400 550" fill="none" stroke="#10b981" strokeWidth="0.5" style={{ animationDelay: '-2s' }} />
                    <path className="data-stream" d="M 100 100 Q 400 200 600 300" fill="none" stroke="#10b981" strokeWidth="0.8" style={{ animationDelay: '-4s' }} />
                </svg>

                {/* Sparkle Particles */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="sparkle-particle absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full blur-[1px]"></div>
                    <div className="sparkle-particle absolute top-3/4 left-1/3 w-1.5 h-1.5 bg-[#10b981]/40 rounded-full blur-[1px]" style={{ animationDelay: '1s' }}></div>
                    <div className="sparkle-particle absolute top-1/2 left-2/3 w-1 h-1 bg-white/60 rounded-full blur-[1px]" style={{ animationDelay: '2.5s' }}></div>
                    <div className="sparkle-particle absolute top-1/5 left-1/2 w-0.5 h-0.5 bg-[#10b981]/80 rounded-full" style={{ animationDelay: '0.5s' }}></div>
                </div>

                {/* Logo and Tagline */}
                <div className="relative z-20">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="bg-[#10b981] p-2.5 rounded-2xl shadow-[0_0_30px_rgba(72,183,16,0.3)] glossy-finish text-[#050704]">
                            <Cloud className="w-8 h-8 font-bold" strokeWidth={2.5} />
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter text-white">Infra</h1>
                    </div>
                    <h2 className="text-6xl font-black text-white leading-[1.1] max-w-xl">
                        AI-Powered <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-[#10b981]">Cloud Efficiency</span>
                    </h2>
                    <p className="mt-8 text-slate-400 text-lg max-w-lg leading-relaxed">
                        The intelligent infrastructure layer for modern enterprises. Optimize resources, automate security, and scale without friction.
                    </p>
                </div>

                {/* Feature Highlights */}
                <div className="relative z-20 space-y-8 max-w-md">
                    <div className="group flex items-start gap-4 p-4 rounded-2xl transition-all hover:bg-white/5">
                        <div className="flex-shrink-0 bg-[#10b981]/10 p-2.5 rounded-xl border border-[#10b981]/30 group-hover:border-[#10b981]/60 transition-colors text-[#10b981]">
                            <TrendingDown size={24} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h4 className="text-white font-bold text-lg">Reduce costs by 60%</h4>
                            <p className="text-slate-400 text-sm leading-relaxed">Multi-cloud right-sizing with neural networks.</p>
                        </div>
                    </div>
                    <div className="group flex items-start gap-4 p-4 rounded-2xl transition-all hover:bg-white/5">
                        <div className="flex-shrink-0 bg-[#10b981]/10 p-2.5 rounded-xl border border-[#10b981]/30 group-hover:border-[#10b981]/60 transition-colors text-[#10b981]">
                            <Shield size={24} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h4 className="text-white font-bold text-lg">Autonomous Security</h4>
                            <p className="text-slate-400 text-sm leading-relaxed">Instant remediation of cloud misconfigurations.</p>
                        </div>
                    </div>
                </div>

                {/* Floating Glass Cards */}
                <div className="absolute right-12 top-1/2 -translate-y-1/2 space-y-8 pointer-events-none z-30">
                    <div className="glass-card p-6 rounded-2xl translate-x-12 w-48 relative group" style={{ animation: 'float 6s ease-in-out infinite' }}>
                        <div className="absolute -inset-0.5 bg-gradient-to-br from-[#10b981]/20 to-transparent rounded-2xl blur-sm opacity-50"></div>
                        <div className="relative">
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">Total Saved</p>
                            <p className="text-[#10b981] text-3xl font-black mt-1 emerald-glow">$2.4M</p>
                            <div className="mt-3 w-full bg-white/10 h-1 rounded-full overflow-hidden">
                                <div className="bg-[#10b981] h-full w-[70%]"></div>
                            </div>
                        </div>
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-6 bg-[#10b981]/20 blur-xl rounded-full"></div>
                    </div>

                    <div className="glass-card p-6 rounded-2xl -translate-x-4 w-48 relative" style={{ animation: 'float 6s ease-in-out infinite', animationDelay: '-2s' }}>
                        <div className="absolute -inset-0.5 bg-gradient-to-tr from-white/10 to-transparent rounded-2xl blur-sm opacity-30"></div>
                        <div className="relative">
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">Live Uptime</p>
                            <p className="text-white text-3xl font-black mt-1">99.9<span className="text-[#10b981]/70 text-xl">%</span></p>
                            <div className="flex gap-1 mt-3">
                                <div className="w-1.5 h-3 bg-[#10b981]/40 rounded-sm"></div>
                                <div className="w-1.5 h-5 bg-[#10b981]/60 rounded-sm"></div>
                                <div className="w-1.5 h-4 bg-[#10b981] rounded-sm"></div>
                                <div className="w-1.5 h-6 bg-[#10b981] rounded-sm"></div>
                            </div>
                        </div>
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-8 bg-emerald-900/30 blur-2xl rounded-full"></div>
                    </div>

                    <div className="glass-card p-6 rounded-2xl translate-x-8 w-48 relative" style={{ animation: 'float 6s ease-in-out infinite', animationDelay: '-4s' }}>
                        <div className="absolute -inset-0.5 bg-gradient-to-bl from-[#10b981]/20 to-transparent rounded-2xl blur-sm opacity-50"></div>
                        <div className="relative">
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">Issues Fixed</p>
                            <p className="text-white text-3xl font-black mt-1">1,000<span className="text-[#10b981] text-2xl">+</span></p>
                            <div className="flex -space-x-2 mt-3">
                                <div className="w-6 h-6 rounded-full border border-white/20 bg-slate-800 flex items-center justify-center text-white">
                                    <Zap size={12} fill="currentColor" />
                                </div>
                                <div className="w-6 h-6 rounded-full border border-white/20 bg-slate-700 flex items-center justify-center text-white">
                                    <Shield size={12} fill="currentColor" />
                                </div>
                            </div>
                        </div>
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-6 bg-[#10b981]/10 blur-xl rounded-full"></div>
                    </div>
                </div>

                {/* Bottom Branding */}
                <div className="relative z-20 flex items-center gap-6 text-slate-500 text-xs font-medium tracking-wide">
                    <span className="flex items-center gap-2"><span className="w-1 h-1 bg-[#10b981] rounded-full"></span> ISO 27001 Certified</span>
                    <span className="flex items-center gap-2"><span className="w-1 h-1 bg-[#10b981] rounded-full"></span> SOC2 Type II</span>
                    <span>© {new Date().getFullYear()} Infra Systems</span>
                </div>
            </div>

            {/* Right Side: Login Area (40%) */}
            <div className="w-full lg:w-2/5 h-full flex items-center justify-center p-6 lg:p-12 relative bg-[#050704]">
                {/* Subtle Carbon Fiber Pattern Overlay (CSS inline for tailwind arbitrary value) */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

                <div className="w-full max-w-md relative z-10">
                    <div className="glass-card p-10 rounded-[2rem] border-emerald-500/20 shadow-2xl relative overflow-hidden flex flex-col justify-center">
                        <div className="absolute inset-0 rounded-[2rem] border border-emerald-400/10 pointer-events-none"></div>
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#10b981]/30 to-transparent"></div>

                        {/* Mobile Logo */}
                        <div className="lg:hidden flex justify-center mb-6">
                            <div className="bg-[#10b981] p-2.5 rounded-2xl shadow-[0_0_30px_rgba(72,183,16,0.3)] glossy-finish text-[#050704]">
                                <Cloud className="w-8 h-8 font-bold" strokeWidth={2.5} />
                            </div>
                        </div>

                        <div className="text-center mb-8">
                            <h3 className="text-3xl font-black text-white tracking-tight">Access Portal</h3>
                            <p className="text-slate-400 mt-3 text-sm font-medium">Securely sign in to your cloud instance</p>
                        </div>

                        <div className="relative z-10 w-full flex justify-center">
                            {/* Clerk Sign-In embedded */}
                            <SignIn
                                routing="hash"
                                forceRedirectUrl="/onboarding"
                                signUpForceRedirectUrl="/onboarding"
                                appearance={{
                                    variables: {
                                        colorPrimary: '#10b981',
                                        colorBackground: 'transparent',
                                        colorText: 'white',
                                        colorTextSecondary: '#a1a1aa',
                                        colorInputBackground: 'rgba(255, 255, 255, 0.05)',
                                        colorInputText: 'white',
                                        colorNeutral: '#a1a1aa',
                                        colorShimmer: 'rgba(255, 255, 255, 0.1)',
                                        borderRadius: '1rem',
                                        fontFamily: 'Inter, sans-serif',
                                    },
                                    elements: {
                                        rootBox: 'w-full flex justify-center',
                                        cardBox: 'w-full max-w-full shadow-none bg-transparent',
                                        card: 'bg-transparent border-0 shadow-none w-full max-w-full p-0 flex flex-col gap-2',
                                        headerTitle: 'hidden',
                                        headerSubtitle: 'hidden',
                                        header: 'hidden',
                                        socialButtonsBlockButton: 'w-full group relative flex items-center justify-center gap-3 py-3 px-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold hover:bg-white/10 transition-all duration-300 glossy-finish',
                                        socialButtonsBlockButtonText: 'text-white font-semibold',
                                        formFieldInput: 'w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#10b981]/30 focus:border-[#10b981]/50 transition-all',
                                        formFieldLabel: 'block text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 mb-2',
                                        formButtonPrimary: 'w-full relative py-3 bg-gradient-to-r from-[#10b981] to-emerald-600 rounded-2xl text-slate-950 font-black text-lg shadow-[0_10px_30px_rgba(72,183,16,0.3)] hover:shadow-[0_15px_40px_rgba(72,183,16,0.5)] hover:-translate-y-0.5 transition-all duration-300 glossy-finish mt-2',
                                        identityPreviewEditButton: 'text-[#10b981]',
                                        dividerLine: 'bg-white/10',
                                        dividerText: 'text-slate-500 text-[10px] uppercase tracking-[0.3em] font-bold mx-4',
                                        formFieldRow: 'space-y-4 pt-4',
                                        footer: 'bg-transparent border-0 pt-6',
                                        footerAction: 'flex justify-center items-center',
                                        footerActionText: 'text-slate-400 text-sm font-medium',
                                        footerActionLink: 'text-[#10b981] font-bold hover:text-emerald-400 transition-colors ml-1 uppercase text-xs tracking-tight',
                                        badge: 'mt-4 border border-white/10 bg-black/20 text-slate-400 rounded-full px-4 py-1 flex items-center gap-2 max-w-fit mx-auto',
                                    },
                                }}
                            />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
