"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiPhone, FiMapPin, FiClock, FiUser, FiSend, FiFileText, FiMessageSquare, FiStar, FiBriefcase, FiUpload, FiLock } from "react-icons/fi";
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from "react-icons/hi";
import { MdOutlineAccessTime } from "react-icons/md";
import { toast } from "sonner";

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState("Enquiry");
  const [submitting, setSubmitting] = useState(false);

  const [enqType, setEnqType] = useState("Enquiry");


  const [formData, setFormData] = useState<any>({
    name: "",
    email: "",
    phone: "",
    address: "",
    requirement: "",
    issueType: "",
    issueDescription: "",
    position: "",
    resume: null,
    coverLetter: "",
    rating: "",
    feedback: "",
    likeMost: "",
  });

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setEnqType(tab); // AUTO UPDATE
  };

  const handleInputChange = (e: any) => {
    const { name, value, files } = e.target;

    setFormData((prev: any) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };


const handleSubmit = async (e: any) => {
  e.preventDefault();
  setSubmitting(true);
  try {
    let payload: any = {
      enqType,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
    };

    if (enqType === "Enquiry") {
      payload.address = formData.address;
      payload.requirement = formData.requirement;
    }

    if (enqType === "Support") {
      payload.issueType = formData.issueType;
      payload.issueDescription = formData.issueDescription;
    }

    if (enqType === "Job Enquiry") {
      payload.position = formData.position;
      payload.coverLetter = formData.coverLetter || "";


      if (formData.resume) {
        payload.resumeUrl = formData.resume.name;
      }
    }

    if (enqType === "Feedback") {
      payload.rating = formData.rating;
      payload.feedback = formData.feedback;
      payload.likeMost = formData.likeMost || "";
    }
    const res = await fetch("/api/v1/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    setSubmitting(false);
    console.log("📩 API Response:", result);

    if (result.success) {
      toast.success("Message sent successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        requirement: "",
        issueType: "",
        issueDescription: "",
        position: "",
        resume: null,
        coverLetter: "",
        rating: "",
        feedback: "",
        likeMost: "",
      });
    } else {
      toast.error("Failed to send message. Try again.");
    }
  } catch (error) {
   
    toast.error("Something went wrong. Please try again later.");
  }
};


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

  <motion.div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10 sm:mb-12 px-2">
        {["Enquiry", "Support", "Job Enquiry", "Feedback"].map((tab, index) => (
          <motion.button
            key={tab}
            onClick={() => handleTabChange(tab)}    // <-- ONLY CHANGE
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

      {/* FORM SECTION */}
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 relative z-10">

        {/* Hidden ENQUIRY TYPE field */}
        <input type="hidden" name="enqType" value={enqType} />

        {/* Name */}
        <input
          name="name"
          onChange={handleInputChange}
          value={formData.name}
          required
          placeholder="Enter your full name"
          className="w-full px-4 py-2.5 border-2 rounded-lg"
        />

        {/* Email */}
        <input
          name="email"
          onChange={handleInputChange}
          value={formData.email}
          required
          placeholder="your.email@example.com"
          className="w-full px-4 py-2.5 border-2 rounded-lg"
        />

        {/* Phone */}
        <input
          name="phone"
          onChange={handleInputChange}
          value={formData.phone}
          required
          placeholder="+91 1234567890"
          className="w-full px-4 py-2.5 border-2 rounded-lg"
        />

        {/* CONDITIONAL FIELDS (unchanged UI, just added state bindings) */}
        {activeTab === "Enquiry" && (
          <>
            <input
              name="address"
              onChange={handleInputChange}
              value={formData.address}
              required
              placeholder="Enter your complete address"
              className="w-full px-4 py-2.5 border-2 rounded-lg"
            />

            <textarea
              name="requirement"
              onChange={handleInputChange}
              value={formData.requirement}
              required
              rows={4}
              placeholder="Tell us about your requirements..."
              className="w-full px-4 py-2.5 border-2 rounded-lg"
            />
          </>
        )}

        {activeTab === "Support" && (
          <>
            <select
              name="issueType"
              onChange={handleInputChange}
              value={formData.issueType}
              required
              className="w-full px-4 py-2.5 border-2 rounded-lg"
            >
              <option value="">Select issue type</option>
              <option value="technical">Technical Issue</option>
              <option value="billing">Billing Support</option>
              <option value="service">Service Related</option>
              <option value="account">Account Issue</option>
            </select>

            <textarea
              name="issueDescription"
              onChange={handleInputChange}
              value={formData.issueDescription}
              required
              rows={4}
              placeholder="Describe your issue..."
              className="w-full px-4 py-2.5 border-2 rounded-lg"
            />
          </>
        )}

        {activeTab === "Job Enquiry" && (
          <>
            <select
              name="position"
              onChange={handleInputChange}
              value={formData.position}
              required
              className="w-full px-4 py-2.5 border-2 rounded-lg"
            >
              <option value="">Select a position</option>
              <option value="software-engineer">Software Engineer</option>
              <option value="ui-ux-designer">UI/UX Designer</option>
              <option value="service-executive">Service Executive</option>
              <option value="customer-support">Customer Support</option>
            </select>

            <input
              type="file"
              name="resume"
              onChange={handleInputChange}
              required
              accept=".pdf,.doc,.docx"
              className="w-full px-4 py-2.5 border-2 rounded-lg"
            />

            <textarea
              name="coverLetter"
              onChange={handleInputChange}
              value={formData.coverLetter}
              rows={4}
              placeholder="Cover letter (optional)"
              className="w-full px-4 py-2.5 border-2 rounded-lg"
            />
          </>
        )}

        {activeTab === "Feedback" && (
          <>
            <select
              name="rating"
              onChange={handleInputChange}
              value={formData.rating}
              required
              className="w-full px-4 py-2.5 border-2 rounded-lg"
            >
              <option value="">Select Rating</option>
              <option value="5">5 Star</option>
              <option value="4">4 Star</option>
              <option value="3">3 Star</option>
              <option value="2">2 Star</option>
              <option value="1">1 Star</option>
            </select>

            <textarea
              name="feedback"
              onChange={handleInputChange}
              value={formData.feedback}
              required
              rows={4}
              placeholder="Share feedback..."
              className="w-full px-4 py-2.5 border-2 rounded-lg"
            />

            <input
              name="likeMost"
              onChange={handleInputChange}
              value={formData.likeMost}
              placeholder="What did you like most?"
              className="w-full px-4 py-2.5 border-2 rounded-lg"
            />
          </>
        )}

        {/* Submit Button (unchanged) */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-[#2B9EB3] to-[#1B7A8F] text-white py-3 rounded-lg font-bold"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : `Submit ${activeTab}`}
        </button>
      </form>

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
