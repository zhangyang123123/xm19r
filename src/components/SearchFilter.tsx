import { Search, X } from 'lucide-react';
import { CATEGORIES, type Category } from '@/types';
import { useFoodStore } from '@/hooks/useFoodStore';
import { getCategoryEmoji } from '@/utils/dateUtils';

export function SearchFilter() {
  const { searchQuery, setSearchQuery, selectedCategory, setSelectedCategory } = useFoodStore();

  return (
    <section className="px-4 mb-4">
      <div className="relative mb-3">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="搜索食材名称..."
          className="w-full h-11 pl-10 pr-10 rounded-xl bg-white border border-stone-200 text-stone-700 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition-all text-sm"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-stone-100 transition-colors"
          >
            <X className="w-4 h-4 text-stone-400" />
          </button>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`shrink-0 h-8 px-3.5 rounded-full text-sm font-medium transition-all ${
            selectedCategory === null
              ? 'bg-orange-500 text-white shadow-sm'
              : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-300'
          }`}
        >
          全部
        </button>
        {CATEGORIES.map((cat: Category) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`shrink-0 h-8 px-3.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
              selectedCategory === cat
                ? 'bg-orange-500 text-white shadow-sm'
                : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-300'
            }`}
          >
            <span>{getCategoryEmoji(cat)}</span>
            <span>{cat}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
