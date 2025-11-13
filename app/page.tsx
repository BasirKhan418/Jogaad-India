import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'

const ShaderBackground = dynamic(() => import('@/components/home/shader-background'), {
  loading: () => (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50 animate-pulse" />
  )
})

const ShaderHeroContent = dynamic(() => import('@/components/home/shader-hero-content'), {
  loading: () => (
    <div className="h-screen flex items-center justify-center">
      <div className="animate-pulse space-y-4 w-full max-w-3xl px-8">
        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
        <div className="h-12 bg-gray-300 rounded w-full"></div>
        <div className="h-6 bg-gray-200 rounded w-2/3"></div>
      </div>
    </div>
  )
})

const PulsingCircle = dynamic(() => import('@/components/home/pulsing-circle'), {
  loading: () => null
})

const ServicesSection = dynamic(() => import('@/components/home/services-section').then(mod => ({ default: mod.ServicesSection })), {
  loading: () => <div className="h-96 bg-gray-50 animate-pulse" />
})

const CoreAreaSection = dynamic(() => import('@/components/home/core-area-section').then(mod => ({ default: mod.CoreAreaSection })), {
  loading: () => <div className="h-96 bg-white animate-pulse" />
})

const AboutSection = dynamic(() => import('@/components/home/about-section').then(mod => ({ default: mod.AboutSection })), {
  loading: () => <div className="h-96 bg-gray-50 animate-pulse" />
})

const ConvenientServiceSection = dynamic(() => import('@/components/home/convenient-service-section').then(mod => ({ default: mod.ConvenientServiceSection })), {
  loading: () => <div className="h-96 bg-white animate-pulse" />
})

const BlogSection = dynamic(() => import('@/components/home/blog-section').then(mod => ({ default: mod.BlogSection })), {
  loading: () => <div className="h-96 bg-gray-50 animate-pulse" />
})

const TestimonialSection = dynamic(() => import('@/components/home/testimonial-section').then(mod => ({ default: mod.TestimonialSection })), {
  loading: () => <div className="h-96 bg-white animate-pulse" />
})

const AppDownloadSection = dynamic(() => import('@/components/home/app-download-section').then(mod => ({ default: mod.AppDownloadSection })), {
  loading: () => <div className="h-96 bg-gray-50 animate-pulse" />
})

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="relative">
        <Suspense fallback={
          <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2B9EB3]"></div>
          </div>
        }>
          <ShaderBackground>
            <ShaderHeroContent />
            <PulsingCircle />
          </ShaderBackground>
        </Suspense>
      </section>

      <Suspense fallback={<div className="h-96 bg-gray-50" />}>
        <ServicesSection />
      </Suspense>
      
      <Suspense fallback={<div className="h-96 bg-white" />}>
        <CoreAreaSection />
      </Suspense>
      
      <Suspense fallback={<div className="h-96 bg-gray-50" />}>
        <AboutSection />
      </Suspense>
      
      <Suspense fallback={<div className="h-96 bg-white" />}>
        <ConvenientServiceSection />
      </Suspense>
      
      <Suspense fallback={<div className="h-96 bg-gray-50" />}>
        <BlogSection />
      </Suspense>
      
      <Suspense fallback={<div className="h-96 bg-white" />}>
        <TestimonialSection />
      </Suspense>
      
      <Suspense fallback={<div className="h-96 bg-gray-50" />}>
        <AppDownloadSection />
      </Suspense>
    </div>
  )
}