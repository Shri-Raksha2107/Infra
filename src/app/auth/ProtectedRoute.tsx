import { Navigate } from 'react-router';
import { useAuth } from '@clerk/react';
import type { ReactNode } from 'react';
import { usePageTracking } from '../hooks/usePageTracking';

export function ProtectedRoute({ children }: { children: ReactNode }) {
    const { isSignedIn, isLoaded } = useAuth();
    usePageTracking();

    // Wait for Clerk to finish loading the session
    if (!isLoaded) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-900">
                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!isSignedIn) {
        return <Navigate to="/connect" replace />;
    }

    return <>{children}</>;
}
