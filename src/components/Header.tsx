import { ChefHat, ShoppingCart } from 'lucide-react';

interface Props {
  shoppingCount?: number;
}

export function Header({ shoppingCount = 0 }: Props) {
  return (
    <header className="pt-8 pb-4 px-4 text-center">
      <div className="flex items-center justify-center gap-3 mb-2">
        <div className="inline-flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-lg">
            <ChefHat className="w-7 h-7 text-white" strokeWidth={2.2} />
          </div>
          <h1 className="text-3xl font-bold text-stone-800 tracking-tight">我的厨房</h1>
        </div>
        <a
          href="/shopping"
          className="relative w-11 h-11 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm ml-2"
          title="采购清单"
        >
          <ShoppingCart className="w-5 h-5" />
          {shoppingCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
              {shoppingCount > 9 ? '9+' : shoppingCount}
            </span>
          )}
        </a>
      </div>
      <p className="text-stone-500 text-sm">让食材不再被遗忘 🍳</p>
    </header>
  );
}
