"use client";
import React, { memo, useState, useCallback, useEffect } from 'react';
import { FaStar, FaQuoteLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  review: string;
  service: string;
  image: string;
  accentColor: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Rajesh Kumar Patel",
    location: "Bhubaneswar, Odisha",
    rating: 5,
    review: "Jogaad India helped us find excellent manpower for our construction project. The workers were skilled, punctual, and the entire process was seamless. Highly recommend their services!",
    service: "Construction Services",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    accentColor: "from-[#F9A825] to-[#FF9800]"
  },
  {
    id: 2,
    name: "Priya Sharma",
    location: "Cuttack, Odisha",
    rating: 5,
    review: "When my father needed emergency medical assistance, Jogaad India arranged an ambulance within 30 minutes. Their quick response and professional healthcare support was life-saving. Forever grateful!",
    service: "Medical Services",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    accentColor: "from-[#2B9EB3] to-[#1B7A8F]"
  },
  {
    id: 3,
    name: "Amit Mishra",
    location: "Puri, Odisha",
    rating: 5,
    review: "Our college fest was a huge success thanks to Jogaad India's event management team. They handled everything from sound to decorations perfectly. Very professional and creative!",
    service: "Event Management",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    accentColor: "from-[#0A3D62] to-[#2B9EB3]"
  },
  {
    id: 4,
    name: "Sneha Dash",
    location: "Rourkela, Odisha",
    rating: 5,
    review: "Found the perfect plumber through Jogaad India for our new home. He was experienced, reasonable, and completed the work on time. Such a relief to have trusted service providers!",
    service: "Home Services",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    accentColor: "from-[#F9A825] to-[#FF9800]"
  }
];

export const TestimonialSection = memo(function TestimonialSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const itemsPerView = isMobile ? 1 : 2;
  const maxIndex = Math.ceil(testimonials.length / itemsPerView) - 1;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  return (
    <section className="relative py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white via-gray-50/30 to-white">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-[10%] w-72 h-72 bg-[#2B9EB3]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-[10%] w-96 h-96 bg-[#F9A825]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#2B9EB3]/10 rounded-full mb-4">
            <div className="w-2 h-2 bg-[#2B9EB3] rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-[#2B9EB3]">Client Testimonials</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-[#0A3D62]">What Our </span>
            <span className="bg-gradient-to-r from-[#2B9EB3] to-[#F9A825] bg-clip-text text-transparent">
              Clients Say
            </span>
          </h2>
          
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
            Real experiences from real people across Odisha who trust Jogaad India
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative max-w-6xl mx-auto">
          <div className="overflow-hidden rounded-3xl">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ 
                transform: `translateX(-${currentIndex * 100}%)` 
              }}
            >
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="w-full md:w-1/2 flex-shrink-0 p-3"
                >
                  {/* Card */}
                  <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-[#2B9EB3]/30 h-full">
                    {/* Accent Line */}
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${testimonial.accentColor} rounded-t-2xl`}></div>
                    
                    {/* Quote Background */}
                    <div className="absolute top-4 right-4 opacity-[0.07] pointer-events-none">
                      <FaQuoteLeft className="text-8xl text-[#2B9EB3]" />
                    </div>

                    <div className="relative p-6 sm:p-8">
                      {/* Profile Section */}
                      <div className="flex items-start gap-4 mb-6">
                        {/* Avatar with Glow */}
                        <div className="relative flex-shrink-0">
                          <div className={`absolute -inset-1 bg-gradient-to-r ${testimonial.accentColor} rounded-full opacity-40 blur-lg group-hover:opacity-60 transition-opacity`}></div>
                          <div className="relative w-16 h-16 sm:w-20 sm:h-20">
                            <img
                              src={testimonial.image}
                              alt={testimonial.name}
                              className="w-full h-full rounded-full object-cover border-4 border-white shadow-md"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=random&size=200`;
                              }}
                            />
                          </div>
                        </div>
                        
                        {/* Name and Rating */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg sm:text-xl font-bold text-[#0A3D62] mb-1">
                            {testimonial.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-500 mb-2 flex items-center gap-1">
                            <span>📍</span>
                            <span className="truncate">{testimonial.location}</span>
                          </p>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <FaStar 
                                key={i} 
                                className={`text-sm ${i < testimonial.rating ? 'text-[#F9A825]' : 'text-gray-300'}`}
                              />
                            ))}
                            <span className="ml-1 text-sm font-bold text-[#0A3D62]">{testimonial.rating}.0</span>
                          </div>
                        </div>
                      </div>

                      {/* Review */}
                      <div className="mb-6">
                        <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                          &ldquo;{testimonial.review}&rdquo;
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${testimonial.accentColor}`}>
                          {testimonial.service}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                          </svg>
                          Verified Client
                        </span>
                      </div>
                    </div>

                    {/* Hover Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.accentColor} opacity-0 group-hover:opacity-[0.02] transition-opacity rounded-2xl pointer-events-none`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-6 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-xl border-2 border-gray-100 flex items-center justify-center text-[#2B9EB3] hover:bg-[#2B9EB3] hover:text-white hover:border-[#2B9EB3] transition-all duration-300 z-10 group"
            aria-label="Previous"
          >
            <FaChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-6 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-xl border-2 border-gray-100 flex items-center justify-center text-[#2B9EB3] hover:bg-[#2B9EB3] hover:text-white hover:border-[#2B9EB3] transition-all duration-300 z-10 group"
            aria-label="Next"
          >
            <FaChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Dots Navigation */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  currentIndex === index
                    ? 'w-8 h-2.5 bg-[#2B9EB3]'
                    : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

TestimonialSection.displayName = "TestimonialSection";
