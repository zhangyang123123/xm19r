import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { FoodItem, Category, Unit } from '@/types';
import { CATEGORIES, UNITS } from '@/types';
import { useFoodStore } from '@/hooks/useFoodStore';
import { getCategoryEmoji, getTodayStr, addDays } from '@/utils/dateUtils';

interface Props {
  open: boolean;
  editingItem: FoodItem | null;
  onClose: () => void;
}

export function AddItemModal({ open, editingItem, onClose }: Props) {
  const { addItem, updateItem } = useFoodStore();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('其他');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState<Unit>('个');
  const [threshold, setThreshold] = useState(0);
  const [purchaseDate, setPurchaseDate] = useState(getTodayStr());
  const [expiryDate, setExpiryDate] = useState(addDays(getTodayStr(), 7));
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      if (editingItem) {
        setName(editingItem.name);
        setCategory(editingItem.category);
        setQuantity(editingItem.quantity);
        setUnit(editingItem.unit);
        setThreshold(editingItem.threshold);
        setPurchaseDate(editingItem.purchaseDate);
        setExpiryDate(editingItem.expiryDate);
      } else {
        setName('');
        setCategory('其他');
        setQuantity(1);
        setUnit('个');
        setThreshold(0);
        setPurchaseDate(getTodayStr());
        setExpiryDate(addDays(getTodayStr(), 7));
      }
      setErrors({});
    }
  }, [open, editingItem]);

  if (!open) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = '请输入名称';
    if (quantity < 1) errs.quantity = '数量至少为1';
    if (!purchaseDate) errs.purchaseDate = '请选择购买日期';
    if (!expiryDate) errs.expiryDate = '请选择保质期';
    if (purchaseDate && expiryDate && new Date(expiryDate) < new Date(purchaseDate)) {
      errs.expiryDate = '保质期不能早于购买日期';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    if (editingItem) {
      updateItem(editingItem.id, {
        name: name.trim(),
        category,
        quantity,
        unit,
        threshold,
        purchaseDate,
        expiryDate,
      });
    } else {
      addItem({
        name: name.trim(),
        category,
        quantity,
        unit,
        threshold,
        purchaseDate,
        expiryDate,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-white sm:rounded-2xl rounded-t-3xl shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 px-5 pt-5 pb-3 border-b border-stone-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-stone-800">
            {editingItem ? '编辑食材' : '添加食材'}
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">名称</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：牛奶、苹果、鸡胸肉..."
              className={`w-full h-11 px-4 rounded-xl border text-stone-700 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all ${
                errors.name ? 'border-red-300 focus:ring-red-200' : 'border-stone-200'
              }`}
              autoFocus
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">分类</label>
            <div className="grid grid-cols-4 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`h-12 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all border ${
                    category === cat
                      ? 'bg-orange-500 border-orange-500 text-white shadow-sm'
                      : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                  }`}
                >
                  <span className="text-lg">{getCategoryEmoji(cat)}</span>
                  <span className="text-xs font-medium">{cat}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">数量</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-11 rounded-xl bg-stone-100 text-stone-600 text-xl font-medium hover:bg-stone-200 transition-all"
                >
                  −
                </button>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="flex-1 h-11 px-2 rounded-xl border border-stone-200 text-center text-stone-700 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-11 rounded-xl bg-stone-100 text-stone-600 text-xl font-medium hover:bg-stone-200 transition-all"
                >
                  +
                </button>
              </div>
              {errors.quantity && <p className="text-xs text-red-500 mt-1">{errors.quantity}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">单位</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as Unit)}
                className="w-full h-11 px-3 rounded-xl border border-stone-200 text-stone-700 focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all"
              >
                {UNITS.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              采购阈值
              <span className="text-xs font-normal text-stone-400 ml-2">低于此数量自动加入采购清单</span>
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setThreshold(Math.max(0, threshold - 1))}
                className="w-10 h-11 rounded-xl bg-stone-100 text-stone-600 text-xl font-medium hover:bg-stone-200 transition-all"
              >
                −
              </button>
              <input
                type="number"
                min={0}
                value={threshold}
                onChange={(e) => setThreshold(Math.max(0, parseInt(e.target.value) || 0))}
                className="flex-1 h-11 px-2 rounded-xl border border-stone-200 text-center text-stone-700 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all"
              />
              <button
                onClick={() => setThreshold(threshold + 1)}
                className="w-10 h-11 rounded-xl bg-stone-100 text-stone-600 text-xl font-medium hover:bg-stone-200 transition-all"
              >
                +
              </button>
              <span className="text-sm text-stone-500 shrink-0">{unit}</span>
            </div>
            {threshold === 0 && (
              <p className="text-xs text-stone-400 mt-1">设为 0 表示不自动提醒</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">购买日期</label>
              <input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className={`w-full h-11 px-3 rounded-xl border text-stone-700 focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all ${
                  errors.purchaseDate ? 'border-red-300 focus:ring-red-200' : 'border-stone-200'
                }`}
              />
              {errors.purchaseDate && <p className="text-xs text-red-500 mt-1">{errors.purchaseDate}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">保质期至</label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className={`w-full h-11 px-3 rounded-xl border text-stone-700 focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all ${
                  errors.expiryDate ? 'border-red-300 focus:ring-red-200' : 'border-stone-200'
                }`}
              />
              {errors.expiryDate && <p className="text-xs text-red-500 mt-1">{errors.expiryDate}</p>}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-stone-100 p-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-12 rounded-xl bg-stone-100 text-stone-600 font-medium hover:bg-stone-200 transition-all"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-200 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            {editingItem ? '保存修改' : '添加食材'}
          </button>
        </div>
      </div>
    </div>
  );
}
