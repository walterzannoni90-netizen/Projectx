'use client';

import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { adminApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import {
  BarChart3, Users, Wallet, ArrowUpDown, Clock,
  CheckCircle, XCircle, Search, RefreshCw, Download
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const [tab, setTab] = useState<'dashboard' | 'users' | 'withdrawals'>('dashboard');
  const [dashboard, setDashboard] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [pendingWithdrawals, setPendingWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    try {
      const [dashRes, usersRes, withdrawRes] = await Promise.all([
        adminApi.getDashboard(),
        adminApi.getUsers(),
        adminApi.getPendingWithdrawals(),
      ]);
      setDashboard(dashRes.data);
      setUsers(usersRes.data.users || []);
      setPendingWithdrawals(withdrawRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSearch = async () => {
    try {
      const { data } = await adminApi.getUsers({ search });
      setUsers(data.users || []);
    } catch (err) {
      console.error(err);
    }
  };

  const approveWithdrawal = async (id: string) => {
    try {
      await adminApi.approveWithdrawal(id, 'admin');
      toast.success('Prelievo approvato!');
      fetchData();
    } catch (err: any) {
      toast.error('Errore');
    }
  };

  const rejectWithdrawal = async (id: string) => {
    const reason = prompt('Motivo del rifiuto:');
    if (!reason) return;
    try {
      await adminApi.rejectWithdrawal(id, reason);
      toast.success('Prelievo rifiutato');
      fetchData();
    } catch (err: any) {
      toast.error('Errore');
    }
  };

  const tabs = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: BarChart3 },
    { id: 'users' as const, label: 'Utenti', icon: Users },
    { id: 'withdrawals' as const, label: 'Prelievi', icon: ArrowUpDown },
  ];

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin</h1>
            <p className="text-gray-500 mt-1">Pannello di amministrazione</p>
          </div>
          <div className="flex gap-2">
            <button onClick={fetchData} className="btn-secondary text-sm">
              <RefreshCw className="w-4 h-4 inline mr-1" /> Aggiorna
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  tab === t.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" /> {t.label}
              </button>
            );
          })}
        </div>

        {tab === 'dashboard' && dashboard && (
          <>
            <div className="grid grid-cols-4 gap-4">
              <div className="card">
                <p className="text-sm text-gray-500">Utenti Totali</p>
                <p className="text-2xl font-bold mt-1">{dashboard.totalUsers}</p>
              </div>
              <div className="card">
                <p className="text-sm text-gray-500">Utenti Attivi</p>
                <p className="text-2xl font-bold mt-1 text-green-600">{dashboard.activeUsers}</p>
              </div>
              <div className="card">
                <p className="text-sm text-gray-500">Depositi Totali</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(dashboard.totalDeposits)}</p>
              </div>
              <div className="card">
                <p className="text-sm text-gray-500">Prelievi Totali</p>
                <p className="text-2xl font-bold mt-1 text-red-600">{formatCurrency(dashboard.totalWithdrawals)}</p>
              </div>
              <div className="card">
                <p className="text-sm text-gray-500">Fee Totali</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(dashboard.totalFees)}</p>
              </div>
              <div className="card">
                <p className="text-sm text-gray-500">Prelievi in Attesa</p>
                <p className="text-2xl font-bold mt-1 text-yellow-600">{dashboard.pendingWithdrawals}</p>
              </div>
              <div className="card">
                <p className="text-sm text-gray-500">Depositi in Attesa</p>
                <p className="text-2xl font-bold mt-1 text-yellow-600">{dashboard.pendingDeposits}</p>
              </div>
            </div>
          </>
        )}

        {tab === 'users' && (
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  className="input-field pl-9"
                  placeholder="Cerca utenti..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <button onClick={handleSearch} className="btn-primary text-sm">Cerca</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-100">
                    <th className="pb-3 font-medium">Utente</th>
                    <th className="pb-3 font-medium">Email</th>
                    <th className="pb-3 font-medium">Stato</th>
                    <th className="pb-3 font-medium">Wallet</th>
                    <th className="pb-3 font-medium">Registrazione</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u: any) => (
                    <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium">{u.nickname?.charAt(0) || '?'}</span>
                          </div>
                          <span className="font-medium">{u.nickname || '—'}</span>
                        </div>
                      </td>
                      <td className="py-3 text-gray-500">{u.email}</td>
                      <td className="py-3">
                        <span className={`badge ${
                          u.status === 'active' ? 'badge-success' : 
                          u.status === 'suspended' ? 'badge-danger' : 'badge-warning'
                        }`}>{u.status}</span>
                      </td>
                      <td className="py-3 font-medium">{formatCurrency(u.wallet?.totalBalance || 0)}</td>
                      <td className="py-3 text-gray-400">{new Date(u.createdAt).toLocaleDateString('it-IT')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'withdrawals' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Prelievi in Attesa ({pendingWithdrawals.length})</h3>
            {pendingWithdrawals.length > 0 ? (
              pendingWithdrawals.map((w: any) => (
                <div key={w.id} className="card">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium">{w.user?.nickname || w.user?.email}</p>
                      <p className="text-sm text-gray-500">{w.chain} • {w.toAddress?.slice(0, 10)}...</p>
                    </div>
                    <span className="text-xl font-bold">{formatCurrency(w.amount)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Fee: {w.feePercent}% ({formatCurrency(w.fee)})</span>
                    <span>Richiesto: {new Date(w.createdAt).toLocaleDateString('it-IT')}</span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => approveWithdrawal(w.id)} className="btn-primary text-sm flex-1">
                      <CheckCircle className="w-4 h-4 inline mr-1" /> Approva
                    </button>
                    <button onClick={() => rejectWithdrawal(w.id)} className="btn-danger text-sm flex-1">
                      <XCircle className="w-4 h-4 inline mr-1" /> Rifiuta
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="card text-center py-8">
                <Clock className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">Nessun prelievo in attesa</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
