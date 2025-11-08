"use client";
import { cn } from "@/lib/utils";
import { IconMenu2, IconX } from "@tabler/icons-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";

import React, { useRef, useState } from "react";


interface NavbarProps {
  children: React.ReactNode;
  className?: string;
}

interface NavBodyProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

interface NavItemsProps {
  items: {
    name: string;
    link: string;
  }[];
  className?: string;
  onItemClick?: () => void;
}

interface MobileNavProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

interface MobileNavHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface MobileNavMenuProps {
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const Navbar = ({ children, className }: NavbarProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState<boolean>(false);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest > 0.05) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  });

  return (
    <>
      {/* Elegant top scroll progress */}
      <motion.div
        className="fixed left-0 right-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-[#F9A825] via-[#2B9EB3] to-[#0A3D62]"
        style={{ scaleX: scrollYProgress }}
      />
      <motion.div
        ref={ref}
        className={cn("fixed inset-x-0 top-0 z-50 w-full", className)}
      >
        {React.Children.map(children, (child) =>
          React.isValidElement(child)
            ? React.cloneElement(
                child as React.ReactElement<{ visible?: boolean }>,
                { visible },
              )
            : child,
        )}
      </motion.div>
    </>
  );
};

export const NavBody = ({ children, className, visible }: NavBodyProps) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(16px)" : "blur(8px)",
        boxShadow: visible
          ? "0 4px 20px rgba(15, 23, 42, 0.04), 0 1px 0 rgba(255,255,255,0.08) inset"
          : "none",
        width: visible ? "64%" : "100%",
        y: visible ? 12 : 8,
      }}
      transition={{
        type: "spring",
        stiffness: 220,
        damping: 36,
      }}
      className={cn(
        "relative z-[60] mx-auto hidden w-full max-w-7xl flex-row items-center justify-between self-start px-3 lg:px-5 py-1 lg:py-1.5 lg:flex mt-4",
        "pointer-events-auto",
        visible
          ? "rounded-full bg-white/30 dark:bg-neutral-950/30 ring-1 ring-[#F9A825]/20 backdrop-saturate-150 shadow-lg shadow-[#2B9EB3]/5"
          : "rounded-none bg-white/35 dark:bg-neutral-950/40",
        className,
      )}
      role="navigation"
      aria-label="Primary"
    >
      {/* gradient border glow */}
      {visible && (
        <div className="pointer-events-none absolute -inset-[1px] rounded-[1.05rem] [mask:linear-gradient(#000,#000)_content-box,linear-gradient(#000,#000)] [mask-composite:exclude] p-[1px] before:absolute before:inset-0 before:rounded-[1.05rem] before:bg-[linear-gradient(135deg,rgba(249,168,37,0.4),rgba(43,158,179,0.3),rgba(10,61,98,0.2))]" />
      )}
      <div className="relative z-10 flex w-full flex-row items-center justify-between">
        {children}
      </div>
    </motion.div>
  );
};

export const NavItems = ({ items, className, onItemClick }: NavItemsProps) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "flex flex-1 flex-row items-center justify-center gap-1 lg:gap-2 text-[0.95rem] font-semibold text-[#0A3D62] dark:text-[#2B9EB3] transition-colors duration-200",
        className,
      )}
    >
      {items.map((item, idx) => (
        <a
          onMouseEnter={() => setHovered(idx)}
          onClick={onItemClick}
          className="group relative px-3 lg:px-4 py-2.5 rounded-full text-[#0A3D62] hover:text-[#2B9EB3] dark:text-[#2B9EB3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F9A825]/40 transition-colors duration-200"
          key={`link-${idx}`}
          href={item.link}
        >
          {hovered === idx && (
            <motion.span
              layoutId="hovered-underline"
              className="absolute left-3 right-3 -bottom-0.5 h-[3px] rounded-full bg-gradient-to-r from-[#F9A825] via-[#2B9EB3] to-[#F9A825] shadow-sm shadow-[#F9A825]/50"
            />
          )}
          <span className="relative z-20">{item.name}</span>
        </a>
      ))}
    </motion.div>
  );
};

