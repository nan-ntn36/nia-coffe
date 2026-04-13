import { useState, useEffect } from 'react';
import { HiPhotograph, HiCheck } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { getSettings, updateSettings, uploadImage } from '../../services/api';
import { useSettings } from '../../context/SettingsContext';

export default function AdminSettingsPage() {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const { refreshSettings } = useSettings();

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    try { setForm(await getSettings()); }
    catch { toast.error('Lỗi'); }
    finally { setLoading(false); }
  }

  async function handleSave() {
    setSaving(true);
    try {
      await updateSettings(form);
      refreshSettings();
      setSaved(true); toast.success('Đã lưu!');
      setTimeout(() => setSaved(false), 2000);
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  }

  async function upload(key, e) {
    const file = e.target.files[0]; if (!file) return;
    try { const r = await uploadImage(file); setForm((f) => ({ ...f, [key]: r.url })); toast.success('Upload ✓'); }
    catch { toast.error('Lỗi upload'); }
  }

  function set(key, val) { setForm((f) => ({ ...f, [key]: val })); }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-[3px] border-gray-200 border-t-[#00897b] rounded-full" /></div>;

  const sections = [
    { title: 'Thông tin cửa hàng', fields: [
      { key: 'shop_name', label: 'Tên cửa hàng', ph: 'Nia Coffee' },
      { key: 'address', label: 'Địa chỉ', ph: '53 Phạm Huy Thông...' },
      { key: 'open_hours', label: 'Giờ mở cửa', ph: '5:00 — 10:00' },
    ]},
    { title: 'Zalo & Liên hệ', fields: [
      { key: 'zalo_phone_1', label: 'Số Zalo 1', ph: '0385637299' },
      { key: 'zalo_phone_2', label: 'Số Zalo 2', ph: '0376598497' },
    ]},
    { title: 'Hình ảnh', fields: [
      { key: 'logo', label: 'Logo', type: 'image' },
      { key: 'hero_bg', label: 'Ảnh nền trang chủ', type: 'image' },
      { key: 'qr_image_1', label: 'QR Code Zalo 1', type: 'image' },
      { key: 'qr_image_2', label: 'QR Code Zalo 2', type: 'image' },
    ]},
    { title: 'Nội dung trang', fields: [
      { key: 'hero_title', label: 'Tiêu đề Hero' },
      { key: 'hero_subtitle', label: 'Phụ đề Hero', type: 'textarea' },
      { key: 'footer_desc', label: 'Mô tả Footer', type: 'textarea' },
    ]},
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">Cài đặt</h1>
        <button onClick={handleSave} disabled={saving} className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium cursor-pointer transition-all ${
          saved ? 'bg-emerald-500 text-white' : 'bg-[#00897b] text-white hover:bg-[#00796b]'
        } disabled:opacity-50`}>
          {saved ? <><HiCheck className="w-4 h-4" /> Đã lưu</> : saving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      </div>

      {sections.map((sec) => (
        <div key={sec.title} className="bg-white rounded-xl border border-gray-200/80">
          <div className="px-5 py-3.5 border-b border-gray-100">
            <h2 className="text-[14px] font-semibold text-gray-700">{sec.title}</h2>
          </div>
          <div className="p-5 space-y-4">
            {sec.fields.map((f) => (
              <div key={f.key}>
                <label className="block text-[12px] font-medium text-gray-500 mb-1.5">{f.label}</label>
                {f.type === 'image' ? (
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {form[f.key] ? <img src={form[f.key]} alt="" className="w-full h-full object-cover" /> : <HiPhotograph className="w-6 h-6 text-gray-300" />}
                    </div>
                    <div className="flex-1 space-y-2">
                      <label className="inline-flex items-center gap-1.5 px-3 py-[6px] border border-dashed border-gray-300 rounded-lg text-[12px] text-gray-500 hover:bg-gray-50 cursor-pointer">
                        <HiPhotograph className="w-4 h-4" /> Chọn ảnh
                        <input type="file" accept="image/*" onChange={(e) => upload(f.key, e)} className="hidden" />
                      </label>
                      <input value={form[f.key] || ''} onChange={(e) => set(f.key, e.target.value)} placeholder="URL ảnh" className="w-full px-3 py-[7px] border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-[#00897b] focus:ring-1 focus:ring-[#00897b]/20 transition-all" />
                    </div>
                  </div>
                ) : f.type === 'textarea' ? (
                  <textarea value={form[f.key] || ''} onChange={(e) => set(f.key, e.target.value)} rows={2} className="w-full px-3 py-[7px] border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-[#00897b] focus:ring-1 focus:ring-[#00897b]/20 resize-none transition-all" />
                ) : (
                  <input value={form[f.key] || ''} onChange={(e) => set(f.key, e.target.value)} placeholder={f.ph} className="w-full px-3 py-[7px] border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-[#00897b] focus:ring-1 focus:ring-[#00897b]/20 transition-all" />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
