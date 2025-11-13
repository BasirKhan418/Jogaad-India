"use client";
import React, { useMemo, memo } from "react";
import { LayoutGrid } from "../ui/layout-grid";

const SkeletonOne = () => {
  return (
    <div className="relative h-full group">
      <div className="absolute inset-0 bg-gradient-to-br from-[#F9A825]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10 p-3 sm:p-4 md:p-6 flex flex-col justify-end h-full">
        <div className="space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full">
            <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#F9A825]" />
            <span className="text-xs font-semibold text-[#0A3D62]">Top Service</span>
          </div>
          <p className="font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-white drop-shadow-lg leading-tight">
            Manpower Solutions
          </p>
          <p className="font-normal text-xs sm:text-sm md:text-base text-white/90 leading-relaxed max-w-md">
            Skilled professionals ready to serve across all districts with verified expertise.
          </p>
        </div>
      </div>
    </div>
  );
};

const SkeletonTwo = () => {
  return (
    <div className="relative h-full group">
      <div className="absolute inset-0 bg-gradient-to-br from-[#2B9EB3]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10 p-3 sm:p-4 md:p-6 flex flex-col justify-end h-full">
        <div className="space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full">
            <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#2B9EB3]" />
            <span className="text-xs font-semibold text-[#0A3D62]">Fast Response</span>
          </div>
          <p className="font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl text-white drop-shadow-lg leading-tight">
            Plumbing Services
          </p>
          <p className="font-normal text-xs sm:text-sm text-white/90 leading-relaxed">
            Expert plumbers at your doorstep across every block in Odisha.
          </p>
        </div>
      </div>
    </div>
  );
};
const SkeletonThree = () => {
  return (
    <div className="relative h-full group">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A3D62]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10 p-3 sm:p-4 md:p-6 flex flex-col justify-end h-full">
        <div className="space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full">
            <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#0A3D62]" />
            <span className="text-xs font-semibold text-[#0A3D62]">Premium</span>
          </div>
          <p className="font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl text-white drop-shadow-lg leading-tight">
            Tours & Travels
          </p>
          <p className="font-normal text-xs sm:text-sm text-white/90 leading-relaxed">
            Safe and comfortable travel solutions with quick bookings across Odisha.
          </p>
        </div>
      </div>
    </div>
  );
};
const SkeletonFour = () => {
  return (
    <div className="relative h-full group">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1B7A8F]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10 p-3 sm:p-4 md:p-6 flex flex-col justify-end h-full">
        <div className="space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full">
            <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#1B7A8F]" />
            <span className="text-xs font-semibold text-[#0A3D62]">Professional</span>
          </div>
          <p className="font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-white drop-shadow-lg leading-tight">
            Architecture Services
          </p>
          <p className="font-normal text-xs sm:text-sm md:text-base text-white/90 leading-relaxed max-w-md">
            Expert architectural consultation and design services building dreams across districts.
          </p>
        </div>
      </div>
    </div>
  );
};

export function LayoutGridDemo() {
  const cards = useMemo(() => [
    {
      id: 1,
      content: <SkeletonOne />,
      className: "col-span-2 md:col-span-2",
      thumbnail: "/2.png",
    },
    {
      id: 2,
      content: <SkeletonTwo />,
      className: "col-span-1",
      thumbnail: "/1.png",
    },
    {
      id: 3,
      content: <SkeletonThree />,
      className: "col-span-1",
      thumbnail: "/3.png",
    },
    {
      id: 4,
      content: <SkeletonFour />,
      className: "col-span-2 md:col-span-2",
      thumbnail: "/4.png",
    },
  ], []);

  return (
    <div className="h-full w-full">
      <LayoutGrid cards={cards} />
    </div>
  );
}

export default memo(LayoutGridDemo);
