import { Link } from 'react-router-dom';
import {
  Calendar, Phone, CheckCircle2, Shield, Heart, Sparkles,
  Stethoscope, Baby, Zap, Smile, AlignLeft, Scissors,
  ArrowRight, Star, Users, Award, Building2,
  ShieldCheck, ClipboardCheck, Droplets, Eye
} from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import { useScrollReveal } from '../hooks/useScrollReveal';

function RevealSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-800 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

const heroFeatures = [
  'Experienced Dental Professionals',
  'Modern Dental Technology',
  'Child-Friendly Care',
  'Personalized Treatment Plans',
];

const trustStats = [
  { icon: Users, value: '10,000+', label: 'Happy Patients', color: 'text-dental-blue' },
  { icon: Building2, value: 'Modern', label: 'Dental Facilities', color: 'text-teal' },
  { icon: Award, value: 'Advanced', label: 'Treatment Technology', color: 'text-dental-blue' },
  { icon: Heart, value: 'Family', label: 'Friendly Environment', color: 'text-teal' },
];

const services = [
  { icon: Stethoscope, title: 'General Dentistry', desc: 'Comprehensive dental checkups, cleanings, and preventive care to maintain your oral health.' },
  { icon: Baby, title: 'Pediatric Dentistry', desc: 'Gentle, child-friendly dental care designed to make every visit comfortable and fun for kids.' },
  { icon: Shield, title: 'Root Canal Treatment', desc: 'Advanced pain-free root canal therapy to save your natural teeth and eliminate infection.' },
  { icon: Sparkles, title: 'Dental Implants', desc: 'Permanent tooth replacement solutions that look, feel, and function like natural teeth.' },
  { icon: AlignLeft, title: 'Orthodontics & Braces', desc: 'Modern orthodontic solutions for perfectly aligned teeth and a confident smile.' },
  { icon: Smile, title: 'Cosmetic Dentistry', desc: 'Smile makeovers including whitening, veneers, and aesthetic enhancements.' },
  { icon: Droplets, title: 'Teeth Cleaning & Scaling', desc: 'Professional deep cleaning to remove plaque, tartar, and prevent gum disease.' },
  { icon: Zap, title: 'Laser Dentistry', desc: 'Minimally invasive laser treatments for faster healing and greater comfort.' },
];

const whyChoose = [
  { icon: Zap, title: 'Advanced Dental Technology', desc: 'State-of-the-art equipment and modern techniques for precise, efficient dental care.' },
  { icon: Heart, title: 'Patient-Centered Care', desc: 'Every treatment plan is personalized to your unique needs, preferences, and comfort.' },
  { icon: ShieldCheck, title: 'Comfortable Treatment Experience', desc: 'A warm, welcoming environment designed to make every dental visit stress-free.' },
  { icon: Scissors, title: 'Highly Hygienic Environment', desc: 'International-standard sterilization and hygiene protocols for your safety.' },
  { icon: ClipboardCheck, title: 'Transparent Treatment Planning', desc: 'Clear communication about procedures, costs, and expected outcomes.' },
  { icon: Eye, title: 'Comprehensive Dental Solutions', desc: 'Complete range of dental services under one roof for the entire family.' },
];

const testimonials = [
  {
    name: 'Priya Krishnan',
    rating: 5,
    text: 'The team at SPS Dental is incredibly friendly and professional. They explained every step of my treatment clearly. My root canal was completely painless!',
    treatment: 'Root Canal Treatment',
  },
  {
    name: 'Rajesh Kumar',
    rating: 5,
    text: 'Best dental clinic in Madurai! The doctors are highly skilled and the clinic is very clean and modern. My kids love coming here for their dental checkups.',
    treatment: 'Pediatric Dentistry',
  },
  {
    name: 'Lakshmi Sundaram',
    rating: 5,
    text: 'I was nervous about getting dental implants, but the team made me feel so comfortable. The results are amazing — my new teeth look completely natural!',
    treatment: 'Dental Implants',
  },
];

