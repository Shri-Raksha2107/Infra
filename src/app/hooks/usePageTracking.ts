import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { useUser } from '@clerk/react';

export function usePageTracking() {
    const location = useLocation();
    const { user, isLoaded, isSignedIn } = useUser();

    useEffect(() => {
        if (!isLoaded || !isSignedIn || !user) return;

        const trackView = async () => {
            try {
                let pageName = location.pathname.replace('/', '');
                if (!pageName) pageName = 'Home';
                else {
                    pageName = pageName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                }

                await fetch('http://localhost:3001/api/stats/view', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        clerkId: user.id,
                        email: user.primaryEmailAddress?.emailAddress,
                        name: user.fullName,
                        pageName: pageName
                    })
                });
            } catch (err) {
                console.error('Failed to track page view', err);
            }
        };

        trackView();
    }, [location.pathname, isLoaded, isSignedIn, user]);
}
