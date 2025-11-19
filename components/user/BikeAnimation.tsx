"use client";

import React from "react";
import { motion } from "framer-motion";
import { Bike } from "lucide-react";

export const BikeAnimation = () => {
  return (
    <div className="w-full h-16 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg overflow-hidden relative border border-neutral-200 dark:border-neutral-700 flex items-center">
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <div className="w-full h-[1px] bg-neutral-900 dark:bg-neutral-100 dashed-line"></div>
      </div>
      
      <motion.div
        className="absolute left-0"
        animate={{
          x: ["-10%", "110%"],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <div className="relative">
          <Bike className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <motion.div 
            className="absolute -bottom-1 left-1 w-6 h-1 bg-black/10 rounded-full blur-[2px]"
            animate={{ scaleX: [0.8, 1.2, 0.8] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        </div>
      </motion.div>
      
      <div className="w-full text-center z-10">
        <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400 bg-white/80 dark:bg-neutral-900/80 px-2 py-1 rounded-full backdrop-blur-sm">
          Assigning nearby engineer...
        </span>
      </div>
    </div>
  );
};
