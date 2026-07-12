'use client';

import { Bell, Menu } from 'lucide-react';
import { useUIStore } from '@/lib/store';
import { useAuthStore } from '@/lib/store';
import Link from 'next/link';

export function Header() {
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const user = useAuthStore((s) => s.user);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/75 backdrop-blur-xl">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex-1" />

        <div className="flex items-center gap-3">
          <Link
            href="/notifications"
            className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </Link>

          <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-900">{user?.nickname || 'User'}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20">
              <span className="text-sm font-semibold text-primary-700">
                <span className="text-white">{(user?.nickname || 'U').charAt(0).toUpperCase()}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
