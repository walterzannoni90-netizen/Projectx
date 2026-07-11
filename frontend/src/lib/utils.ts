import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(amount: number, currency = 'USDT'): string {
  return `${Number(amount).toFixed(2)} ${currency}`;
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function truncateAddress(address: string, chars = 6): string {
  return `${address.slice(0, chars)}...${address.slice(-4)}`;
}

export function generateReferralLink(code: string): string {
  return `${window.location.origin}/register?ref=${code}`;
}
