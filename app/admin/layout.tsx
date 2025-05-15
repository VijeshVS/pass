'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Loading from '@/app/components/Loading';
import { checkIfAuthenticated } from '../actions/auth';

export default function Layout({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        checkIfAuthenticated(localStorage.getItem('token') || '').then((check) => {
            if (check) {
                setLoading(false);
            } else {
                router.push('/login');
                toast.error('Please login to continue');
            }
        });
    }, [router]);

    if (loading) return <Loading />;

    return <>{children}</>;
}