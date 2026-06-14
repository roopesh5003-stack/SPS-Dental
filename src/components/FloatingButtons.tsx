import { Phone, MessageCircle, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FloatingButtons() {
  return (
    <>
      {/* Desktop Floating Appointment Button */}
      <Link
        to="/contact"
        className="hidden lg:flex fixed right-6 bottom-24 z-40 items-center gap-2 px-5 py-3 rounded-full btn-primary text-sm font-semibold shadow-2xl hover:shadow-3xl"
      >
        <Calendar size={18} />
        Book Appointment
      </Link>

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/918807700880?text=Hello%2C%20I%20would%20like%20to%20book%20an%20appointment%20at%20SPS%20Dental%20Clinic."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed right-6 bottom-6 z-40 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={26} />
      </a>

      {/* Mobile Call Button */}
      <a
        href="tel:+918807700880"
        className="lg:hidden fixed left-6 bottom-6 z-40 w-14 h-14 rounded-full bg-dental-blue text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all"
        aria-label="Call Now"
      >
        <Phone size={24} />
      </a>
    </>
  );
}
