import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Camera, Star, X, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
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

const galleryCategories = ['All', 'Clinic Interior', 'Treatment Rooms', 'Equipment', 'Patient Care'];

const galleryImages = [
  {
    src: 'https://images.pexels.com/photos/4269268/pexels-photo-4269268.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=700',
    alt: 'Modern dental clinic interior',
    category: 'Clinic Interior',
  },
  {
    src: 'https://images.pexels.com/photos/5355863/pexels-photo-5355863.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=700',
    alt: 'Clean treatment room',
    category: 'Treatment Rooms',
  },
  {
    src: 'https://images.pexels.com/photos/6629415/pexels-photo-6629415.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=700',
    alt: 'Advanced dental equipment',
    category: 'Equipment',
  },
  {
    src: 'https://images.pexels.com/photos/3884103/pexels-photo-3884103.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=700',
    alt: 'Doctor consulting with patient',
    category: 'Patient Care',
  },
  {
    src: 'https://images.pexels.com/photos/4269277/pexels-photo-4269277.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=700',
    alt: 'Dental chair in modern setting',
    category: 'Treatment Rooms',
  },
  {
    src: 'https://images.pexels.com/photos/6502543/pexels-photo-6502543.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=700',
    alt: 'Dental handpieces and instruments',
    category: 'Equipment',
  },
  {
    src: 'https://images.pexels.com/photos/3881181/pexels-photo-3881181.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=700',
    alt: 'Dentist examining patient',
    category: 'Patient Care',
  },
  {
    src: 'https://images.pexels.com/photos/532786/pexels-photo-532786.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=700',
    alt: 'Modern clinic facilities',
    category: 'Clinic Interior',
  },
  {
    src: 'https://images.pexels.com/photos/7800560/pexels-photo-7800560.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=700',
    alt: 'Child-friendly dental care',
    category: 'Patient Care',
  },
  {
    src: 'https://images.pexels.com/photos/5355723/pexels-photo-5355723.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=700',
    alt: 'Treatment explanation with dental model',
    category: 'Patient Care',
  },
  {
    src: 'https://images.pexels.com/photos/3884101/pexels-photo-3884101.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=700',
    alt: 'Friendly dental consultation',
    category: 'Clinic Interior',
  },
  {
    src: 'https://images.pexels.com/photos/6627574/pexels-photo-6627574.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=700',
    alt: 'Happy patient after treatment',
    category: 'Patient Care',
  },
];

