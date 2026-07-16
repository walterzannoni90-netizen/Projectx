'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';

export default function Home() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#090B14]">
      <div className="text-center">
        <img src="/images/nummy-logo.png" alt="NUMMY" className="w-24 h-24 object-cover rounded-3xl mx-auto mb-4 animate-pulse" />
        <p className="text-slate-400 tracking-wide">Smart. Simple. For you.</p>
      </div>
    </div>
  );
}
