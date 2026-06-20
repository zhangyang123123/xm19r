import { Check, Pencil, Trash2, Minus, ShoppingCart } from 'lucide-react';
import type { FoodItem } from '@/types';
import { useFoodStore } from '@/hooks/useFoodStore';
import { getDaysRemaining, getExpiryStatus, getCategoryColor, getCategoryEmoji } from '@/utils/dateUtils';

interface Props {
  item: FoodItem;
  onEdit: (item: FoodItem) => void;
  onConsume: (item: FoodItem) => void;
}

export function FoodCard({ item, onEdit, onConsume }: Props) {
  const { toggleUsedUp, deleteItem, consumeItem, addToShoppingList } = useFoodStore();
  const days = getDaysRemaining(item.expiryDate);
  const status = getExpiryStatus(item.expiryDate);

  const statusConfig = {
    expired: { text: `已过期 ${Math.abs(days)} 天`, bg: 'bg-red-500', textColor: 'text-red-600', lightBg: 'bg-red-50' },
    warning: {
      text: days === 0 ? '今天到期' : `还剩 ${days} 天`,
      bg: 'bg-orange-500',
      textColor: 'text-orange-600',
      lightBg: 'bg-orange-50',
    },
    normal: { text: `还剩 ${days} 天`, bg: 'bg-green-500', textColor: 'text-green-600', lightBg: 'bg-green-50' },
  }[status];

  const categoryEmoji = getCategoryEmoji(item.category);
  const categoryColor = getCategoryColor(item.category);

  const isLowStock = !item.usedUp && item.threshold > 0 && item.quantity <= item.threshold;

  const handleAddToShoppingList = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToShoppingList({
      name: item.name,
      category: item.category,
      quantity: item.threshold > 0 ? Math.max(item.threshold - item.quantity + 1, 1) : 1,
      unit: item.unit,
      reason: item.usedUp ? '已用完' : '手动添加',
      fromItemId: item.id,
    });
  };

  return (
    <div
      className={`group relative rounded-2xl bg-white border border-stone-200 shadow-sm overflow-hidden transition-all hover:shadow-md animate-fade-in ${
        item.usedUp ? 'opacity-50' : ''
      }`}
    >
      {isLowStock && (
        <div className="bg-amber-50 border-b border-amber-100 px-4 py-1.5 flex items-center gap-1.5">
          <ShoppingCart className="w-3.5 h-3.5 text-amber-600" />
          <span className="text-xs text-amber-700 font-medium">库存不足 · 低于阈值 {item.threshold} {item.unit}</span>
        </div>
      )}

      <div className="flex">
        <div className={`w-1.5 ${categoryColor}`} />
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`w-10 h-10 rounded-xl ${categoryColor} bg-opacity-15 flex items-center justify-center text-xl shrink-0`}>
                {categoryEmoji}
              </div>
              <div className="min-w-0">
                <h3
                  className={`font-semibold text-stone-800 truncate ${
                    item.usedUp ? 'line-through text-stone-400' : ''
                  }`}
                >
                  {item.name}
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-stone-500">{item.category}</span>
                  <span className="text-stone-300">·</span>
                  <span className="text-xs text-stone-500">
                    {item.quantity} {item.unit}
                  </span>
                  {item.threshold > 0 && (
                    <>
                      <span className="text-stone-300">·</span>
                      <span className="text-xs text-stone-400">阈值 {item.threshold}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div
              className={`shrink-0 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.lightBg} ${statusConfig.textColor}`}
            >
              {item.usedUp ? '已用完' : statusConfig.text}
            </div>
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-100">
            <div className="flex items-center gap-4 text-xs text-stone-500">
              <span>购入 {item.purchaseDate}</span>
              <span>到期 {item.expiryDate}</span>
            </div>
            <div className="flex items-center gap-1">
              {!item.usedUp && (
                <>
                  <button
                    onClick={() => consumeItem(item.id, 1)}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-stone-400 hover:bg-orange-50 hover:text-orange-600 transition-all"
                    title="消耗1份"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onConsume(item)}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-stone-400 hover:bg-orange-50 hover:text-orange-600 transition-all text-xs font-bold"
                    title="自定义消耗"
                  >
                    <span className="text-[10px] font-bold">−N</span>
                  </button>
                </>
              )}
              <button
                onClick={() => toggleUsedUp(item.id)}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                  item.usedUp
                    ? 'bg-green-100 text-green-600'
                    : 'text-stone-400 hover:bg-stone-100 hover:text-green-600'
                }`}
                title={item.usedUp ? '取消标记' : '标记已用完'}
              >
                <Check className="w-4 h-4" strokeWidth={item.usedUp ? 2.5 : 2} />
              </button>
              <button
                onClick={handleAddToShoppingList}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-stone-400 hover:bg-blue-50 hover:text-blue-600 transition-all"
                title="加入采购清单"
              >
                <ShoppingCart className="w-4 h-4" />
              </button>
              <button
                onClick={() => onEdit(item)}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-all"
                title="编辑"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if (confirm(`确定删除"${item.name}"吗？`)) deleteItem(item.id);
                }}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-stone-400 hover:bg-red-50 hover:text-red-500 transition-all"
                title="删除"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