const testimonials = [
  {
    name: 'Priya Krishnan',
    rating: 5,
    text: 'The team at SPS Dental is incredibly friendly and professional. They explained every step of my root canal treatment clearly. The procedure was completely painless — I was amazed! I now recommend SPS Dental to all my friends and family.',
    treatment: 'Root Canal Treatment',
    date: 'Recent Visit',
  },
  {
    name: 'Rajesh Kumar',
    rating: 5,
    text: 'Best dental clinic in Madurai without a doubt! The doctors are highly skilled and the clinic is very modern and clean. My children actually look forward to their dental checkups now. The pediatric team is wonderful with kids.',
    treatment: 'Pediatric Dentistry',
    date: 'Regular Patient',
  },
  {
    name: 'Lakshmi Sundaram',
    rating: 5,
    text: 'I was extremely nervous about getting dental implants, but Dr. Dhanalakshmi and her team made me feel so comfortable. The results are incredible — my new teeth look and feel completely natural. Thank you, SPS Dental!',
    treatment: 'Dental Implants',
    date: 'Recent Visit',
  },
  {
    name: 'Arun Venkatesh',
    rating: 5,
    text: 'I have been visiting SPS Dental for regular cleanings for over two years now. The hygiene standards are exceptional, the staff is always welcoming, and the treatments are always thorough. Five stars without hesitation!',
    treatment: 'Teeth Cleaning',
    date: 'Regular Patient',
  },
  {
    name: 'Meena Raghavan',
    rating: 5,
    text: 'The cosmetic dentistry work done on my teeth was outstanding. From the initial consultation to the final result, every step was handled with care and expertise. My smile has never looked better!',
    treatment: 'Cosmetic Dentistry',
    date: 'Recent Visit',
  },
  {
    name: 'Saravanan Murugan',
    rating: 5,
    text: 'As someone with dental anxiety, I was dreading my first visit. But the warm, patient approach of the entire team put me completely at ease. They took their time, explained everything, and made sure I was comfortable throughout.',
    treatment: 'General Dentistry',
    date: 'New Patient',
  },
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredImages = activeCategory === 'All'
    ? galleryImages
    : galleryImages.filter(img => img.category === activeCategory);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const nextImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredImages.length);
    }
  };
  const prevImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredImages.length) % filteredImages.length);
    }
  };

  return (
    <main>
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNhKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==')] opacity-60" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-sm text-white mb-6">
            <Camera size={16} />
            Our Gallery & Reviews
          </div>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Gallery & <span className="text-teal-light">Testimonials</span>
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            Take a virtual tour of our modern dental clinic and read what our patients have to say about their experience with us.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L1440 60L1440 30C1440 30 1320 0 1080 0C840 0 720 30 480 30C240 30 120 0 0 0L0 60Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ============ GALLERY ============ */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <RevealSection>
            <SectionHeading
              badge="Clinic Gallery"
              title="Explore Our Modern Facilities"
              subtitle="See our state-of-the-art dental clinic, advanced equipment, and comfortable treatment environment."
            />
          </RevealSection>

          {/* Category Filters */}
          <RevealSection>
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {galleryCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? 'bg-dental-blue text-white shadow-md'
                      : 'bg-section-alt text-text-secondary hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </RevealSection>

          {/* Gallery Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredImages.map((img, i) => (
              <RevealSection key={`${img.alt}-${i}`} delay={i * 80}>
                <div
                  className="group relative rounded-2xl overflow-hidden cursor-pointer premium-card"
                  onClick={() => openLightbox(i)}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-64 lg:h-72 object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="text-white font-medium text-sm">{img.alt}</p>
                    <p className="text-white/70 text-xs mt-1">{img.category}</p>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4" onClick={closeLightbox}>
          <button
            onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
          >
            <X size={24} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-4 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-4 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <ChevronRight size={24} />
          </button>
          <img
            src={filteredImages[lightboxIndex].src}
            alt={filteredImages[lightboxIndex].alt}
            className="max-w-full max-h-[85vh] rounded-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* ============ TESTIMONIALS ============ */}
      <section className="py-20 lg:py-28 bg-section-alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <RevealSection>
            <SectionHeading
              badge="Patient Reviews"
              title="What Our Patients Say"
              subtitle="Real stories from real patients who trust SPS Dental with their oral health."
            />
          </RevealSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((t, i) => (
              <RevealSection key={t.name} delay={i * 100}>
                <div className="p-7 lg:p-8 rounded-2xl bg-white border border-gray-100 premium-card h-full flex flex-col">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex">
                      {[...Array(t.rating)].map((_, j) => (
                        <Star key={j} size={18} className="text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <Quote size={28} className="text-dental-blue/15" />
                  </div>
                  <p className="text-text-secondary leading-relaxed mb-6 flex-1 text-sm">
                    "{t.text}"
                  </p>
                  <div className="border-t border-gray-100 pt-5">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-dental-blue to-teal flex items-center justify-center text-white font-bold text-sm">
                        {t.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
                          {t.name}
                        </div>
                        <div className="text-xs text-teal font-medium">{t.treatment} • {t.date}</div>
                      </div>
                    </div>
                  </div>
                </div>
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
              Join Our Growing Family of Happy Patients
            </h2>
            <p className="text-lg text-white/80 leading-relaxed mb-10 max-w-2xl mx-auto">
              Experience the quality of care that thousands of patients trust. Book your appointment today.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-dental-blue font-bold hover:bg-gray-100 transition-all shadow-xl"
            >
              <Calendar size={20} />
              Book Appointment
            </Link>
          </RevealSection>
        </div>
      </section>
    </main>
  );
}
