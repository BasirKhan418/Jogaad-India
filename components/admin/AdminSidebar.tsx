"use client";

import React from "react";
import { motion } from "framer-motion";
import { IconLogout } from "@tabler/icons-react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { useAdminNavigation } from "@/utils/admin/useAdminNavigation";
import { useAdminSidebar } from "@/utils/admin/useAdminHooks";
import { AdminData } from "@/utils/admin/adminAuthService";
import { getUserInitials } from "@/utils/auth";

interface AdminSidebarProps {
  adminData: AdminData | null;
  handleLogout: () => void;
}

export function AdminSidebar({ adminData, handleLogout }: AdminSidebarProps) {
  const { open, setOpen } = useAdminSidebar();
  const { links } = useAdminNavigation();

  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-10">
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          {open ? <Logo /> : <LogoIcon />}
          <div className="mt-8 flex flex-col gap-2">
            {links.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
            ))}
          </div>
        </div>
        
        {/* User Section */}
        <div>
          <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
            {adminData && (
              <SidebarLink
                link={{
                  label: adminData.name || adminData.email,
                  href: "/admin/profile",
                  icon: (
                    <div className="h-7 w-7 shrink-0 rounded-full bg-gradient-to-r from-[#F9A825] to-[#2B9EB3] flex items-center justify-center overflow-hidden relative">
                      {adminData.img && adminData.img.trim() !== "" ? (
                        <img
                          src={adminData.img}
                          alt={adminData.name}
                          className="h-7 w-7 rounded-full object-cover absolute inset-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : null}
                      <span className="text-white font-bold text-xs leading-none select-none" style={{ fontSize: '10px', color: 'white' }}>
                        {getUserInitials(adminData.name || adminData.email || "AD")}
                      </span>
                    </div>
                  ),
                }}
              />
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full py-2 px-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors mt-2"
            >
              <IconLogout className="h-5 w-5 text-neutral-700 dark:text-neutral-200 shrink-0" />
              <motion.span
                animate={{
                  display: open ? "inline-block" : "none",
                  opacity: open ? 1 : 0,
                }}
                className="text-sm text-neutral-700 dark:text-neutral-200"
              >
                Logout
              </motion.span>
            </button>
          </div>
        </div>
      </SidebarBody>
    </Sidebar>
  );
}

const Logo = () => {
  return (
    <a
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-neutral-800 dark:text-neutral-200 py-1 relative z-20"
    >
      <img 
        src="/logo.png" 
        alt="Jogaad India Logo" 
        className="h-8 w-auto"
      />
    </a>
  );
};

const LogoIcon = () => {
  return (
    <a
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-neutral-800 dark:text-neutral-200 py-1 relative z-20"
    >
      <img 
        src="/logo.png" 
        alt="Jogaad India" 
        className="h-8 w-8 object-contain"
      />
    </a>
  );
};
