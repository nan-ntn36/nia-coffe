import { useState } from 'react';
import { HiX, HiClipboardCopy, HiCheck, HiExternalLink } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { createOrderMessage, copyToClipboard } from '../../utils/zaloHelper';

export default function CheckoutModal({ onClose }) {
  const { items, totalPrice, clearCart, setCartOpen } = useCart();
  const [copied, setCopied] = useState(false);

  const orderMessage = createOrderMessage(items, totalPrice);
  const ZALO_PHONE = '0912345678'; // Placeholder - thay bằng SĐT thật

  const handleCopy = async () => {
    const success = await copyToClipboard(orderMessage);
    if (success) {
      setCopied(true);
      toast.success('Đã copy nội dung đơn hàng!', { icon: '📋' });
      setTimeout(() => setCopied(false), 3000);
    } else {
      toast.error('Không thể copy. Vui lòng copy thủ công.');
    }
  };

  const handleOpenZalo = () => {
    window.open(`https://zalo.me/${ZALO_PHONE}`, '_blank');
  };

  const handleComplete = () => {
    clearCart();
    setCartOpen(false);
    onClose();
    toast.success('Cảm ơn bạn đã đặt hàng! ☕', { duration: 3000 });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-bounce-in">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-xl rounded-t-3xl flex items-center justify-between px-6 pt-6 pb-4 border-b border-coffee-50 z-10">
          <h3 className="font-heading text-xl font-bold text-coffee-800 flex items-center gap-2">
            <span className="text-2xl">📱</span> Đặt hàng qua Zalo
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-coffee-400 hover:text-coffee-700 rounded-full hover:bg-coffee-50 transition-all"
            id="close-checkout-modal"
          >
            <HiX className="w-5 h-5" />
          </button>
        </div>

        {/* Steps indicator */}
        <div className="px-6 pt-5 pb-2">
          <div className="flex items-center gap-3 text-xs text-coffee-400">
            <div className="flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center">1</span>
              <span className="font-medium text-accent">Copy đơn hàng</span>
            </div>
            <div className="flex-1 h-px bg-coffee-200" />
            <div className="flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-full bg-coffee-200 text-coffee-500 text-xs font-bold flex items-center justify-center">2</span>
              <span className="font-medium">Mở Zalo</span>
            </div>
            <div className="flex-1 h-px bg-coffee-200" />
            <div className="flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-full bg-coffee-200 text-coffee-500 text-xs font-bold flex items-center justify-center">3</span>
              <span className="font-medium">Gửi</span>
            </div>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="px-6 py-4">
          <div className="bg-gradient-to-br from-coffee-50 to-cream-dark rounded-2xl p-6 flex flex-col items-center">
            <p className="text-sm text-coffee-600 mb-4 font-medium">
              Quét mã QR để mở Zalo shop
            </p>
            <div className="w-48 h-48 bg-white rounded-2xl border-2 border-dashed border-coffee-200 flex items-center justify-center shadow-inner">
              <div className="text-center">
                <span className="text-5xl block mb-2 opacity-60">📱</span>
                <span className="text-xs text-coffee-400 font-medium">
                  QR Code Zalo
                </span>
                <span className="text-[10px] text-coffee-300 block mt-1">
                  (Chờ cập nhật)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="px-6 pb-4">
          <h4 className="text-sm font-semibold text-coffee-700 mb-2 flex items-center gap-2">
            <span>📋</span> Nội dung đơn hàng
          </h4>
          <div className="bg-coffee-50 rounded-2xl p-4 font-mono text-xs text-coffee-700 whitespace-pre-wrap max-h-44 overflow-y-auto leading-relaxed border border-coffee-100">
            {orderMessage}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 pb-6 space-y-3">
          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className={`w-full py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2.5 transition-all duration-300 cursor-pointer ${
              copied
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                : 'bg-accent text-white hover:bg-accent-dark shadow-lg hover:shadow-accent/25'
            }`}
            id="copy-order-button"
          >
            {copied ? (
              <>
                <HiCheck className="w-5 h-5" />
                Đã copy nội dung đơn hàng!
              </>
            ) : (
              <>
                <HiClipboardCopy className="w-5 h-5" />
                Copy nội dung đơn hàng
              </>
            )}
          </button>

          {/* Open Zalo Button */}
          <button
            onClick={handleOpenZalo}
            className="w-full py-3.5 rounded-2xl font-semibold bg-blue-500 text-white hover:bg-blue-600 flex items-center justify-center gap-2.5 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 cursor-pointer"
            id="open-zalo-button"
          >
            <HiExternalLink className="w-5 h-5" />
            Mở Zalo Chat
          </button>

          {/* Done */}
          <button
            onClick={handleComplete}
            className="w-full py-2.5 text-sm text-coffee-400 hover:text-coffee-600 transition-colors cursor-pointer"
            id="complete-order-button"
          >
            ✅ Hoàn tất đặt hàng
          </button>
        </div>
      </div>
    </div>
  );
}
