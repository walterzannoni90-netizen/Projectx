'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Toaster, toast } from 'react-hot-toast';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authApi.login(form);
      setAuth(data.user, data.accessToken, data.refreshToken);
      toast.success('Login effettuato!');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Errore di login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen flex">
        {/* Left - Form */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm">
            <div className="text-center mb-8">
              <img src="/images/nummy-logo.png" alt="NUMMY" className="w-20 h-20 object-cover rounded-2xl mx-auto mb-3" />
              <h1 className="text-2xl font-extrabold tracking-[.2em] text-white">NUMMY</h1>
              <p className="text-gray-500 mt-1">Accedi al tuo account</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="email" className="input-field pl-10" placeholder="nome@esempio.com"
                    value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                </div>
              </div>
              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type={showPassword ? 'text' : 'password'} className="input-field pl-10 pr-10"
                    placeholder="••••••••" value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div className="flex justify-end">
                <Link href="/forgot-password" className="text-sm text-primary-600 hover:underline">
                  Password dimenticata?
                </Link>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'Accesso in corso...' : 'Accedi'}
              </button>
            </form>
            <p className="text-center text-sm text-gray-500 mt-6">
              Non hai un account?{' '}
              <Link href="/register" className="text-primary-600 font-medium hover:underline">Registrati</Link>
            </p>
          </div>
        </div>
        <div className="hidden lg:flex flex-1 bg-[radial-gradient(circle_at_top_left,_rgba(0,191,166,.26),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(255,45,143,.22),_transparent_36%),#111520] items-center justify-center p-12">
          <div className="max-w-md text-white">
            <h2 className="text-3xl font-bold mb-4">Benvenuto su NUMMY</h2>
            <p className="text-slate-300 leading-relaxed mb-6">
              La piattaforma di quantizzazione AI che ti permette di far crescere il tuo capitale
              in modo semplice, veloce e sicuro.
            </p>
            <div className="space-y-3">
              {['Wallet multi-chain', 'Quantizzazione AI', 'Sistema Referral', 'Sicurezza avanzata'].map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  <span className="text-slate-300">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
