"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { usePublicCareers, PublicCareer } from "@/utils/careers/usePublicCareers";
import { Cover } from "@/components/ui/cover";
import { 
  IconMapPin, 
  IconBriefcase, 
  IconClock, 
  IconCurrencyRupee,
  IconBuilding,
  IconUserCheck,
  IconSearch,
  IconFilter,
  IconExternalLink
} from "@tabler/icons-react";
import { formatDistanceToNow } from "date-fns";

const CareersHero = () => {
  return (
    <section className="relative py-20 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
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

      <div className="relative z-10 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#F9A825]/10 to-[#2B9EB3]/10 border border-[#F9A825]/20 backdrop-blur-sm mb-6"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F9A825] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F9A825]"></span>
          </span>
          <span className="text-sm font-bold text-[#0A3D62] tracking-wider">JOIN OUR TEAM</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0A3D62] mb-6 leading-tight"
        >
          Build Your Career with <Cover>Jogaad India</Cover>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-neutral-600 max-w-3xl mx-auto mb-8"
        >
          Join a dynamic team that&apos;s revolutionizing service delivery across India. 
          Explore exciting opportunities and grow with us.
        </motion.p>
      </div>
    </section>
  );
};

interface CareerCardProps {
  career: PublicCareer;
}

const CareerCard: React.FC<CareerCardProps> = ({ career }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative bg-white rounded-2xl border border-neutral-200 hover:border-[#2B9EB3] shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
    >
      {/* Gradient Overlay on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F9A825]/5 to-[#2B9EB3]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-[#0A3D62] mb-2 group-hover:text-[#2B9EB3] transition-colors">
              {career.role}
            </h3>
            {career.department && (
              <div className="flex items-center gap-2 text-neutral-600 mb-2">
                <IconBuilding className="w-4 h-4" />
                <span className="text-sm font-medium">{career.department}</span>
              </div>
            )}
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            career.mode === 'remote' 
              ? 'bg-blue-100 text-blue-700'
              : career.mode === 'hybrid'
              ? 'bg-purple-100 text-purple-700'
              : 'bg-green-100 text-green-700'
          }`}>
            {career.mode}
          </span>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2 text-neutral-600">
            <IconMapPin className="w-4 h-4 text-[#2B9EB3]" />
            <span className="text-sm">{career.location}</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-600">
            <IconBriefcase className="w-4 h-4 text-[#2B9EB3]" />
            <span className="text-sm capitalize">{career.employmentType || 'full-time'}</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-600">
            <IconUserCheck className="w-4 h-4 text-[#2B9EB3]" />
            <span className="text-sm">{career.experience}</span>
          </div>
          {career.salary && (
            <div className="flex items-center gap-2 text-neutral-600">
              <IconCurrencyRupee className="w-4 h-4 text-[#2B9EB3]" />
              <span className="text-sm">{career.salary}</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-neutral-600 text-sm mb-4 line-clamp-3">
          {career.description}
        </p>

        {/* Skills */}
        {career.skills && career.skills.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {career.skills.slice(0, 5).map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
              {career.skills.length > 5 && (
                <span className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-xs font-medium">
                  +{career.skills.length - 5} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
          <div className="flex items-center gap-1 text-xs text-neutral-500">
            <IconClock className="w-3 h-3" />
            Posted {formatDistanceToNow(new Date(career.createdAt), { addSuffix: true })}
          </div>
          <a
            href={career.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#F9A825] to-[#2B9EB3] text-white font-semibold hover:shadow-lg transition-all duration-200 group"
          >
            Apply Now
            <IconExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export function CareersSection() {
  const { careers, loading, error } = usePublicCareers();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMode, setFilterMode] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");

  // Filter careers
  const filteredCareers = careers.filter((career) => {
    const matchesSearch = 
      career.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      career.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      career.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      career.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMode = filterMode === "all" || career.mode === filterMode;
    const matchesType = filterType === "all" || career.employmentType === filterType;

    return matchesSearch && matchesMode && matchesType;
  });

  return (
    <div className="min-h-screen bg-white">
      <CareersHero />

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center p-6 rounded-xl bg-gradient-to-br from-[#F9A825]/10 to-[#FF9800]/10 border border-[#F9A825]/20"
            >
              <div className="text-4xl font-bold text-[#0A3D62] mb-2">{careers.length}</div>
              <div className="text-neutral-600 font-medium">Open Positions</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center p-6 rounded-xl bg-gradient-to-br from-[#2B9EB3]/10 to-[#1B7A8F]/10 border border-[#2B9EB3]/20"
            >
              <div className="text-4xl font-bold text-[#0A3D62] mb-2">
                {new Set(careers.map(c => c.department).filter(Boolean)).size}
              </div>
              <div className="text-neutral-600 font-medium">Departments</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center p-6 rounded-xl bg-gradient-to-br from-[#0A3D62]/10 to-[#1B7A8F]/10 border border-[#0A3D62]/20"
            >
              <div className="text-4xl font-bold text-[#0A3D62] mb-2">
                {careers.filter(c => c.mode === 'remote').length}
              </div>
              <div className="text-neutral-600 font-medium">Remote Positions</div>
            </motion.div>
          </div>

          {/* Filters */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search by role, department, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B9EB3] focus:border-transparent"
                />
              </div>
              <select
                value={filterMode}
                onChange={(e) => setFilterMode(e.target.value)}
                className="px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B9EB3] focus:border-transparent"
              >
                <option value="all">All Modes</option>
                <option value="remote">Remote</option>
                <option value="offline">Offline</option>
                <option value="hybrid">Hybrid</option>
              </select>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B9EB3] focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>
          </div>

          {/* Career Listings */}
          {loading ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-gradient-to-r from-[#F9A825] to-[#2B9EB3] rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
              <p className="text-[#0A3D62] font-semibold">Loading careers...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-600 font-semibold mb-2">Failed to load careers</p>
              <p className="text-neutral-600">{error}</p>
            </div>
          ) : filteredCareers.length === 0 ? (
            <div className="text-center py-20">
              <IconBriefcase className="w-16 h-16 mx-auto mb-4 text-neutral-300" />
              <p className="text-neutral-600 text-lg font-medium mb-2">
                {searchTerm || filterMode !== "all" || filterType !== "all" 
                  ? "No careers match your filters" 
                  : "No open positions at the moment"}
              </p>
              <p className="text-neutral-500">
                {searchTerm || filterMode !== "all" || filterType !== "all"
                  ? "Try adjusting your search or filters"
                  : "Check back soon for new opportunities"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredCareers.map((career) => (
                <CareerCard key={career._id} career={career} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
