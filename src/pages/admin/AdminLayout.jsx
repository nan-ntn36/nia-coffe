import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import {
  HiOutlineTemplate,
  HiOutlineCube,
  HiOutlineTag,
  HiOutlineCog,
  HiOutlineClipboardList,
  HiOutlineChartBar,
  HiOutlineLogout,
  HiOutlineMenuAlt2,
  HiOutlineHome,
  HiOutlineSearch,
  HiOutlineBell,
} from 'react-icons/hi';
import { useState } from 'react';

const sidebarLinks = [
  { to: '/admin', icon: HiOutlineTemplate, label: 'Dashboard', end: true },
  { to: '/admin/products', icon: HiOutlineCube, label: 'Sản phẩm' },
  { to: '/admin/categories', icon: HiOutlineTag, label: 'Danh mục' },
  { to: '/admin/orders', icon: HiOutlineClipboardList, label: 'Đơn hàng' },
  { to: '/admin/stats', icon: HiOutlineChartBar, label: 'Thống kê' },
  { to: '/admin/settings', icon: HiOutlineCog, label: 'Cài đặt' },
];

export default function AdminLayout() {
  const { admin, logoutAdmin } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#f8fafb] flex">
      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/20 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar — white like Jampack */}
      <aside
        className={`fixed top-0 left-0 h-full w-[250px] z-50 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full bg-white border-r border-gray-200/80 flex flex-col">
          {/* Brand */}
          <div className="h-16 flex items-center px-5 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <img src={settings.logo || '/logo.png'} alt="Nia Coffee" className="w-8 h-8 rounded-lg object-cover" />
              <span className="font-heading text-[17px] font-bold text-gray-800 tracking-tight">{settings.shop_name || 'Nia Coffee'}</span>
            </div>
          </div>

          {/* Menu label */}
          <div className="px-5 pt-6 pb-2">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.08em]">Menu</p>
          </div>

          {/* Nav */}
          <nav className="px-3 space-y-0.5 flex-1 overflow-y-auto">
            {sidebarLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-[9px] rounded-lg text-[13.5px] font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-[#e0f2f1] text-[#00897b]'
                      : 'text-[#64748b] hover:bg-gray-50 hover:text-gray-700'
                  }`
                }
              >
                <link.icon className="w-[19px] h-[19px]" />
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Bottom */}
          <div className="px-3 py-3 border-t border-gray-100">
            <a href="/" target="_blank" className="flex items-center gap-3 px-3 py-[9px] rounded-lg text-[13.5px] font-medium text-[#64748b] hover:bg-gray-50 hover:text-gray-700 transition-all">
              <HiOutlineHome className="w-[19px] h-[19px]" /> Xem trang chủ
            </a>
            <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-[9px] rounded-lg text-[13.5px] font-medium text-[#64748b] hover:bg-red-50 hover:text-red-500 transition-all w-full cursor-pointer">
              <HiOutlineLogout className="w-[19px] h-[19px]" /> Đăng xuất
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Topbar — Jampack style: search left, icons right */}
        <header className="bg-white border-b border-gray-200/80 h-16 flex items-center px-4 lg:px-6 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden mr-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
            <HiOutlineMenuAlt2 className="w-5 h-5 text-gray-500" />
          </button>

          {/* Search */}
          <div className="hidden sm:flex items-center flex-1 max-w-xs">
            <div className="relative w-full">
              <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                placeholder="Tìm kiếm..."
                className="w-full pl-9 pr-10 py-[7px] border border-gray-200 rounded-lg text-sm text-gray-600 placeholder:text-gray-400 focus:outline-none focus:border-[#00897b] focus:ring-1 focus:ring-[#00897b]/20 transition-all"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-gray-400 border border-gray-200 rounded px-1.5 py-0.5 bg-gray-50">/</kbd>
            </div>
          </div>

          <div className="flex-1" />

          {/* Right icons */}
          <div className="flex items-center gap-1">
            <button className="relative p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
              <HiOutlineBell className="w-5 h-5 text-gray-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            </button>
            <div className="w-px h-6 bg-gray-200 mx-2" />
            <div className="flex items-center gap-2.5 cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-[13px] font-semibold text-gray-700 leading-none">{admin?.username}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Admin</p>
              </div>
              <img src={settings.logo || '/logo.png'} alt="" className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100" />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-5 lg:p-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
