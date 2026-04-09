import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiOutlineShoppingBag, HiOutlineMenuAlt3, HiOutlineX } from 'react-icons/hi';
import { useCart } from '../../context/CartContext';

export default function Header() {
  const { totalItems, toggleCart } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: '/', label: 'Trang chủ' },
    { to: '/menu', label: 'Menu' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        isScrolled
          ? 'bg-coffee-900/95 backdrop-blur-2xl shadow-lg shadow-black/10 py-2'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 lg:h-16">
          {/* Left: Logo */}
          <Link to="/" className="flex items-center gap-2.5 group" id="logo-link">
            <img
              src="/logo.png"
              alt="Nia Coffee Logo"
              className="w-10 h-10 lg:w-12 lg:h-12 rounded-full object-cover transition-transform duration-300 group-hover:scale-110 border-2 border-green/40 shadow-lg shadow-green/10"
            />
            <span className="font-heading text-xl lg:text-2xl font-bold text-white group-hover:text-green-light transition-colors duration-300">
              Nia Coffee
            </span>
          </Link>

          {/* Right: Nav + Cart */}
          <div className="flex items-center gap-8">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8" id="desktop-nav">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative text-sm font-medium tracking-widest uppercase transition-colors duration-300 py-2 ${
                    location.pathname === link.to
                      ? 'text-green-light'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {link.label}
                  {location.pathname === link.to && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-green-light rounded-full" />
                  )}
                </Link>
              ))}
            </nav>
            {/* Cart Button */}
            <button
              onClick={toggleCart}
              className="relative p-2.5 text-white/70 hover:text-green-light transition-all duration-300 hover:bg-white/5 rounded-xl"
              aria-label="Giỏ hàng"
              id="cart-toggle-button"
            >
              <HiOutlineShoppingBag className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-green text-white text-[10px] font-bold min-w-[20px] h-5 rounded-full flex items-center justify-center animate-bounce-in shadow-md shadow-green/30">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2.5 text-white/70 hover:text-white transition-colors rounded-xl hover:bg-white/5"
              aria-label="Menu"
              id="mobile-menu-toggle"
            >
              {isMobileMenuOpen ? (
                <HiOutlineX className="w-6 h-6" />
              ) : (
                <HiOutlineMenuAlt3 className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="bg-coffee-900/95 backdrop-blur-2xl border-t border-white/10 px-4 py-3 space-y-1" id="mobile-nav">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block text-base font-medium py-3 px-4 rounded-xl transition-all duration-200 ${
                location.pathname === link.to
                  ? 'bg-green/15 text-green-light font-semibold'
                  : 'text-white/70 hover:bg-white/5 active:bg-white/10'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
