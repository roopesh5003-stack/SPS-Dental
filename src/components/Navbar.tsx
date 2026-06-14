import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Calendar, MapPin } from 'lucide-react';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      {/* Top Bar */}
      <div className="hidden lg:block bg-dental-blue text-white text-sm">
        <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <a href="tel:+918807700880" className="flex items-center gap-2 hover:text-teal-light transition-colors">
              <Phone size={14} />
              <span>+91 88077 00880</span>
            </a>
            <a href="tel:+918056196016" className="flex items-center gap-2 hover:text-teal-light transition-colors">
              <Phone size={14} />
              <span>+91 80561 96016</span>
            </a>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <MapPin size={14} />
              <span>Othakadai, Madurai, Tamil Nadu</span>
            </div>
            <span className="text-white/60">|</span>
            <span>Mon - Sat: 9:00 AM - 9:00 PM</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-lg shadow-lg shadow-black/5'
            : 'bg-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-18 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-dental-blue to-teal flex items-center justify-center text-white font-bold text-lg lg:text-xl shadow-md group-hover:shadow-lg transition-shadow" style={{ fontFamily: 'var(--font-heading)' }}>
                S
              </div>
              <div>
                <div className="text-lg lg:text-xl font-bold text-dental-blue leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                  SPS Dental
                </div>
                <div className="text-[10px] lg:text-xs text-text-secondary tracking-wider uppercase">
                  Multispeciality Clinic
                </div>
              </div>
            </Link>

            {/* Desktop Links */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname === link.path
                      ? 'text-dental-blue bg-accent'
                      : 'text-text-secondary hover:text-dental-blue hover:bg-gray-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <a
                href="tel:+918807700880"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-dental-blue border border-dental-blue/20 hover:bg-dental-blue/5 transition-all"
              >
                <Phone size={16} />
                Call Now
              </a>
              <Link
                to="/contact"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold btn-primary"
              >
                <Calendar size={16} />
                Book Appointment
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-text-secondary hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 animate-slide-down">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'text-dental-blue bg-accent'
                      : 'text-text-secondary hover:bg-gray-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 space-y-3 border-t border-gray-100 mt-4">
                <a
                  href="tel:+918807700880"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-base font-medium text-dental-blue border border-dental-blue/20"
                >
                  <Phone size={18} />
                  Call Now
                </a>
                <Link
                  to="/contact"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-base font-semibold btn-primary"
                >
                  <Calendar size={18} />
                  Book Appointment
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
