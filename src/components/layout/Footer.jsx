import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa';
import { HiLocationMarker, HiPhone, HiClock } from 'react-icons/hi';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden">
      {/* Dark coffee beans background - like Kaffa */}
      <div className="absolute inset-0 bg-coffee-900">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: 'url(/images/hero-bg.webp)' }}
        />
        <div className="absolute inset-0 bg-coffee-900/70" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        {/* Top: Logo centered */}
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex flex-col items-center gap-3 group">
            <img
              src="/logo.png"
              alt="Nia Coffee Logo"
              className="w-16 h-16 rounded-full object-cover border-2 border-green/30 transition-transform duration-300 group-hover:scale-110"
            />
            <span className="font-heading text-2xl font-bold text-white">
              Nia Coffee
            </span>
          </Link>
          <p className="text-white/40 text-sm mt-3 max-w-xs mx-auto leading-relaxed">
            Hương vị cà phê Việt Nam trong từng giọt.
            Chúng tôi mang đến trải nghiệm hoàn hảo cho bạn.
          </p>
        </div>

        {/* Social Icons - Kaffa style: centered row */}
        <div className="flex items-center justify-center gap-5 mb-12">
          <a
            href="#"
            className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:text-green-light hover:border-green/40 transition-all duration-300"
            aria-label="Facebook"
          >
            <FaFacebookF className="w-4 h-4" />
          </a>
          <a
            href="#"
            className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:text-green-light hover:border-green/40 transition-all duration-300"
            aria-label="Instagram"
          >
            <FaInstagram className="w-4 h-4" />
          </a>
          <a
            href="#"
            className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:text-green-light hover:border-green/40 transition-all duration-300"
            aria-label="TikTok"
          >
            <FaTiktok className="w-4 h-4" />
          </a>
        </div>

        {/* Contact Info - Kaffa style: centered heading with green underline */}
        <div className="text-center">
          <div className="inline-block mb-8">
            <h3 className="font-heading text-xl text-green-light italic mb-2">
              Thông Tin Liên Hệ
            </h3>
            <div className="w-16 h-0.5 bg-green mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {/* Location */}
            <div className="flex flex-col items-center gap-2">
              <HiLocationMarker className="w-5 h-5 text-green-light" />
              <span className="text-green-light text-sm font-semibold">Địa chỉ:</span>
              <span className="text-white/60 text-sm">TP. Hồ Chí Minh, Việt Nam</span>
            </div>

            {/* Phone */}
            <div className="flex flex-col items-center gap-2">
              <HiPhone className="w-5 h-5 text-green-light" />
              <span className="text-green-light text-sm font-semibold">Zalo:</span>
              <span className="text-white/60 text-sm">0912345678</span>
            </div>

            {/* Hours */}
            <div className="flex flex-col items-center gap-2">
              <HiClock className="w-5 h-5 text-green-light" />
              <span className="text-green-light text-sm font-semibold">Giờ mở cửa:</span>
              <span className="text-white/60 text-sm">7:00 — 22:00 hàng ngày</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative z-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/30">
            © 2026 Nia Coffee. All rights reserved.
          </p>
          <p className="text-xs text-white/30">
            Made with ☕ in Việt Nam
          </p>
        </div>
      </div>
    </footer>
  );
}
