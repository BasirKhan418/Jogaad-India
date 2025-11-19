"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { logoutUser } from "@/actions/logout";
import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiLogOut, FiAlertTriangle, FiX } from "react-icons/fi";

export function RoleConflictBanner() {
  const params = useSearchParams();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  
  const show = params.get("logout_required") === "1";
  const currentRoleRaw = params.get("currentRole") || "current";
  const targetRoleRaw = params.get("targetRole") || "requested";

  // Map role names to user-friendly display names
  const roleDisplayNames: Record<string, string> = {
    "user": "User",
    "admin": "Admin",
    "employee": "Service Provider",
    "field-exec": "Employee"
  };
  
  const currentRole = roleDisplayNames[currentRoleRaw] || currentRoleRaw;
  const targetRole = roleDisplayNames[targetRoleRaw] || targetRoleRaw;

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      // Prevent scrolling when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [show]);

  const handleLogout = useCallback(async () => {
    await logoutUser();
    const url = new URL(window.location.href);
    url.searchParams.delete("logout_required");
    url.searchParams.delete("currentRole");
    url.searchParams.delete("targetRole");
    router.replace(url.pathname + (url.search ? url.search : ""));
    setIsVisible(false);
  }, [router]);

  const handleCancel = useCallback(() => {
    const url = new URL(window.location.href);
    url.searchParams.delete("logout_required");
    url.searchParams.delete("currentRole");
    url.searchParams.delete("targetRole");
    router.replace(url.pathname + (url.search ? url.search : ""));
    setIsVisible(false);
  }, [router]);

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCancel}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#F9A825] to-[#2B9EB3]" />
            
            <div className="p-6 sm:p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <FiAlertTriangle className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0A3D62]">Account Conflict</h3>
                    <p className="text-sm text-gray-500">Action required</p>
                  </div>
                </div>
                <button 
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mb-8">
                <p className="text-gray-600 leading-relaxed">
                  You are currently logged in as <span className="font-bold text-[#0A3D62]">{currentRole}</span>. 
                  To access the <span className="font-bold text-[#2B9EB3]">{targetRole}</span> portal, you need to log out of your current session first.
                </p>
              </div>
              
              <div className="flex flex-col-reverse sm:flex-row gap-3">
                <button
                  onClick={handleCancel}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
                >
                  Stay Logged In
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full sm:w-1 flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-[#2B9EB3]/20 transition-all flex items-center justify-center gap-2"
                >
                  <FiLogOut className="w-4 h-4" />
                  Logout & Switch
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
