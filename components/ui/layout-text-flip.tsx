"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export const LayoutTextFlip = ({
  text = "Build Amazing",
  words = ["Landing Pages", "Component Blocks", "Page Sections", "3D Shaders"],
  duration = 3000,
}: {
  text: string;
  words: string[];
  duration?: number;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, duration);

    return () => clearInterval(interval);
  }, [words.length, duration]);

  return (
    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 sm:gap-2 md:gap-2.5">
      <motion.span
        layoutId="subtext"
        className="text-xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-tight drop-shadow-lg text-gray-900"
      >
        {text}
      </motion.span>

      <motion.span
        layout
        className="relative w-fit overflow-hidden rounded-lg sm:rounded-xl border border-transparent bg-gradient-to-br from-[#2B9EB3]/10 to-[#0A3D62]/10 px-2 py-1 sm:px-3 sm:py-1.5 md:px-3.5 md:py-1.5 lg:px-4 lg:py-2 font-sans text-xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-tight text-[#0A3D62] shadow-lg ring-1 ring-[#2B9EB3]/20 backdrop-blur-sm drop-shadow-lg dark:bg-gradient-to-br dark:from-[#2B9EB3]/20 dark:to-[#0A3D62]/20 dark:text-[#2B9EB3] dark:shadow-lg dark:ring-1 dark:ring-[#2B9EB3]/30"
      >
        <AnimatePresence mode="popLayout">
          <motion.span
            key={currentIndex}
            initial={{ y: -40, filter: "blur(10px)", opacity: 0 }}
            animate={{
              y: 0,
              filter: "blur(0px)",
              opacity: 1,
            }}
            exit={{ y: 50, filter: "blur(10px)", opacity: 0 }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
            }}
            className={cn("inline-block whitespace-nowrap")}
          >
            {words[currentIndex]}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </div>
  );
};
