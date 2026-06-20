import { useState } from 'react';
import { ArrowLeft, ShoppingCart, Trash2, Check, Plus, RefreshCw, X } from 'lucide-react';
import { useFoodStore } from '@/hooks/useFoodStore';
import { getCategoryEmoji } from '@/utils/dateUtils';
import type { Category, Unit, ShoppingReason } from '@/types';
import { CATEGORIES, UNITS } from '@/types';

export default function ShoppingListPage() {
  const {
    shoppingList,
    toggleShoppingItem,
    removeFromShoppingList,
    clearCheckedShoppingItems,
    clearAllShoppingItems,
    checkAndAutoAddToShoppingList,
    addToShoppingList,
  } = useFoodStore();

  const [showAddForm, setShowAddForm] = useState(false);
  const [addName, setAddName] = useState('');
  const [addCategory, setAddCategory] = useState<Category>('其他');
  const [addQuantity, setAddQuantity] = useState(1);
  const [addUnit, setAddUnit] = useState<Unit>('个');

  const uncheckedItems = shoppingList.filter((si) => !si.checked);
  const checkedItems = shoppingList.filter((si) => si.checked);

  const groupedUnchecked: Record<string, typeof uncheckedItems> = {};
  for (const item of uncheckedItems) {
    if (!groupedUnchecked[item.category]) groupedUnchecked[item.category] = [];
    groupedUnchecked[item.category].push(item);
  }

  const reasonStyle: Record<ShoppingReason, string> = {
    '已用完': 'bg-red-50 text-red-600',
    '库存不足': 'bg-amber-50 text-amber-600',
    '手动添加': 'bg-blue-50 text-blue-600',
  };

  const handleManualAdd = () => {
    if (!addName.trim()) return;
    addToShoppingList({
      name: addName.trim(),
      category: addCategory,
      quantity: addQuantity,
      unit: addUnit,
      reason: '手动添加',
    });
    setAddName('');
    setAddQuantity(1);
    setAddUnit('个');
    setShowAddForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-indigo-50/30 to-stone-50">
      <div className="max-w-xl mx-auto">
        <header className="pt-8 pb-4 px-4">
          <div className="flex items-center gap-3 mb-2">
            <a
              href="/"
              className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-500 hover:bg-stone-50 transition-all shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </a>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-stone-800 tracking-tight">采购清单</h1>
                <p className="text-xs text-stone-500">
                  {uncheckedItems.length} 项待采购
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="px-4 mb-4 flex gap-2">
          <button
            onClick={checkAndAutoAddToShoppingList}
            className="flex-1 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center gap-2 text-sm font-medium text-stone-600 hover:bg-stone-50 shadow-sm transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            自动同步库存
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex-1 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center gap-2 text-sm font-semibold text-white shadow-lg shadow-blue-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus className="w-4 h-4" />
            手动添加
          </button>
        </div>

        {showAddForm && (
          <div className="px-4 mb-4 animate-fade-in">
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-stone-700">手动添加采购项</h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-400 hover:bg-stone-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <input
                type="text"
                value={addName}
                onChange={(e) => setAddName(e.target.value)}
                placeholder="食材名称"
                className="w-full h-10 px-3 rounded-xl border border-stone-200 text-stone-700 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
              />
              <div className="flex gap-2">
                <select
                  value={addCategory}
                  onChange={(e) => setAddCategory(e.target.value as Category)}
                  className="flex-1 h-10 px-3 rounded-xl border border-stone-200 text-stone-700 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{getCategoryEmoji(cat)} {cat}</option>
                  ))}
                </select>
                <select
                  value={addUnit}
                  onChange={(e) => setAddUnit(e.target.value as Unit)}
                  className="w-20 h-10 px-3 rounded-xl border border-stone-200 text-stone-700 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
                >
                  {UNITS.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
                <input
                  type="number"
                  min={1}
                  value={addQuantity}
                  onChange={(e) => setAddQuantity(parseInt(e.target.value) || 1)}
                  className="w-16 h-10 px-3 rounded-xl border border-stone-200 text-center text-stone-700 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
                />
              </div>
              <button
                onClick={handleManualAdd}
                disabled={!addName.trim()}
                className="w-full h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold shadow-lg shadow-blue-200 hover:shadow-xl active:scale-[0.98] transition-all disabled:opacity-40"
              >
                添加到清单
              </button>
            </div>
          </div>
        )}

        <section className="px-4 pb-32 space-y-3">
          {shoppingList.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center mb-4">
                <ShoppingCart className="w-9 h-9 text-stone-400" />
              </div>
              <h3 className="text-lg font-medium text-stone-700 mb-1">清单为空</h3>
              <p className="text-sm text-stone-400 max-w-xs">
                点击「自动同步库存」或「手动添加」来创建采购清单
              </p>
            </div>
          )}

          {Object.entries(groupedUnchecked).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-stone-500 mb-2 flex items-center gap-1.5">
                <span>{getCategoryEmoji(category as Category)}</span>
                {category}
                <span className="text-xs font-normal text-stone-400">({items.length})</span>
              </h3>
              <div className="space-y-2">
                {items.map((si) => (
                  <div
                    key={si.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white border border-stone-200 shadow-sm animate-fade-in"
                  >
                    <button
                      onClick={() => toggleShoppingItem(si.id)}
                      className="w-6 h-6 rounded-lg border-2 border-stone-300 flex items-center justify-center shrink-0 hover:border-blue-400 transition-all"
                    >
                      <Check className="w-3.5 h-3.5 text-transparent" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-stone-800 truncate">{si.name}</span>
                        <span className={`shrink-0 px-1.5 py-0.5 rounded text-[10px] font-medium ${reasonStyle[si.reason]}`}>
                          {si.reason}
                        </span>
                      </div>
                      <span className="text-xs text-stone-500">
                        {si.quantity} {si.unit}
                      </span>
                    </div>
                    <button
                      onClick={() => removeFromShoppingList(si.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-400 hover:bg-red-50 hover:text-red-500 transition-all shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {checkedItems.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-stone-400 mb-2 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                已选购 ({checkedItems.length})
              </h3>
              <div className="space-y-2">
                {checkedItems.map((si) => (
                  <div
                    key={si.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-stone-100 animate-fade-in opacity-60"
                  >
                    <button
                      onClick={() => toggleShoppingItem(si.id)}
                      className="w-6 h-6 rounded-lg bg-blue-500 flex items-center justify-center shrink-0"
                    >
                      <Check className="w-3.5 h-3.5 text-white" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <span className="font-medium text-stone-400 line-through truncate">{si.name}</span>
                      <span className="text-xs text-stone-400 ml-2">{si.quantity} {si.unit}</span>
                    </div>
                    <button
                      onClick={() => removeFromShoppingList(si.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-400 hover:bg-red-50 hover:text-red-500 transition-all shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={clearCheckedShoppingItems}
                className="mt-3 w-full h-9 rounded-xl bg-stone-100 text-stone-500 text-sm font-medium hover:bg-stone-200 transition-all"
              >
                清除已选购项
              </button>
            </div>
          )}

          {shoppingList.length > 0 && (
            <button
              onClick={() => {
                if (confirm('确定清空整个采购清单吗？')) clearAllShoppingItems();
              }}
              className="w-full h-9 rounded-xl bg-red-50 text-red-500 text-sm font-medium hover:bg-red-100 transition-all"
            >
              清空全部
            </button>
          )}
        </section>
      </div>
    </div>
  );
}
