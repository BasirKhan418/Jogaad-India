"use client"

import type React from "react"
import { useEffect, useRef, useState, memo } from "react"
import { MeshGradient } from "@paper-design/shaders-react"

interface ShaderBackgroundProps {
  children: React.ReactNode
}

function ShaderBackground({ children }: ShaderBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isActive, setIsActive] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Delay shader loading to improve initial render
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleMouseEnter = () => setIsActive(true)
    const handleMouseLeave = () => setIsActive(false)

    const container = containerRef.current
    if (container) {
      container.addEventListener("mouseenter", handleMouseEnter, { passive: true })
      container.addEventListener("mouseleave", handleMouseLeave, { passive: true })
    }

    return () => {
      if (container) {
        container.removeEventListener("mouseenter", handleMouseEnter)
        container.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
  }, [])

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden" style={{ willChange: 'transform', transform: 'translateZ(0)' }}>
      {/* SVG Filters */}
      <svg className="absolute inset-0 w-0 h-0">
        <defs>
          <filter id="glass-effect" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence baseFrequency="0.005" numOctaves="1" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.3" />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0.02
                      0 1 0 0 0.02
                      0 0 1 0 0.05
                      0 0 0 0.9 0"
              result="tint"
            />
          </filter>
          <filter id="gooey-filter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="gooey"
            />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Background Shaders with Jogaad India Theme Colors - Only render when visible */}
      {isVisible && (
        <div className="absolute inset-0" style={{ willChange: 'opacity', transform: 'translateZ(0)' }}>
          <MeshGradient
            className="absolute inset-0 w-full h-full"
            colors={["#F9A825", "#2B9EB3", "#ffffff"]}
            speed={0.15}
          />
        </div>
      )}

      {/* White overlay for readability */}
      <div className="absolute inset-0 bg-white/55 backdrop-blur-sm" />

      {children}
    </div>
  )
}

export default memo(ShaderBackground)
