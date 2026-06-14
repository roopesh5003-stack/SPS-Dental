import { Link } from 'react-router-dom';
import {
  Calendar, Phone, Stethoscope, Baby, Shield, Sparkles,
  AlignLeft, Zap, Smile, Droplets, CheckCircle2,
  Heart
} from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

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

interface ServiceDetail {
  icon: React.ElementType;
  title: string;
  description: string;
  benefits: string[];
  process: string[];
  color: string;
}

const serviceCategories: ServiceDetail[] = [
  {
    icon: Stethoscope,
    title: 'General Dentistry',
    description: 'Comprehensive dental care focusing on prevention, diagnosis, and treatment of common dental conditions. Our general dentistry services form the foundation of lifelong oral health.',
    benefits: ['Complete dental checkups & examinations', 'Professional teeth cleaning & polishing', 'Tooth-colored fillings & restorations', 'Preventive care & oral health guidance'],
    process: ['Thorough oral examination', 'Digital X-rays if needed', 'Personalized treatment plan', 'Gentle, precise treatment'],
    color: 'dental-blue',
  },
  {
    icon: Baby,
    title: 'Pediatric Dentistry',
    description: 'Specialized dental care for children in a fun, friendly environment. Our pediatric dental team is trained to make every visit a positive experience for your child.',
    benefits: ['Child-friendly treatment approach', 'Preventive dental treatments', 'Oral health education for kids', 'Early detection of dental issues'],
    process: ['Warm welcome & comfort building', 'Gentle examination', 'Age-appropriate treatment', 'Parent guidance & home care tips'],
    color: 'teal',
  },
  {
    icon: Shield,
    title: 'Root Canal Therapy',
    description: 'Advanced, pain-free root canal treatment to save infected or damaged teeth. Our modern techniques ensure comfortable procedures with excellent success rates.',
    benefits: ['Pain relief from tooth infection', 'Preservation of natural tooth', 'Modern anesthesia for comfort', 'Long-lasting results'],
    process: ['Precise diagnosis with digital imaging', 'Complete anesthesia for comfort', 'Thorough cleaning of root canals', 'Sealed and restored tooth'],
    color: 'dental-blue',
  },
  {
    icon: Sparkles,
    title: 'Cosmetic Dentistry',
    description: 'Transform your smile with our range of cosmetic dental treatments. From whitening to complete smile makeovers, we help you achieve the smile you have always wanted.',
    benefits: ['Professional teeth whitening', 'Smile enhancement & design', 'Tooth reshaping & contouring', 'Natural-looking results'],
    process: ['Smile assessment & consultation', 'Custom treatment planning', 'Precise cosmetic procedures', 'Beautiful, lasting results'],
    color: 'teal',
  },
  {
    icon: AlignLeft,
    title: 'Orthodontics & Braces',
    description: 'Straighten your teeth and correct bite issues with modern orthodontic solutions. We offer various options to suit your lifestyle and treatment goals.',
    benefits: ['Metal & ceramic braces options', 'Smile alignment correction', 'Bite correction & jaw alignment', 'Improved oral health & confidence'],
    process: ['Orthodontic assessment', 'Custom treatment plan', 'Precise bracket placement', 'Regular adjustment & monitoring'],
    color: 'dental-blue',
  },
  {
    icon: Zap,
    title: 'Laser Dentistry',
    description: 'Experience the future of dental care with our advanced laser treatments. Minimally invasive procedures that offer faster healing, less discomfort, and superior results.',
    benefits: ['Minimally invasive procedures', 'Faster healing & recovery', 'Greater comfort during treatment', 'Precise & efficient treatment'],
    process: ['Assessment & treatment planning', 'Laser-assisted procedure', 'Minimal downtime', 'Quick recovery & follow-up'],
    color: 'teal',
  },
  {
    icon: Smile,
    title: 'Dental Implants',
    description: 'Permanent tooth replacement solutions that look, feel, and function like natural teeth. Dental implants are the gold standard for replacing missing teeth.',
    benefits: ['Permanent tooth replacement', 'Natural look & feel', 'Preserved facial structure', 'Improved chewing & speech'],
    process: ['Comprehensive evaluation', 'Implant placement surgery', 'Healing & osseointegration', 'Final crown placement'],
    color: 'dental-blue',
  },
  {
    icon: Droplets,
    title: 'Teeth Cleaning & Scaling',
    description: 'Professional deep cleaning services to remove plaque, tartar, and stains. Regular scaling is essential for preventing gum disease and maintaining oral health.',
    benefits: ['Removal of plaque & tartar', 'Prevention of gum disease', 'Fresher breath & cleaner teeth', 'Polishing for brighter smile'],
    process: ['Examination of gum health', 'Ultrasonic scaling treatment', 'Professional polishing', 'Oral hygiene guidance'],
    color: 'teal',
  },
];

