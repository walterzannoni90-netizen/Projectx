'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Wallet, Cpu, Users, UserCircle,
  LogOut, ChevronLeft, Bell, TrendingUp, Settings,
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/wallet', label: 'Wallet', icon: Wallet },
  { href: '/quantization', label: 'Quantizzazione', icon: Cpu },
  { href: '/referral', label: 'Referral', icon: Users },
  { href: '/profile', label: 'Profilo', icon: UserCircle },
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const logout = useAuthStore((s) => s.logout);

  return (
    <>
      {/* Overlay mobile */}
      {open && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside className={cn(
        'fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-100 shadow-sm',
        'transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto',
        open ? 'translate-x-0' : '-translate-x-full',
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">Project X</span>
            </Link>
            <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-gray-600">
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                  )}
                >
                  <Icon className={cn('w-5 h-5', isActive ? 'text-primary-600' : 'text-gray-400')} />
                  {item.label}
                  {item.label === 'Notifiche' && (
                    <span className="ml-auto w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom */}
          <div className="px-3 py-4 border-t border-gray-100 space-y-1">
            <Link
              href="/profile"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50"
            >
              <Settings className="w-5 h-5 text-gray-400" />
              Impostazioni
            </Link>
            <button
              onClick={() => { logout(); window.location.href = '/login'; }}
              className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
