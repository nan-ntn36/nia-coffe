import { useState, useEffect } from 'react';
import { HiOutlineCube, HiOutlineClipboardList, HiOutlineCash, HiOutlineTrendingUp, HiArrowSmUp, HiArrowSmDown } from 'react-icons/hi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getStatsOverview, getTopProducts, getRevenue } from '../../services/api';
import { formatCurrency } from '../../utils/formatCurrency';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1e293b] text-white px-3.5 py-2 rounded-lg shadow-xl text-[12px]">
      <p className="text-white/60 mb-0.5">{label}</p>
      <p className="font-bold">{formatCurrency(payload[0].value)}</p>
    </div>
  );
};

export default function DashboardPage() {
  const [overview, setOverview] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [revenue, setRevenue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [ov, tp, rev] = await Promise.all([
          getStatsOverview(),
          getTopProducts(5),
          getRevenue('month', new Date().toISOString().slice(0, 10)),
        ]);
        setOverview(ov);
        setTopProducts(tp);
        setRevenue(rev);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    fetchData();
  }, []);

  const statCards = overview ? [
    { label: 'Sản phẩm', value: overview.totalProducts, icon: HiOutlineCube, color: 'text-[#00897b]', bg: 'bg-[#e0f2f1]' },
    { label: 'Đơn đã xác nhận', value: overview.totalOrders, icon: HiOutlineClipboardList, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Đơn hôm nay', value: overview.todayOrders, icon: HiOutlineTrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Doanh thu hôm nay', value: formatCurrency(overview.todayRevenue), icon: HiOutlineCash, color: 'text-violet-600', bg: 'bg-violet-50' },
  ] : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-[3px] border-gray-200 border-t-[#00897b] rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pending Orders Alert */}
      {overview?.pendingOrders > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">⏳</span>
            <div>
              <p className="text-sm font-semibold text-amber-800">
                Có {overview.pendingOrders} đơn hàng chờ xác nhận
              </p>
              <p className="text-xs text-amber-600 mt-0.5">
                Kiểm tra Zalo và xác nhận đơn để tính doanh thu
              </p>
            </div>
          </div>
          <a href="/admin/orders" className="px-3.5 py-1.5 bg-amber-500 text-white rounded-lg text-[12px] font-medium hover:bg-amber-600 transition-colors cursor-pointer">
            Xem đơn
          </a>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200/80 p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[13px] text-gray-500 font-medium">{card.label}</p>
              <div className={`w-9 h-9 rounded-lg ${card.bg} ${card.color} flex items-center justify-center`}>
                <card.icon className="w-[18px] h-[18px]" />
              </div>
            </div>
            <p className="text-[26px] font-bold text-gray-800 leading-none">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Chart + Top Products */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-gray-200/80">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-[15px] font-semibold text-gray-800">Doanh thu tháng này</h2>
              <p className="text-[12px] text-gray-400 mt-0.5">Tổng: {formatCurrency(revenue?.total || 0)}</p>
            </div>
          </div>
          <div className="p-4">
            {revenue?.data?.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={revenue.data}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00897b" stopOpacity={0.12} />
                      <stop offset="95%" stopColor="#00897b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} dy={8} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} axisLine={false} tickLine={false} dx={-4} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="revenue" stroke="#00897b" strokeWidth={2} fill="url(#revGrad)" dot={false} activeDot={{ r: 4, fill: '#00897b', stroke: '#fff', strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[280px] flex flex-col items-center justify-center">
                <p className="text-3xl opacity-20 mb-2">📊</p>
                <p className="text-sm text-gray-400">Chưa có dữ liệu doanh thu</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl border border-gray-200/80">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-[15px] font-semibold text-gray-800">Bán chạy nhất</h2>
          </div>
          <div className="p-2">
            {topProducts.length > 0 ? (
              <div>
                {topProducts.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                    <span className={`w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${
                      i === 0 ? 'bg-amber-100 text-amber-700' : i === 1 ? 'bg-gray-200 text-gray-600' : i === 2 ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-400'
                    }`}>{i + 1}</span>
                    <img src={item.product?.image || '/coffee-icon.svg'} alt="" className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-gray-700 truncate">{item.product?.name}</p>
                      <p className="text-[11px] text-gray-400">{item.product?.category?.name}</p>
                    </div>
                    <span className="text-[13px] font-semibold text-[#00897b]">{item.totalQuantity}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-3xl opacity-20 mb-2">☕</p>
                <p className="text-sm text-gray-400">Chưa có đơn hàng</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200/80 p-5">
          <p className="text-[12px] font-medium text-gray-400 uppercase tracking-wide mb-1">Tổng doanh thu</p>
          <p className="text-2xl font-bold text-gray-800">{formatCurrency(overview?.totalRevenue || 0)}</p>
          <p className="text-[12px] text-[#00897b] font-medium mt-1 flex items-center gap-0.5"><HiArrowSmUp className="w-4 h-4" /> Toàn thời gian</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200/80 p-5">
          <p className="text-[12px] font-medium text-gray-400 uppercase tracking-wide mb-1">Tổng đơn hàng</p>
          <p className="text-2xl font-bold text-gray-800">{overview?.totalOrders || 0}</p>
          <p className="text-[12px] text-blue-500 font-medium mt-1 flex items-center gap-0.5"><HiArrowSmUp className="w-4 h-4" /> đơn</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200/80 p-5">
          <p className="text-[12px] font-medium text-gray-400 uppercase tracking-wide mb-1">Sản phẩm đang bán</p>
          <p className="text-2xl font-bold text-gray-800">{overview?.totalProducts || 0}</p>
          <p className="text-[12px] text-amber-500 font-medium mt-1">trên menu</p>
        </div>
      </div>
    </div>
  );
}
