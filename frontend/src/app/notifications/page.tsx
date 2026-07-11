'use client';

import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { notificationsApi } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import {
  Bell, CheckCheck, Trash2, Gift, Wallet, TrendingUp,
  Award, MessageSquare, RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

const typeIcons: Record<string, any> = {
  deposit: Wallet,
  withdrawal: Wallet,
  referral: Gift,
  level_up: Award,
  quantization: TrendingUp,
  admin_message: MessageSquare,
  system_update: Bell,
};

const typeColors: Record<string, string> = {
  deposit: 'text-green-600 bg-green-50',
  withdrawal: 'text-red-600 bg-red-50',
  referral: 'text-purple-600 bg-purple-50',
  level_up: 'text-blue-600 bg-blue-50',
  quantization: 'text-primary-600 bg-primary-50',
  admin_message: 'text-orange-600 bg-orange-50',
  system_update: 'text-gray-600 bg-gray-50',
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const { data } = await notificationsApi.getNotifications();
      setNotifications(data.notifications || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const markAsRead = async (id: string) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (err: any) {
      toast.error('Errore');
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      toast.success('Tutte lette!');
    } catch (err: any) {
      toast.error('Errore');
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await notificationsApi.delete(id);
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (err: any) {
      toast.error('Errore');
    }
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifiche</h1>
            <p className="text-gray-500 mt-1">Centro notifiche</p>
          </div>
          <button onClick={markAllAsRead} className="btn-secondary text-sm">
            <CheckCheck className="w-4 h-4 inline mr-1" /> Segna tutte come lette
          </button>
        </div>

        <div className="card p-0 divide-y divide-gray-100">
          {loading ? (
            <div className="flex justify-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-primary-600" />
            </div>
          ) : notifications.length > 0 ? (
            notifications.map((n: any) => {
              const Icon = typeIcons[n.type] || Bell;
              const colorClass = typeColors[n.type] || 'text-gray-600 bg-gray-50';
              return (
                <div
                  key={n.id}
                  className={`flex items-start gap-4 p-4 transition-colors ${!n.isRead ? 'bg-primary-50/50' : 'hover:bg-gray-50'}`}
                >
                  <div className={`p-2 rounded-xl ${colorClass}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!n.isRead ? 'font-semibold' : 'font-medium'}`}>{n.title}</p>
                    {n.body && <p className="text-xs text-gray-500 mt-0.5">{n.body}</p>}
                    <p className="text-xs text-gray-400 mt-1">{formatDate(n.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {!n.isRead && (
                      <button onClick={() => markAsRead(n.id)} className="p-1.5 hover:bg-white rounded-lg text-gray-400 hover:text-primary-600">
                        <CheckCheck className="w-4 h-4" />
                      </button>
                    )}
                    <button onClick={() => deleteNotification(n.id)} className="p-1.5 hover:bg-white rounded-lg text-gray-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Nessuna notifica</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
