import { createContext, useContext, useState, useEffect } from 'react';
import { getSettings as fetchSettings } from '../services/api';

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const data = await fetchSettings();
      setSettings(data);
    } catch {
      // Fallback to defaults if API is unavailable
      setSettings({
        shop_name: 'Nia Coffee',
        zalo_phone_1: '0385637299',
        zalo_phone_2: '0376598497',
        logo: '/logo.png',
        hero_bg: '/images/hero-bg.webp',
        qr_image_1: '/images/qr.jpg',
        qr_image_2: '/images/qr2.jpg',
        hero_title: 'Hương vị Cà Phê Việt Nam',
        hero_subtitle: 'Thưởng thức khoảnh khắc bình yên bên ly cà phê đậm đà, được chọn lọc từ những hạt cà phê tốt nhất.',
        address: '53 Phạm Huy Thông, Gò Vấp, TP. Hồ Chí Minh',
        open_hours: '5:00 — 10:00',
        footer_desc: 'Hương vị cà phê Việt Nam trong từng giọt.',
      });
    } finally {
      setLoading(false);
    }
  }

  function refreshSettings() {
    loadSettings();
  }

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
}
