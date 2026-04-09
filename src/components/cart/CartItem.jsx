import { HiPlus, HiMinus, HiTrash } from 'react-icons/hi';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatCurrency';

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();

  const categoryEmojis = {
    coffee: '☕',
    matcha: '🍵',
    cacao: '🍫',
    tea: '🍋',
  };

  return (
    <div className="flex gap-3 p-3 bg-coffee-50/50 rounded-xl group hover:bg-coffee-50 transition-colors duration-200">
      {/* Thumbnail */}
      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-coffee-100">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentElement.innerHTML = `<span class="flex items-center justify-center w-full h-full text-2xl">${
              categoryEmojis[item.category] || '☕'
            }</span>`;
          }}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-semibold text-sm text-coffee-800 truncate">
            {item.name}
          </h4>
          <button
            onClick={() => removeFromCart(item.id)}
            className="p-1 text-coffee-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-200 flex-shrink-0"
            aria-label={`Xóa ${item.name}`}
          >
            <HiTrash className="w-4 h-4" />
          </button>
        </div>

        <p className="text-accent font-bold text-sm mt-0.5">
          {formatCurrency(item.price)}
        </p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="w-7 h-7 rounded-full bg-white border border-coffee-200 flex items-center justify-center text-coffee-500 hover:border-accent hover:text-accent transition-colors cursor-pointer"
            aria-label="Giảm số lượng"
          >
            <HiMinus className="w-3 h-3" />
          </button>
          <span className="text-sm font-bold text-coffee-800 w-6 text-center tabular-nums">
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="w-7 h-7 rounded-full bg-white border border-coffee-200 flex items-center justify-center text-coffee-500 hover:border-accent hover:text-accent transition-colors cursor-pointer"
            aria-label="Tăng số lượng"
          >
            <HiPlus className="w-3 h-3" />
          </button>
          <span className="ml-auto text-sm font-bold text-coffee-700 tabular-nums">
            {formatCurrency(item.price * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  );
}
