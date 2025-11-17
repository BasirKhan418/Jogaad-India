"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserData } from "@/utils/user/useUserHooks";


interface UserStatsCardProps {
  userData: UserData | null;
}

export const UserStatsCard: React.FC<UserStatsCardProps> = ({ userData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {/* Account Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
        </div>
        <h3 className="text-slate-600 text-sm font-medium mb-1">Account Status</h3>
        <p className="text-2xl font-bold text-[#0A3D62]">
          {userData?.isVerified ? 'Verified' : 'Not Verified'}
        </p>
        <p className="text-xs text-slate-500 mt-2">
          Member since {new Date(userData?.createdAt || '').toLocaleDateString()}
        </p>
      </motion.div>

      {/* Fine Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow"
      >
        <div className="flex items-center justify-between mb-4">
          <div className={cn(
            "p-3 rounded-xl",
            userData?.isImposedFine 
              ? "bg-gradient-to-br from-red-500/10 to-red-600/10"
              : "bg-gradient-to-br from-blue-500/10 to-blue-600/10"
          )}>
            <ShieldAlert className={cn(
              "w-6 h-6",
              userData?.isImposedFine ? "text-red-600" : "text-blue-600"
            )} />
          </div>
        </div>
        <h3 className="text-slate-600 text-sm font-medium mb-1">Fine Status</h3>
        <p className="text-2xl font-bold text-[#0A3D62]">
          {userData?.isImposedFine ? 'Pending' : 'Clear'}
        </p>
        <p className="text-xs text-slate-500 mt-2">
          {userData?.isImposedFine ? 'Please contact support' : 'No fines imposed'}
        </p>
      </motion.div>

      {/* Location Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-gradient-to-br from-[#F9A825]/10 to-[#2B9EB3]/10 rounded-xl">
            <MapPin className="w-6 h-6 text-[#F9A825]" />
          </div>
        </div>
        <h3 className="text-slate-600 text-sm font-medium mb-1">Location</h3>
        <p className="text-xl font-bold text-[#0A3D62]">
          {userData?.pincode || 'Not Set'}
        </p>
        <p className="text-xs text-slate-500 mt-2">
          {userData?.address ? 
            (userData.address.length > 30 ? userData.address.substring(0, 30) + '...' : userData.address) 
            : 'No address provided'}
        </p>
      </motion.div>
    </div>
  );
};
