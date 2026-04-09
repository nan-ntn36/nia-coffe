import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatCurrency';
import CheckoutModal from './CheckoutModal';

export default function CartSummary() {
  const { totalPrice, items, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  return (
    <>
      <div className="border-t border-coffee-100 px-6 py-5 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
        {/* Total */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <span className="text-coffee-500 text-sm">Tổng cộng</span>
            <span className="text-coffee-400 text-xs block">
              ({items.reduce((s, i) => s + i.quantity, 0)} sản phẩm)
            </span>
          </div>
          <span className="text-2xl font-bold text-coffee-800 tabular-nums">
            {formatCurrency(totalPrice)}
          </span>
        </div>

        {/* Checkout Button */}
        <button
          onClick={() => setShowCheckout(true)}
          className="w-full py-4 bg-gradient-to-r from-accent to-accent-dark text-white font-semibold rounded-2xl hover:from-accent-light hover:to-accent transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-accent/25 active:scale-[0.98] flex items-center justify-center gap-2.5 text-base cursor-pointer"
          id="checkout-button"
        >
          <span className="text-lg">📱</span>
          Đặt hàng qua Zalo
        </button>

        {/* Clear Cart */}
        <button
          onClick={clearCart}
          className="w-full mt-3 py-2 text-sm text-coffee-400 hover:text-red-500 transition-colors cursor-pointer"
          id="clear-cart-button"
        >
          Xóa tất cả
        </button>
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <CheckoutModal onClose={() => setShowCheckout(false)} />
      )}
    </>
  );
}
