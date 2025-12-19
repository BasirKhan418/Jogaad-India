"use client";

import React from "react";
import { motion } from "framer-motion";
import { CometCard } from "@/components/ui/comet-card";

const testimonials = [
  // {
  //   name: "Soumya Ranjan",
  //   text: "In my point of View's we would like to create an employment in every homes in life that nobody will tell to others that why you are in \" ବେକାର\" in your family. this is a message for my side to Human Society.",
  //   odia: "ମୋ ଦୃଷ୍ଟିକୋଣରୁ ଆମେ ଜୀବନରେ ପ୍ରତ୍ୟେକ ଘରେ ଏପରି ଏକ ନିଯୁକ୍ତି ସୃଷ୍ଟି କରିବାକୁ ଚାହୁଁଛୁ ଯେଉଁଥିରେ କେହି ଅନ୍ୟମାନଙ୍କୁ କହିବେ ନାହିଁ ଯେ ତୁମେ ତୁମର ପରିବାରରେ \"ବେକାର\" କାହିଁକି ଅଛ। ଏହା ମାନବ ସମାଜ ପାଇଁ ମୋର ପକ୍ଷରୁ ଏକ ବାର୍ତ୍ତା।"
  // },
  // {
  //   name: "S.Chandra",
  //   text: "\"Service for society is Service to God\". Needless to Say, Everybody should get work in their Life. As Per 3 C way of Policies Confidence, Concentration & Constant are the ways. which creates to active of minds to achieve the Goals & Success. Reduce the Unemployment & Increase the Employment is the first motto to focus our organization.",
  //   odia: "\"ସମାଜ ସେବା ହେଉଛି ଇଶ୍ୱରଙ୍କ ସେବା\"। କହିବା ଆବଶ୍ୟକ ନୁହେଁ, ପ୍ରତ୍ୟେକ ବ୍ୟକ୍ତି ନିଜ ଜୀବନରେ କାମ ପାଇବା ଉଚିତ। 3C ନୀତି ଅନୁସାରେ ଆତ୍ମବିଶ୍ୱାସ, ଏକାଗ୍ରତା ଏବଂ ସ୍ଥିରତା ହେଉଛି ସେହି ଉପାୟ ଯାହା ଲକ୍ଷ୍ୟ ଏବଂ ସଫଳତା ହାସଲ କରିବା ପାଇଁ ମାନସ ସକ୍ରିୟ କରିଥାଏ। ବେକାରୀ ହ୍ରାସ ଏବଂ ନିଯୁକ୍ତି ବୃଦ୍ଧି ହେଉଛି ଆମ ସଂଗଠନକୁ ଫୋକସ କରିବାର ପ୍ରଥମ ମୁଦ୍ରା।"
  // },
  {
    name: "G.Ranjan (Managing Director)",
    text: "Keep trying until you reach your Goal. therefore, to be Successful in life, hardwork & patience must be required.",
    odia: "ନିଜ ଲକ୍ଷ୍ୟରେ ପହଞ୍ଚିବା ପର୍ଯ୍ୟନ୍ତ ପ୍ରୟାସ ଜାରି ରଖନ୍ତୁ। ଜୀବନରେ ସଫଳ ହେବାକୁ ପରିଶ୍ରମ ଏବଂ ଧୈର୍ଯ୍ୟ ଥିବା ଆବଶ୍ୟକ"
  },
  {
    name: "Deepak Kumar (CEO)",
    text: "Provide services within less time and transparent way of effort with save your time is our motto.",
    odia: "କମ୍ ସମୟ ଏବଂ ସଫଳ ପ୍ରୟାସ ଓ ପାରଦର୍ଶୀ ସେବା ଯୋଗାଇବା ସହିତ ଆପଣଙ୍କ ସମୟ ସଞ୍ଚୟ କରିବା ଆମର ମୂଳଲକ୍ଷ୍ୟ।"
  }
];

export function TestimonialsReviewSection() {
  return (
    <section className="relative py-20 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-[#2B9EB3]/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#F9A825]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      {/* Animated Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgb(10, 61, 98) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(10, 61, 98) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px'
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#F9A825]/10 to-[#2B9EB3]/10 border border-[#F9A825]/20 backdrop-blur-sm mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2B9EB3] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2B9EB3]"></span>
            </span>
            <span className="text-sm font-bold text-[#0A3D62] tracking-wider">OUR FOUNDERS</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0A3D62] mb-4">
            What Our Founders Say
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from the visionaries behind Jogaad India
          </p>
        </div>

        {/* Testimonials Grid - Equal Height Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 auto-rows-fr">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex"
            >
              <CometCard className="w-full">
                <div className="relative bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-col min-h-[520px] hover:shadow-xl transition-shadow duration-300">
                  {/* Quote Icon */}
                  <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-gradient-to-br from-[#F9A825]/10 to-[#2B9EB3]/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#2B9EB3]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>

                  {/* Name */}
                  <h3 className="text-xl font-bold text-[#0A3D62] mb-4 pr-14">
                    {testimonial.name}
                  </h3>

                  {/* English Text */}
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                    {testimonial.text}
                  </p>

                  {/* Spacer to push Odia text and decorative bar to bottom */}
                  <div className="flex-grow"></div>

                  {/* Odia Text */}
                  <p className="text-sm text-gray-600 leading-relaxed border-t border-gray-200 pt-4 mt-4 italic" style={{ fontFamily: 'sans-serif' }}>
                    {testimonial.odia}
                  </p>

                  {/* Decorative Bottom Bar */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="h-1 w-12 bg-gradient-to-r from-[#F9A825] to-[#2B9EB3] rounded-full"></div>
                      <div className="w-2 h-2 rounded-full bg-[#2B9EB3]"></div>
                    </div>
                  </div>
                </div>
              </CometCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
