"use client";
import React from 'react';
import { FiArrowRight, FiClock } from 'react-icons/fi';
import Link from 'next/link';
import { CometCard } from './ui/comet-card';

interface BlogPost {
  id: number;
  title: string;
  description: string;
  category: string;
  date: string;
  image: string;
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Empowering Minds, Shaping the Future",
    description: "Colleges and universities both offer higher education, but they differ in their focus and scope. Colleges typically focus on undergraduate education and specialized.....",
    category: "Colleges & University Blogs",
    date: "Dec 24, 2024",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=600&fit=crop&q=80"
  },
  {
    id: 2,
    title: "Compassionate Care, Anytime You Need.",
    description: "This includes resources like articles, videos, and infographics that explain medical conditions, treatments, and preventative measures. This information ....",
    category: "Medical & Healthcare",
    date: "Dec 24, 2024",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop"
  },
  {
    id: 3,
    title: "Seamless Events, Unforgettable Memories.",
    description: "Event management content includes templates, checklists, marketing guides, and tools for planning, communication, social media, logistics ......",
    category: "Event Management",
    date: "Dec 24, 2024",
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=600&fit=crop"
  }
];

export const BlogSection = () => {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgb(10, 61, 98) 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 sm:mb-16 gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0A3D62] mb-2">
              Latest Blog posts
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-[#F9A825] to-[#2B9EB3] rounded-full"></div>
          </div>
          <Link 
            href="/blog" 
            className="group flex items-center gap-2 text-[#2B9EB3] hover:text-[#0A3D62] font-semibold text-sm sm:text-base transition-colors duration-300"
          >
            Explore More
            <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {blogPosts.map((post) => (
            <CometCard 
              key={post.id}
              className="h-full"
            >
              <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#F9A825]/30 flex flex-col h-full">
                {/* Image Container - Fixed Height */}
                <div className="relative h-64 w-full overflow-hidden bg-gray-100">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{
                      backgroundImage: `url(${post.image})`,
                    }}
                  />
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 px-4 py-2 bg-gradient-to-r from-[#5B4FD9] to-[#7B6EE5] text-white text-xs sm:text-sm font-semibold rounded-lg shadow-lg">
                    {post.category}
                  </div>
                </div>

                {/* Content Container - Fixed Height with Flex */}
                <div className="p-6 flex flex-col flex-1">
                  {/* Date */}
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                    <FiClock className="w-4 h-4" />
                    <span>{post.date}</span>
                  </div>

                  {/* Title - Fixed Height with Line Clamp */}
                  <h3 className="text-xl font-bold text-[#0A3D62] mb-3 line-clamp-2 min-h-[3.5rem] group-hover:text-[#2B9EB3] transition-colors duration-300">
                    {post.title}
                  </h3>

                  {/* Description - Fixed Height with Line Clamp */}
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 min-h-[4.5rem] mb-4">
                    {post.description}
                  </p>

                  {/* Read More Link - Push to Bottom */}
                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <Link 
                      href={`/blog/${post.id}`}
                      className="group/link inline-flex items-center gap-2 text-[#2B9EB3] hover:text-[#0A3D62] font-semibold text-sm transition-colors duration-300"
                    >
                      Read More
                      <FiArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>
                </div>
              </div>
            </CometCard>
          ))}
        </div>
      </div>
    </section>
  );
};
