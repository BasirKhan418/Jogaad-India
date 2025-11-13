"use client";
import React, { useState, useEffect, memo, useCallback } from 'react';
import { FaStar } from 'react-icons/fa';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  rating: number;
  comment: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Marvin McKinney",
    role: "Directors",
    rating: 4.8,
    comment: "Clean & Shine did an amazing job with our deep clean. The team was punctual, professional, and thorough. Every corner of the house sparkles now! Will definitely hire them again.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&q=80"
  },
  {
    id: 2,
    name: "Andrea Silvana",
    role: "Directors",
    rating: 5.0,
    comment: "Clean & Shine did an amazing job with our deep clean. The team was punctual, professional, and thorough. Every corner of the house sparkles now! Will definitely hire them again.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&q=80"
  },
  {
    id: 3,
    name: "Andrea Silvana",
    role: "Directors",
    rating: 5.0,
    comment: "Clean & Shine did an amazing job with our deep clean. The team was punctual, professional, and thorough. Every corner of the house sparkles now! Will definitely hire them again.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&q=80"
  },
  {
    id: 4,
    name: "Marvin McKinney",
    role: "Directors",
    rating: 5.0,
    comment: "Clean & Shine did an amazing job with our deep clean. The team was punctual, professional, and thorough. Every corner of the house sparkles now! Will definitely hire them again.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&q=80"
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
    window.addEventListener('resize', checkMobile);
    
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

  const getVisibleTestimonials = useCallback(() => {
    const start = currentIndex * itemsPerView;
    return testimonials.slice(start, start + itemsPerView);
  }, [currentIndex, itemsPerView]);

  return (
    <section className="relative py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden" style={{ willChange: 'transform', transform: 'translateZ(0)' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgb(10, 61, 98) 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0A3D62]">
            What Our Client Says
          </h2>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative">
          <div className="overflow-hidden">
            <div className="flex gap-4 sm:gap-6 lg:gap-8 transition-all duration-500 ease-in-out">
              {getVisibleTestimonials().map((testimonial) => (
                <div
                  key={testimonial.id}
                  className={`${isMobile ? 'w-full' : 'w-1/2'} flex-shrink-0`}
                >
                  <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 h-full flex flex-col">
                    {/* Avatar and Rating */}
                    <div className="flex flex-col items-center mb-6">
                      <div className="relative mb-4">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                          <img
                            src={testimonial.image}
                            alt={testimonial.name}
                            loading="lazy"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      
                      {/* Star Rating */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, index) => (
                            <FaStar
                              key={index}
                              className={`w-4 h-4 sm:w-5 sm:h-5 ${
                                index < Math.floor(testimonial.rating)
                                  ? 'text-[#F9A825]'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[#0A3D62] font-bold text-sm sm:text-base">
                          {testimonial.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>

                    {/* Testimonial Text */}
                    <div className="flex-1 flex flex-col items-center text-center">
                      <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-6 italic">
                        "{testimonial.comment}"
                      </p>

                      {/* Name and Role */}
                      <div className="mt-auto">
                        <h4 className="text-[#0A3D62] font-bold text-lg sm:text-xl mb-1">
                          {testimonial.name}
                        </h4>
                        <p className="text-gray-500 text-sm sm:text-base">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {[...Array(maxIndex + 1)].map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2.5 sm:h-3 rounded-full transition-all duration-300 ${
                  currentIndex === index
                    ? 'w-8 sm:w-10 bg-[#5B4FD9]'
                    : 'w-2.5 sm:w-3 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Optional: Arrow Navigation for larger screens */}
          <div className="hidden md:block">
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white shadow-lg hover:shadow-xl border border-gray-200 flex items-center justify-center text-[#5B4FD9] hover:bg-[#5B4FD9] hover:text-white transition-all duration-300"
              aria-label="Previous testimonial"
            >
              <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white shadow-lg hover:shadow-xl border border-gray-200 flex items-center justify-center text-[#5B4FD9] hover:bg-[#5B4FD9] hover:text-white transition-all duration-300"
              aria-label="Next testimonial"
            >
              <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Swipe Hint */}
        <div className="md:hidden text-center mt-6 text-gray-500 text-sm">
          Swipe or use dots to navigate
        </div>
      </div>
    </section>
  );
});
