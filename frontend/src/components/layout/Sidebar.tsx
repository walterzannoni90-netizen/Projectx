'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Wallet, Cpu, Users, UserCircle,
  LogOut, ChevronLeft, Settings,
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
        'fixed top-0 left-0 z-50 h-full w-72 border-r border-white/10 bg-[#090B14] text-white shadow-2xl',
        'transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto',
        open ? 'translate-x-0' : '-translate-x-full',
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
            <Link href="/dashboard" className="flex items-center gap-3">
              <img src="/images/nummy-logo.png" alt="NUMMY" className="w-11 h-11 rounded-xl object-cover" />
              <div><span className="block text-lg font-extrabold tracking-[.18em] text-white">NUMMY</span><span className="text-[9px] uppercase tracking-[.18em] text-primary-300">Smart. Simple. For you.</span></div>
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
                      ? 'brand-gradient text-white shadow-lg shadow-black/30'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white',
                  )}
                >
                  <Icon className={cn('w-5 h-5', isActive ? 'text-white' : 'text-slate-500')} />
                  {item.label}
                  {item.label === 'Notifiche' && (
                    <span className="ml-auto w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom */}
          <div className="px-3 py-4 border-t border-white/10 space-y-1">
            <Link
              href="/profile"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-white/5 hover:text-white"
            >
              <Settings className="w-5 h-5 text-gray-400" />
              Impostazioni
            </Link>
            <button
              onClick={() => { logout(); window.location.href = '/login'; }}
              className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm text-magenta-400 hover:bg-magenta-500/10 transition-colors"
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
