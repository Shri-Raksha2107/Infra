import { Cloud, LogOut } from 'lucide-react';
import { useUser, UserButton, useClerk } from '@clerk/react';

export function TopBar({ title }: { title: string }) {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  return (
    <div className="bg-slate-950 border-b border-emerald-500/20 px-8 py-4 flex items-center justify-between">
      <h1 className="text-2xl font-semibold text-white">{title}</h1>

      <div className="flex items-center gap-4">
        {/* GCP Connected Badge */}
        <div className="flex items-center space-x-3 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
          <Cloud className="w-5 h-5 text-emerald-400" />
          <span className="text-emerald-400 font-medium">Google Cloud Connected</span>
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
                  avatarBox: 'w-9 h-9 border-2 border-emerald-500/40',
                },
              }}
            />

            {/* Explicit sign-out button for quick access */}
            <button
              onClick={() => signOut({ redirectUrl: '/' })}
              title="Sign out"
              className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
