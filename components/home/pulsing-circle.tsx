"use client"

import { memo, useState, useEffect } from "react"
import { PulsingBorder } from "@paper-design/shaders-react"
import { motion } from "framer-motion"

function PulsingCircle() {
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    // Delay rendering to improve initial page load
    const timer = setTimeout(() => setShouldRender(true), 800)
    return () => clearTimeout(timer)
  }, [])

  if (!shouldRender) return null

  return (
    <div className="absolute bottom-8 right-8 z-30 hidden lg:block">
      <div className="relative w-20 h-20 flex items-center justify-center" style={{ willChange: 'transform', transform: 'translateZ(0)' }}>
        <PulsingBorder
          colors={["#F9A825", "#2B9EB3", "#3BB4CF", "#FF9800", "#1B7A8F", "#0A3D62", "#45C4E0"]}
          colorBack="#00000000"
          speed={1}
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
          }}
        />

        <motion.svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          animate={{ rotate: 360 }}
          transition={{
            duration: 30,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          style={{ transform: "scale(1.6)", willChange: 'transform' }}
        >
          <defs>
            <path id="circle" d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
          </defs>
          <text className="text-sm fill-[#0A3D62] font-semibold" style={{ fontFamily: "var(--font-figtree)" }}>
            <textPath href="#circle" startOffset="0%">
              Jogaad India • Fast & Reliable • 24/7 Service • Jogaad India •
            </textPath>
          </text>
        </motion.svg>
      </div>
    </div>
  )
}

export default memo(PulsingCircle)
