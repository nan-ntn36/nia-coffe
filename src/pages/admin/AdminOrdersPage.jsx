import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getOrders, updateOrderStatus } from '../../services/api';
import { formatCurrency } from '../../utils/formatCurrency';

const statusMap = {
  pending:   { label: 'Chờ xử lý',   color: 'text-amber-600',   bg: 'bg-amber-50',   dot: 'bg-amber-500' },
  confirmed: { label: 'Đã xác nhận', color: 'text-blue-600',    bg: 'bg-blue-50',    dot: 'bg-blue-500' },
  completed: { label: 'Hoàn thành',  color: 'text-[#00897b]',   bg: 'bg-[#e0f2f1]',  dot: 'bg-[#00897b]' },
  cancelled: { label: 'Đã hủy',     color: 'text-red-500',     bg: 'bg-red-50',     dot: 'bg-red-400' },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => { fetchOrders(); }, [filter]);

  async function fetchOrders() {
    setLoading(true);
    try { const d = await getOrders(filter ? { status: filter } : {}); setOrders(d.orders); setTotal(d.total); }
    catch { toast.error('Lỗi tải đơn hàng'); }
    finally { setLoading(false); }
  }

  async function changeStatus(id, status) {
    try { await updateOrderStatus(id, status); toast.success(`→ ${statusMap[status].label}`); fetchOrders(); }
    catch (err) { toast.error(err.message); }
  }

  const tabs = [
    { value: '', label: 'Tất cả' },
    { value: 'pending', label: 'Chờ xử lý' },
    { value: 'confirmed', label: 'Đã xác nhận' },
    { value: 'completed', label: 'Hoàn thành' },
    { value: 'cancelled', label: 'Đã hủy' },
  ];

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-semibold text-gray-800">Đơn hàng <span className="text-gray-400 font-normal text-sm ml-1">{total}</span></h1>

      {/* Tabs — Jampack style underline tabs */}
      <div className="bg-white rounded-xl border border-gray-200/80">
        <div className="px-5 border-b border-gray-100 flex gap-0">
          {tabs.map((t) => (
            <button
              key={t.value} onClick={() => setFilter(t.value)}
              className={`px-4 py-3 text-[13px] font-medium border-b-2 transition-colors cursor-pointer -mb-px ${
                filter === t.value ? 'border-[#00897b] text-[#00897b]' : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >{t.label}</button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><div className="animate-spin w-7 h-7 border-[3px] border-gray-200 border-t-[#00897b] rounded-full" /></div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center"><p className="text-3xl opacity-20 mb-2">📭</p><p className="text-sm text-gray-400">Chưa có đơn hàng</p></div>
        ) : (
          <div className="divide-y divide-gray-50">
            {orders.map((order) => {
              const st = statusMap[order.status] || statusMap.pending;
              return (
                <div key={order.id} className="px-5 py-4 hover:bg-[#f8fafb] transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[13px] font-semibold text-gray-700">#{String(order.id).padStart(4, '0')}</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${st.bg} ${st.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} /> {st.label}
                      </span>
                    </div>
                    <span className="text-[12px] text-gray-400">{new Date(order.createdAt).toLocaleString('vi-VN')}</span>
                  </div>

                  <div className="flex items-center gap-1.5 mb-3 flex-wrap">
                    {order.items?.map((item, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 rounded-md text-[12px] text-gray-600 border border-gray-100">
                        <img src={item.product?.image || '/coffee-icon.svg'} alt="" className="w-5 h-5 rounded object-cover" />
                        {item.product?.name} <span className="text-gray-400">×{item.quantity}</span>
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[15px] font-bold text-gray-800">{formatCurrency(order.totalPrice)}</span>
                    <div className="flex gap-2">
                      {order.status === 'pending' && (
                        <>
                          <button onClick={() => changeStatus(order.id, 'confirmed')} className="px-3 py-1.5 bg-[#00897b] text-white rounded-lg text-[12px] font-medium hover:bg-[#00796b] cursor-pointer">Xác nhận</button>
                          <button onClick={() => changeStatus(order.id, 'cancelled')} className="px-3 py-1.5 text-red-500 border border-red-200 rounded-lg text-[12px] font-medium hover:bg-red-50 cursor-pointer">Hủy</button>
                        </>
                      )}
                      {order.status === 'confirmed' && (
                        <button onClick={() => changeStatus(order.id, 'completed')} className="px-3 py-1.5 bg-[#00897b] text-white rounded-lg text-[12px] font-medium hover:bg-[#00796b] cursor-pointer">Hoàn thành</button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
