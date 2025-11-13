"use client";
import React, { memo } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { HiOutlineArrowNarrowRight } from 'react-icons/hi';
import Link from 'next/link';
import Image from 'next/image';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  gradient: string;
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Transforming Education in Rural Odisha",
    excerpt: "How accessible quality education is bridging the gap between urban and rural communities",
    category: "Education",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=600&fit=crop&q=80",
    gradient: "from-emerald-500/90 to-teal-600/90"
  },
  {
    id: 2,
    title: "Healthcare at Your Doorstep",
    excerpt: "Revolutionary medical services bringing expert care to every corner of the state",
    category: "Healthcare",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop",
    gradient: "from-blue-500/90 to-indigo-600/90"
  },
  {
    id: 3,
    title: "Creating Memories That Last",
    excerpt: "The art and science of orchestrating flawless events across diverse communities",
    category: "Events",
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=600&fit=crop",
    gradient: "from-violet-500/90 to-purple-600/90"
  }
];

export const BlogSection = memo(function BlogSection() {
  return (
    <section className="relative py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-white via-gray-50/50 to-white overflow-hidden">
      {/* Refined Background Elements */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-gradient-to-bl from-[#2B9EB3]/10 to-[#1B7A8F]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -left-20 w-[500px] h-[500px] bg-gradient-to-tr from-[#F9A825]/10 to-[#FF9800]/5 rounded-full blur-3xl" />
      
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `linear-gradient(to right, rgb(10, 61, 98) 1px, transparent 1px), linear-gradient(to bottom, rgb(10, 61, 98) 1px, transparent 1px)`,
        backgroundSize: '80px 80px'
      }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 sm:mb-12 lg:mb-14 gap-4 sm:gap-6">
          <div className="space-y-3 sm:space-y-4">
            {/* Section Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-gray-200 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#F9A825] to-[#2B9EB3]" />
              <span className="text-xs sm:text-sm font-bold bg-gradient-to-r from-[#0A3D62] to-[#2B9EB3] bg-clip-text text-transparent tracking-wide">INSIGHTS & STORIES</span>
            </div>
            
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0A3D62] mb-3">
                Latest Insights
              </h2>
              <p className="text-sm sm:text-base text-gray-600 max-w-2xl leading-relaxed">
                Discover stories, updates, and insights from across our service ecosystem
              </p>
            </div>
          </div>
          
          <Link 
            href="/blog" 
            className="group inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-[#2B9EB3] to-[#1B7A8F] text-white font-semibold text-sm shadow-lg hover:shadow-xl hover:from-[#3BB4CF] hover:to-[#2B9EB3] transition-all duration-300 whitespace-nowrap"
          >
            View All Posts
            <HiOutlineArrowNarrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>

        {/* Blog Cards Grid - Magazine Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {blogPosts.map((post, index) => (
            <Link 
              key={post.id}
              href="/coming-soon"
              className="group block h-full"
            >
              <article className="relative h-full flex flex-col">
                {/* Main Card with Artistic Overlap */}
                <div className="relative flex-1 flex flex-col">
                  {/* Image Container with Unique Shape */}
                  <div className="relative h-72 sm:h-80 overflow-hidden rounded-3xl bg-gradient-to-br from-gray-100 to-gray-50 shadow-xl">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-all duration-1000 ease-out group-hover:scale-105"
                      loading="lazy"
                      quality={75}
                    />
                    
                    {/* Artistic Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${post.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700 mix-blend-multiply`} />
                    
                    {/* Elegant Category Pill - Top */}
                    <div className="absolute top-6 left-6">
                      <div className="px-4 py-2 rounded-full bg-white/95 backdrop-blur-xl shadow-lg border border-white/20">
                        <span className="text-xs font-bold tracking-wider text-gray-800">{post.category.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content Card - Overlapping Bottom with Fixed Height */}
                  <div className="relative -mt-12 mx-4 sm:mx-6 bg-white rounded-2xl p-6 sm:p-7 shadow-2xl border border-gray-100 group-hover:shadow-3xl group-hover:-translate-y-2 transition-all duration-500 flex-1 flex flex-col">
                    {/* Decorative Accent */}
                    <div className="absolute top-0 left-6 w-12 h-1 bg-gradient-to-r from-[#F9A825] to-[#2B9EB3] -translate-y-6" />
                    
                    {/* Title - Fixed Height */}
                    <h3 className="text-xl sm:text-2xl font-bold text-[#0A3D62] mb-3 leading-tight group-hover:text-[#2B9EB3] transition-colors duration-300 min-h-[3.5rem] line-clamp-2">
                      {post.title}
                    </h3>

                    {/* Excerpt - Fixed Height */}
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-5 min-h-[4.5rem] line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    {/* Elegant Read More - Pushed to Bottom */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                      <span className="text-sm font-semibold text-[#2B9EB3] group-hover:text-[#0A3D62] transition-colors duration-300">
                        Explore Story
                      </span>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2B9EB3] to-[#1B7A8F] flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                        <FiArrowRight className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
});
