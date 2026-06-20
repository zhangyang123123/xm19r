import type { Category, ExpiryStatus } from '@/types';

export function getDaysRemaining(expiryDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  const diffMs = expiry.getTime() - today.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function getExpiryStatus(expiryDate: string): ExpiryStatus {
  const days = getDaysRemaining(expiryDate);
  if (days < 0) return 'expired';
  if (days <= 7) return 'warning';
  return 'normal';
}

export function getCategoryEmoji(category: Category): string {
  const map: Record<Category, string> = {
    '蔬菜': '🥬',
    '水果': '🍎',
    '肉类': '🥩',
    '蛋奶': '🥛',
    '干货': '🌾',
    '调料': '🌶️',
    '饮品': '🥤',
    '其他': '📦',
  };
  return map[category] || '📦';
}

export function getCategoryColor(category: Category): string {
  const map: Record<Category, string> = {
    '蔬菜': 'bg-green-400',
    '水果': 'bg-red-400',
    '肉类': 'bg-rose-400',
    '蛋奶': 'bg-yellow-400',
    '干货': 'bg-amber-400',
    '调料': 'bg-orange-400',
    '饮品': 'bg-sky-400',
    '其他': 'bg-gray-400',
  };
  return map[category] || 'bg-gray-400';
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getTodayStr(): string {
  return formatDate(new Date().toISOString());
}

export function addDays(dateStr: string, days: number): string {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return formatDate(date.toISOString());
}
