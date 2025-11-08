"use client";
import React from "react";

type DecorativeEdgesProps = {
  className?: string;
  showTop?: boolean;
  showBottom?: boolean;
  mode?: "full" | "corners"; // full = top/bottom bands, corners = bottom-left & bottom-right badges
};

// Subtle, stylish SVG chevrons + dashed path inspired by the reference image
export function DecorativeEdges({ className = "", showTop = true, showBottom = true, mode = "full" }: DecorativeEdgesProps) {
  return (
    <div className={`pointer-events-none absolute inset-0 z-[15] ${className}`} aria-hidden>
      {mode === "full" ? (
        <>
          {/* Top edge */}
          {showTop && (
            <div className="absolute left-0 right-0 top-0 h-28 sm:h-32">
              <svg className="w-full h-full" viewBox="0 0 1440 180" preserveAspectRatio="none">
                <g opacity="0.18">
                  <polygon points="1020,20 1120,100 1020,180 970,180 1070,100 970,20" fill="#0A3D62" />
                  <polygon points="1120,20 1220,100 1120,180 1070,180 1170,100 1070,20" fill="#0A3D62" />
                  <polygon points="1220,20 1320,100 1220,180 1170,180 1270,100 1170,20" fill="#0A3D62" />
                </g>
                <path d="M 0 10 C 180 80 420 40 640 90 C 860 140 1120 30 1440 80" fill="none" stroke="#F9A825" strokeWidth="3" className="ji-dash" strokeLinecap="round" />
              </svg>
            </div>
          )}
          {/* Bottom edge */}
          {showBottom && (
            <div className="absolute left-0 right-0 bottom-0 h-28 sm:h-32 rotate-180">
              <svg className="w-full h-full" viewBox="0 0 1440 180" preserveAspectRatio="none">
                <g opacity="0.18">
                  <polygon points="1020,20 1120,100 1020,180 970,180 1070,100 970,20" fill="#0A3D62" />
                  <polygon points="1120,20 1220,100 1120,180 1070,180 1170,100 1070,20" fill="#0A3D62" />
                  <polygon points="1220,20 1320,100 1220,180 1170,180 1270,100 1170,20" fill="#0A3D62" />
                </g>
                <path d="M 0 10 C 180 80 420 40 640 90 C 860 140 1120 30 1440 80" fill="none" stroke="#F9A825" strokeWidth="3" className="ji-dash" strokeLinecap="round" />
              </svg>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Bottom-left corner */}
          {showBottom && (
            <div className="absolute bottom-0 left-0 w-40 h-24 sm:w-56 sm:h-32 md:w-64 md:h-36 lg:w-80 lg:h-40">
              <svg className="w-full h-full" viewBox="0 0 320 180" preserveAspectRatio="none">
                <g opacity="0.18">
                  <polygon points="140,20 190,90 140,160 115,160 165,90 115,20" fill="#0A3D62" />
                  <polygon points="190,20 240,90 190,160 165,160 215,90 165,20" fill="#0A3D62" />
                </g>
                <path d="M 0 10 C 50 60 110 30 170 70" fill="none" stroke="#F9A825" strokeWidth="3" className="ji-dash" strokeLinecap="round" />
              </svg>
            </div>
          )}
          {/* Bottom-right corner (mirrored) */}
          {showBottom && (
            <div className="absolute bottom-0 right-0 w-40 h-24 sm:w-56 sm:h-32 md:w-64 md:h-36 lg:w-80 lg:h-40 scale-x-[-1]">
              <svg className="w-full h-full" viewBox="0 0 320 180" preserveAspectRatio="none">
                <g opacity="0.18">
                  <polygon points="140,20 190,90 140,160 115,160 165,90 115,20" fill="#0A3D62" />
                  <polygon points="190,20 240,90 190,160 165,160 215,90 165,20" fill="#0A3D62" />
                </g>
                <path d="M 0 10 C 50 60 110 30 170 70" fill="none" stroke="#F9A825" strokeWidth="3" className="ji-dash" strokeLinecap="round" />
              </svg>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default DecorativeEdges;
