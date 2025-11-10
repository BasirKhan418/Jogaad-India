"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiPhone, FiMapPin, FiClock, FiUser, FiSend, FiFileText, FiMessageSquare, FiStar, FiBriefcase, FiUpload, FiLock } from "react-icons/fi";
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from "react-icons/hi";
import { MdOutlineAccessTime } from "react-icons/md";
import { BiHome } from "react-icons/bi";

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState("Enquiry");

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#F9A825]/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#2B9EB3]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#0A3D62]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

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

      {/* Floating Dots */}
      <div 
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgb(249, 168, 37) 2px, transparent 0)`,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="relative z-10 container mx-auto px-4 py-16 sm:py-20 lg:py-24">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block mb-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#F9A825]/10 to-[#2B9EB3]/10 border border-[#F9A825]/20 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2B9EB3] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2B9EB3]"></span>
              </span>
              <span className="text-xs sm:text-sm font-semibold text-[#0A3D62]">GET IN TOUCH</span>
            </div>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-[#0A3D62] mb-4 sm:mb-6">
            Contact <span className="bg-gradient-to-r from-[#F9A825] to-[#2B9EB3] bg-clip-text text-transparent">Us</span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed px-4">
            We're here to help! Reach out to us for any inquiries, support, or feedback.
          </p>
        </motion.div>

        {/* Contact Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16"
        >
          {/* Send Email Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -8 }}
            className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 hover:border-purple-500/30 transition-all duration-300 shadow-lg hover:shadow-xl group cursor-pointer relative overflow-hidden"
          >
            {/* Background gradient effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative z-10">
              <motion.div 
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg"
              >
                <HiOutlineMail className="text-white text-3xl" />
              </motion.div>
              <h3 className="text-xl font-bold text-[#0A3D62] mb-4 text-center">Send Email</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p className="break-all text-center">jogaadindia@gmail.com</p>
                <p className="break-all text-center">hr@jogaadindia.com</p>
                <p className="break-all text-center">enquiry@jogaadindia.com</p>
                <p className="break-all text-center">support@jogaadindia.com</p>
                <p className="break-all text-center">feedback@jogaadindia.com</p>
              </div>
            </div>
          </motion.div>

          {/* Call Us Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -8 }}
            className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 hover:border-[#2B9EB3]/30 transition-all duration-300 shadow-lg hover:shadow-xl group cursor-pointer relative overflow-hidden"
          >
            {/* Background gradient effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative z-10">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 15 }}
                transition={{ duration: 0.3 }}
                className="w-20 h-20 bg-gradient-to-br from-[#2B9EB3] to-[#1B7A8F] rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg"
              >
                <HiOutlinePhone className="text-white text-3xl" />
              </motion.div>
              <h3 className="text-xl font-bold text-[#0A3D62] mb-4 text-center">Call Us Now</h3>
              <a href="tel:7609031417" className="text-3xl font-bold text-[#2B9EB3] text-center block hover:scale-105 transition-transform">
                7609031417
              </a>
            </div>
          </motion.div>

          {/* Location Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -8 }}
            className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 hover:border-[#F9A825]/30 transition-all duration-300 shadow-lg hover:shadow-xl group cursor-pointer relative overflow-hidden"
          >
            {/* Background gradient effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative z-10">
              <motion.div 
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="w-20 h-20 bg-gradient-to-br from-[#F9A825] to-[#E68900] rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg"
              >
                <HiOutlineLocationMarker className="text-white text-3xl" />
              </motion.div>
              <h3 className="text-xl font-bold text-[#0A3D62] mb-4 text-center">Location</h3>
              <p className="text-sm text-gray-600 text-center leading-relaxed">
                Lane-1, Gangotri Nagar,<br />
                Sisupalagada,<br />
                Bhubaneswar, Odisha,<br />
                751002
              </p>
            </div>
          </motion.div>

          {/* Update Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -8 }}
            className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 hover:border-green-500/30 transition-all duration-300 shadow-lg hover:shadow-xl group cursor-pointer relative overflow-hidden"
          >
            {/* Background gradient effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative z-10">
              <motion.div 
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg"
              >
                <MdOutlineAccessTime className="text-white text-3xl" />
              </motion.div>
              <h3 className="text-xl font-bold text-[#0A3D62] mb-4 text-center">Update Info</h3>
              <div className="text-center">
                <p className="text-3xl font-bold text-[#2B9EB3]">24/7 Support</p>
                <p className="text-sm text-gray-600 mt-3">@45 minutes</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10 sm:mb-12 px-2"
        >
          {["Enquiry", "Support", "Job Enquiry", "Feedback"].map((tab, index) => (
            <motion.button
              key={tab}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab)}
              className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-semibold transition-all duration-300 ${
                activeTab === tab
                  ? "bg-gradient-to-r from-[#2B9EB3] to-[#1B7A8F] text-white shadow-lg shadow-[#2B9EB3]/30"
                  : "bg-white text-gray-700 border-2 border-gray-100 hover:border-[#2B9EB3] hover:shadow-md"
              }`}
            >
              {tab}
            </motion.button>
          ))}
        </motion.div>

        {/* Forms Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16"
        >
          {/* Form Image */}
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative h-[400px] sm:h-[500px] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl group"
          >
            <motion.img
              key={activeTab}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              src={
                activeTab === "Enquiry"
                  ? "https://images.unsplash.com/photo-1516534775068-ba3e7458af70?q=80&w=2400&auto=format&fit=crop"
                  : activeTab === "Support"
                  ? "https://images.unsplash.com/photo-1596524430615-b46475ddff6e?q=80&w=2400&auto=format&fit=crop"
                  : activeTab === "Job Enquiry"
                  ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2400&auto=format&fit=crop"
                  : "https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=2400&auto=format&fit=crop"
              }
              alt={activeTab}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A3D62]/90 via-[#0A3D62]/50 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-[#F9A825]/10 via-transparent to-[#2B9EB3]/10"></div>
            
            {/* Floating Card on Image */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl"
            >
              <h3 className="text-xl font-bold text-[#0A3D62] mb-2 flex items-center gap-2">
                {activeTab === "Enquiry" && <><FiFileText className="text-[#2B9EB3]" /> General Enquiries</>}
                {activeTab === "Support" && <><FiMessageSquare className="text-[#2B9EB3]" /> Technical Support</>}
                {activeTab === "Job Enquiry" && <><FiBriefcase className="text-[#2B9EB3]" /> Career Opportunities</>}
                {activeTab === "Feedback" && <><FiMessageSquare className="text-[#2B9EB3]" /> Share Your Experience</>}
              </h3>
              <p className="text-sm text-gray-600">
                {activeTab === "Enquiry" && "We're here to answer all your questions about our services"}
                {activeTab === "Support" && "Get help from our dedicated support team within 45 minutes"}
                {activeTab === "Job Enquiry" && "Join our growing team and build your career with Jogaad India"}
                {activeTab === "Feedback" && "Your feedback helps us improve and serve you better"}
              </p>
            </motion.div>
          </motion.div>

          {/* Form Content */}
          <motion.div 
            key={`form-${activeTab}`}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border-2 border-gray-100 shadow-2xl relative overflow-hidden"
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#F9A825]/5 to-[#2B9EB3]/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-[#2B9EB3]/5 to-[#F9A825]/5 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <motion.h2 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl sm:text-3xl font-bold text-[#0A3D62] mb-2"
              >
                {activeTab === "Enquiry" && "Share Your Requirements"}
                {activeTab === "Support" && "How Can We Help You?"}
                {activeTab === "Job Enquiry" && "Apply for a Position"}
                {activeTab === "Feedback" && "We Value Your Feedback"}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-sm text-gray-600 mb-6"
              >
                Fill out the form below and we'll get back to you shortly
              </motion.p>
            </div>

            <form className="space-y-4 sm:space-y-5 relative z-10">
              {/* Name Field */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-sm font-semibold text-[#0A3D62] mb-2 flex items-center gap-2">
                  <FiUser className="text-[#2B9EB3]" /> Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  required
                  className="w-full px-4 py-2.5 sm:py-3 rounded-lg border-2 border-gray-100 focus:border-[#2B9EB3] focus:ring-4 focus:ring-[#2B9EB3]/10 outline-none transition-all text-gray-700 bg-white hover:border-[#2B9EB3]/50"
                />
              </motion.div>

              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label className="block text-sm font-semibold text-[#0A3D62] mb-2 flex items-center gap-2">
                  <FiMail className="text-[#2B9EB3]" /> Email *
                </label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  required
                  className="w-full px-4 py-2.5 sm:py-3 rounded-lg border-2 border-gray-100 focus:border-[#2B9EB3] focus:ring-4 focus:ring-[#2B9EB3]/10 outline-none transition-all text-gray-700 bg-white hover:border-[#2B9EB3]/50"
                />
              </motion.div>

              {/* Phone Field */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label className="block text-sm font-semibold text-[#0A3D62] mb-2 flex items-center gap-2">
                  <FiPhone className="text-[#2B9EB3]" /> Phone *
                </label>
                <input
                  type="tel"
                  placeholder="+91 1234567890"
                  required
                  className="w-full px-4 py-2.5 sm:py-3 rounded-lg border-2 border-gray-100 focus:border-[#2B9EB3] focus:ring-4 focus:ring-[#2B9EB3]/10 outline-none transition-all text-gray-700 bg-white hover:border-[#2B9EB3]/50"
                />
              </motion.div>

              {/* Conditional Fields Based on Tab */}
              {activeTab === "Enquiry" && (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <label className="block text-sm font-semibold text-[#0A3D62] mb-2 flex items-center gap-2">
                      <BiHome className="text-[#2B9EB3]" /> Address *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your complete address"
                      required
                      className="w-full px-4 py-2.5 sm:py-3 rounded-lg border-2 border-gray-100 focus:border-[#2B9EB3] focus:ring-4 focus:ring-[#2B9EB3]/10 outline-none transition-all text-gray-700 bg-white hover:border-[#2B9EB3]/50"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <label className="block text-sm font-semibold text-[#0A3D62] mb-2 flex items-center gap-2">
                      <FiFileText className="text-[#2B9EB3]" /> Your Requirement *
                    </label>
                    <textarea
                      placeholder="Tell us about your requirements in detail..."
                      rows={4}
                      required
                      className="w-full px-4 py-2.5 sm:py-3 rounded-lg border-2 border-gray-100 focus:border-[#2B9EB3] focus:ring-4 focus:ring-[#2B9EB3]/10 outline-none transition-all text-gray-700 bg-white resize-none hover:border-[#2B9EB3]/50"
                    ></textarea>
                  </motion.div>
                </>
              )}

              {activeTab === "Support" && (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <label className="block text-sm font-semibold text-[#0A3D62] mb-2 flex items-center gap-2">
                      <FiMessageSquare className="text-[#2B9EB3]" /> Issue Type *
                    </label>
                    <select 
                      required
                      className="w-full px-4 py-2.5 sm:py-3 rounded-lg border-2 border-gray-100 focus:border-[#2B9EB3] focus:ring-4 focus:ring-[#2B9EB3]/10 outline-none transition-all text-gray-700 bg-white cursor-pointer hover:border-[#2B9EB3]/50"
                    >
                      <option value="">Select issue type</option>
                      <option value="technical">Technical Issue</option>
                      <option value="billing">Billing Support</option>
                      <option value="service">Service Related</option>
                      <option value="account">Account Issue</option>
                      <option value="other">Other</option>
                    </select>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <label className="block text-sm font-semibold text-[#0A3D62] mb-2 flex items-center gap-2">
                      <FiFileText className="text-[#2B9EB3]" /> Description *
                    </label>
                    <textarea
                      placeholder="Please describe your issue in detail so we can help you better..."
                      rows={4}
                      required
                      className="w-full px-4 py-2.5 sm:py-3 rounded-lg border-2 border-gray-100 focus:border-[#2B9EB3] focus:ring-4 focus:ring-[#2B9EB3]/10 outline-none transition-all text-gray-700 bg-white resize-none hover:border-[#2B9EB3]/50"
                    ></textarea>
                  </motion.div>
                </>
              )}

              {activeTab === "Job Enquiry" && (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <label className="block text-sm font-semibold text-[#0A3D62] mb-2 flex items-center gap-2">
                      <FiBriefcase className="text-[#2B9EB3]" /> Position Applied For *
                    </label>
                    <select
                      required
                      className="w-full px-4 py-2.5 sm:py-3 rounded-lg border-2 border-gray-100 focus:border-[#2B9EB3] focus:ring-4 focus:ring-[#2B9EB3]/10 outline-none transition-all text-gray-700 bg-white cursor-pointer hover:border-[#2B9EB3]/50"
                    >
                      <option value="">Select a position</option>
                      <option value="software-engineer">Software Engineer</option>
                      <option value="ui-ux-designer">UI/UX Designer</option>
                      <option value="service-executive">Service Executive</option>
                      <option value="business-development">Business Development</option>
                      <option value="customer-support">Customer Support</option>
                      <option value="other">Other Position</option>
                    </select>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <label className="block text-sm font-semibold text-[#0A3D62] mb-2 flex items-center gap-2">
                      <FiUpload className="text-[#2B9EB3]" /> Upload Resume *
                    </label>
                    <input
                      type="file"
                      required
                      accept=".pdf,.doc,.docx"
                      className="w-full px-4 py-2.5 sm:py-3 rounded-lg border-2 border-gray-100 focus:border-[#2B9EB3] focus:ring-4 focus:ring-[#2B9EB3]/10 outline-none transition-all text-gray-700 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-[#2B9EB3] file:to-[#1B7A8F] file:text-white file:font-semibold file:cursor-pointer hover:file:shadow-lg file:transition-all"
                    />
                    <p className="text-xs text-gray-500 mt-2">Accepted formats: PDF, DOC, DOCX (Max 5MB)</p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                  >
                    <label className="block text-sm font-semibold text-[#0A3D62] mb-2 flex items-center gap-2">
                      <FiFileText className="text-[#2B9EB3]" /> Cover Letter (Optional)
                    </label>
                    <textarea
                      placeholder="Tell us why you'd be a great fit for this role..."
                      rows={4}
                      className="w-full px-4 py-2.5 sm:py-3 rounded-lg border-2 border-gray-100 focus:border-[#2B9EB3] focus:ring-4 focus:ring-[#2B9EB3]/10 outline-none transition-all text-gray-700 bg-white resize-none hover:border-[#2B9EB3]/50"
                    ></textarea>
                  </motion.div>
                </>
              )}

              {activeTab === "Feedback" && (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <label className="block text-sm font-semibold text-[#0A3D62] mb-2 flex items-center gap-2">
                      <FiStar className="text-[#2B9EB3]" /> Rate Your Experience *
                    </label>
                    <select 
                      required
                      className="w-full px-4 py-2.5 sm:py-3 rounded-lg border-2 border-gray-100 focus:border-[#2B9EB3] focus:ring-4 focus:ring-[#2B9EB3]/10 outline-none transition-all text-gray-700 bg-white cursor-pointer hover:border-[#2B9EB3]/50"
                    >
                      <option value="">Select your rating</option>
                      <option value="5">⭐⭐⭐⭐⭐ Excellent (5 Stars)</option>
                      <option value="4">⭐⭐⭐⭐ Very Good (4 Stars)</option>
                      <option value="3">⭐⭐⭐ Good (3 Stars)</option>
                      <option value="2">⭐⭐ Fair (2 Stars)</option>
                      <option value="1">⭐ Poor (1 Star)</option>
                    </select>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <label className="block text-sm font-semibold text-[#0A3D62] mb-2 flex items-center gap-2">
                      <FiMessageSquare className="text-[#2B9EB3]" /> Your Feedback *
                    </label>
                    <textarea
                      placeholder="Share your experience with us. Your feedback helps us improve our services..."
                      rows={4}
                      required
                      className="w-full px-4 py-2.5 sm:py-3 rounded-lg border-2 border-gray-100 focus:border-[#2B9EB3] focus:ring-4 focus:ring-[#2B9EB3]/10 outline-none transition-all text-gray-700 bg-white resize-none hover:border-[#2B9EB3]/50"
                    ></textarea>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                  >
                    <label className="block text-sm font-semibold text-[#0A3D62] mb-2 flex items-center gap-2">
                      <FiStar className="text-[#2B9EB3]" /> What did you like most?
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Quick response, Professional service, etc."
                      className="w-full px-4 py-2.5 sm:py-3 rounded-lg border-2 border-gray-100 focus:border-[#2B9EB3] focus:ring-4 focus:ring-[#2B9EB3]/10 outline-none transition-all text-gray-700 bg-white hover:border-[#2B9EB3]/50"
                    />
                  </motion.div>
                </>
              )}

              {/* Submit Button */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-gradient-to-r from-[#2B9EB3] via-[#1B7A8F] to-[#2B9EB3] bg-size-200 bg-pos-0 hover:bg-pos-100 text-white font-bold py-3 sm:py-4 rounded-lg shadow-lg hover:shadow-xl hover:shadow-[#2B9EB3]/40 transition-all duration-500 mt-2 flex items-center justify-center gap-2 group"
                style={{ backgroundSize: '200% auto' }}
              >
                <span>Submit {activeTab}</span>
                <svg 
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </motion.button>
              
              {/* Privacy Notice */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
                className="text-xs text-gray-500 text-center mt-4 flex items-center justify-center gap-2"
              >
                <FiLock className="text-green-600" />
                Your information is secure and will not be shared with third parties
              </motion.p>
            </form>
          </motion.div>
        </motion.div>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-gray-100 shadow-2xl overflow-hidden"
        >
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#F9A825]/10 to-[#2B9EB3]/10 border border-[#F9A825]/20 backdrop-blur-sm mb-4">
              <FiMapPin className="text-[#2B9EB3]" />
              <span className="text-xs sm:text-sm font-semibold text-[#0A3D62]">LOCATION</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0A3D62]">Find Us Here</h2>
          </div>
          <div className="rounded-xl overflow-hidden border-2 border-gray-100">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3743.8915157296665!2d85.84413477523483!3d20.22182858123312!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjDCsDEzJzE4LjYiTiA4NcKwNTAnNDguMiJF!5e0!3m2!1sen!2sin!4v1762807747536!5m2!1sen!2sin"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
            ></iframe>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