export default function ServicesPage() {
  return (
    <main>
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNhKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==')] opacity-60" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-sm text-white mb-6">
            <Stethoscope size={16} />
            Complete Dental Solutions
          </div>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Our <span className="text-teal-light">Dental Services</span>
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            Comprehensive dental care solutions for every need — from preventive care and routine checkups to advanced restorative and cosmetic procedures.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L1440 60L1440 30C1440 30 1320 0 1080 0C840 0 720 30 480 30C240 30 120 0 0 0L0 60Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ============ SERVICES LIST ============ */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="space-y-16 lg:space-y-24">
            {serviceCategories.map((service, i) => (
              <RevealSection key={service.title}>
                <div
                  className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-center ${
                    i % 2 === 1 ? 'lg:direction-rtl' : ''
                  }`}
                >
                  {/* Content Side */}
                  <div className={`${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                      service.color === 'dental-blue' ? 'bg-dental-blue/10' : 'bg-teal/10'
                    }`}>
                      <service.icon size={32} className={service.color === 'dental-blue' ? 'text-dental-blue' : 'text-teal'} />
                    </div>
                    <h2
                      className="text-2xl sm:text-3xl font-bold text-text-primary mb-4"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {service.title}
                    </h2>
                    <p className="text-text-secondary leading-relaxed mb-8">
                      {service.description}
                    </p>

                    <div className="grid sm:grid-cols-2 gap-6 mb-8">
                      {/* Benefits */}
                      <div>
                        <h4 className="text-sm font-semibold text-dental-blue uppercase tracking-wider mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                          Key Benefits
                        </h4>
                        <div className="space-y-3">
                          {service.benefits.map((b) => (
                            <div key={b} className="flex items-start gap-2">
                              <CheckCircle2 size={16} className="text-teal flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-text-secondary">{b}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* Process */}
                      <div>
                        <h4 className="text-sm font-semibold text-dental-blue uppercase tracking-wider mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                          Our Process
                        </h4>
                        <div className="space-y-3">
                          {service.process.map((p, j) => (
                            <div key={p} className="flex items-start gap-3">
                              <span className="w-6 h-6 rounded-full bg-dental-blue/10 flex items-center justify-center flex-shrink-0 text-xs font-bold text-dental-blue">
                                {j + 1}
                              </span>
                              <span className="text-sm text-text-secondary">{p}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl btn-primary text-sm font-semibold"
                    >
                      <Calendar size={16} />
                      Book for {service.title}
                    </Link>
                  </div>

                  {/* Visual Side */}
                  <div className={`${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <div className={`rounded-3xl p-8 lg:p-12 h-full min-h-[300px] flex items-center justify-center ${
                      service.color === 'dental-blue' ? 'bg-gradient-to-br from-dental-blue/5 to-teal/5' : 'bg-gradient-to-br from-teal/5 to-dental-blue/5'
                    }`}>
                      <div className="text-center">
                        <div className={`w-24 h-24 rounded-3xl mx-auto mb-6 flex items-center justify-center ${
                          service.color === 'dental-blue' ? 'bg-dental-blue/10' : 'bg-teal/10'
                        }`}>
                          <service.icon size={48} className={service.color === 'dental-blue' ? 'text-dental-blue' : 'text-teal'} />
                        </div>
                        <h3 className="text-xl font-bold text-text-primary mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                          {service.title}
                        </h3>
                        <div className="flex items-center justify-center gap-2 text-sm text-teal font-medium">
                          <Heart size={14} className="fill-teal" />
                          Comfortable & Professional Care
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                {i < serviceCategories.length - 1 && (
                  <div className="border-b border-gray-100 mt-16 lg:mt-24" />
                )}
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <RevealSection>
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Not Sure Which Treatment You Need?
            </h2>
            <p className="text-lg text-white/80 leading-relaxed mb-10 max-w-2xl mx-auto">
              Schedule a consultation and let our dental experts assess your needs and recommend the best treatment plan for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-dental-blue font-bold hover:bg-gray-100 transition-all shadow-xl"
              >
                <Calendar size={20} />
                Book Consultation
              </Link>
              <a
                href="tel:+918807700880"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-all"
              >
                <Phone size={20} />
                Call Us
              </a>
            </div>
          </RevealSection>
        </div>
      </section>
    </main>
  );
}
