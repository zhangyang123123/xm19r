import { AlertTriangle, XCircle } from 'lucide-react';
import { useAlertItems } from '@/hooks/useFoodStore';
import { getDaysRemaining, getCategoryEmoji } from '@/utils/dateUtils';

export function AlertSection() {
  const alertItems = useAlertItems();

  if (alertItems.length === 0) return null;

  const expiredItems = alertItems.filter((item) => getDaysRemaining(item.expiryDate) < 0);
  const warningItems = alertItems.filter((item) => getDaysRemaining(item.expiryDate) >= 0);

  return (
    <section className="px-4 mb-6">
      <h2 className="text-base font-semibold text-stone-700 mb-3 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-orange-500" />
        需要注意
        <span className="text-xs font-normal text-stone-400 ml-1">
          共 {alertItems.length} 项
        </span>
      </h2>

      <div className="space-y-2">
        {expiredItems.map((item) => {
          const days = getDaysRemaining(item.expiryDate);
          return (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-red-50 border border-red-100 animate-fade-in"
            >
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center text-xl">
                {getCategoryEmoji(item.category)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <span className="font-medium text-stone-800 truncate">{item.name}</span>
                </div>
                <div className="text-xs text-red-600 mt-0.5">
                  已过期 {Math.abs(days)} 天 · {item.quantity} {item.unit}
                </div>
              </div>
            </div>
          );
        })}

        {warningItems.map((item) => {
          const days = getDaysRemaining(item.expiryDate);
          return (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-orange-50 border border-orange-100 animate-fade-in"
            >
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-xl">
                {getCategoryEmoji(item.category)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0" />
                  <span className="font-medium text-stone-800 truncate">{item.name}</span>
                </div>
                <div className="text-xs text-orange-600 mt-0.5">
                  {days === 0 ? '今天到期' : `还剩 ${days} 天`} · {item.quantity} {item.unit}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
