import React from 'react'
import { CompanyInfoSection } from '@/components/about/company-info-section'
import { WhyJogaadSection } from '@/components/about/why-jogaad-section'
import { TestimonialsReviewSection } from '@/components/about/testimonials-review-section'
import { CoreAreaSection } from '@/components/home/core-area-section'
import { AppDownloadSection } from '@/components/home/app-download-section'

const page = () => {
  return (
    <div className="min-h-screen bg-white">
      <CompanyInfoSection />
      
      <WhyJogaadSection />
      
      <TestimonialsReviewSection />
      <CoreAreaSection />
      <AppDownloadSection />
    </div>
  )
}

export default page
