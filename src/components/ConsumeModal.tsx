import { useState } from 'react';
import { X, Minus } from 'lucide-react';
import type { FoodItem } from '@/types';
import { useFoodStore } from '@/hooks/useFoodStore';

interface Props {
  open: boolean;
  item: FoodItem | null;
  onClose: () => void;
}

export function ConsumeModal({ open, item, onClose }: Props) {
  const { consumeItem } = useFoodStore();
  const [customAmount, setCustomAmount] = useState('');

  if (!open || !item) return null;

  const handleConsume = (amount: number) => {
    if (amount <= 0) return;
    consumeItem(item.id, amount);
    onClose();
  };

  const handleCustomConsume = () => {
    const val = parseFloat(customAmount);
    if (isNaN(val) || val <= 0) return;
    consumeItem(item.id, Math.min(val, item.quantity));
    onClose();
  };

  const quickOptions: { label: string; amount: number }[] = [];
  if (item.quantity >= 1) quickOptions.push({ label: `1 ${item.unit}`, amount: 1 });
  if (item.quantity >= 0.5 && item.unit !== '克' && item.unit !== '毫升') {
    quickOptions.push({ label: `半${item.unit}`, amount: 0.5 });
  }
  if (item.quantity >= 2) quickOptions.push({ label: `2 ${item.unit}`, amount: 2 });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-white sm:rounded-2xl rounded-t-3xl shadow-2xl animate-slide-up">
        <div className="px-5 pt-5 pb-3 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
              <Minus className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-stone-800">消耗食材</h2>
              <p className="text-xs text-stone-500">
                {item.name} · 剩余 {item.quantity} {item.unit}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {quickOptions.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">快速消耗</label>
              <div className="flex gap-2 flex-wrap">
                {quickOptions.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => handleConsume(opt.amount)}
                    className="h-10 px-4 rounded-xl bg-orange-50 border border-orange-200 text-orange-700 font-medium hover:bg-orange-100 active:scale-95 transition-all"
                  >
                    {opt.label}
                  </button>
                ))}
                <button
                  onClick={() => handleConsume(item.quantity)}
                  className="h-10 px-4 rounded-xl bg-red-50 border border-red-200 text-red-600 font-medium hover:bg-red-100 active:scale-95 transition-all"
                >
                  全部用完
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">自定义数量</label>
            <div className="flex gap-3">
              <input
                type="number"
                min={0.1}
                step={0.1}
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder={`输入消耗的${item.unit}数`}
                className="flex-1 h-11 px-4 rounded-xl border border-stone-200 text-stone-700 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all"
              />
              <button
                onClick={handleCustomConsume}
                disabled={!customAmount || parseFloat(customAmount) <= 0}
                className="h-11 px-5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold shadow-lg shadow-orange-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 disabled:shadow-none disabled:hover:scale-100"
              >
                确定
              </button>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-stone-100 p-4">
          <button
            onClick={onClose}
            className="w-full h-11 rounded-xl bg-stone-100 text-stone-600 font-medium hover:bg-stone-200 transition-all"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
}
