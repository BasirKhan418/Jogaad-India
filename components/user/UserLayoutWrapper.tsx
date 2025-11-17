"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { IconLogout } from "@tabler/icons-react";
import { getUserInitials } from "@/utils/auth";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { useUserNavigation } from "@/utils/user/useUserNavigation";
import { 
  useUserData, 
  useUserLogout, 
  useUserSidebar 
} from "@/utils/user/useUserHooks";
import { MobileBottomNav } from "@/components/user/MobileBottomNav";

interface UserLayoutWrapperProps {
  children: React.ReactNode;
  currentPath: string;
}


export const UserLayoutWrapper: React.FC<UserLayoutWrapperProps> = ({ 
  children, 
  currentPath 
}) => {
  const { userData } = useUserData();
  const { handleLogout } = useUserLogout();
  const { open, setOpen } = useUserSidebar();
  const { links } = useUserNavigation();

  return (
    <div className={cn("flex w-full flex-1 flex-col overflow-hidden md:flex-row", "h-screen")}>
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
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
            
            <div>
              <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
                {userData && (
                  <SidebarLink
                    link={{
                      label: userData.name || userData.email,
                      href: "/user/profile",
                      icon: <UserAvatar userData={userData} />,
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
      </div>

      {/* Main Content */}
      {children}

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden">
        <MobileBottomNav links={links} currentPath={currentPath} />
      </div>
    </div>
  );
};

// Logo Components
const Logo = () => (
  <Link
    href="/user/dashboard"
    className="font-normal flex space-x-2 items-center text-sm text-neutral-800 dark:text-neutral-200 py-1 relative z-20"
  >
    <img 
      src="/logo.png" 
      alt="Jogaad India Logo" 
      className="h-8 w-auto"
    />
  </Link>
);

const LogoIcon = () => (
  <Link
    href="/user/dashboard"
    className="font-normal flex space-x-2 items-center text-sm text-neutral-800 dark:text-neutral-200 py-1 relative z-20"
  >
    <img 
      src="/logo.png" 
      alt="Jogaad India" 
      className="h-8 w-8 object-contain"
    />
  </Link>
);

// User Avatar Component
const UserAvatar: React.FC<{ userData: any }> = ({ userData }) => (
  <div className="w-7 h-7 rounded-full bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] flex items-center justify-center text-white text-xs font-bold">
    {getUserInitials(userData.name || userData.email)}
  </div>
);
