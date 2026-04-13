import { useState, useEffect } from 'react';
import { HiPlus, HiPencil, HiX } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { getCategories, createCategory, updateCategory } from '../../services/api';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', slug: '', icon: '☕', description: '', sortOrder: 0 });

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    try { setCategories(await getCategories()); }
    catch { toast.error('Lỗi'); }
    finally { setLoading(false); }
  }

  function openCreate() {
    setEditing(null);
    setForm({ name: '', slug: '', icon: '☕', description: '', sortOrder: categories.length });
    setModalOpen(true);
  }

  function openEdit(cat) {
    setEditing(cat);
    setForm({ name: cat.name, slug: cat.slug, icon: cat.icon, description: cat.description || '', sortOrder: cat.sortOrder });
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editing) { await updateCategory(editing.id, form); toast.success('Đã cập nhật'); }
      else { await createCategory(form); toast.success('Đã thêm'); }
      setModalOpen(false); fetchData();
    } catch (err) { toast.error(err.message); }
  }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-[3px] border-gray-200 border-t-[#00897b] rounded-full" /></div>;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">Danh mục <span className="text-gray-400 font-normal text-sm ml-1">{categories.length}</span></h1>
        <button onClick={openCreate} className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#00897b] text-white rounded-lg text-[13px] font-medium hover:bg-[#00796b] cursor-pointer">
          <HiPlus className="w-4 h-4" /> Thêm
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200/80">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Icon</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Tên</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Slug</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Mô tả</th>
                <th className="text-center px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">SP</th>
                <th className="w-16" />
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-b border-gray-50 hover:bg-[#f8fafb] transition-colors group">
                  <td className="px-5 py-3 text-2xl">{cat.icon}</td>
                  <td className="px-4 py-3 text-[13px] font-medium text-gray-800">{cat.name}</td>
                  <td className="px-4 py-3 text-[13px] text-gray-400 font-mono">{cat.slug}</td>
                  <td className="px-4 py-3 text-[13px] text-gray-500 max-w-[200px] truncate">{cat.description || '—'}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#e0f2f1] text-[#00897b]">{cat._count?.products || 0}</span>
                  </td>
                  <td className="px-3 py-3">
                    <button onClick={() => openEdit(cat)} className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                      <HiPencil className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-start justify-center pt-[10vh] px-4" onClick={() => setModalOpen(false)}>
          <div className="bg-white rounded-xl w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-[15px] font-semibold text-gray-800">{editing ? 'Chỉnh sửa danh mục' : 'Thêm danh mục'}</h2>
              <button onClick={() => setModalOpen(false)} className="p-1.5 rounded-md hover:bg-gray-100 cursor-pointer"><HiX className="w-4 h-4 text-gray-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="flex gap-3">
                <div className="w-20">
                  <label className="block text-[12px] font-medium text-gray-500 mb-1.5">Icon</label>
                  <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="w-full px-2 py-[7px] border border-gray-200 rounded-lg text-2xl text-center focus:outline-none focus:border-[#00897b] focus:ring-1 focus:ring-[#00897b]/20 transition-all" />
                </div>
                <div className="flex-1">
                  <label className="block text-[12px] font-medium text-gray-500 mb-1.5">Tên <span className="text-red-400">*</span></label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full px-3 py-[7px] border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-[#00897b] focus:ring-1 focus:ring-[#00897b]/20 transition-all" placeholder="Cà Phê" />
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-500 mb-1.5">Slug <span className="text-red-400">*</span></label>
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required className="w-full px-3 py-[7px] border border-gray-200 rounded-lg text-[13px] font-mono focus:outline-none focus:border-[#00897b] focus:ring-1 focus:ring-[#00897b]/20 transition-all" placeholder="coffee" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-500 mb-1.5">Mô tả</label>
                <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-[7px] border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-[#00897b] focus:ring-1 focus:ring-[#00897b]/20 transition-all" />
              </div>
              <div className="flex gap-2.5 pt-1">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-[13px] font-medium text-gray-500 hover:bg-gray-50 cursor-pointer">Hủy</button>
                <button type="submit" className="flex-1 py-2.5 bg-[#00897b] text-white rounded-lg text-[13px] font-medium hover:bg-[#00796b] cursor-pointer">{editing ? 'Cập nhật' : 'Thêm'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
