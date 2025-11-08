"use client";
import React from "react";
import { LayoutGrid } from "./ui/layout-grid";

export function LayoutGridDemo() {
  return (
    <div className="h-full w-full">
      <LayoutGrid cards={cards} />
    </div>
  );
}

const SkeletonOne = () => {
  return (
    <div>
      <p className="font-bold text-lg sm:text-xl md:text-2xl lg:text-4xl text-white">
        Manpower Solutions
      </p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-xs sm:text-sm md:text-base my-2 sm:my-4 max-w-lg text-neutral-200">
        1000+ skilled professionals ready to serve. Reliable workforce solutions 
        for rural and urban areas through our district franchises.
      </p>
    </div>
  );
};

const SkeletonTwo = () => {
  return (
    <div>
      <p className="font-bold text-lg sm:text-xl md:text-2xl lg:text-4xl text-white">
        Plumbing Services
      </p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-xs sm:text-sm md:text-base my-2 sm:my-4 max-w-lg text-neutral-200">
        Expert plumbers at your doorstep within 45 minutes. From repairs to installations, 
        we cover every block and panchayat across Odisha.
      </p>
    </div>
  );
};
const SkeletonThree = () => {
  return (
    <div>
      <p className="font-bold text-lg sm:text-xl md:text-2xl lg:text-4xl text-white">
        Tours & Travels
      </p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-xs sm:text-sm md:text-base my-2 sm:my-4 max-w-lg text-neutral-200">
        Safe and comfortable travel solutions across Odisha. Quick bookings 
        with reliable service for all your journey needs.
      </p>
    </div>
  );
};
const SkeletonFour = () => {
  return (
    <div>
      <p className="font-bold text-lg sm:text-xl md:text-2xl lg:text-4xl text-white">
        Architecture Services
      </p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-xs sm:text-sm md:text-base my-2 sm:my-4 max-w-lg text-neutral-200">
        Professional architectural consultation and design services. 
        Building dreams with expert guidance across every district.
      </p>
    </div>
  );
};

const cards = [
  {
    id: 1,
    content: <SkeletonOne />,
    className: "col-span-2 md:col-span-2",
    thumbnail:
      "/2.png",
  },
  {
    id: 2,
    content: <SkeletonTwo />,
    className: "col-span-1",
    thumbnail:
      "/1.png",
  },
  {
    id: 3,
    content: <SkeletonThree />,
    className: "col-span-1",
    thumbnail:
      "/3.png",
  },
  {
    id: 4,
    content: <SkeletonFour />,
    className: "col-span-2 md:col-span-2",
    thumbnail:
      "/4.png",
  },
];
