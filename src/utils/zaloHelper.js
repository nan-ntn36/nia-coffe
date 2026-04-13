import { formatCurrency } from './formatCurrency';

export function createOrderMessage(cartItems, total, orderId) {
  const timestamp = new Date().toLocaleString('vi-VN');
  const orderCode = orderId ? `#${String(orderId).padStart(4, '0')}` : '';

  const itemLines = cartItems
    .map(
      (item) =>
        `• ${item.name}${item.variant ? ` (${item.variant})` : ''} x${item.quantity} — ${formatCurrency(item.price * item.quantity)}`
    )
    .join('\n');

  return (
    `🛒 ĐƠN HÀNG MỚI — Nia Coffee\n` +
    (orderCode ? `📌 Mã đơn: ${orderCode}\n` : '') +
    `🕐 ${timestamp}\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `${itemLines}\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `💰 Tổng cộng: ${formatCurrency(total)}\n\n` +
    `📝 Họ tên: \n` +
    `📍 Địa chỉ: \n` +
    `📱 SĐT: `
  );
}

export function openZaloChat(phoneNumber) {
  window.open(`https://zalo.me/${phoneNumber}`, '_blank');
}

export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    return success;
  }
}
