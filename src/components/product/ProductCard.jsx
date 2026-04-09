import { useState } from 'react';
import { HiPlus, HiCheck } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatCurrency';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setIsAdded(true);
    toast.success(`Đã thêm ${product.name}`, { icon: '☕', duration: 2000 });
    setTimeout(() => setIsAdded(false), 1500);
  };

  const categoryGradients = {
    coffee: 'from-amber-800 to-amber-950',
    matcha: 'from-emerald-700 to-emerald-900',
    cacao: 'from-amber-900 to-stone-900',
    tea: 'from-yellow-600 to-orange-800',
  };

  const categoryEmojis = {
    coffee: '☕',
    matcha: '🍵',
    cacao: '🍫',
    tea: '🍋',
  };

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-coffee-300/30 transition-all duration-500 hover:-translate-y-1.5 border border-coffee-100/50"
      id={`product-card-${product.id}`}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {!imageError ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${
              categoryGradients[product.category] || categoryGradients.coffee
            } flex items-center justify-center`}
          >
            <div className="text-center">
              <span className="text-7xl block mb-2 opacity-60 drop-shadow-lg">
                {categoryEmojis[product.category] || '☕'}
              </span>
              <span className="text-white/40 text-xs font-medium tracking-wider uppercase">
                {product.name}
              </span>
            </div>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Badge */}
        {product.badge && (
          <span
            className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-lg backdrop-blur-sm ${
              product.badge === 'Bán chạy'
                ? 'bg-red-500/90 text-white'
                : product.badge === 'Mới'
                ? 'bg-emerald-500/90 text-white'
                : product.badge === 'Hot'
                ? 'bg-orange-500/90 text-white'
                : product.badge === 'Premium'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white'
                : product.badge === 'Classic'
                ? 'bg-green-dark/90 text-white'
                : 'bg-coffee-600/90 text-white'
            }`}
          >
            {product.badge}
          </span>
        )}

        {/* Variant tag */}
        {product.variant && (
          <span className="absolute top-3 right-3 px-2.5 py-1 bg-accent/20 backdrop-blur-sm rounded-full text-[11px] font-semibold text-accent-dark shadow-sm border border-accent/20">
            {product.variant}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 lg:p-5">
        <h3 className="font-heading text-lg font-bold text-coffee-800 mb-1.5 group-hover:text-accent transition-colors duration-300">
          {product.name}
        </h3>
        <p className="text-[13px] text-coffee-400 mb-4 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-accent">
            {formatCurrency(product.price)}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={isAdded}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer ${
              isAdded
                ? 'bg-emerald-500 text-white scale-95'
                : 'bg-accent text-white hover:bg-accent-dark hover:scale-105 active:scale-95 shadow-md hover:shadow-lg hover:shadow-accent/20'
            }`}
            id={`add-to-cart-${product.id}`}
          >
            {isAdded ? (
              <>
                <HiCheck className="w-4 h-4" />
                <span>Đã thêm</span>
              </>
            ) : (
              <>
                <HiPlus className="w-4 h-4" />
                <span>Thêm</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
