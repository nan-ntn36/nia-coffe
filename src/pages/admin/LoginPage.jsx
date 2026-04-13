import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { login } from '../../services/api';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuthAdmin } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return;
    setLoading(true);
    try {
      const data = await login(username, password);
      setAuthAdmin(data.admin, data.token);
      toast.success('Đăng nhập thành công!');
      navigate('/admin');
    } catch (err) {
      toast.error(err.message || 'Sai tài khoản hoặc mật khẩu');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#f8fafb] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-7">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2.5 mb-6">
            <img src={settings.logo || '/logo.png'} alt="" className="w-12 h-12 rounded-xl object-cover" />
            <span className="font-heading text-xl font-bold text-gray-800">{settings.shop_name || 'Nia Coffee'}</span>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-lg font-semibold text-gray-800">Đăng nhập</h1>
            <p className="text-[13px] text-gray-400 mt-1">Truy cập Admin Panel</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[12px] font-medium text-gray-500 mb-1.5">Tài khoản</label>
              <input
                type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3.5 py-[9px] border border-gray-200 rounded-lg text-[13.5px] placeholder:text-gray-400 focus:outline-none focus:border-[#00897b] focus:ring-1 focus:ring-[#00897b]/20 transition-all"
                placeholder="admin" autoFocus
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-gray-500 mb-1.5">Mật khẩu</label>
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-[9px] border border-gray-200 rounded-lg text-[13.5px] placeholder:text-gray-400 focus:outline-none focus:border-[#00897b] focus:ring-1 focus:ring-[#00897b]/20 transition-all"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full py-[10px] bg-[#00897b] text-white text-[13.5px] font-medium rounded-lg hover:bg-[#00796b] transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>
        </div>

        <p className="text-center text-[12px] text-gray-400 mt-5">© 2026 {settings.shop_name || 'Nia Coffee'}</p>
      </div>
    </div>
  );
}