export const MobileNav = ({ children, className, visible }: MobileNavProps) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(16px)" : "blur(8px)",
        boxShadow: visible
          ? "0 4px 20px rgba(15, 23, 42, 0.04), 0 1px 0 rgba(255,255,255,0.08) inset"
          : "none",
        width: visible ? "96%" : "100%",
        paddingRight: visible ? "8px" : "0px",
        paddingLeft: visible ? "8px" : "0px",
        borderRadius: visible ? "1.5rem" : "2rem",
        y: visible ? 10 : 8,
      }}
      transition={{
        type: "spring",
        stiffness: 220,
        damping: 36,
      }}
      className={cn(
        "pointer-events-auto relative z-50 mx-auto flex w-full max-w-[calc(100vw-1rem)] flex-col items-center justify-between bg-white/25 px-0 py-1.5 lg:hidden mt-4",
        visible && "rounded-xl bg-white/20 dark:bg-neutral-950/30 ring-1 ring-white/20 backdrop-saturate-150",
        className,
      )}
    >
      {children}
    </motion.div>
  );
};

export const MobileNavHeader = ({
  children,
  className,
}: MobileNavHeaderProps) => {
  return (
    <div
      className={cn(
        "flex w-full flex-row items-center justify-between",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const MobileNavMenu = ({
  children,
  className,
  isOpen,
  onClose,
}: MobileNavMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className={cn(
            "absolute inset-x-0 top-14 z-50 flex w-full flex-col items-start justify-start gap-4 rounded-2xl bg-white/95 px-4 py-6 backdrop-blur-xl ring-1 ring-[#F9A825]/20 shadow-[0_10px_30px_rgba(249,168,37,0.15)] dark:bg-neutral-950/85",
            className,
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const MobileNavToggle = ({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) => {
  return isOpen ? (
    <IconX className="w-7 h-7 text-[#0A3D62] dark:text-[#2B9EB3]" onClick={onClick} />
  ) : (
    <IconMenu2 className="w-7 h-7 text-[#0A3D62] dark:text-[#2B9EB3]" onClick={onClick} />
  );
};

export const NavbarLogo = () => {
  return (
    <a
      href="#"
      className="relative z-20 mr-2 lg:mr-4 flex items-center space-x-3 px-2 py-1 text-base font-medium"
    >
      <img
        src="/logo.png"
        alt="logo"
        width={150}
        height={40}
      />
    </a>
  );
};

export const NavbarButton = ({
  href,
  as: Tag = "a",
  children,
  className,
  variant = "primary",
  ...props
}: {
  href?: string;
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "dark" | "gradient";
} & (
  | React.ComponentPropsWithoutRef<"a">
  | React.ComponentPropsWithoutRef<"button">
)) => {
  const baseStyles =
    "px-6 py-2.5 rounded-full text-sm font-semibold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-block text-center";

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-[#F9A825] via-[#FFB74D] to-[#F9A825] text-[#1b1b1b] shadow-[0_6px_20px_rgba(249,168,37,0.4)] ring-1 ring-[#F9A825]/30 hover:shadow-[0_8px_28px_rgba(249,168,37,0.5)] hover:scale-105 hover:ring-[#F9A825]/50",
    secondary:
      "bg-transparent text-[#0A3D62] hover:text-[#2B9EB3] dark:text-[#2B9EB3] hover:bg-[#F9A825]/5 ring-1 ring-[#0A3D62]/20 hover:ring-[#2B9EB3]/30",
    dark:
      "bg-gradient-to-r from-[#1B7A8F] to-[#0A3D62] text-white shadow-[0_6px_20px_rgba(10,61,98,0.3)] ring-1 ring-[#2B9EB3]/20 hover:from-[#3BB4CF] hover:to-[#1B7A8F] hover:shadow-[0_8px_28px_rgba(43,158,179,0.4)]",
    gradient:
      "bg-gradient-to-r from-[#3BB4CF] to-[#1B7A8F] text-white shadow-[0_6px_20px_rgba(43,158,179,0.35)] ring-1 ring-white/10 hover:from-[#45C4E0] hover:to-[#2B9EB3] hover:shadow-[0_8px_28px_rgba(43,158,179,0.45)]",
  };

  return (
    <Tag
      href={href || undefined}
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </Tag>
  );
};
