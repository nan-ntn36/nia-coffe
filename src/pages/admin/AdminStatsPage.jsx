import { useState, useEffect } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getRevenue, getTopProducts } from '../../services/api';
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

export default function AdminStatsPage() {
  const [period, setPeriod] = useState('month');
  const [revenueData, setRevenueData] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateInput, setDateInput] = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => { fetchStats(); }, [period, dateInput]);

  async function fetchStats() {
    setLoading(true);
    try {
      const [rev, tp] = await Promise.all([getRevenue(period, dateInput), getTopProducts(10)]);
      setRevenueData(rev); setTopProducts(tp);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  const tabs = [
    { value: 'day', label: 'Hôm nay' },
    { value: 'month', label: 'Tháng này' },
    { value: 'year', label: 'Năm nay' },
  ];

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-semibold text-gray-800">Thống kê doanh thu</h1>

      {/* Chart Card */}
      <div className="bg-white rounded-xl border border-gray-200/80">
        <div className="px-5 py-3.5 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
          {/* Tabs */}
          <div className="flex gap-0 border-b-0">
            {tabs.map((t) => (
              <button key={t.value} onClick={() => setPeriod(t.value)} className={`px-3.5 py-1.5 text-[13px] font-medium rounded-lg transition-colors cursor-pointer mr-1 ${
                period === t.value ? 'bg-[#e0f2f1] text-[#00897b]' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
              }`}>{t.label}</button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <input type="date" value={dateInput} onChange={(e) => setDateInput(e.target.value)} className="px-3 py-[6px] border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-[#00897b] transition-all" />
            <div className="text-right">
              <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium">Tổng</p>
              <p className="text-lg font-bold text-gray-800">{formatCurrency(revenueData?.total || 0)}</p>
            </div>
          </div>
        </div>

        <div className="p-5">
          {loading ? (
            <div className="flex justify-center py-16"><div className="animate-spin w-7 h-7 border-[3px] border-gray-200 border-t-[#00897b] rounded-full" /></div>
          ) : revenueData?.data?.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData.data} barSize={20}>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00897b" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#00897b" stopOpacity={0.5} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} dy={8} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} axisLine={false} tickLine={false} dx={-4} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,137,123,0.04)' }} />
                <Bar dataKey="revenue" fill="url(#barGrad)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex flex-col items-center justify-center">
              <p className="text-3xl opacity-20 mb-2">📊</p>
              <p className="text-sm text-gray-400">Chưa có dữ liệu</p>
            </div>
          )}
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-xl border border-gray-200/80">
        <div className="px-5 py-3.5 border-b border-gray-100">
          <h2 className="text-[15px] font-semibold text-gray-800">Top sản phẩm bán chạy</h2>
        </div>
        {topProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider w-10">#</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Sản phẩm</th>
                  <th className="text-right px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Số lượng</th>
                  <th className="text-right px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Đơn hàng</th>
                  <th className="text-right px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Đơn giá</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((item, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-[#f8fafb] transition-colors">
                    <td className="px-5 py-2.5">
                      <span className={`w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-bold ${
                        i === 0 ? 'bg-amber-100 text-amber-700' : i === 1 ? 'bg-gray-200 text-gray-600' : i === 2 ? 'bg-orange-100 text-orange-700' : 'bg-gray-50 text-gray-400'
                      }`}>{i + 1}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <img src={item.product?.image || '/coffee-icon.svg'} alt="" className="w-8 h-8 rounded-lg object-cover" />
                        <div>
                          <p className="text-[13px] font-medium text-gray-700">{item.product?.name}</p>
                          <p className="text-[11px] text-gray-400">{item.product?.category?.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-right text-[13px] font-semibold text-[#00897b]">{item.totalQuantity} ly</td>
                    <td className="px-4 py-2.5 text-right text-[13px] text-gray-500">{item.orderCount}</td>
                    <td className="px-5 py-2.5 text-right text-[13px] text-gray-500">{formatCurrency(item.product?.price || 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center"><p className="text-3xl opacity-20 mb-2">☕</p><p className="text-sm text-gray-400">Chưa có dữ liệu</p></div>
        )}
      </div>
    </div>
  );
}
