import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../../services/api';
import ProductCard from '../product/ProductCard';

export default function FeaturedProducts() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const products = await getProducts();
        const items = products
          .filter((p) => p.badge === 'Bán chạy' || p.badge === 'Hot' || p.badge === 'Mới')
          .slice(0, 6);
        setFeatured(items);
      } catch {
        // Fallback to static
        const { products } = await import('../../data/products');
        setFeatured(products.filter((p) => p.badge).slice(0, 6));
      }
    }
    fetchFeatured();
  }, []);

  return (
    <section id="featured" className="py-20 lg:py-28 bg-cream relative overflow-hidden">
      {/* Decorative leaf shape top-right */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
        <svg viewBox="0 0 200 200" className="w-full h-full text-green">
          <path fill="currentColor" d="M200,0 C120,40 80,100 0,200 L200,200 Z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14 lg:mb-16">
          <span className="inline-block text-green text-xs font-semibold tracking-[0.3em] uppercase mb-4 relative">
            <span className="absolute left-full ml-3 top-1/2 w-8 h-px bg-green/30" />
            <span className="absolute right-full mr-3 top-1/2 w-8 h-px bg-green/30" />
            Đặc Biệt
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-coffee-800 mb-5">
            Sản Phẩm <span className="text-green italic">Nổi Bật</span>
          </h2>
          <p className="text-coffee-400 max-w-xl mx-auto text-base leading-relaxed">
            Những thức uống được yêu thích nhất tại Nia Coffee
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {featured.map((product, index) => (
            <div
              key={product.id}
              className="animate-slide-up h-full"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-14">
          <Link
            to="/menu"
            className="group inline-flex items-center gap-2 px-8 py-3.5 bg-green text-white font-semibold rounded-full text-sm uppercase tracking-wider hover:bg-green-dark transition-all duration-300 shadow-lg shadow-green/20 hover:shadow-xl hover:shadow-green/30"
            id="view-all-products"
          >
            Xem tất cả menu
            <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
