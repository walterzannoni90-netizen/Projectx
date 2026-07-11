'use client';

import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { referralApi, levelsApi } from '@/lib/api';
import { formatCurrency, formatDate, generateReferralLink } from '@/lib/utils';
import { Users, Gift, Share2, Copy, TreePine, Award, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ReferralPage() {
  const [team, setTeam] = useState<any>(null);
  const [rewards, setRewards] = useState<any>(null);
  const [level, setLevel] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamRes, rewardsRes, levelRes] = await Promise.all([
          referralApi.getTeam(),
          referralApi.getRewards(),
          levelsApi.getMyLevel(),
        ]);
        setTeam(teamRes.data);
        setRewards(rewardsRes.data);
        setLevel(levelRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const copyLink = () => {
    const link = generateReferralLink('ABC123'); // Will be dynamic
    navigator.clipboard.writeText(link);
    toast.success('Link referral copiato!');
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Referral</h1>
          <p className="text-gray-500 mt-1">Invita amici e guadagna commissioni</p>
        </div>

        {/* Commission Cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { level: 'Livello 1', percent: level?.current?.referralLevel1Percent || 8, desc: 'Referral diretto' },
            { level: 'Livello 2', percent: level?.current?.referralLevel2Percent || 5, desc: 'Referral indiretto' },
            { level: 'Livello 3', percent: level?.current?.referralLevel3Percent || 3, desc: 'Terzo livello' },
          ].map((item) => (
            <div key={item.level} className="card text-center">
              <Award className="w-8 h-8 text-primary-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-primary-600">{item.percent}%</p>
              <p className="text-sm font-medium text-gray-900">{item.level}</p>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Share Card */}
        <div className="card bg-gradient-to-br from-primary-600 to-primary-800 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Il Tuo Link Referral</h3>
              <p className="text-sm text-primary-200 mt-1">Condividi e guadagna commissioni su 3 livelli</p>
            </div>
            <button onClick={copyLink} className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-colors">
              <Copy className="w-4 h-4" /> Copia Link
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Team */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Il Tuo Team</h3>
              <Users className="w-5 h-5 text-primary-600" />
            </div>
            <div className="flex gap-4 mb-4">
              <div className="flex-1 text-center p-3 bg-gray-50 rounded-xl">
                <p className="text-2xl font-bold">{team?.total || 0}</p>
                <p className="text-xs text-gray-500">Totale</p>
              </div>
              <div className="flex-1 text-center p-3 bg-green-50 rounded-xl">
                <p className="text-2xl font-bold text-green-600">{team?.active || 0}</p>
                <p className="text-xs text-green-600">Attivi</p>
              </div>
            </div>
            <div className="space-y-2">
              {team?.members?.slice(0, 10).map((m: any) => (
                <div key={m.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium">{m.nickname?.charAt(0) || '?'}</span>
                    </div>
                    <div>
                      <p className="font-medium">{m.nickname || 'Utente'}</p>
                      <p className="text-xs text-gray-400">{m.email}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{formatCurrency(m.operatingCapital)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Rewards */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Commissioni Ricevute</h3>
              <Gift className="w-5 h-5 text-primary-600" />
            </div>
            <div className="text-center mb-4">
              <p className="text-3xl font-bold text-green-600">{formatCurrency(rewards?.total || 0)}</p>
              <p className="text-sm text-gray-500">Commissioni totali</p>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {rewards?.rewards?.slice(0, 20).map((r: any) => (
                <div key={r.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg text-sm">
                  <div>
                    <p className="font-medium">Livello {r.level}</p>
                    <p className="text-xs text-gray-400">{formatDate(r.createdAt)}</p>
                  </div>
                  <span className="text-green-600 font-medium">+{formatCurrency(r.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