export default function HomePage() {
  return (
    <main>
      {/* ============ HERO SECTION ============ */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNhKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==')] opacity-60" />

        {/* Floating Decorative Elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-teal/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="text-white animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-sm mb-8">
                <span className="w-2 h-2 bg-teal-light rounded-full animate-pulse" />
                Trusted Dental Care in Madurai
              </div>

              <h1
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-[3.5rem] font-extrabold leading-[1.1] mb-6"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Healthy Smiles Begin With{' '}
                <span className="text-teal-light">Expert Dental Care</span>
              </h1>

              <p className="text-lg sm:text-xl text-white/80 leading-relaxed mb-8 max-w-xl">
                Advanced dental treatments delivered with precision, comfort, and compassion. From routine checkups to specialized procedures, we help you achieve lasting oral health and confident smiles.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-dental-blue font-bold text-base hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
                >
                  <Calendar size={20} />
                  Book Appointment
                </Link>
                <a
                  href="tel:+918807700880"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-white/30 text-white font-semibold text-base hover:bg-white/10 transition-all"
                >
                  <Phone size={20} />
                  Call Now
                </a>
              </div>

              {/* Hero Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {heroFeatures.map((feature, i) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3 text-white/90 text-sm"
                    style={{ animationDelay: `${(i + 1) * 150}ms` }}
                  >
                    <CheckCircle2 size={18} className="text-teal-light flex-shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Hero Image & Floating Cards */}
            <div className="relative hidden lg:block animate-fade-in-right">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-teal/20 to-transparent rounded-3xl blur-2xl" />
                <img
                  src="https://images.pexels.com/photos/3884103/pexels-photo-3884103.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=600"
                  alt="Dentist caring for patient at SPS Dental Clinic"
                  className="relative rounded-3xl shadow-2xl w-full h-[500px] object-cover"
                />

                {/* Floating Card - Experience */}
                <div className="absolute -left-8 top-16 glass rounded-2xl px-5 py-4 animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-teal/20 flex items-center justify-center">
                      <Award size={22} className="text-white" />
                    </div>
                    <div>
                      <div className="text-white font-bold text-lg" style={{ fontFamily: 'var(--font-heading)' }}>Expert Team</div>
                      <div className="text-white/70 text-xs">Skilled Professionals</div>
                    </div>
                  </div>
                </div>

                {/* Floating Card - Patients */}
                <div className="absolute -right-6 bottom-24 glass rounded-2xl px-5 py-4 animate-float" style={{ animationDelay: '1.5s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">
                      <Users size={22} className="text-white" />
                    </div>
                    <div>
                      <div className="text-white font-bold text-lg" style={{ fontFamily: 'var(--font-heading)' }}>10,000+</div>
                      <div className="text-white/70 text-xs">Happy Patients</div>
                    </div>
                  </div>
                </div>

                {/* Floating Card - Rating */}
                <div className="absolute left-8 -bottom-6 glass rounded-2xl px-5 py-4 animate-float" style={{ animationDelay: '0.75s' }}>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <span className="text-white font-semibold text-sm ml-1">4.9/5</span>
                  </div>
                  <div className="text-white/70 text-xs mt-1">Patient Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L1440 60L1440 30C1440 30 1320 0 1080 0C840 0 720 30 480 30C240 30 120 0 0 0L0 60Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ============ TRUST INDICATORS ============ */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <RevealSection>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {trustStats.map((stat, i) => (
                <div
                  key={stat.label}
                  className="text-center p-6 lg:p-8 rounded-2xl bg-section-alt border border-gray-100 hover:border-teal/30 premium-card"
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
                    stat.color === 'text-dental-blue' ? 'bg-dental-blue/10' : 'bg-teal/10'
                  }`}>
                    <stat.icon size={26} className={stat.color} />
                  </div>
                  <div className={`text-2xl lg:text-3xl font-bold ${stat.color}`} style={{ fontFamily: 'var(--font-heading)' }}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-text-secondary mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ============ ABOUT PREVIEW ============ */}
      <section className="py-20 lg:py-28 bg-section-alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <RevealSection>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-dental-blue/10 to-teal/10 rounded-3xl blur-2xl" />
                <img
                  src="https://images.pexels.com/photos/5355863/pexels-photo-5355863.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=700"
                  alt="Modern dental facility at SPS Dental Clinic"
                  className="relative rounded-3xl shadow-xl w-full h-[400px] lg:h-[480px] object-cover"
                />
                <div className="absolute -bottom-6 -right-4 lg:-right-8 bg-white rounded-2xl shadow-xl px-6 py-5 max-w-[220px]">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart size={20} className="text-teal fill-teal" />
                    <span className="text-sm font-semibold text-text-primary" style={{ fontFamily: 'var(--font-heading)' }}>Patient First</span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Your comfort and well-being are at the heart of everything we do.
                  </p>
                </div>
              </div>
            </RevealSection>

            <RevealSection delay={200}>
              <div>
                <span className="inline-block px-4 py-1.5 rounded-full bg-accent text-teal text-xs font-semibold tracking-wider uppercase mb-4">
                  About Our Clinic
                </span>
                <h2
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary leading-tight mb-6"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Dedicated to Your{' '}
                  <span className="gradient-text">Oral Health</span>{' '}
                  & Comfort
                </h2>
                <p className="text-text-secondary leading-relaxed mb-6">
                  At SPS Multispeciality Dental Clinic, we believe that great dental care goes beyond treating teeth — it's about building lasting relationships, understanding your unique needs, and delivering treatments that truly make a difference.
                </p>
                <p className="text-text-secondary leading-relaxed mb-8">
                  Our clinic combines modern technology with a warm, welcoming environment to ensure every patient — from children to adults — receives the highest standard of care in complete comfort.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {['Patient Comfort', 'Ethical Treatments', 'Personalized Care', 'Modern Dentistry'].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-teal/10 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 size={18} className="text-teal" />
                      </div>
                      <span className="text-sm font-medium text-text-primary">{item}</span>
                    </div>
                  ))}
                </div>

                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl btn-primary text-sm font-semibold"
                >
                  Learn More About Us
                  <ArrowRight size={16} />
                </Link>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ============ SERVICES OVERVIEW ============ */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <RevealSection>
            <SectionHeading
              badge="Our Services"
              title="Comprehensive Dental Care Solutions"
              subtitle="From preventive care to advanced procedures, we offer a complete range of dental services tailored to every member of your family."
            />
          </RevealSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, i) => (
              <RevealSection key={service.title} delay={i * 80}>
                <div className="group p-6 lg:p-7 rounded-2xl bg-white border border-gray-100 hover:border-dental-blue/20 premium-card h-full flex flex-col">
                  <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mb-5 group-hover:bg-dental-blue/10 transition-colors">
                    <service.icon size={26} className="text-dental-blue" />
                  </div>
                  <h3
                    className="text-lg font-bold text-text-primary mb-3"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {service.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed mb-5 flex-1">
                    {service.desc}
                  </p>
                  <Link
                    to="/services"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-dental-blue hover:text-teal transition-colors group-hover:gap-2.5"
                  >
                    Learn More
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ============ WHY CHOOSE US ============ */}
      <section className="py-20 lg:py-28 bg-section-alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <RevealSection>
            <SectionHeading
              badge="Why Choose SPS Dental"
              title="What Makes Us Different"
              subtitle="We're committed to delivering dental care that exceeds expectations — combining expertise, technology, and genuine compassion."
            />
          </RevealSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {whyChoose.map((item, i) => (
              <RevealSection key={item.title} delay={i * 100}>
                <div className="p-7 lg:p-8 rounded-2xl bg-white border border-gray-100 premium-card h-full">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-dental-blue/10 to-teal/10 flex items-center justify-center mb-5">
                    <item.icon size={26} className="text-dental-blue" />
                  </div>
                  <h3
                    className="text-lg font-bold text-text-primary mb-3"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PATIENT EXPERIENCE / TESTIMONIALS ============ */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <RevealSection>
            <SectionHeading
              badge="Patient Stories"
              title="What Our Patients Say"
              subtitle="Real experiences from real patients. Their trust and satisfaction drive everything we do."
            />
          </RevealSection>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((t, i) => (
              <RevealSection key={t.name} delay={i * 150}>
                <div className="p-7 lg:p-8 rounded-2xl bg-section-alt border border-gray-100 premium-card h-full flex flex-col">
                  <div className="flex mb-4">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} size={18} className="text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-text-secondary leading-relaxed mb-6 flex-1 italic">
                    "{t.text}"
                  </p>
                  <div className="border-t border-gray-200 pt-5">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-dental-blue to-teal flex items-center justify-center text-white font-bold text-sm">
                        {t.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
                          {t.name}
                        </div>
                        <div className="text-xs text-teal font-medium">{t.treatment}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ============ APPOINTMENT CTA ============ */}
      <section className="py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNhKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==')] opacity-60" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <RevealSection>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-sm text-white mb-6">
              <Calendar size={16} />
              Schedule Your Visit
            </div>
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Ready For A{' '}
              <span className="text-teal-light">Healthier Smile?</span>
            </h2>
            <p className="text-lg text-white/80 leading-relaxed mb-10 max-w-2xl mx-auto">
              Take the first step towards better oral health. Book your appointment today and experience the difference of truly professional, compassionate dental care.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-dental-blue font-bold text-base hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
              >
                <Calendar size={20} />
                Book Appointment
              </Link>
              <a
                href="tel:+918807700880"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-white/30 text-white font-semibold text-base hover:bg-white/10 transition-all"
              >
                <Phone size={20} />
                Call Clinic
              </a>
            </div>
          </RevealSection>
        </div>
      </section>
    </main>
  );
}
