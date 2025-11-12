"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { logoutUser } from "@/actions/logout";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiUser, FiLogOut, FiHome } from "react-icons/fi";
import { toast } from "sonner";
import { useAuth, getUserInitials } from "@/utils/auth";
import Image from "next/image";
const NAV_ITEMS = [
  {
    name: "Home",
    link: "/",
  },
  {
    name: "About Us",
    link: "/about",
  },
  {
    name: "Services",
    link: "/services",
  },
  {
    name: "Blog",
    link: "/blog",
  },
  {
    name: "Contact",
    link: "/contact",
  },
];

export function NavbarDemo() {
  const router = useRouter();
  const { isAuthenticated, user, loading, logout: authLogout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Check if user is admin
  const isAdmin = user?.type === 'admin' || user?.isSuperAdmin === true;
  const profileRoute = isAdmin ? '/admin/dashboard' : '/profile';
  const profileLabel = isAdmin ? 'Dashboard' : 'Profile';
  
  // Debug logging
  useEffect(() => {
    if (user) {
      console.log('User data in navbar:', user);
      console.log('User type:', user.type);
      console.log('Is Admin:', isAdmin);
      console.log('Profile Label:', profileLabel);
    }
  }, [user, isAdmin, profileLabel]);
  
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);
  
  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showDropdown && !target.closest('.profile-dropdown')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  const handleLogout = () => {
    logoutUser().then(() => {
      authLogout();
      setShowDropdown(false);
      toast.success("Logged out successfully");
      router.push("/signin");
    });
  };

  return (
    <div className="relative w-full">
      <Navbar>
        <NavBody>
          <NavbarLogo />
          <NavItems items={NAV_ITEMS} />
          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <div className="relative profile-dropdown">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2B9EB3] to-[#0A3D62] flex items-center justify-center text-white font-semibold hover:shadow-lg transition-all overflow-hidden"
                >
                  {user.img ? (
                    <img
                      src={user.img} 
                      alt={user.name}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-sm">{getUserInitials(user.name)}</span>
                  )}
                </button>
                
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-[#0A3D62]">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        router.push(profileRoute);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <FiHome className="w-4 h-4" />
                      {profileLabel}
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <FiLogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <NavbarButton variant="secondary" onClick={() => router.push("/signin")}>Login</NavbarButton>
            )}
            <NavbarButton variant="primary" className="!px-4 !py-2 !text-sm shadow-none hover:shadow-none">Book a Call</NavbarButton>
          </div>
        </NavBody>

        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={toggleMobileMenu}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={closeMobileMenu}
          >
            {NAV_ITEMS.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={closeMobileMenu}
                className="relative text-[#2B9EB3] hover:text-[#0A3D62] dark:text-[#2B9EB3] font-medium"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              {isAuthenticated && user ? (
                <>
                  <div className="px-4 py-3 bg-gradient-to-r from-[#F9A825]/10 to-[#2B9EB3]/10 rounded-lg border border-[#2B9EB3]/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2B9EB3] to-[#0A3D62] flex items-center justify-center text-white font-semibold overflow-hidden">
                        {user.img ? (
                          <Image 
                            src={user.img} 
                            alt={user.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-sm">{getUserInitials(user.name)}</span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#0A3D62]">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  <NavbarButton
                    onClick={() => {
                      closeMobileMenu();
                      router.push(profileRoute);
                    }}
                    variant="secondary"
                    className="w-full"
                  >
                    {profileLabel}
                  </NavbarButton>
                  <NavbarButton
                    onClick={() => {
                      closeMobileMenu();
                      handleLogout();
                    }}
                    variant="secondary"
                    className="w-full !bg-red-50 !text-red-600 !border-red-200"
                  >
                    Logout
                  </NavbarButton>
                </>
              ) : (
                <NavbarButton
                  onClick={() => {
                    closeMobileMenu();
                    router.push("/signin");
                  }}
                  variant="secondary"
                  className="w-full"
                >
                  Login
                </NavbarButton>
              )}
              <NavbarButton
                onClick={closeMobileMenu}
                variant="primary"
                className="w-full !px-4 !py-2 !text-sm shadow-none hover:shadow-none"
              >
                Book a Call
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
};
