"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface MobileBottomNavProps {
  links: Array<{
    label: string;
    href: string;
    icon: React.ReactElement;
  }>;
  currentPath: string;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ 
  links, 
  currentPath
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-t border-neutral-800 shadow-[0_-4px_24px_rgba(0,0,0,0.3)] pb-safe">
      <nav className="flex items-center justify-around px-4 py-2">
        {links.map((link, idx) => {
          const isActive = currentPath === link.href;
          
          return (
            <Link
              key={idx}
              href={link.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1.5 px-2 py-2 rounded-xl transition-all duration-300 min-w-[70px] relative",
                isActive 
                  ? "" 
                  : "hover:bg-neutral-800/50"
              )}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] rounded-full" />
              )}
              
              <div className={cn(
                "flex items-center justify-center w-11 h-11 rounded-2xl transition-all duration-300 relative",
                isActive 
                  ? "bg-gradient-to-br from-[#2B9EB3] to-[#0A3D62] shadow-lg shadow-[#2B9EB3]/30" 
                  : "bg-neutral-800/50"
              )}>
                <span className={cn(
                  "h-5 w-5 flex-shrink-0 transition-all duration-300",
                  isActive ? "text-white" : "text-neutral-400"
                )}>
                  {link.icon}
                </span>
              </div>
              <span className={cn(
                "text-[11px] font-semibold transition-all duration-300 tracking-tight",
                isActive 
                  ? "text-white" 
                  : "text-neutral-400"
              )}>
                {link.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
