import { Link } from 'react-router-dom';
import {
  Calendar, Heart, Target, Eye, Shield, Users,
  Award, CheckCircle2, ArrowRight, Sparkles,
  Stethoscope, Baby, BookOpen
} from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
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

const values = [
  { icon: Heart, title: 'Compassion', desc: 'Every patient is treated with genuine care, empathy, and respect.' },
  { icon: Shield, title: 'Integrity', desc: 'Honest treatment recommendations focused on your best interest.' },
  { icon: Award, title: 'Excellence', desc: 'Commitment to the highest standards of clinical quality and outcomes.' },
  { icon: Users, title: 'Inclusivity', desc: 'Welcoming patients of all ages — from toddlers to seniors.' },
  { icon: Sparkles, title: 'Innovation', desc: 'Embracing modern techniques and technology for better results.' },
  { icon: BookOpen, title: 'Education', desc: 'Empowering patients with knowledge for better oral health decisions.' },
];

const doctorHighlights = [
  'Pediatric dental expertise',
  'Gentle and compassionate patient care',
  'Family-focused dentistry approach',
  'Commitment to preventive care',
  'Experienced in advanced dental procedures',
  'Child-friendly treatment techniques',
];

export default function AboutPage() {
  return (
    <main>
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNhKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==')] opacity-60" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-sm text-white mb-6">
            <Heart size={16} />
            Get to Know Us
          </div>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            About <span className="text-teal-light">SPS Dental</span>
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            A modern dental care center dedicated to providing comfortable, patient-focused, advanced dental treatments for children, adults, and families in Madurai.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L1440 60L1440 30C1440 30 1320 0 1080 0C840 0 720 30 480 30C240 30 120 0 0 0L0 60Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ============ OUR STORY ============ */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <RevealSection>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-dental-blue/10 to-teal/10 rounded-3xl blur-2xl" />
                <img
                  src="https://images.pexels.com/photos/4269268/pexels-photo-4269268.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=700"
                  alt="Modern dental clinic interior"
                  className="relative rounded-3xl shadow-xl w-full h-[400px] lg:h-[480px] object-cover"
                />
              </div>
            </RevealSection>
            <RevealSection delay={200}>
              <div>
                <span className="inline-block px-4 py-1.5 rounded-full bg-accent text-teal text-xs font-semibold tracking-wider uppercase mb-4">
                  Our Story
                </span>
                <h2
                  className="text-3xl sm:text-4xl font-bold text-text-primary leading-tight mb-6"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Building Healthier Smiles, One Patient at a Time
                </h2>
                <p className="text-text-secondary leading-relaxed mb-5">
                  SPS Multispeciality Dental Clinic was founded with a clear vision — to bring world-class dental care to Madurai. From our very first day, we've been committed to making quality dental treatments accessible, comfortable, and patient-centered.
                </p>
                <p className="text-text-secondary leading-relaxed mb-5">
                  What started as a dream to create a dental clinic where patients feel truly cared for has grown into one of Madurai's most trusted dental care destinations. Our team of skilled dental professionals brings together years of expertise, continuous learning, and a genuine passion for helping people achieve their best smiles.
                </p>
                <p className="text-text-secondary leading-relaxed">
                  Today, we serve thousands of patients — from young children experiencing their first dental visit to seniors seeking restorative care — all with the same dedication to excellence and compassion that defines who we are.
                </p>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ============ MISSION / VISION ============ */}
      <section className="py-20 lg:py-28 bg-section-alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <RevealSection>
              <div className="p-8 lg:p-10 rounded-3xl bg-white border border-gray-100 shadow-sm h-full">
                <div className="w-16 h-16 rounded-2xl bg-dental-blue/10 flex items-center justify-center mb-6">
                  <Target size={30} className="text-dental-blue" />
                </div>
                <h3 className="text-2xl font-bold text-text-primary mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                  Our Mission
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  To deliver exceptional, patient-centered dental care that combines advanced technology with genuine compassion — making quality dental treatment comfortable, accessible, and trustworthy for every member of the community. We strive to educate, prevent, and treat with equal dedication.
                </p>
              </div>
            </RevealSection>
            <RevealSection delay={150}>
              <div className="p-8 lg:p-10 rounded-3xl bg-white border border-gray-100 shadow-sm h-full">
                <div className="w-16 h-16 rounded-2xl bg-teal/10 flex items-center justify-center mb-6">
                  <Eye size={30} className="text-teal" />
                </div>
                <h3 className="text-2xl font-bold text-text-primary mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                  Our Vision
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  To be Madurai's most trusted and recommended dental care center — recognized for clinical excellence, ethical practices, and a patient experience that sets new standards in dental healthcare. We envision a community where every individual has access to the dental care they deserve.
                </p>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ============ OUR VALUES ============ */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <RevealSection>
            <SectionHeading
              badge="Our Values"
              title="The Principles That Guide Us"
              subtitle="Every decision we make, every treatment we perform, is guided by our core values."
            />
          </RevealSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {values.map((val, i) => (
              <RevealSection key={val.title} delay={i * 100}>
                <div className="p-7 rounded-2xl bg-section-alt border border-gray-100 premium-card h-full">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-dental-blue/10 to-teal/10 flex items-center justify-center mb-5">
                    <val.icon size={26} className="text-dental-blue" />
                  </div>
                  <h3 className="text-lg font-bold text-text-primary mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                    {val.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{val.desc}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PATIENT-FIRST APPROACH ============ */}
      <section className="py-20 lg:py-28 bg-section-alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <RevealSection>
              <div>
                <span className="inline-block px-4 py-1.5 rounded-full bg-accent text-teal text-xs font-semibold tracking-wider uppercase mb-4">
                  Our Approach
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-text-primary leading-tight mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
                  A Patient-First Philosophy in Everything We Do
                </h2>
                <p className="text-text-secondary leading-relaxed mb-6">
                  We understand that visiting a dentist can be stressful. That's why we've designed every aspect of our clinic — from the comfortable waiting area to the gentle treatment approach — to ensure you feel relaxed and well-cared-for.
                </p>
                <div className="space-y-4 mb-8">
                  {[
                    'Thorough consultation before every procedure',
                    'Clear explanation of treatment options and costs',
                    'Pain management and comfort-focused techniques',
                    'Follow-up care and ongoing support',
                    'A welcoming environment for anxious patients',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle2 size={20} className="text-teal flex-shrink-0 mt-0.5" />
                      <span className="text-text-secondary text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </RevealSection>
            <RevealSection delay={200}>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-teal/10 to-dental-blue/10 rounded-3xl blur-2xl" />
                <img
                  src="https://images.pexels.com/photos/3884101/pexels-photo-3884101.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=700"
                  alt="Friendly dental consultation"
                  className="relative rounded-3xl shadow-xl w-full h-[400px] lg:h-[480px] object-cover"
                />
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ============ MEET THE DOCTOR ============ */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <RevealSection>
            <SectionHeading
              badge="Meet Our Doctor"
              title="Expert Care You Can Trust"
              subtitle="Led by experienced dental professionals committed to your health and comfort."
            />
          </RevealSection>

          <RevealSection delay={150}>
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-5 gap-8 items-center p-8 lg:p-12 rounded-3xl bg-section-alt border border-gray-100">
                {/* Doctor Image */}
                <div className="md:col-span-2">
                  <div className="relative">
                    <div className="absolute -inset-3 bg-gradient-to-br from-dental-blue/20 to-teal/20 rounded-3xl blur-xl" />
                    <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-br from-dental-blue/10 to-teal/10 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-dental-blue to-teal mx-auto mb-4 flex items-center justify-center">
                          <Stethoscope size={40} className="text-white" />
                        </div>
                        <p className="text-sm text-text-secondary font-medium">Professional Portrait</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Doctor Info */}
                <div className="md:col-span-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal/10 text-teal text-xs font-semibold mb-4">
                    <Baby size={14} />
                    Pediatric Dental Specialist
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-text-primary mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                    Dr. A. Dhanalakshmi
                  </h3>
                  <p className="text-teal font-medium mb-5">BDS, Pediatric Dentistry</p>
                  <p className="text-text-secondary leading-relaxed mb-6">
                    Dr. A. Dhanalakshmi brings a unique combination of clinical expertise and warm, compassionate care. With specialized training in pediatric dentistry, she has helped thousands of children and families achieve optimal oral health. Her gentle approach and detailed treatment explanations put patients of all ages at ease.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {doctorHighlights.map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-teal flex-shrink-0" />
                        <span className="text-sm text-text-secondary">{item}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-xl btn-primary text-sm font-semibold"
                  >
                    <Calendar size={16} />
                    Book Appointment
                  </Link>
                </div>
              </div>
            </div>
          </RevealSection>
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
              Experience the SPS Dental Difference
            </h2>
            <p className="text-lg text-white/80 leading-relaxed mb-10 max-w-2xl mx-auto">
              Visit our clinic and discover why patients across Madurai trust us with their dental care.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-dental-blue font-bold hover:bg-gray-100 transition-all shadow-xl"
              >
                <Calendar size={20} />
                Book Appointment
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-all"
              >
                Our Services
                <ArrowRight size={18} />
              </Link>
            </div>
          </RevealSection>
        </div>
      </section>
    </main>
  );
}
