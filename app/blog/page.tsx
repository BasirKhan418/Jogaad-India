"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Cover } from "@/components/ui/cover";
import { DirectionAwareHover } from "@/components/ui/direction-aware-hover";
import { FiSearch, FiArrowRight, FiCalendar, FiClock } from "react-icons/fi";

const blogPosts = [
  {
    id: 1,
    title: "Empowering Minds, Shaping the Future.",
    description: "Colleges and universities both offer higher education, but they differ in their focus and scope. Colleges typically focus on undergraduate education and specialized...",
    fullDescription: "Colleges and universities both offer higher education, but they differ in their focus and scope. Colleges typically focus on undergraduate education and specialized programs, while universities offer a broader range of undergraduate and graduate programs.",
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2400&auto=format&fit=crop",
    category: "Colleges & Universities",
    date: "Nov 10, 2025",
    readTime: "5 min read",
    badge: "Education",
    badgeColor: "bg-purple-500"
  },
  {
    id: 2,
    title: "Compassionate Care, Anytime You Need.",
    description: "This includes resources like articles, videos, and infographics that explain medical conditions, treatments, and preventative measures. This information...",
    fullDescription: "Medical and healthcare services include comprehensive resources like articles, videos, and infographics that explain medical conditions, treatments, and preventative measures. This information empowers patients to make informed decisions about their health.",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2400&auto=format&fit=crop",
    category: "Medical & Healthcare",
    date: "Nov 9, 2025",
    readTime: "7 min read",
    badge: "Healthcare",
    badgeColor: "bg-red-500"
  },
  {
    id: 3,
    title: "Seamless Events, Unforgettable Memories.",
    description: "Event management content includes templates, checklists, marketing guides, and tools for planning, communication, social media, logistics......",
    fullDescription: "Event management content includes comprehensive templates, checklists, marketing guides, and tools for planning, communication, social media management, and logistics coordination to ensure seamless and unforgettable events.",
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2400&auto=format&fit=crop",
    category: "Event Management",
    date: "Nov 8, 2025",
    readTime: "6 min read",
    badge: "Events",
    badgeColor: "bg-blue-500"
  },
  {
    id: 4,
    title: "Reliable Workforce, Exceptional Results.",
    description: "Manpower refers to the available workforce for tasks. India's large, skilled labour force is a valuable global asset, especially in growing industries......",
    fullDescription: "Manpower refers to the available workforce for tasks. India's large, skilled labour force is a valuable global asset, especially in growing industries. Our manpower services connect you with reliable professionals.",
    image: "https://images.unsplash.com/photo-1664575602554-2087b04935a5?q=80&w=2400&auto=format&fit=crop",
    category: "Manpower",
    date: "Nov 7, 2025",
    readTime: "4 min read",
    badge: "Business",
    badgeColor: "bg-green-500"
  },
  {
    id: 5,
    title: "Reliable Rides, Unmatched Convenience.",
    description: "Vehicle services encompass a wide range of activities, from routine maintenance and repairs to registration and ownership transfer......",
    fullDescription: "Vehicle services encompass a wide range of activities, from routine maintenance and repairs to registration and ownership transfer. We provide comprehensive solutions for all your vehicle needs.",
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2400&auto=format&fit=crop",
    category: "Vehicle Services",
    date: "Nov 6, 2025",
    readTime: "5 min read",
    badge: "Transport",
    badgeColor: "bg-orange-500"
  },
  {
    id: 6,
    title: "Delicious Meals, Homely Comfort Every Time.",
    description: "Home cooking content can range from simple recipes and tips to elaborate culinary journeys, often shared through various platforms like blogs, social media, and video channels......",
    fullDescription: "Home cooking content can range from simple recipes and tips to elaborate culinary journeys, often shared through various platforms like blogs, social media, and video channels. Discover the joy of homemade meals.",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2400&auto=format&fit=crop",
    category: "Home Cook Services",
    date: "Nov 5, 2025",
    readTime: "8 min read",
    badge: "Lifestyle",
    badgeColor: "bg-yellow-500"
  },
  {
    id: 7,
    title: "Reliable Watch, Unwavering Protection – Every Time.",
    description: "Security guard content can explore various aspects of the profession, including skills, duties, training, and the importance of security in various settings. It can also focus on specific services like access control......",
    fullDescription: "Security guard content explores various aspects including professional skills, duties, comprehensive training programs, and the critical importance of security in various settings. Learn about access control, surveillance, and emergency response protocols.",
    image: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=2400&auto=format&fit=crop",
    category: "Security Guard",
    date: "Nov 4, 2025",
    readTime: "6 min read",
    badge: "Security",
    badgeColor: "bg-indigo-500"
  },
  {
    id: 8,
    title: "Fresh From Your Backyard – The Joy of Kitchen Gardening",
    description: "A kitchen garden is a space dedicated to growing herbs, vegetables, and sometimes fruits, directly accessible to the kitchen for easy use. It's essentially a food source...",
    fullDescription: "A kitchen garden is a dedicated space for growing fresh herbs, vegetables, and fruits directly accessible to your kitchen. It's a sustainable food source that promotes healthy eating and connects you with nature.",
    image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=2400&auto=format&fit=crop",
    category: "Kitchen Garden",
    date: "Nov 3, 2025",
    readTime: "7 min read",
    badge: "Lifestyle",
    badgeColor: "bg-green-600"
  },
  {
    id: 9,
    title: "Find Your Space – Comfortable Living, Hassle-Free Renting",
    description: "House rent content typically refers to the details and terms agreed upon in a rental agreement between a landlord and a tenant. This includes the amount of rent, payment terms, security deposit, property details...",
    fullDescription: "House rent services cover all aspects of rental agreements including rent amount, payment terms, security deposits, and property details. We make finding your perfect home easy and stress-free.",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2400&auto=format&fit=crop",
    category: "House Rent",
    date: "Nov 2, 2025",
    readTime: "5 min read",
    badge: "Property",
    badgeColor: "bg-teal-500"
  },
  {
    id: 10,
    title: "Secure Tomorrow – Trusted Insurance, Total Peace of Mind",
    description: "In today's fast-paced world, insurance services offer tailored plans, reliable coverage, and expert support, ensuring every step of life is protected with confidence, care, and commitment.",
    fullDescription: "Our insurance services provide comprehensive protection with tailored plans, reliable coverage, and expert support. We ensure every step of your life journey is secured with confidence, care, and unwavering commitment to your peace of mind.",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2400&auto=format&fit=crop",
    category: "Insurance Service",
    date: "Nov 1, 2025",
    readTime: "6 min read",
    badge: "Finance",
    badgeColor: "bg-blue-600"
  },
  {
    id: 11,
    title: "Power in Motion – Reliable Machinery Services, Anytime You Need",
    description: "In today's fast-paced world, machinery services offer expert maintenance, timely repairs, and high-performance support, ensuring every operation runs smoothly...",
    fullDescription: "Our machinery services provide expert maintenance, timely repairs, and high-performance support to keep your operations running smoothly. We ensure maximum uptime and efficiency for all your industrial equipment.",
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=2400&auto=format&fit=crop",
    category: "Machinery Service",
    date: "Oct 31, 2025",
    readTime: "5 min read",
    badge: "Industrial",
    badgeColor: "bg-gray-600"
  }
];

