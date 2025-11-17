"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { IndianRupee, Tag } from "lucide-react";

interface Category {
  _id: string;
  categoryName: string;
  categoryType: string;
  categoryDescription: string;
  categoryUnit: string;
  recommendationPrice: number;
  categoryMinPrice: number;
  categoryMaxPrice: number;
  categoryStatus: boolean;
  img: string;
}

interface CategoryCardProps {
  category: Category;
  onBookNow: () => void;
}

/**
 * CategoryCard Component
 * Displays category information with book now action
 * Follows SRP - Single responsibility of rendering category card
 */
export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onBookNow,
}) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200 hover:shadow-xl transition-all duration-300"
    >
      {/* Category Image */}
      <div className="relative h-48 w-full bg-gradient-to-br from-[#2B9EB3]/10 to-[#0A3D62]/10">
        {category.img ? (
          <Image
            src={category.img}
            alt={category.categoryName}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => {
              // Fallback to gradient if image fails to load
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="w-20 h-20 bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        )}

        {/* Category Type Badge */}
        <div className="absolute top-3 right-3">
          <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-[#0A3D62] flex items-center gap-1">
            <Tag className="w-3 h-3" />
            {category.categoryType}
          </span>
        </div>
      </div>

      {/* Category Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-xl font-bold text-[#0A3D62] mb-2 line-clamp-1">
          {category.categoryName}
        </h3>

        {/* Description */}
        <p className="text-slate-600 text-sm mb-4 line-clamp-2 min-h-[40px]">
          {category.categoryDescription || "Professional service available"}
        </p>

        {/* Price Info */}
        <div className="mb-4">
          {category.recommendationPrice > 0 && (
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-gradient-to-r from-[#2B9EB3]/10 to-[#0A3D62]/10 px-3 py-2 rounded-lg flex items-center gap-1">
                <IndianRupee className="w-4 h-4 text-[#0A3D62]" />
                <span className="text-lg font-bold text-[#0A3D62]">
                  {category.recommendationPrice}
                </span>
                {category.categoryUnit && (
                  <span className="text-xs text-slate-600">
                    / {category.categoryUnit}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Price Range */}
          {category.categoryMinPrice > 0 && category.categoryMaxPrice > 0 && (
            <p className="text-xs text-slate-500">
              Price range: ₹{category.categoryMinPrice} - ₹
              {category.categoryMaxPrice}
            </p>
          )}
        </div>

        {/* Book Now Button */}
        <Button
          onClick={onBookNow}
          className="w-full bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] hover:from-[#0A3D62] hover:to-[#2B9EB3] text-white font-semibold py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Book Now
        </Button>
      </div>
    </motion.div>
  );
};
