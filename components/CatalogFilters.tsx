"use client";

import { useState } from "react";

interface FiltersProps {
  totalCount: number;
  onSearch: (q: string) => void;
  onFilterChange: (filter: string) => void;
  activeFilter: string;
}

export default function CatalogFilters({
  totalCount,
  onSearch,
  onFilterChange,
  activeFilter,
}: FiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const filters = [
    { key: "all", label: "همه", icon: "📦" },
    { key: "discount", label: "تخفیف‌دار", icon: "🔥" },
    { key: "instock", label: "موجود", icon: "✅" },
  ];

  return (
    <div className="mb-6 space-y-4">
      {/* نوار جستجو */}
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="جستجوی محصول... (مثلاً: سرامیک، پرسلان، کاشی)"
          className="w-full rounded-2xl border-2 border-gray-200 bg-white py-3.5 pr-12 pl-4 text-sm transition-colors focus:border-primary focus:outline-none md:py-4 md:text-base"
        />
        <button
          type="submit"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-muted transition-colors hover:text-primary"
          aria-label="جستجو"
        >
          🔍
        </button>
      </form>

      {/* فیلترها */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => onFilterChange(filter.key)}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all md:px-4 md:py-2.5 md:text-sm ${
                activeFilter === filter.key
                  ? "bg-primary text-white shadow-md"
                  : "bg-white text-secondary hover:bg-primary/10"
              }`}
            >
              <span>{filter.icon}</span>
              <span>{filter.label}</span>
            </button>
          ))}
        </div>

        {/* تعداد محصولات */}
        <div className="text-xs text-muted md:text-sm">
          📊 {totalCount.toLocaleString("fa-IR")} محصول
        </div>
      </div>
    </div>
  );
}