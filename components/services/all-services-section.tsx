"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { CometCard } from "@/components/ui/comet-card";
import { FiSearch } from "react-icons/fi";

const services = [
    
  { title: "Financial Services", description: "We offer financial services including investment planning", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2400&auto=format&fit=crop", location: "India", category: "Finance" },
  { title: "Information Technology Services", description: "We provide IT services including software development", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2400&auto=format&fit=crop", location: "India", category: "Technology" },
  { title: "Legal Services", description: "We offer legal services including contract drafting", image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2400&auto=format&fit=crop", location: "India", category: "Professional" },
  
  { title: "Landscaping", description: "We provide landscaping services including garden design", image: "https://images.unsplash.com/photo-1558904541-efa843a96f01?q=80&w=2400&auto=format&fit=crop", location: "India", category: "Outdoor" },
  { title: "Software Services", description: "We offer software services including custom software development", image: "https://images.unsplash.com/photo-1605379399642-870262d3d051?q=80&w=2400&auto=format&fit=crop", location: "India", category: "Technology" },
  { title: "Sports Facilities", description: "We provide sports facility services including construction", image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=2400&auto=format&fit=crop", location: "India", category: "Sports" },
  
  { title: "Retail Services", description: "We provide retail services including store setup, inventory", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2400&auto=format&fit=crop", location: "India", category: "Retail" },
  { title: "Public Services", description: "We offer public services including community development", image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2400&auto=format&fit=crop", location: "India", category: "Public" },
  { title: "Catering Services", description: "We provide catering services including event catering", image: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2400&auto=format&fit=crop", location: "India", category: "Food" },
  
  { title: "Clubs", description: "We offer club services including event hosting, membership", image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2400&auto=format&fit=crop", location: "India", category: "Entertainment" },
  
  { title: "Childcare Services", description: "We provide childcare services including daycare", image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=2400&auto=format&fit=crop", location: "India", category: "Childcare" },
  { title: "Customs Tailoring", description: "We provide professional tailoring services including custom designs", image: "https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=2400&auto=format&fit=crop", location: "India", category: "Fashion" },
  { title: "Nail Arts", description: "We offer professional nail art services including manicures", image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=2400&auto=format&fit=crop", location: "India", category: "Beauty" },
  
  { title: "Sewing & Alterations", description: "We provide sewing and alteration services including repairs", image: "https://images.unsplash.com/photo-1597228146878-64f59a5c7d3e?q=80&w=2400&auto=format&fit=crop", location: "India", category: "Fashion" },
  { title: "Skin Care Treatment", description: "We offer professional skin care treatments including facials", image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2400&auto=format&fit=crop", location: "India", category: "Beauty" },
  { title: "Personal Assistant", description: "We provide personal assistant services including scheduling", image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=2400&auto=format&fit=crop", location: "India", category: "Personal" },
  
  { title: "Hair Stylists", description: "We provide professional hair styling services including haircuts", image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=2400&auto=format&fit=crop", location: "India", category: "Beauty" },
  { title: "Massage Therapy", description: "We offer massage therapy services including relaxation", image: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=2400&auto=format&fit=crop", location: "India", category: "Wellness" },
  { title: "Personal Coaching", description: "We provide personal coaching services including life coaching", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2400&auto=format&fit=crop", location: "India", category: "Personal" },
  
  { title: "Cab Services", description: "We offer reliable cab services including local and outstation travel", image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2400&auto=format&fit=crop", location: "India", category: "Transport" },
  
  { title: "Architects", description: "We provide architectural services including building design", image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2400&auto=format&fit=crop", location: "India", category: "Professional" },
  { title: "Dentists", description: "We provide professional dental services including check-ups", image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=2400&auto=format&fit=crop", location: "India", category: "Healthcare" },
  { title: "Insurance Brokers", description: "We offer insurance brokerage services including policy selection", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2400&auto=format&fit=crop", location: "India", category: "Finance" },
  
  { title: "Occupational Therapy", description: "We provide occupational therapy services including rehabilitation", image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2400&auto=format&fit=crop", location: "India", category: "Healthcare" },
  { title: "Psychologists", description: "We offer psychological services including counseling", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=2400&auto=format&fit=crop", location: "India", category: "Healthcare" },
  { title: "Designers", description: "We provide design services including graphic design", image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=2400&auto=format&fit=crop", location: "India", category: "Creative" },
  
  { title: "Financial Advisors", description: "We provide financial advisory services including investment", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2400&auto=format&fit=crop", location: "India", category: "Finance" },
  { title: "Photographers", description: "We provide professional photography services including event coverage", image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2400&auto=format&fit=crop", location: "India", category: "Creative" },
  { title: "Recruiters", description: "We offer recruitment services including talent acquisition", image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=2400&auto=format&fit=crop", location: "India", category: "Business" },
  
  { title: "Digital Journalism", description: "We provide digital journalism services including news reporting", image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2400&auto=format&fit=crop", location: "India", category: "Media" },
  { title: "Digital Marketing", description: "We offer digital marketing services including SEO", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2400&auto=format&fit=crop", location: "India", category: "Marketing" },
  { title: "Digital Publishing", description: "We provide digital publishing services including e-book creation", image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=2400&auto=format&fit=crop", location: "India", category: "Media" },
  
  { title: "Engineers", description: "We provide engineering services including project planning", image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=2400&auto=format&fit=crop", location: "India", category: "Professional" },
  { title: "Consultants", description: "We offer consulting services including business strategy", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2400&auto=format&fit=crop", location: "India", category: "Business" },
  { title: "Counseling Services", description: "We provide professional counseling services including mental health", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2400&auto=format&fit=crop", location: "India", category: "Healthcare" },

  { title: "Dieticians", description: "We offer dietician services including personalized meal plans", image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2400&auto=format&fit=crop", location: "India", category: "Healthcare" },
  
  { title: "Conferences", description: "We provide conference services including event planning", image: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2400&auto=format&fit=crop", location: "India", category: "Events" },
  { title: "Debt Collection", description: "We offer debt collection services including account recovery", image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2400&auto=format&fit=crop", location: "India", category: "Finance" },
  { title: "Office Space", description: "We provide office space solutions including rentals", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2400&auto=format&fit=crop", location: "India", category: "Property" },
  
  { title: "Project Management", description: "We offer project management services including planning", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2400&auto=format&fit=crop", location: "India", category: "Business" },
  
  { title: "Construction Services", description: "We provide construction services including building design", image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2400&auto=format&fit=crop", location: "India", category: "Construction" },
  { title: "Service Provider Benefits", description: "We provide service provider benefits services including health insurance", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=2400&auto=format&fit=crop", location: "India", category: "Business" },
  { title: "Payroll Services", description: "We offer payroll services including salary processing", image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2400&auto=format&fit=crop", location: "India", category: "Business" },
  
  { title: "Seminars", description: "We organize seminars including event planning", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2400&auto=format&fit=crop", location: "India", category: "Events" },
  { title: "Student Support Services", description: "We provide student support services including counseling", image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=2400&auto=format&fit=crop", location: "India", category: "Education" },
  { title: "Summer Camps", description: "We organize summer camps including recreational activities", image: "https://images.unsplash.com/photo-1504805572947-34fad45aed93?q=80&w=2400&auto=format&fit=crop", location: "India", category: "Education" },
  
  { title: "Early Childhood Services", description: "We provide early childhood services including daycare", image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=2400&auto=format&fit=crop", location: "India", category: "Childcare" },
  { title: "Urban Plannings", description: "We offer urban planning services including zoning infrastructure", image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2400&auto=format&fit=crop", location: "India", category: "Professional" },
  { title: "Job Training", description: "We provide job training services including skill development", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2400&auto=format&fit=crop", location: "India", category: "Education" },
  
  { title: "Garbage Collection", description: "We offer garbage collection services including waste pickup", image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2400&auto=format&fit=crop", location: "India", category: "Utilities" },
  
  { title: "Firefighting Services", description: "We provide firefighting services including fire prevention", image: "https://images.unsplash.com/photo-1584277261846-c6a1672ed979?q=80&w=2400&auto=format&fit=crop", location: "India", category: "Emergency" },
  { title: "Entrepreneur Services", description: "We offer entrepreneur services including business planning", image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=2400&auto=format&fit=crop", location: "India", category: "Business" }
];

const categories = ["All", ...Array.from(new Set(services.map(s => s.category || "Other")))];

export function AllServicesSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Filter and search logic
  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          service.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || service.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Pagination logic
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentServices = filteredServices.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

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

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#F9A825]/10 to-[#2B9EB3]/10 border border-[#F9A825]/20 backdrop-blur-sm mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2B9EB3] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2B9EB3]"></span>
            </span>
            <span className="text-sm font-bold text-[#0A3D62] tracking-wider">OUR SERVICES</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0A3D62] mb-4">
            Complete A to Z Services
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our comprehensive range of professional services across all sectors
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#2B9EB3] focus:ring-4 focus:ring-[#2B9EB3]/10 outline-none transition-all duration-300 bg-white shadow-sm"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-[#2B9EB3] to-[#1B7A8F] text-white shadow-lg shadow-[#2B9EB3]/30"
                    : "bg-white text-gray-700 border-2 border-gray-200 hover:border-[#2B9EB3] hover:text-[#2B9EB3]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Results Count */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold text-[#2B9EB3]">{currentServices.length}</span> of{" "}
              <span className="font-semibold text-[#2B9EB3]">{filteredServices.length}</span> services
            </p>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {currentServices.map((service, index) => (
            <motion.div
              key={`${service.title}-${index}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="h-full"
            >
              <CometCard 
                rotateDepth={8} 
                translateDepth={8}
                className="w-full h-full"
              >
                <div 
                  className="relative group w-full h-[360px] rounded-2xl p-5 border-2 border-white/90 flex flex-col overflow-hidden shadow-xl hover:shadow-2xl hover:border-[#2B9EB3]/50 transition-all duration-500 bg-white"
                >
                  {/* Background Patterns */}
                  <div 
                    className="absolute inset-0 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-300 z-0"
                    style={{
                      backgroundImage: `radial-gradient(circle at 2px 2px, rgb(43, 158, 179) 1.5px, transparent 0)`,
                      backgroundSize: '20px 20px'
                    }}
                  />
                  
                  {/* Decorative corner elements */}
                  <div className="absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 border-[#F9A825]/20 rounded-tl-2xl group-hover:border-[#F9A825]/40 transition-all duration-300 z-10" />
                  <div className="absolute bottom-0 right-0 w-12 h-12 border-r-2 border-b-2 border-[#2B9EB3]/20 rounded-br-2xl group-hover:border-[#2B9EB3]/40 transition-all duration-300 z-10" />
                  
                  {/* Image */}
                  <div className="w-full mb-4 flex-shrink-0 relative z-10">
                    <div className="relative overflow-hidden rounded-xl group-hover:shadow-lg transition-all duration-300">
                      <img
                        src={service.image}
                        height="200"
                        width="400"
                        className="h-40 w-full object-cover rounded-xl group-hover:scale-110 transition-all duration-500"
                        alt={service.title}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A3D62]/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-[#0A3D62] mb-2 flex-shrink-0 relative z-10 group-hover:text-[#2B9EB3] transition-colors duration-300 line-clamp-2">
                    {service.title}
                  </h3>

                  {/* Decorative line */}
                  <div className="w-10 h-1 bg-gradient-to-r from-[#F9A825] to-[#2B9EB3] rounded-full mb-2 group-hover:w-16 transition-all duration-300" />

                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-2 flex-1 relative z-10">
                    {service.description}
                  </p>

                  {/* Location & Button */}
                  <div className="flex items-center justify-between mt-auto relative z-10">
                    <div className="flex items-center gap-1 text-gray-600">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs font-medium">{service.location}</span>
                    </div>
                    
                    <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#2B9EB3] to-[#1B7A8F] text-white text-xs font-semibold hover:from-[#3BB4CF] hover:to-[#2B9EB3] transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
                      Book Now
                    </button>
                  </div>
                </div>
              </CometCard>
            </motion.div>
          ))}
        </div>

        {/* No Results Message */}
        {currentServices.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <FiSearch className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No services found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            {/* Previous Button */}
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-[#2B9EB3] border-2 border-[#2B9EB3] hover:bg-[#2B9EB3] hover:text-white shadow-md hover:shadow-lg"
              }`}
            >
              « Previous
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // Show first page, last page, current page, and pages around current
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg font-semibold transition-all duration-300 ${
                        currentPage === page
                          ? "bg-gradient-to-r from-[#2B9EB3] to-[#1B7A8F] text-white shadow-lg shadow-[#2B9EB3]/30"
                          : "bg-white text-gray-700 border-2 border-gray-200 hover:border-[#2B9EB3] hover:text-[#2B9EB3]"
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (page === currentPage - 2 || page === currentPage + 2) {
                  return <span key={page} className="text-gray-400">...</span>;
                }
                return null;
              })}
            </div>

            {/* Next Button */}
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-[#2B9EB3] border-2 border-[#2B9EB3] hover:bg-[#2B9EB3] hover:text-white shadow-md hover:shadow-lg"
              }`}
            >
              Next »
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
