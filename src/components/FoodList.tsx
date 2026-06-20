import { Package } from 'lucide-react';
import { FoodCard } from './FoodCard';
import { useFilteredItems } from '@/hooks/useFoodStore';
import type { FoodItem } from '@/types';

interface Props {
  onEdit: (item: FoodItem) => void;
  onConsume: (item: FoodItem) => void;
}

export function FoodList({ onEdit, onConsume }: Props) {
  const items = useFilteredItems();

  if (items.length === 0) {
    return (
      <section className="px-4 pb-32">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center mb-4">
            <Package className="w-9 h-9 text-stone-400" />
          </div>
          <h3 className="text-lg font-medium text-stone-700 mb-1">暂无食材</h3>
          <p className="text-sm text-stone-400 max-w-xs">
            点击右下角的 + 按钮添加你家冰箱和橱柜里的东西吧～
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 pb-32 space-y-3">
      {items.map((item) => (
        <FoodCard key={item.id} item={item} onEdit={onEdit} onConsume={onConsume} />
      ))}
    </section>
  );
}
