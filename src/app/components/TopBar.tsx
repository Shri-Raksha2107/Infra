import { Cloud, LogOut } from 'lucide-react';
import { useUser, UserButton, useClerk } from '@clerk/react';

export function TopBar({ title }: { title: string }) {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  return (
    <div className="glass-premium border-b border-white/5 px-8 py-4 flex items-center justify-between sticky top-0 z-20 shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
      <h1 className="text-2xl font-black text-white tracking-tight drop-shadow-sm font-['Outfit',sans-serif]">{title}</h1>

      <div className="flex items-center gap-6">
        {/* GCP Connected Badge */}
        <div className="flex items-center space-x-2 px-3 py-1.5 bg-[var(--color-accent-green)]/10 border border-[var(--color-accent-green)]/30 rounded-lg shadow-[0_0_10px_rgba(5,150,105,0.1)]">
          <Cloud className="w-4 h-4 text-[var(--color-accent-green)]" />
          <span className="text-[var(--color-accent-green)] font-bold text-[11px] uppercase tracking-wider">Google Cloud Connected</span>
        </div>

        {/* Clerk UserButton — shows avatar + sign-out dropdown */}
        {isLoaded && user && (
          <div className="flex items-center gap-3">
            <div className="hidden md:block text-right">
              <div className="text-sm font-medium text-white leading-tight">
                {user.fullName || user.firstName}
              </div>
              <div className="text-xs text-slate-400 leading-tight">
                {user.primaryEmailAddress?.emailAddress}
              </div>
            </div>

            {/* Clerk's built-in avatar + dropdown (profile, sign out, etc.) */}
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'w-10 h-10 border-2 border-[var(--color-accent-green)]/40 shadow-[0_0_10px_rgba(5,150,105,0.2)]',
                },
              }}
            />

            {/* Explicit sign-out button for quick access */}
            <button
              onClick={() => signOut({ redirectUrl: '/' })}
              title="Sign out"
              className="p-2.5 rounded-xl text-slate-400 bg-white/5 border border-white/10 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all shadow-sm"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
