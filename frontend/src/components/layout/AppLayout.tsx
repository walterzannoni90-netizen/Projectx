'use client';

import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Toaster } from 'react-hot-toast';
import { useUIStore } from '@/lib/store';

export function AppLayout({ children }: { children: ReactNode }) {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  return (
    <div className="flex h-screen overflow-hidden bg-[#070b18]">
      <Toaster position="top-right" toastOptions={{
        duration: 4000,
        style: { borderRadius: '12px', padding: '12px 16px' },
      }} />
      <Sidebar open={sidebarOpen} onClose={() => sidebarOpen && toggleSidebar()} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="relative flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top_right,_rgba(37,99,235,.14),_transparent_35%),linear-gradient(180deg,#f8fafc,#eef2ff)] p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
