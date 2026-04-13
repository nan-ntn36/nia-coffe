import { useState, useEffect } from 'react';
import { HiPlus, HiPencil, HiTrash, HiX, HiPhotograph, HiSearch } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { getAllProducts, createProduct, updateProduct, deleteProduct, getCategories, uploadImage } from '../../services/api';
import { formatCurrency } from '../../utils/formatCurrency';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', description: '', price: '', categoryId: '', variant: '', badge: '', image: '', isActive: true });

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    try {
      const [p, c] = await Promise.all([getAllProducts(), getCategories()]);
      setProducts(p); setCategories(c);
    } catch { toast.error('Lỗi tải dữ liệu'); }
    finally { setLoading(false); }
  }

  const filtered = products.filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase()));

  function openCreate() {
    setEditing(null);
    setForm({ name: '', description: '', price: '', categoryId: categories[0]?.id || '', variant: '', badge: '', image: '', isActive: true });
    setModalOpen(true);
  }

  function openEdit(product) {
    setEditing(product);
    setForm({ name: product.name, description: product.description || '', price: product.price, categoryId: product.categoryId, variant: product.variant || '', badge: product.badge || '', image: product.image || '', isActive: product.isActive });
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editing) { await updateProduct(editing.id, form); toast.success('Đã cập nhật'); }
      else { await createProduct(form); toast.success('Đã thêm sản phẩm'); }
      setModalOpen(false); fetchData();
    } catch (err) { toast.error(err.message); }
  }

  async function handleDelete(id, name) {
    if (!confirm(`Xóa "${name}"?`)) return;
    try { await deleteProduct(id); toast.success('Đã xóa'); fetchData(); }
    catch (err) { toast.error(err.message); }
  }

  async function handleImageUpload(e) {
    const file = e.target.files[0]; if (!file) return;
    try { const r = await uploadImage(file); setForm((f) => ({ ...f, image: r.url })); toast.success('Upload ✓'); }
    catch { toast.error('Upload thất bại'); }
  }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-[3px] border-gray-200 border-t-[#00897b] rounded-full" /></div>;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-gray-800">Sản phẩm <span className="text-gray-400 font-normal text-sm ml-1">{products.length}</span></h1>
        <button onClick={openCreate} className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#00897b] text-white rounded-lg text-[13px] font-medium hover:bg-[#00796b] transition-colors cursor-pointer">
          <HiPlus className="w-4 h-4" /> Thêm sản phẩm
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-gray-200/80">
        {/* Search + Filters bar */}
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm kiếm..." className="w-full pl-9 pr-3 py-[7px] border border-gray-200 rounded-lg text-[13px] placeholder:text-gray-400 focus:outline-none focus:border-[#00897b] focus:ring-1 focus:ring-[#00897b]/20 transition-all" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Sản phẩm</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Danh mục</th>
                <th className="text-right px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Giá</th>
                <th className="text-center px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Badge</th>
                <th className="text-center px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Trạng thái</th>
                <th className="w-20" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-[#f8fafb] transition-colors group">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.image || '/coffee-icon.svg'} alt="" className="w-9 h-9 rounded-lg object-cover bg-gray-100" />
                      <div className="min-w-0">
                        <p className="text-[13px] font-medium text-gray-800 truncate">{p.name}</p>
                        {p.variant && <p className="text-[11px] text-gray-400">{p.variant}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-gray-500">{p.category?.name}</td>
                  <td className="px-4 py-3 text-[13px] font-semibold text-gray-700 text-right">{formatCurrency(p.price)}</td>
                  <td className="px-4 py-3 text-center">
                    {p.badge && <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#e0f2f1] text-[#00897b]">{p.badge}</span>}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 text-[11px] font-medium ${p.isActive ? 'text-[#00897b]' : 'text-gray-400'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${p.isActive ? 'bg-[#00897b]' : 'bg-gray-300'}`} />
                      {p.isActive ? 'Đang bán' : 'Ẩn'}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(p)} className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 cursor-pointer"><HiPencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(p.id, p.name)} className="p-1.5 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-500 cursor-pointer"><HiTrash className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-start justify-center pt-[8vh] px-4 overflow-y-auto" onClick={() => setModalOpen(false)}>
          <div className="bg-white rounded-xl w-full max-w-lg shadow-xl mb-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-[15px] font-semibold text-gray-800">{editing ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
              <button onClick={() => setModalOpen(false)} className="p-1.5 rounded-md hover:bg-gray-100 cursor-pointer"><HiX className="w-4 h-4 text-gray-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <Field label="Tên sản phẩm" required>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="input-field" placeholder="VD: Cà Phê Sữa Đá" />
              </Field>
              <Field label="Mô tả">
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="input-field resize-none" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Giá (VND)" required>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required className="input-field" />
                </Field>
                <Field label="Danh mục" required>
                  <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: parseInt(e.target.value) })} className="input-field">
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                  </select>
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Variant">
                  <input value={form.variant} onChange={(e) => setForm({ ...form, variant: e.target.value })} placeholder="Đá / Nóng" className="input-field" />
                </Field>
                <Field label="Badge">
                  <select value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} className="input-field">
                    <option value="">Không</option>
                    <option value="Mới">Mới</option><option value="Hot">Hot</option><option value="Bán chạy">Bán chạy</option><option value="Premium">Premium</option><option value="Classic">Classic</option>
                  </select>
                </Field>
              </div>
              <Field label="Ảnh">
                <div className="flex items-center gap-3">
                  {form.image && <img src={form.image} alt="" className="w-14 h-14 rounded-lg object-cover" />}
                  <label className="px-3 py-2 border border-dashed border-gray-300 rounded-lg text-[12px] text-gray-500 hover:bg-gray-50 cursor-pointer flex items-center gap-1.5">
                    <HiPhotograph className="w-4 h-4" /> Upload
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                  <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="URL ảnh" className="flex-1 input-field" />
                </div>
              </Field>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-[#00897b] focus:ring-[#00897b]/20 accent-[#00897b]" />
                <span className="text-[13px] text-gray-600">Hiển thị trên menu</span>
              </label>
              <div className="flex gap-2.5 pt-1">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-[13px] font-medium text-gray-500 hover:bg-gray-50 cursor-pointer">Hủy</button>
                <button type="submit" className="flex-1 py-2.5 bg-[#00897b] text-white rounded-lg text-[13px] font-medium hover:bg-[#00796b] cursor-pointer">{editing ? 'Cập nhật' : 'Thêm'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`.input-field { width: 100%; padding: 7px 12px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13px; outline: none; transition: all 0.15s; } .input-field:focus { border-color: #00897b; box-shadow: 0 0 0 3px rgba(0,137,123,0.08); }`}</style>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-[12px] font-medium text-gray-500 mb-1.5">{label}{required && <span className="text-red-400 ml-0.5">*</span>}</label>
      {children}
    </div>
  );
}
