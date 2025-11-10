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
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiUser, FiLogOut, FiHome } from "react-icons/fi";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);
  
  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch("/api/v1/user/verify", {
        cache: 'no-store',
        credentials: 'include'
      });
      const data = await response.json();
      console.log('Auth check:', data); 
      if (data.success && data.data) {
        setIsAuthenticated(true);
        setUser(data.data);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
    
    const interval = setInterval(checkAuth, 30000);
    
    return () => clearInterval(interval);
  }, [checkAuth]);

  useEffect(() => {
    const handleFocus = () => {
      checkAuth();
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [checkAuth]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkAuth();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [checkAuth]);

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
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setIsAuthenticated(false);
    setUser(null);
    setShowDropdown(false);
    window.location.href = "/";
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
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
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2B9EB3] to-[#0A3D62] flex items-center justify-center text-white font-semibold hover:shadow-lg transition-all"
                >
                  {getInitials(user.name)}
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
                        router.push("/profile");
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <FiHome className="w-4 h-4" />
                      Profile
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
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2B9EB3] to-[#0A3D62] flex items-center justify-center text-white font-semibold">
                        {getInitials(user.name)}
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
                      router.push("/profile");
                    }}
                    variant="secondary"
                    className="w-full"
                  >
                    Dashboard
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
