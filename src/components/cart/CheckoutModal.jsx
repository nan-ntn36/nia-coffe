import { useState, useEffect, useRef } from 'react';
import { HiX, HiClipboardCopy, HiCheck, HiExternalLink } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { createOrderMessage, copyToClipboard } from '../../utils/zaloHelper';
import { createOrder } from '../../services/api';

export default function CheckoutModal({ onClose }) {
  const { items, totalPrice, clearCart, setCartOpen } = useCart();
  const { settings } = useSettings();
  const [copied, setCopied] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [creating, setCreating] = useState(true);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const orderCreated = useRef(false);

  const ZALO_PHONES = [settings.zalo_phone_1 || '0385637299', settings.zalo_phone_2 || '0376598497'];

  // Tạo đơn NGAY khi modal mở — đảm bảo mọi checkout đều được tracking
  useEffect(() => {
    if (orderCreated.current) return;
    orderCreated.current = true;

    async function submitOrder() {
      try {
        const order = await createOrder({
          items: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            unitPrice: item.price,
          })),
          totalPrice,
          zaloPhone: ZALO_PHONES[0],
        });
        setOrderId(order.id);
      } catch (err) {
        console.warn('Could not save order:', err);
        setError(true);
        // Show rate limit message
        if (err.message?.includes('quá nhiều')) {
          setErrorMsg(err.message);
        }
      } finally {
        setCreating(false);
      }
    }
    submitOrder();
  }, []);

  // Nội dung tin nhắn Zalo có mã đơn
  const orderMessage = createOrderMessage(items, totalPrice, orderId);
  const orderCode = orderId ? `#${String(orderId).padStart(4, '0')}` : '';

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

  const handleOpenZalo = (phone) => {
    window.open(`https://zalo.me/${phone}`, '_blank');
  };

  const handleDone = () => {
    clearCart();
    setCartOpen(false);
    onClose();
    toast.success(
      orderId
        ? `Đơn ${orderCode} đã ghi nhận! Gửi Zalo để xác nhận nhé ☕`
        : 'Cảm ơn bạn! Gửi đơn qua Zalo nhé ☕',
      { duration: 4000 }
    );
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-bounce-in">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-xl rounded-t-3xl flex items-center justify-between px-6 pt-6 pb-4 border-b border-coffee-50 z-10">
          <h3 className="font-heading text-xl font-bold text-coffee-800 flex items-center gap-2">
            <span className="text-2xl">📱</span> Đặt hàng qua Zalo
          </h3>
          <button onClick={onClose} className="p-2 text-coffee-400 hover:text-coffee-700 rounded-full hover:bg-coffee-50 transition-all" id="close-checkout-modal">
            <HiX className="w-5 h-5" />
          </button>
        </div>

        {/* Order Status Banner */}
        <div className="px-6 pt-5">
          {creating ? (
            <div className="bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3 flex items-center gap-3">
              <div className="animate-spin w-5 h-5 border-2 border-blue-300 border-t-blue-600 rounded-full flex-shrink-0" />
              <p className="text-sm text-blue-700 font-medium">Đang tạo đơn hàng...</p>
            </div>
          ) : orderId ? (
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3 flex items-center gap-3">
              <span className="text-lg">✅</span>
              <div>
                <p className="text-sm font-bold text-emerald-700">Đơn hàng {orderCode} đã được ghi nhận!</p>
                <p className="text-xs text-emerald-600 mt-0.5">Copy nội dung bên dưới → gửi qua Zalo để xác nhận đơn</p>
              </div>
            </div>
          ) : error ? (
            <div className={`${errorMsg ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-100'} border rounded-2xl px-4 py-3 flex items-center gap-3`}>
              <span className="text-lg">{errorMsg ? '🚫' : '⚠️'}</span>
              <div>
                <p className={`text-sm font-semibold ${errorMsg ? 'text-red-700' : 'text-amber-700'}`}>
                  {errorMsg || 'Không kết nối được server'}
                </p>
                <p className={`text-xs mt-0.5 ${errorMsg ? 'text-red-500' : 'text-amber-600'}`}>
                  {errorMsg ? 'Vui lòng thử lại sau' : 'Vẫn gửi được qua Zalo bình thường'}
                </p>
              </div>
            </div>
          ) : null}
        </div>

        {/* Steps */}
        <div className="px-6 pt-4 pb-2">
          <div className="flex items-center gap-3 text-xs text-coffee-400">
            <div className="flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center">1</span>
              <span className="font-medium text-accent">Copy đơn</span>
            </div>
            <div className="flex-1 h-px bg-coffee-200" />
            <div className="flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-full bg-coffee-200 text-coffee-500 text-xs font-bold flex items-center justify-center">2</span>
              <span className="font-medium">Mở Zalo</span>
            </div>
            <div className="flex-1 h-px bg-coffee-200" />
            <div className="flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-full bg-coffee-200 text-coffee-500 text-xs font-bold flex items-center justify-center">3</span>
              <span className="font-medium">Gửi & xác nhận</span>
            </div>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="px-6 py-4">
          <div className="bg-gradient-to-br from-coffee-50 to-cream-dark rounded-2xl p-5">
            <p className="text-sm text-coffee-600 mb-4 font-medium text-center">
              Quét mã QR để mở Zalo shop
            </p>
            <div className="flex items-start justify-center gap-4">
              <div className="flex flex-col items-center gap-2">
                <div className="w-36 h-36 bg-white rounded-xl overflow-hidden shadow-sm border border-coffee-100">
                  <img src={settings.qr_image_1 || '/images/qr.jpg'} alt="QR Zalo 1" className="w-full h-full object-contain" />
                </div>
                <span className="text-xs text-coffee-500 font-medium">{ZALO_PHONES[0]}</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-36 h-36 bg-white rounded-xl overflow-hidden shadow-sm border border-coffee-100">
                  <img src={settings.qr_image_2 || '/images/qr2.jpg'} alt="QR Zalo 2" className="w-full h-full object-contain" />
                </div>
                <span className="text-xs text-coffee-500 font-medium">{ZALO_PHONES[1]}</span>
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
          <button
            onClick={handleCopy}
            className={`w-full py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2.5 transition-all duration-300 cursor-pointer ${
              copied
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                : 'bg-accent text-white hover:bg-accent-dark shadow-lg hover:shadow-accent/25'
            }`}
            id="copy-order-button"
          >
            {copied ? (<><HiCheck className="w-5 h-5" /> Đã copy!</>) : (<><HiClipboardCopy className="w-5 h-5" /> Copy nội dung đơn hàng</>)}
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => handleOpenZalo(ZALO_PHONES[0])}
              className="flex-1 py-3 rounded-2xl font-semibold bg-blue-500 text-white hover:bg-blue-600 flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-blue-500/25 cursor-pointer text-sm"
              id="open-zalo-button-1"
            >
              <HiExternalLink className="w-4 h-4" /> Zalo {ZALO_PHONES[0]}
            </button>
            <button
              onClick={() => handleOpenZalo(ZALO_PHONES[1])}
              className="flex-1 py-3 rounded-2xl font-semibold bg-blue-500 text-white hover:bg-blue-600 flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-blue-500/25 cursor-pointer text-sm"
              id="open-zalo-button-2"
            >
              <HiExternalLink className="w-4 h-4" /> Zalo {ZALO_PHONES[1]}
            </button>
          </div>

          <button
            onClick={handleDone}
            className="w-full py-2.5 text-sm text-coffee-400 hover:text-coffee-600 transition-colors cursor-pointer"
            id="complete-order-button"
          >
            ✅ Hoàn tất
          </button>
        </div>
      </div>
    </div>
  );
}
