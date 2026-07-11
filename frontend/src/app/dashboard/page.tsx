'use client';

import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { userApi, quantizationApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import {
  Wallet, TrendingUp, Users, Cpu, ArrowUpRight, ArrowDownRight,
  Copy, Clock, RefreshCw, Zap
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [quantStatus, setQuantStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [dashRes, quantRes] = await Promise.all([
        userApi.getDashboard(),
        quantizationApi.getStatus(),
      ]);
      setData(dashRes.data);
      setQuantStatus(quantRes.data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      </AppLayout>
    );
  }

  const stats = [
    { label: 'Patrimonio Totale', value: formatCurrency(data?.totalBalance || 0), icon: Wallet, color: 'blue' },
    { label: 'Capitale Operativo', value: formatCurrency(data?.operatingCapital || 0), icon: TrendingUp, color: 'green' },
    { label: 'Saldo Disponibile', value: formatCurrency(data?.availableBalance || 0), icon: Wallet, color: 'purple' },
    { label: 'Guadagno Giornaliero', value: formatCurrency(data?.dailyEarnings || 0), icon: Zap, color: 'orange' },
  ];

  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Benvenuto su Project X</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="card">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg ${colors[stat.color]}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Quantization Status */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Quantizzazione</h2>
              <Cpu className="w-5 h-5 text-primary-600" />
            </div>
            {quantStatus?.active ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-green-600 bg-green-50 rounded-lg p-3">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span className="text-sm font-medium">Quantizzazione in corso...</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Importo investito</span>
                  <span className="font-medium">{formatCurrency(quantStatus.active.amountInvested)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Rendimento atteso</span>
                  <span className="font-medium text-green-600">{formatCurrency(quantStatus.active.expectedReturn)}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <Cpu className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm mb-4">Nessuna quantizzazione attiva</p>
                <a href="/quantization" className="btn-primary text-sm inline-block">
                  Avvia Quantizzazione
                </a>
              </div>
            )}
            {quantStatus && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Quantizzazioni completate</span>
                  <span className="font-medium">{quantStatus.completed || 0}</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-500">Guadagno totale</span>
                  <span className="font-medium text-green-600">{formatCurrency(quantStatus.totalEarned || 0)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Level Progress */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Il Tuo Livello</h2>
              <TrendingUp className="w-5 h-5 text-primary-600" />
            </div>
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-primary-600">
                Livello {data?.currentLevel || '-'}
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Progresso</span>
                  <span className="font-medium">{data?.levelProgress || 0}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${data?.levelProgress || 0}%` }}
                  />
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Referral attivi</span>
                <span className="font-medium">{data?.activeReferrals || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ultime Operazioni</h2>
          {data?.lastTransactions?.length > 0 ? (
            <div className="space-y-3">
              {data.lastTransactions.slice(0, 5).map((tx: any) => (
                <div key={tx.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      ['deposit', 'quantization_earning', 'referral_reward', 'bonus'].includes(tx.type)
                        ? 'bg-green-50 text-green-600'
                        : 'bg-red-50 text-red-600'
                    }`}>
                      {['deposit', 'quantization_earning', 'referral_reward', 'bonus'].includes(tx.type)
                        ? <ArrowUpRight className="w-4 h-4" />
                        : <ArrowDownRight className="w-4 h-4" />
                      }
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{tx.description || tx.type}</p>
                      <p className="text-xs text-gray-400">{new Date(tx.createdAt).toLocaleDateString('it-IT')}</p>
                    </div>
                  </div>
                  <span className={`font-semibold ${
                    ['deposit', 'quantization_earning', 'referral_reward', 'bonus'].includes(tx.type)
                      ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {['deposit', 'quantization_earning', 'referral_reward', 'bonus'].includes(tx.type) ? '+' : '-'}
                    {formatCurrency(tx.amount)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Nessuna operazione recente</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
