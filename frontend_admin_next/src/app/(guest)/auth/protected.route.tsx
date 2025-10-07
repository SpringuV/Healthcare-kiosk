'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Helper function để lấy cookie
function getCookie(name: string): string | null {
    if (typeof window === 'undefined') return null;

    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) {
        return parts.pop()?.split(';').shift() || null;
    }

    return null;
}

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    useEffect(() => {
        // Lấy token từ cookie
        const token = getCookie('access_token');

        if (!token) {
            router.push('/login');
        }
    }, [router]);

    // Check token trước khi render
    const token = getCookie('access_token');

    if (!token) {
        return null; // Hoặc return <LoadingSpinner />
    }

    return <>{children}</>;
}