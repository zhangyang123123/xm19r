import { useState } from 'react';
import { Header } from '@/components/Header';
import { AlertSection } from '@/components/AlertSection';
import { SearchFilter } from '@/components/SearchFilter';
import { SortControl } from '@/components/SortControl';
import { FoodList } from '@/components/FoodList';
import { FloatingButton } from '@/components/FloatingButton';
import { AddItemModal } from '@/components/AddItemModal';
import { ConsumeModal } from '@/components/ConsumeModal';
import { useShoppingListCount } from '@/hooks/useFoodStore';
import type { FoodItem } from '@/types';

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const [consumingItem, setConsumingItem] = useState<FoodItem | null>(null);
  const shoppingCount = useShoppingListCount();

  const handleAdd = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleEdit = (item: FoodItem) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setEditingItem(null);
  };

  const handleConsume = (item: FoodItem) => {
    setConsumingItem(item);
  };

  const handleConsumeClose = () => {
    setConsumingItem(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50/30 to-stone-50">
      <div className="max-w-xl sm:max-w-3xl mx-auto">
        <Header shoppingCount={shoppingCount} />
        <AlertSection />
        <SearchFilter />
        <SortControl />
        <FoodList onEdit={handleEdit} onConsume={handleConsume} />
      </div>

      <FloatingButton onClick={handleAdd} />
      <AddItemModal open={modalOpen} editingItem={editingItem} onClose={handleClose} />
      <ConsumeModal open={!!consumingItem} item={consumingItem} onClose={handleConsumeClose} />
    </div>
  );
}
