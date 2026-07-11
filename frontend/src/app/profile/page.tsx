'use client';

import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { userApi, authApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import {
  User, Shield, Key, Smartphone, Bell, Moon, Sun,
  LogOut, Check, RefreshCw, QrCode
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [profile, setProfile] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pinForm, setPinForm] = useState({ pin: '', confirmPin: '' });
  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' });
  const [qrCode, setQrCode] = useState('');
  const [settingPin, setSettingPin] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profRes, sessRes] = await Promise.all([
          userApi.getProfile(),
          userApi.getSessions(),
        ]);
        setProfile(profRes.data);
        setSessions(sessRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSetPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pinForm.pin !== pinForm.confirmPin) {
      toast.error('PIN non corrispondono');
      return;
    }
    setSettingPin(true);
    try {
      await authApi.setPin(pinForm.pin);
      toast.success('PIN impostato!');
      setPinForm({ pin: '', confirmPin: '' });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Errore');
    } finally {
      setSettingPin(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPass !== passwordForm.confirm) {
      toast.error('Password non corrispondono');
      return;
    }
    setChangingPassword(true);
    try {
      await authApi.changePassword({ currentPassword: passwordForm.current, newPassword: passwordForm.newPass });
      toast.success('Password cambiata!');
      setPasswordForm({ current: '', newPass: '', confirm: '' });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Errore');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleSetup2FA = async () => {
    try {
      const { data } = await authApi.setup2FA();
      setQrCode(data.qrCode);
      toast.success('Scansiona il QR code con la tua app 2FA');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Errore');
    }
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profilo</h1>
          <p className="text-gray-500 mt-1">Gestisci il tuo account</p>
        </div>

        {/* Profile Card */}
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-700">
                {(user?.nickname || 'U').charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold">{user?.nickname || 'Utente'}</h2>
              <p className="text-gray-500">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Security Sections */}
        <div className="space-y-6">
          {/* Pin */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Key className="w-5 h-5 text-primary-600" />
              <h3 className="font-semibold">PIN Prelievo</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">Imposta un PIN a 6 cifre per autorizzare i prelievi</p>
            <form onSubmit={handleSetPin} className="space-y-3 max-w-sm">
              <input
                type="password"
                className="input-field text-center text-lg tracking-widest"
                placeholder="PIN 6 cifre"
                maxLength={6}
                value={pinForm.pin}
                onChange={(e) => setPinForm({ ...pinForm, pin: e.target.value })}
                pattern="\d{6}"
              />
              <input
                type="password"
                className="input-field text-center text-lg tracking-widest"
                placeholder="Conferma PIN"
                maxLength={6}
                value={pinForm.confirmPin}
                onChange={(e) => setPinForm({ ...pinForm, confirmPin: e.target.value })}
                pattern="\d{6}"
              />
              <button type="submit" disabled={settingPin} className="btn-primary">
                {settingPin ? 'Impostazione...' : 'Imposta PIN'}
              </button>
            </form>
          </div>

          {/* Password */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-primary-600" />
              <h3 className="font-semibold">Cambia Password</h3>
            </div>
            <form onSubmit={handleChangePassword} className="space-y-3 max-w-sm">
              <input type="password" className="input-field" placeholder="Password attuale"
                value={passwordForm.current} onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })} />
              <input type="password" className="input-field" placeholder="Nuova password"
                value={passwordForm.newPass} onChange={(e) => setPasswordForm({ ...passwordForm, newPass: e.target.value })} />
              <input type="password" className="input-field" placeholder="Conferma nuova password"
                value={passwordForm.confirm} onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })} />
              <button type="submit" disabled={changingPassword} className="btn-primary">
                {changingPassword ? 'Cambio in corso...' : 'Cambia Password'}
              </button>
            </form>
          </div>

          {/* 2FA */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <QrCode className="w-5 h-5 text-primary-600" />
              <h3 className="font-semibold">Autenticazione a Due Fattori</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">Aggiungi un livello di sicurezza extra al tuo account</p>
            {qrCode ? (
              <div className="text-center">
                <img src={qrCode} alt="2FA QR Code" className="mx-auto w-48 h-48 rounded-xl" />
                <p className="text-sm text-gray-500 mt-2">Scansiona con Google Authenticator o Authy</p>
              </div>
            ) : (
              <button onClick={handleSetup2FA} className="btn-secondary">
                <QrCode className="w-4 h-4 inline mr-2" />Abilita 2FA
              </button>
            )}
          </div>

          {/* Sessions */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Smartphone className="w-5 h-5 text-primary-600" />
              <h3 className="font-semibold">Dispositivi Collegati</h3>
            </div>
            {sessions.length > 0 ? (
              <div className="space-y-3">
                {sessions.map((s: any) => (
                  <div key={s.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div>
                      <p className="text-sm font-medium">{s.deviceName || 'Dispositivo sconosciuto'}</p>
                      <p className="text-xs text-gray-400">Ultima attività: {new Date(s.lastActivityAt).toLocaleDateString('it-IT')}</p>
                    </div>
                    <span className="badge-success">Attivo</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Nessuna sessione attiva</p>
            )}
          </div>
        </div>

        {/* Logout */}
        <div className="card">
          <button onClick={() => { authApi.logoutAll(); logout(); window.location.href = '/login'; }}
            className="btn-danger w-full flex items-center justify-center gap-2">
            <LogOut className="w-4 h-4" /> Logout da tutti i dispositivi
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
