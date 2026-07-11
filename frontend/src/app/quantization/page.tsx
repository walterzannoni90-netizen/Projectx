'use client';

import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { quantizationApi, levelsApi } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Cpu, Play, Clock, TrendingUp, RefreshCw, BarChart3, History } from 'lucide-react';
import toast from 'react-hot-toast';

export default function QuantizationPage() {
  const [status, setStatus] = useState<any>(null);
  const [level, setLevel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  const fetchData = async () => {
    try {
      const [quantRes, levelRes] = await Promise.all([
        quantizationApi.getStatus(),
        levelsApi.getMyLevel(),
      ]);
      setStatus(quantRes.data);
      setLevel(levelRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);
  useEffect(() => {
    if (status?.active) {
      const interval = setInterval(fetchData, 10000);
      return () => clearInterval(interval);
    }
  }, [status?.active]);

  const startQuantization = async () => {
    setStarting(true);
    try {
      await quantizationApi.start();
      toast.success('Quantizzazione avviata!');
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Errore');
    } finally {
      setStarting(false);
    }
  };

  if (loading) return (
    <AppLayout>
      <div className="flex justify-center py-20"><RefreshCw className="w-8 h-8 animate-spin text-primary-600" /></div>
    </AppLayout>
  );

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quantizzazione AI</h1>
          <p className="text-gray-500 mt-1">Il cuore operativo della piattaforma</p>
        </div>

        {/* Active Quantization */}
        {status?.active ? (
          <div className="card bg-gradient-to-br from-primary-600 to-primary-800 text-white">
            <div className="flex items-center gap-3 mb-3">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <h2 className="text-lg font-semibold">Quantizzazione in corso</h2>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div>
                <p className="text-sm text-primary-200">Importo Investito</p>
                <p className="text-xl font-bold">{formatCurrency(status.active.amountInvested)}</p>
              </div>
              <div>
                <p className="text-sm text-primary-200">Rendimento Atteso</p>
                <p className="text-xl font-bold">{formatCurrency(status.active.expectedReturn)}</p>
              </div>
              <div>
                <p className="text-sm text-primary-200">Stato</p>
                <p className="text-xl font-bold flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Running
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="card text-center py-10">
            <Cpu className="w-16 h-16 text-primary-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Pronto per la Quantizzazione</h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Avvia la quantizzazione del tuo capitale operativo e genera rendimenti automatici.
            </p>
            <button onClick={startQuantization} disabled={starting} className="btn-primary text-lg px-8 py-3">
              {starting ? (
                <><RefreshCw className="w-5 h-5 animate-spin inline mr-2" />Avvio...</>
              ) : (
                <><Play className="w-5 h-5 inline mr-2" />Avvia Quantizzazione</>
              )}
            </button>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Level Info */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Il Tuo Livello</h3>
              <TrendingUp className="w-5 h-5 text-primary-600" />
            </div>
            {level && (
              <div className="space-y-3">
                <div className="text-center">
                  <span className="text-3xl font-bold text-primary-600">{level.current?.name || 'Bronze'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Rendimento giornaliero</span>
                  <span className="font-medium">{level.current?.dailyYieldPercent || 0.05}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Quantizzazioni/giorno</span>
                  <span className="font-medium">{level.current?.quantizationsPerDay || 1}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Fee riduzione</span>
                  <span className="font-medium">{level.current?.feeReductionPercent || 0}%</span>
                </div>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Statistiche</h3>
              <BarChart3 className="w-5 h-5 text-primary-600" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Quantizzazioni completate</span>
                <span className="font-bold text-lg">{status?.completed || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Guadagno totale generato</span>
                <span className="font-bold text-lg text-green-600">{formatCurrency(status?.totalEarned || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Prossima disponibile</span>
                <span className="font-bold text-lg">
                  {status?.nextQuantizationAt ? 'Disponibile' : 'Ora'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* History */}
        {status?.history?.length > 0 && (
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Storico Quantizzazioni</h3>
              <History className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-2">
              {status.history.slice(0, 10).map((q: any) => (
                <div key={q.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm font-medium">Ciclo #{q.id?.slice(0, 8)}</p>
                    <p className="text-xs text-gray-400">{formatDate(q.completedAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">+{formatCurrency(q.actualReturn || 0)}</p>
                    <p className="text-xs text-gray-400">{formatCurrency(q.amountInvested)} investito</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
