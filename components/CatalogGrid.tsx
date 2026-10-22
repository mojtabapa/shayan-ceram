"use client";

import { useMemo, useState } from "react";
import { activePct } from "@/lib/pricing";
import ProductCard from "./ProductCard";
import CatalogFilters from "./CatalogFilters";

interface Product {
  id: string;
  code: string;
  name: string;
  size: string;
  imageUrl: string;
  price: number;
  stock: any;
  discountPercent: number;
  discountEndsAt: Date | null;
}

export default function CatalogGrid({ products }: { products: Product[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q) ||
          p.size.toLowerCase().includes(q)
      );
    }

    if (activeFilter === "discount") {
      result = result.filter((p) => activePct(p) > 0);
    } else if (activeFilter === "instock") {
      result = result.filter((p) => p.stock && Object.values(p.stock).some(v => Number(v) > 0));
    }

    result.sort((a, b) => activePct(b) - activePct(a));

    return result;
  }, [products, searchQuery, activeFilter]);

  return (
    <div>
      <CatalogFilters
        totalCount={filteredProducts.length}
        onSearch={setSearchQuery}
        onFilterChange={setActiveFilter}
        activeFilter={activeFilter}
      />

      {filteredProducts.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-card">
          <div className="mb-4 text-6xl">🔍</div>
          <h3 className="mb-2 text-xl font-bold text-secondary">محصولی پیدا نشد</h3>
          <p className="text-sm text-muted">جستجو یا فیلترها را تغییر دهید</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}