const categories = ["All", ...Array.from(new Set(blogPosts.map(post => post.badge)))].sort();

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "All" || post.badge === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  return (
    <div className="min-h-screen mt-10 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#F9A825]/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#2B9EB3]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

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

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block mb-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#F9A825]/10 to-[#2B9EB3]/10 border border-[#F9A825]/20 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2B9EB3] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2B9EB3]"></span>
              </span>
              <span className="text-sm font-bold text-[#0A3D62] tracking-wider">OUR BLOG & STORIES</span>
            </div>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-[#0A3D62] mb-6">
            Discover <Cover>Amazing Insights</Cover>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Explore our collection of stories, insights, and expertise across various service domains. 
            Stay updated with the latest trends and best practices.
          </p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-2xl mx-auto relative"
          >
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles, categories, topics..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#2B9EB3] focus:ring-4 focus:ring-[#2B9EB3]/10 outline-none transition-all duration-300 bg-white shadow-sm"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category, index) => (
              <motion.button
                key={category}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedCategory(category);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-[#2B9EB3] to-[#1B7A8F] text-white shadow-lg shadow-[#2B9EB3]/30"
                    : "bg-white text-gray-700 border-2 border-gray-200 hover:border-[#2B9EB3] hover:text-[#2B9EB3]"
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-8"
        >
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold text-[#2B9EB3]">{currentPosts.length}</span> of{" "}
            <span className="font-semibold text-[#2B9EB3]">{filteredPosts.length}</span> articles
          </p>
        </motion.div>

        {/* Blog Grid */}
        {currentPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {currentPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="relative h-full bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-[#2B9EB3] transition-all duration-500 hover:shadow-xl hover:shadow-[#2B9EB3]/20 hover:-translate-y-2">
                  {/* Image Container with Overlay */}
                  <div className="relative h-64 overflow-hidden bg-gray-100">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A3D62]/80 via-[#0A3D62]/40 to-transparent"></div>
                    <div className="absolute top-4 left-4 z-10">
                      <span className={`px-4 py-1.5 ${post.badgeColor} text-white text-xs font-bold rounded-full shadow-lg`}>
                        {post.badge}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Meta Info */}
                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <FiCalendar className="text-[#F9A825]" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiClock className="text-[#2B9EB3]" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-[#0A3D62] mb-3 group-hover:text-[#2B9EB3] transition-colors duration-300">
                      {post.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 mb-6 line-clamp-3">
                      {post.description}
                    </p>

                    {/* Read More Button */}
                    <button className="flex items-center gap-2 text-[#2B9EB3] font-semibold group-hover:gap-4 transition-all duration-300">
                      <span>Read More</span>
                      <FiArrowRight className="text-xl" />
                    </button>
                  </div>

                  {/* Decorative Bottom Border */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2B9EB3] to-[#F9A825] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-2xl font-bold text-[#0A3D62] mb-2">No articles found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center items-center gap-3"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#2B9EB3] to-[#1B7A8F] text-white hover:shadow-lg"
              }`}
            >
              Previous
            </motion.button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <motion.button
                  key={page}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCurrentPage(page)}
                  className={`w-12 h-12 rounded-xl font-semibold transition-all duration-300 ${
                    currentPage === page
                      ? "bg-gradient-to-r from-[#2B9EB3] to-[#1B7A8F] text-white shadow-lg"
                      : "bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200"
                  }`}
                >
                  {page}
                </motion.button>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#2B9EB3] to-[#1B7A8F] text-white hover:shadow-lg"
              }`}
            >
              Next
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
