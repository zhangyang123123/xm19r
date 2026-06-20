import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FoodItem, SortType, Category, Unit, ShoppingListItem, ShoppingReason } from '@/types';
import { generateId, getTodayStr } from '@/utils/dateUtils';

interface FoodState {
  items: FoodItem[];
  shoppingList: ShoppingListItem[];
  searchQuery: string;
  selectedCategory: Category | null;
  sortType: SortType;
  showUsedUp: boolean;

  addItem: (data: Omit<FoodItem, 'id' | 'createdAt' | 'updatedAt' | 'usedUp'>) => void;
  updateItem: (id: string, data: Partial<FoodItem>) => void;
  deleteItem: (id: string) => void;
  toggleUsedUp: (id: string) => void;
  consumeItem: (id: string, amount: number) => void;

  addToShoppingList: (data: { name: string; category: Category; quantity: number; unit: Unit; reason: ShoppingReason; fromItemId?: string }) => void;
  removeFromShoppingList: (id: string) => void;
  toggleShoppingItem: (id: string) => void;
  clearCheckedShoppingItems: () => void;
  clearAllShoppingItems: () => void;
  checkAndAutoAddToShoppingList: () => void;

  setSearchQuery: (q: string) => void;
  setSelectedCategory: (c: Category | null) => void;
  setSortType: (s: SortType) => void;
  setShowUsedUp: (v: boolean) => void;

  clearAll: () => void;
}

export const useFoodStore = create<FoodState>()(
  persist(
    (set, get) => ({
      items: [],
      shoppingList: [],
      searchQuery: '',
      selectedCategory: null,
      sortType: 'purchaseDate',
      showUsedUp: false,

      addItem: (data) => {
        const now = new Date().toISOString();
        const newItem: FoodItem = {
          ...data,
          id: generateId(),
          usedUp: false,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ items: [newItem, ...state.items] }));
      },

      updateItem: (id, data) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...data, updatedAt: new Date().toISOString() } : item
          ),
        }));
      },

      deleteItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
          shoppingList: state.shoppingList.filter((si) => si.fromItemId !== id),
        }));
      },

      toggleUsedUp: (id) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, usedUp: !item.usedUp, updatedAt: new Date().toISOString() }
              : item
          ),
        }));
      },

      consumeItem: (id, amount) => {
        const state = get();
        const item = state.items.find((i) => i.id === id);
        if (!item || item.usedUp) return;

        const newQuantity = Math.max(0, item.quantity - amount);
        const shouldMarkUsedUp = newQuantity === 0;

        set((state) => ({
          items: state.items.map((i) =>
            i.id === id
              ? {
                  ...i,
                  quantity: newQuantity,
                  usedUp: shouldMarkUsedUp,
                  updatedAt: new Date().toISOString(),
                }
              : i
          ),
        }));

        if (shouldMarkUsedUp) {
          const existing = get().shoppingList.find((si) => si.fromItemId === id);
          if (!existing) {
            get().addToShoppingList({
              name: item.name,
              category: item.category,
              quantity: item.threshold > 0 ? item.threshold : 1,
              unit: item.unit,
              reason: '已用完',
              fromItemId: id,
            });
          }
        } else if (newQuantity <= item.threshold && item.threshold > 0) {
          const existing = get().shoppingList.find((si) => si.fromItemId === id);
          if (!existing) {
            get().addToShoppingList({
              name: item.name,
              category: item.category,
              quantity: item.threshold - newQuantity,
              unit: item.unit,
              reason: '库存不足',
              fromItemId: id,
            });
          }
        }
      },

      addToShoppingList: (data) => {
        set((state) => {
          const existing = state.shoppingList.find(
            (si) => si.fromItemId === data.fromItemId && si.fromItemId
          );
          if (existing) return state;

          const newItem: ShoppingListItem = {
            id: generateId(),
            ...data,
            checked: false,
            createdAt: new Date().toISOString(),
          };
          return { shoppingList: [newItem, ...state.shoppingList] };
        });
      },

      removeFromShoppingList: (id) => {
        set((state) => ({
          shoppingList: state.shoppingList.filter((si) => si.id !== id),
        }));
      },

      toggleShoppingItem: (id) => {
        set((state) => ({
          shoppingList: state.shoppingList.map((si) =>
            si.id === id ? { ...si, checked: !si.checked } : si
          ),
        }));
      },

      clearCheckedShoppingItems: () => {
        set((state) => ({
          shoppingList: state.shoppingList.filter((si) => !si.checked),
        }));
      },

      clearAllShoppingItems: () => {
        set({ shoppingList: [] });
      },

      checkAndAutoAddToShoppingList: () => {
        const state = get();
        for (const item of state.items) {
          if (item.usedUp) {
            const existing = state.shoppingList.find((si) => si.fromItemId === item.id);
            if (!existing) {
              get().addToShoppingList({
                name: item.name,
                category: item.category,
                quantity: item.threshold > 0 ? item.threshold : 1,
                unit: item.unit,
                reason: '已用完',
                fromItemId: item.id,
              });
            }
          } else if (item.threshold > 0 && item.quantity <= item.threshold && item.quantity > 0) {
            const existing = state.shoppingList.find((si) => si.fromItemId === item.id);
            if (!existing) {
              get().addToShoppingList({
                name: item.name,
                category: item.category,
                quantity: item.threshold - item.quantity + 1,
                unit: item.unit,
                reason: '库存不足',
                fromItemId: item.id,
              });
            }
          }
        }
      },

      setSearchQuery: (q) => set({ searchQuery: q }),
      setSelectedCategory: (c) => set({ selectedCategory: c }),
      setSortType: (s) => set({ sortType: s }),
      setShowUsedUp: (v) => set({ showUsedUp: v }),

      clearAll: () => set({ items: [], shoppingList: [] }),
    }),
    {
      name: 'kitchen-inventory-storage',
      version: 2,
      migrate: (persistedState: Record<string, unknown>, version: number) => {
        const state = persistedState as Record<string, unknown>;
        if (version === 0 || version === 1) {
          if (state.items) {
            state.items = (state.items as Record<string, unknown>[]).map((item) => ({
              ...item,
              unit: item.unit || '个',
              threshold: item.threshold ?? 0,
            }));
          }
          if (!state.shoppingList) {
            state.shoppingList = [];
          }
        }
        return state;
      },
    }
  )
);

export function useFilteredItems() {
  const { items, searchQuery, selectedCategory, sortType, showUsedUp } = useFoodStore();

  const result = items.filter((item) => {
    if (!showUsedUp && item.usedUp) return false;
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedCategory && item.category !== selectedCategory) return false;
    return true;
  });

  result.sort((a, b) => {
    if (sortType === 'purchaseDate') {
      return new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime();
    } else {
      return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
    }
  });

  return result;
}

export function useAlertItems() {
  const { items } = useFoodStore();
  return items
    .filter((item) => !item.usedUp)
    .filter((item) => {
      const today = new Date(getTodayStr()).getTime();
      const expiry = new Date(item.expiryDate).getTime();
      const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    })
    .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());
}

export function useShoppingListCount() {
  const { shoppingList } = useFoodStore();
  return shoppingList.filter((si) => !si.checked).length;
}
