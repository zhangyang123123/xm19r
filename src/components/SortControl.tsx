import { Calendar, Clock, Eye, EyeOff } from 'lucide-react';
import { useFoodStore } from '@/hooks/useFoodStore';
import type { SortType } from '@/types';

export function SortControl() {
  const { sortType, setSortType, showUsedUp, setShowUsedUp, items } = useFoodStore();

  const usedUpCount = items.filter((i) => i.usedUp).length;

  const options: { value: SortType; label: string; icon: typeof Calendar }[] = [
    { value: 'purchaseDate', label: '购买日期', icon: Calendar },
    { value: 'expiryDate', label: '保质期优先', icon: Clock },
  ];

  return (
    <div className="px-4 mb-4 flex items-center justify-between gap-3">
      <div className="inline-flex bg-white rounded-full p-1 border border-stone-200 shadow-sm">
        {options.map((opt) => {
          const Icon = opt.icon;
          const active = sortType === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => setSortType(opt.value)}
              className={`inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full text-sm font-medium transition-all ${
                active ? 'bg-stone-800 text-white' : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {opt.label}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => setShowUsedUp(!showUsedUp)}
        className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-sm font-medium transition-all border ${
          showUsedUp
            ? 'bg-stone-700 text-white border-stone-700'
            : 'bg-white text-stone-500 border-stone-200 hover:text-stone-700'
        }`}
      >
        {showUsedUp ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
        已用完 {usedUpCount > 0 && <span className="text-xs opacity-75">({usedUpCount})</span>}
      </button>
    </div>
  );
}
