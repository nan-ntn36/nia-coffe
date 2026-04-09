import { useEffect } from 'react';
import { HiX } from 'react-icons/hi';
import { useCart } from '../../context/CartContext';
import CartItem from './CartItem';
import CartSummary from './CartSummary';

export default function CartDrawer() {
  const { items, isOpen, setCartOpen, totalItems } = useCart();

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setCartOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [setCartOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setCartOpen(false)}
        id="cart-backdrop"
      />

      {/* Drawer Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[440px] bg-white z-50 shadow-2xl shadow-black/20 transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        id="cart-drawer"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-coffee-100 bg-cream/50">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🛒</span>
              <h2 className="font-heading text-xl font-bold text-coffee-800">
                Giỏ hàng
              </h2>
              {totalItems > 0 && (
                <span className="bg-accent text-white text-xs font-bold px-2.5 py-0.5 rounded-full animate-bounce-in">
                  {totalItems}
                </span>
              )}
            </div>
            <button
              onClick={() => setCartOpen(false)}
              className="p-2 text-coffee-400 hover:text-coffee-700 hover:bg-coffee-100 rounded-xl transition-all duration-200"
              aria-label="Đóng giỏ hàng"
              id="close-cart-button"
            >
              <HiX className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-10">
                <div className="w-24 h-24 bg-coffee-50 rounded-full flex items-center justify-center mb-5">
                  <span className="text-5xl opacity-50">☕</span>
                </div>
                <p className="text-coffee-500 text-lg font-medium mb-2">
                  Giỏ hàng trống
                </p>
                <p className="text-coffee-300 text-sm max-w-[200px]">
                  Hãy thêm món yêu thích vào giỏ hàng nhé!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>

          {/* Summary & Checkout */}
          {items.length > 0 && <CartSummary />}
        </div>
      </div>
    </>
  );
}
