import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';

export default function HeroSection() {
  const { settings } = useSettings();
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Dark coffee beans background */}
      <div className="absolute inset-0 bg-coffee-900">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url(${settings.hero_bg || '/images/hero-bg.webp'})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-coffee-900/60 via-coffee-900/40 to-coffee-900/80" />
      </div>

      {/* Decorative leaf shape - top left (like Kaffa) */}
      <div className="absolute top-0 left-0 w-40 h-40 opacity-10">
        <svg viewBox="0 0 200 200" className="w-full h-full text-green">
          <path fill="currentColor" d="M0,0 C80,40 120,100 200,200 L0,200 Z" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
        {/* Logo */}
        <div className="animate-fade-in mb-8">
          <img
            src={settings.logo || '/logo.png'}
            alt="Nia Coffee Logo"
            className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 mx-auto rounded-full object-cover border-2 border-green/30 shadow-2xl shadow-black/30"
          />
        </div>

        {/* Title - Kaffa style: accent word in green italic, rest in white */}
        <h1 className="animate-slide-up font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-[1.15] tracking-tight">
          <span className="text-green-light italic block sm:inline">Hương vị</span>
          <br className="hidden sm:block" />
          <span className="text-white">{(settings.hero_title || 'Hương vị Cà Phê Việt Nam').replace('Hương vị ', '')}</span>
        </h1>

        {/* Subtitle */}
        <p
          className="animate-slide-up text-base sm:text-lg text-white/60 mb-10 max-w-lg mx-auto leading-relaxed font-light"
          style={{ animationDelay: '0.15s' }}
        >
          {settings.hero_subtitle || 'Thưởng thức khoảnh khắc bình yên bên ly cà phê đậm đà, được chọn lọc từ những hạt cà phê tốt nhất.'}
        </p>

        {/* CTA Buttons - Kaffa style: green primary, dark outline secondary */}
        <div
          className="animate-slide-up flex flex-col sm:flex-row items-center justify-center gap-4"
          style={{ animationDelay: '0.3s' }}
        >
          <Link
            to="/menu"
            className="group px-8 py-3.5 bg-green text-white font-semibold rounded-full text-sm uppercase tracking-wider hover:bg-green-light transition-all duration-300 shadow-lg shadow-green/20 hover:shadow-xl hover:shadow-green/30 flex items-center gap-2"
            id="hero-cta-menu"
          >
            Xem Menu
            <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
          </Link>
          <a
            href="#featured"
            className="px-8 py-3.5 border border-white/25 text-white/80 font-semibold rounded-full text-sm uppercase tracking-wider hover:bg-white/10 hover:border-white/40 transition-all duration-300"
            id="hero-cta-explore"
          >
            Khám phá
          </a>
        </div>

        {/* "Since" badge - Kaffa style: dashed border circle */}
        <div
          className="animate-fade-in mt-14"
          style={{ animationDelay: '0.5s' }}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-2 border-dashed border-green/40">
            <div className="text-center">
              <span className="text-green-light text-[10px] uppercase tracking-widest block font-semibold">Since</span>
              <span className="text-white text-lg font-heading font-bold">2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-pulse-soft">
        <a href="#featured" className="block">
          <div className="w-6 h-10 rounded-full border border-white/20 flex items-start justify-center p-1.5">
            <div className="w-1 h-2.5 rounded-full bg-green-light/60 animate-slide-down" />
          </div>
        </a>
      </div>
    </section>
  );
}
