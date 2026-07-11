'use client';

import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { walletApi, depositApi, withdrawalApi } from '@/lib/api';
import { formatCurrency, formatDate, truncateAddress } from '@/lib/utils';
import {
  Wallet, ArrowUpRight, ArrowDownRight, Copy, Plus, QrCode,
  History, RefreshCw, ChevronDown, ExternalLink, Banknote
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function WalletPage() {
  const [tab, setTab] = useState<'overview' | 'deposit' | 'withdraw' | 'history'>('overview');
  const [balance, setBalance] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [withdrawForm, setWithdrawForm] = useState({ amount: '', chain: 'TRC20', toAddress: '', pin: '' });
  const [withdrawing, setWithdrawing] = useState(false);

  const fetchData = async () => {
    try {
      const [balRes, txRes, addrRes] = await Promise.all([
        walletApi.getBalance(),
        walletApi.getTransactions(),
        walletApi.getAddresses(),
      ]);
      setBalance(balRes.data);
      setTransactions(txRes.data.transactions || []);
      setAddresses(addrRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawing(true);
    try {
      await withdrawalApi.requestWithdrawal(withdrawForm);
      toast.success('Richiesta di prelievo inviata!');
      setWithdrawForm({ amount: '', chain: 'TRC20', toAddress: '', pin: '' });
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Errore prelievo');
    } finally {
      setWithdrawing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Indirizzo copiato!');
  };

  const tabs = [
    { id: 'overview' as const, label: 'Panoramica' },
    { id: 'deposit' as const, label: 'Deposita' },
    { id: 'withdraw' as const, label: 'Prelievo' },
    { id: 'history' as const, label: 'Storico' },
  ];

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Wallet</h1>
          <p className="text-gray-500 mt-1">Gestisci il tuo portafoglio</p>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="card bg-gradient-to-br from-primary-600 to-primary-800 text-white">
            <p className="text-sm text-primary-200">Saldo Totale</p>
            <p className="text-2xl font-bold mt-1">{formatCurrency(balance?.totalBalance || 0)}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-500">Capitale Operativo</p>
            <p className="text-2xl font-bold mt-1 text-gray-900">{formatCurrency(balance?.operatingCapital || 0)}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-500">Disponibile</p>
            <p className="text-2xl font-bold mt-1 text-green-600">{formatCurrency(balance?.availableBalance || 0)}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                tab === t.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {tab === 'overview' && (
          <div className="card space-y-4">
            <h2 className="text-lg font-semibold">Indirizzi di Deposito</h2>
            {['TRC20', 'BEP20'].map((chain) => {
              const addr = addresses.find((a) => a.chain === chain);
              return (
                <div key={chain} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm font-medium">{chain}</p>
                    <p className="text-xs text-gray-400 font-mono mt-0.5">
                      {addr ? truncateAddress(addr.address) : 'Genera indirizzo'}
                    </p>
                  </div>
                  <button
                    onClick={() => addr && copyToClipboard(addr.address)}
                    className="p-2 hover:bg-white rounded-lg text-gray-400 hover:text-primary-600 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {tab === 'deposit' && (
          <div className="card space-y-4">
            <h2 className="text-lg font-semibold">Deposita USDT</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
              <p className="font-medium mb-1">⚠️ Deposito Minimo: 100 USDT</p>
              <p>Invia solo USDT sulla rete corretta. Transazioni su rete errata andranno perse.</p>
            </div>
            <div className="grid gap-4">
              {['TRC20', 'BEP20'].map((chain) => {
                const addr = addresses.find((a) => a.chain === chain);
                return (
                  <div key={chain} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium">{chain} Network</h3>
                      <span className="badge-info">{chain}</span>
                    </div>
                    {addr ? (
                      <div className="flex items-center gap-2">
                        <code className="flex-1 text-xs bg-gray-50 p-2 rounded-lg font-mono break-all">
                          {addr.address}
                        </code>
                        <button onClick={() => copyToClipboard(addr.address)} className="btn-secondary text-xs px-3 py-2">
                          <Copy className="w-3 h-3 mr-1 inline" /> Copia
                        </button>
                      </div>
                    ) : (
                      <button className="btn-secondary text-sm">Genera Indirizzo</button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === 'withdraw' && (
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Richiedi Prelievo</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800 mb-4">
              <p className="font-medium">ℹ️ Informazioni Prelievo</p>
              <ul className="mt-2 space-y-1">
                <li>• Minimo: 30 USDT</li>
                <li>• Fee: 15% (ridotta in base al livello)</li>
                <li>• Elaborazione: 24-72 ore</li>
                <li>• Intervallo tra richieste: 48 ore</li>
              </ul>
            </div>
            <form onSubmit={handleWithdraw} className="space-y-4">
              <div>
                <label className="label">Rete</label>
                <select
                  className="input-field"
                  value={withdrawForm.chain}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, chain: e.target.value })}
                >
                  <option value="TRC20">TRC20 (TRON)</option>
                  <option value="BEP20">BEP20 (BNB Chain)</option>
                </select>
              </div>
              <div>
                <label className="label">Indirizzo di destinazione</label>
                <input
                  className="input-field"
                  placeholder="Inserisci l'indirizzo"
                  value={withdrawForm.toAddress}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, toAddress: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="label">Importo (USDT)</label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="Min. 30"
                  min={30}
                  step={1}
                  value={withdrawForm.amount}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, amount: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="label">PIN di sicurezza</label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="PIN a 6 cifre"
                  maxLength={6}
                  value={withdrawForm.pin}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, pin: e.target.value })}
                  required
                  pattern="\d{6}"
                />
              </div>
              <button type="submit" disabled={withdrawing} className="btn-primary w-full">
                {withdrawing ? 'Richiesta in corso...' : 'Richiedi Prelievo'}
              </button>
            </form>
          </div>
        )}

        {tab === 'history' && (
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Storico Transazioni</h2>
            {transactions.length > 0 ? (
              <div className="space-y-2">
                {transactions.map((tx: any) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        tx.type === 'deposit' || tx.type === 'quantization_earning' || tx.type === 'referral_reward'
                          ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {tx.type === 'withdrawal' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{tx.description || tx.type}</p>
                        <p className="text-xs text-gray-400">{formatDate(tx.createdAt)}</p>
                      </div>
                    </div>
                    <span className={`font-semibold ${
                      tx.type === 'deposit' || tx.type === 'quantization_earning' || tx.type === 'referral_reward'
                        ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {tx.type === 'deposit' || tx.type === 'quantization_earning' || tx.type === 'referral_reward' ? '+' : '-'}
                      {formatCurrency(tx.amount)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <History className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">Nessuna transazione</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
