import { useState } from 'react';
import {
  Calendar, Phone, MapPin, Clock, Mail,
  MessageCircle, Send, CheckCircle2, User,
  FileText, CalendarDays
} from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { appointmentsDB, inquiriesDB } from '../admin/db/database';

function RevealSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

const treatments = [
  'General Checkup',
  'Teeth Cleaning',
  'Root Canal Treatment',
  'Dental Implants',
  'Orthodontics / Braces',
  'Cosmetic Dentistry',
  'Pediatric Dentistry',
  'Laser Dentistry',
  'Emergency Dental Care',
  'Other',
];

const contactDetails = [
  {
    icon: MapPin,
    title: 'Visit Our Clinic',
    lines: ['2/598, Thirumohoor Road,', 'Near Rishi Hospital, Othakadai,', 'Madurai, Tamil Nadu 625107'],
    color: 'dental-blue',
  },
  {
    icon: Phone,
    title: 'Call Us',
    lines: ['+91 88077 00880', '+91 80561 96016'],
    links: ['tel:+918807700880', 'tel:+918056196016'],
    color: 'teal',
  },
  {
    icon: Mail,
    title: 'Email Us',
    lines: ['info@spsdental.com'],
    links: ['mailto:info@spsdental.com'],
    color: 'dental-blue',
  },
  {
    icon: Clock,
    title: 'Working Hours',
    lines: ['Mon - Sat: 9:00 AM - 9:00 PM', 'Sunday: By Appointment'],
    color: 'teal',
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    treatment: '',
    date: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // If a date is selected, create an appointment; always create an inquiry for tracking
    if (formData.date) {
      appointmentsDB.create({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        treatment: formData.treatment || 'General Checkup',
        date: formData.date,
        time: '10:00', // Default time - admin can reschedule
        message: formData.message,
        status: 'new',
      });
    }
    // Always create an inquiry as well
    inquiriesDB.create({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: formData.treatment ? `Appointment Request: ${formData.treatment}` : 'General Inquiry',
      message: formData.message || 'Booking request from website',
    });
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
    setFormData({ name: '', phone: '', email: '', treatment: '', date: '', message: '' });
  };

  return (
    <main>
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNhKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==')] opacity-60" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-sm text-white mb-6">
            <Calendar size={16} />
            Schedule Your Visit
          </div>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Book Your <span className="text-teal-light">Dental Consultation</span>
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            Take the first step towards a healthier, more confident smile. Schedule your appointment or reach out to our friendly team.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L1440 60L1440 30C1440 30 1320 0 1080 0C840 0 720 30 480 30C240 30 120 0 0 0L0 60Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ============ QUICK CONTACT BUTTONS ============ */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="tel:+918807700880"
              className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-dental-blue text-white font-semibold hover:bg-dental-blue-dark transition-all shadow-md hover:shadow-lg"
            >
              <Phone size={20} />
              <span className="text-sm">Call Now</span>
            </a>
            <a
              href="https://wa.me/918807700880?text=Hello%2C%20I%20would%20like%20to%20book%20an%20appointment%20at%20SPS%20Dental%20Clinic."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-[#25D366] text-white font-semibold hover:bg-[#1da851] transition-all shadow-md hover:shadow-lg"
            >
              <MessageCircle size={20} />
              <span className="text-sm">WhatsApp</span>
            </a>
            <a
              href="mailto:info@spsdental.com"
              className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-teal text-white font-semibold hover:bg-teal-dark transition-all shadow-md hover:shadow-lg"
            >
              <Mail size={20} />
              <span className="text-sm">Email Us</span>
            </a>
            <a
              href="https://maps.google.com/?q=SPS+Multispeciality+Dental+Clinic+Othakadai+Madurai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-section-alt text-dental-blue font-semibold border border-dental-blue/20 hover:bg-dental-blue/5 transition-all"
            >
              <MapPin size={20} />
              <span className="text-sm">Get Directions</span>
            </a>
          </div>
        </div>
      </section>

      {/* ============ FORM + CONTACT INFO ============ */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Appointment Form */}
            <div className="lg:col-span-3">
              <RevealSection>
                <div className="bg-section-alt rounded-3xl p-8 lg:p-10 border border-gray-100">
                  <div className="mb-8">
                    <h2
                      className="text-2xl lg:text-3xl font-bold text-text-primary mb-3"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      Book an Appointment
                    </h2>
                    <p className="text-text-secondary text-sm">
                      Fill in the form below and we'll get back to you within 24 hours to confirm your appointment.
                    </p>
                  </div>

                  {isSubmitted ? (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 rounded-full bg-teal/10 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={40} className="text-teal" />
                      </div>
                      <h3 className="text-xl font-bold text-text-primary mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                        Thank You!
                      </h3>
                      <p className="text-text-secondary">
                        We've received your appointment request. Our team will contact you shortly to confirm.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-5">
                        {/* Name */}
                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-2">
                            Full Name *
                          </label>
                          <div className="relative">
                            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" />
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              required
                              placeholder="Your full name"
                              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-dental-blue/20 focus:border-dental-blue transition-all"
                            />
                          </div>
                        </div>

                        {/* Phone */}
                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-2">
                            Phone Number *
                          </label>
                          <div className="relative">
                            <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" />
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              required
                              placeholder="Your phone number"
                              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-dental-blue/20 focus:border-dental-blue transition-all"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-5">
                        {/* Email */}
                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-2">
                            Email Address
                          </label>
                          <div className="relative">
                            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" />
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="Your email address"
                              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-dental-blue/20 focus:border-dental-blue transition-all"
                            />
                          </div>
                        </div>

                        {/* Treatment */}
                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-2">
                            Treatment Required *
                          </label>
                          <div className="relative">
                            <FileText size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" />
                            <select
                              name="treatment"
                              value={formData.treatment}
                              onChange={handleChange}
                              required
                              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-dental-blue/20 focus:border-dental-blue transition-all appearance-none"
                            >
                              <option value="">Select treatment</option>
                              {treatments.map(t => (
                                <option key={t} value={t}>{t}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Date */}
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          Preferred Date
                        </label>
                        <div className="relative">
                          <CalendarDays size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" />
                          <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-dental-blue/20 focus:border-dental-blue transition-all"
                          />
                        </div>
                      </div>

                      {/* Message */}
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          Additional Message
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows={4}
                          placeholder="Tell us about your dental concern or any special requirements..."
                          className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-dental-blue/20 focus:border-dental-blue transition-all resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl btn-primary text-base font-semibold"
                      >
                        <Send size={18} />
                        Submit Appointment Request
                      </button>

                      <p className="text-xs text-text-light text-center">
                        We'll contact you within 24 hours to confirm your appointment. For urgent matters, please call us directly.
                      </p>
                    </form>
                  )}
                </div>
              </RevealSection>
            </div>

            {/* Contact Information */}
            <div className="lg:col-span-2">
              <RevealSection delay={200}>
                <div className="space-y-6">
                  {contactDetails.map((detail) => (
                    <div
                      key={detail.title}
                      className="p-6 rounded-2xl bg-section-alt border border-gray-100 premium-card"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          detail.color === 'dental-blue' ? 'bg-dental-blue/10' : 'bg-teal/10'
                        }`}>
                          <detail.icon size={22} className={detail.color === 'dental-blue' ? 'text-dental-blue' : 'text-teal'} />
                        </div>
                        <div>
                          <h3
                            className="text-base font-semibold text-text-primary mb-2"
                            style={{ fontFamily: 'var(--font-heading)' }}
                          >
                            {detail.title}
                          </h3>
                          {detail.lines.map((line, i) => (
                            detail.links && detail.links[i] ? (
                              <a
                                key={line}
                                href={detail.links[i]}
                                className="block text-sm text-text-secondary hover:text-dental-blue transition-colors"
                              >
                                {line}
                              </a>
                            ) : (
                              <p key={line} className="text-sm text-text-secondary">{line}</p>
                            )
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Directions */}
                  <div className="p-6 rounded-2xl bg-dental-blue text-white">
                    <h3
                      className="text-base font-semibold mb-3"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      How to Reach Us
                    </h3>
                    <div className="space-y-2 text-sm text-white/80">
                      <p>📍 Located on Thirumohoor Road, near Rishi Hospital</p>
                      <p>🚗 Easily accessible from Othakadai Junction</p>
                      <p>🅿️ Convenient parking available</p>
                      <p>🏥 Look for SPS Multispeciality Dental Clinic signboard</p>
                    </div>
                  </div>
                </div>
              </RevealSection>
            </div>
          </div>
        </div>
      </section>

      {/* ============ MAP SECTION ============ */}
      <section className="py-16 lg:py-24 bg-section-alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <RevealSection>
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 rounded-full bg-accent text-teal text-xs font-semibold tracking-wider uppercase mb-4">
                Find Us
              </span>
              <h2
                className="text-3xl sm:text-4xl font-bold text-text-primary mb-4"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Visit Our Clinic
              </h2>
              <p className="text-text-secondary max-w-xl mx-auto">
                Conveniently located in Othakadai, Madurai — easily accessible for patients across the city and surrounding areas.
              </p>
            </div>

            <div className="rounded-3xl overflow-hidden shadow-xl border border-gray-100">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3930.5!2d78.05!3d9.95!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOcKwNTcnMDAuMCJOIDc4wrAwMycwMC4wIkU!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="SPS Dental Clinic Location"
                className="w-full"
              />
            </div>

            <div className="mt-8 grid sm:grid-cols-3 gap-6">
              <div className="text-center p-6 rounded-2xl bg-white border border-gray-100">
                <MapPin size={24} className="text-dental-blue mx-auto mb-3" />
                <h4 className="font-semibold text-text-primary text-sm mb-1" style={{ fontFamily: 'var(--font-heading)' }}>Address</h4>
                <p className="text-xs text-text-secondary">2/598, Thirumohoor Road, Othakadai, Madurai - 625107</p>
              </div>
              <div className="text-center p-6 rounded-2xl bg-white border border-gray-100">
                <Clock size={24} className="text-teal mx-auto mb-3" />
                <h4 className="font-semibold text-text-primary text-sm mb-1" style={{ fontFamily: 'var(--font-heading)' }}>Hours</h4>
                <p className="text-xs text-text-secondary">Mon - Sat: 9 AM - 9 PM | Sun: By Appointment</p>
              </div>
              <div className="text-center p-6 rounded-2xl bg-white border border-gray-100">
                <Phone size={24} className="text-dental-blue mx-auto mb-3" />
                <h4 className="font-semibold text-text-primary text-sm mb-1" style={{ fontFamily: 'var(--font-heading)' }}>Phone</h4>
                <p className="text-xs text-text-secondary">+91 88077 00880 | +91 80561 96016</p>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>
    </main>
  );
}
