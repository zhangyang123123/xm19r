export type Category = '蔬菜' | '水果' | '肉类' | '蛋奶' | '干货' | '调料' | '饮品' | '其他';

export type Unit = '个' | '盒' | '袋' | '瓶' | '份' | '包' | '罐' | '克' | '毫升' | '把' | '根' | '片';

export const UNITS: Unit[] = ['个', '盒', '袋', '瓶', '份', '包', '罐', '克', '毫升', '把', '根', '片'];

export interface FoodItem {
  id: string;
  name: string;
  category: Category;
  quantity: number;
  unit: Unit;
  threshold: number;
  purchaseDate: string;
  expiryDate: string;
  usedUp: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SortType = 'purchaseDate' | 'expiryDate';

export type ExpiryStatus = 'expired' | 'warning' | 'normal';

export type ShoppingReason = '已用完' | '库存不足' | '手动添加';

export interface ShoppingListItem {
  id: string;
  name: string;
  category: Category;
  quantity: number;
  unit: Unit;
  reason: ShoppingReason;
  fromItemId?: string;
  checked: boolean;
  createdAt: string;
}

export const CATEGORIES: Category[] = ['蔬菜', '水果', '肉类', '蛋奶', '干货', '调料', '饮品', '其他'];
