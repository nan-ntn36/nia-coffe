import ProductGrid from '../components/product/ProductGrid';

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Dark hero banner for menu page - Kaffa style */}
      <div className="relative pt-24 pb-16 lg:pt-32 lg:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-coffee-900">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: 'url(/images/hero-bg.webp)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-coffee-900/50 to-coffee-900/90" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-block text-green-light text-xs font-semibold tracking-[0.3em] uppercase mb-4 relative">
              <span className="absolute left-full ml-3 top-1/2 w-8 h-px bg-green/30" />
              <span className="absolute right-full mr-3 top-1/2 w-8 h-px bg-green/30" />
              Thực Đơn
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Menu <span className="text-green-light italic">Nia Coffee</span>
            </h1>
            <p className="text-white/50 max-w-lg mx-auto text-sm lg:text-base leading-relaxed">
              Khám phá bộ sưu tập thức uống đa dạng, từ cà phê truyền thống
              đến các loại đặc biệt
            </p>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <ProductGrid />
      </div>
    </div>
  );
}
