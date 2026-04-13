import { useState, useEffect, useMemo } from 'react';
import { HiSearch } from 'react-icons/hi';
import { getProducts, getCategories } from '../../services/api';
import ProductCard from './ProductCard';

export default function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        // Fallback: import static data
        const { products: staticProducts, categories: staticCategories } = await import('../../data/products');
        setProducts(staticProducts);
        setCategories(staticCategories);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (activeCategory !== 'all') {
      const catSlug = activeCategory;
      filtered = filtered.filter((p) =>
        p.category?.slug === catSlug || p.category === catSlug
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          (p.description || '').toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [activeCategory, searchQuery, products]);

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-coffee-300" />
          <input
            type="text"
            placeholder="Tìm kiếm thức uống..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-coffee-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all duration-300 text-sm placeholder:text-coffee-300 shadow-sm"
            id="search-input"
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2.5 mb-10" id="category-filters">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
            activeCategory === 'all'
              ? 'bg-accent text-white shadow-lg shadow-accent/20 scale-105'
              : 'bg-white text-coffee-600 hover:bg-coffee-100 border border-coffee-200 hover:border-coffee-300'
          }`}
          id="filter-all"
        >
          Tất cả ({products.length})
        </button>
        {categories.map((cat) => {
          const slug = cat.slug || cat.id;
          const count = products.filter((p) => (p.category?.slug || p.category) === slug).length;
          const isGreenCat = slug === 'matcha' || slug === 'tea';
          const isBrownCat = slug === 'cacao';
          const activeClass = isGreenCat
            ? 'bg-green text-white shadow-lg shadow-green/20 scale-105'
            : isBrownCat
            ? 'bg-coffee-700 text-white shadow-lg shadow-coffee-700/20 scale-105'
            : 'bg-accent text-white shadow-lg shadow-accent/20 scale-105';
          return (
            <button
              key={slug}
              onClick={() => setActiveCategory(slug)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeCategory === slug
                  ? activeClass
                  : 'bg-white text-coffee-600 hover:bg-coffee-100 border border-coffee-200 hover:border-coffee-300'
              }`}
              id={`filter-${slug}`}
            >
              <span className="text-base">{cat.icon}</span>
              {cat.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-7">
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className="animate-slide-up h-full"
              style={{ animationDelay: `${Math.min(index * 0.05, 0.5)}s` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <span className="text-6xl mb-4 block opacity-40">🔍</span>
          <p className="text-coffee-400 text-lg font-medium mb-2">
            Không tìm thấy sản phẩm nào
          </p>
          <p className="text-coffee-300 text-sm">
            Thử tìm kiếm với từ khóa khác nhé
          </p>
        </div>
      )}
    </div>
  );
}
