import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Calendar, ArrowRight } from 'lucide-react';

const quickLinks = [
  { name: 'Home', path: '/' },
  { name: 'About Us', path: '/about' },
  { name: 'Our Services', path: '/services' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Contact Us', path: '/contact' },
];

const services = [
  'General Dentistry',
  'Pediatric Dentistry',
  'Root Canal Treatment',
  'Dental Implants',
  'Orthodontics & Braces',
  'Cosmetic Dentistry',
  'Laser Dentistry',
  'Teeth Cleaning',
];

export default function Footer() {
  return (
    <footer className="bg-dental-blue text-white">
      {/* CTA Strip */}
      <div className="bg-gradient-to-r from-teal to-teal-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
              Ready to Transform Your Smile?
            </h3>
            <p className="text-white/80 text-sm mt-1">
              Schedule your consultation today and take the first step towards better oral health.
            </p>
          </div>
          <Link
            to="/contact"
            className="flex items-center gap-2 px-6 py-3 bg-white text-dental-blue rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl whitespace-nowrap"
          >
            <Calendar size={18} />
            Book Appointment
          </Link>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/20 to-teal/40 flex items-center justify-center text-white font-bold text-xl shadow-md" style={{ fontFamily: 'var(--font-heading)' }}>
                S
              </div>
              <div>
                <div className="text-xl font-bold leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                  SPS Dental
                </div>
                <div className="text-xs text-white/60 tracking-wider uppercase">
                  Multispeciality Clinic
                </div>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Advanced dental care delivered with precision, comfort, and compassion. Your trusted partner for complete oral health in Madurai.
            </p>
            <div className="flex gap-3">
              {['facebook', 'instagram', 'youtube'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                  aria-label={social}
                >
                  <span className="text-sm capitalize">{social[0].toUpperCase()}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="flex items-center gap-2 text-white/70 hover:text-teal-light transition-colors text-sm group"
                  >
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
              Our Services
            </h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <Link
                    to="/services"
                    className="flex items-center gap-2 text-white/70 hover:text-teal-light transition-colors text-sm group"
                  >
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
              Contact Info
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin size={16} />
                </div>
                <div>
                  <p className="text-sm text-white/70 leading-relaxed">
                    2/598, Thirumohoor Road, Near Rishi Hospital, Othakadai, Madurai, Tamil Nadu 625107
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Phone size={16} />
                </div>
                <div>
                  <a href="tel:+918807700880" className="block text-sm text-white/70 hover:text-teal-light transition-colors">
                    +91 88077 00880
                  </a>
                  <a href="tel:+918056196016" className="block text-sm text-white/70 hover:text-teal-light transition-colors">
                    +91 80561 96016
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Mail size={16} />
                </div>
                <a href="mailto:info@spsdental.com" className="text-sm text-white/70 hover:text-teal-light transition-colors">
                  info@spsdental.com
                </a>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock size={16} />
                </div>
                <div>
                  <p className="text-sm text-white/90 font-medium">Working Hours</p>
                  <p className="text-sm text-white/70">Mon - Sat: 9:00 AM - 9:00 PM</p>
                  <p className="text-sm text-white/70">Sun: By Appointment</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/50 text-center sm:text-left">
            © {new Date().getFullYear()} SPS Multispeciality Dental Clinic. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-white/50">
            <a href="#" className="hover:text-white/80 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white/80 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
