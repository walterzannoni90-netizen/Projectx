'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Toaster, toast } from 'react-hot-toast';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { Mail, Lock, User, Gift } from 'lucide-react';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    nickname: '',
    referralCode: searchParams.get('ref') || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authApi.register(form);
      setAuth(data.user, data.accessToken, data.refreshToken);
      toast.success('Registrazione completata!');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Errore di registrazione');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img src="/images/nummy-logo.png" alt="NUMMY" className="w-20 h-20 object-cover rounded-2xl mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-gray-900">Crea Account</h1>
          <p className="text-gray-500 mt-1">Inizia il tuo viaggio con NUMMY</p>
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
            <label className="label">Nickname</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" className="input-field pl-10" placeholder="Il tuo nickname"
                value={form.nickname} onChange={(e) => setForm({ ...form, nickname: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="password" className="input-field pl-10" placeholder="Min. 8 caratteri"
                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                required minLength={8} />
            </div>
          </div>
          <div>
            <label className="label">Codice Referral (opzionale)</label>
            <div className="relative">
              <Gift className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" className="input-field pl-10" placeholder="Es. ABC12345"
                value={form.referralCode} onChange={(e) => setForm({ ...form, referralCode: e.target.value })} />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Registrazione...' : 'Registrati'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          Hai già un account?{' '}
          <Link href="/login" className="text-primary-600 font-medium hover:underline">Accedi</Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen flex">
        <Suspense fallback={<div className="flex-1 flex items-center justify-center">Caricamento...</div>}>
          <RegisterForm />
        </Suspense>
        <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-600 to-primary-800 items-center justify-center p-12">
          <div className="max-w-md text-white">
            <h2 className="text-3xl font-bold mb-4">Inizia Subito</h2>
            <p className="text-primary-100 leading-relaxed mb-6">
              Registrati gratuitamente e scopri il potenziale della quantizzazione AI.
              Invita amici e guadagna commissioni su 3 livelli!
            </p>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-sm text-primary-100 font-medium">Bonus di Benvenuto</p>
              <p className="text-2xl font-bold mt-1">Fino a 8%</p>
              <p className="text-sm text-primary-100">di commissioni referral</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
