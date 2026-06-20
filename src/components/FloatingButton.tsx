import { Plus } from 'lucide-react';

interface Props {
  onClick: () => void;
}

export function FloatingButton({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="fixed right-5 bottom-6 w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-xl shadow-orange-300 flex items-center justify-center hover:shadow-2xl hover:shadow-orange-300 hover:scale-105 active:scale-95 transition-all z-40"
      aria-label="添加食材"
    >
      <Plus className="w-7 h-7" strokeWidth={2.5} />
    </button>
  );
}
