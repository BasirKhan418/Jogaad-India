"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Target, TrendingUp, Calendar } from 'lucide-react';
import { useFieldExecAnalytics } from '@/utils/fieldexecutive/useFieldExecAnalytics';
import { motion } from 'framer-motion';

interface TargetsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fieldExecData?: any;
}

export const TargetsModal: React.FC<TargetsModalProps> = ({ open, onOpenChange, fieldExecData }) => {
  const { analytics, loading } = useFieldExecAnalytics();

  const progressPercentage = analytics?.assignTarget && analytics.assignTarget > 0
    ? Math.round((analytics.currentTarget / analytics.assignTarget) * 100)
    : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl pb-safe">
        <DialogClose onClose={() => onOpenChange(false)} />
        <DialogHeader>
          <DialogTitle>Your Targets & Goals</DialogTitle>
          <DialogDescription>
            Track your monthly targets and performance metrics
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8 sm:py-12">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-[#2B9EB3]"></div>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {/* Current Target Overview */}
            <div className="bg-gradient-to-br from-[#2B9EB3]/10 to-[#0A3D62]/10 rounded-xl p-4 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="p-2 sm:p-3 bg-[#2B9EB3] rounded-lg flex-shrink-0">
                  <Target className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm sm:text-base text-[#0A3D62]">Current Monthly Target</h3>
                  <p className="text-xs sm:text-sm text-slate-600">Your assigned goal for this month</p>
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0A3D62]">{fieldExecData?.target || 0}</span>
                <span className="text-base sm:text-lg text-slate-600">employees</span>
              </div>
              {fieldExecData?.targetDate && (
                <div className="flex items-center gap-2 mt-3 text-sm text-slate-600">
                  <Calendar className="w-4 h-4" />
                  <span>Due: {new Date(fieldExecData.targetDate).toLocaleDateString('en-IN', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
              )}
            </div>

            {/* Progress Stats */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4"
              >
                <div className="flex items-center gap-1.5 sm:gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                  <h4 className="font-semibold text-xs sm:text-sm text-slate-700">Achieved</h4>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-[#0A3D62]">{analytics?.currentTarget || 0}</p>
                <p className="text-xs text-slate-500 mt-1">Employees onboarded</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4"
              >
                <div className="flex items-center gap-1.5 sm:gap-2 mb-2">
                  <Target className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 flex-shrink-0" />
                  <h4 className="font-semibold text-xs sm:text-sm text-slate-700">Remaining</h4>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-[#0A3D62]">
                  {Math.max(0, (fieldExecData?.target || 0) - (analytics?.currentTarget || 0))}
                </p>
                <p className="text-xs text-slate-500 mt-1">To reach target</p>
              </motion.div>
            </div>

            {/* Progress Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-700">Overall Progress</span>
                <span className={`text-sm font-bold ${
                  progressPercentage >= 100 ? 'text-green-600' : 
                  progressPercentage >= 75 ? 'text-[#2B9EB3]' : 
                  progressPercentage >= 50 ? 'text-amber-600' : 'text-slate-600'
                }`}>
                  {progressPercentage}%
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(progressPercentage, 100)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full rounded-full ${
                    progressPercentage >= 100 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                    progressPercentage >= 75 ? 'bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62]' :
                    progressPercentage >= 50 ? 'bg-gradient-to-r from-amber-500 to-amber-600' :
                    'bg-gradient-to-r from-slate-400 to-slate-500'
                  }`}
                />
              </div>
              <p className="text-xs text-slate-500 mt-2 text-center">
                {progressPercentage >= 100 
                  ? '🎉 Congratulations! Target achieved!' 
                  : `Keep going! ${Math.max(0, (fieldExecData?.target || 0) - (analytics?.currentTarget || 0))} more to reach your goal`}
              </p>
            </div>

            {/* Additional Info */}
            <div className="bg-slate-50 rounded-xl p-3 sm:p-4 border border-slate-200">
              <h4 className="font-semibold text-sm sm:text-base text-slate-700 mb-2">About Your Targets</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-[#2B9EB3] mt-0.5">•</span>
                  <span>Targets are assigned monthly based on your area coverage</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#2B9EB3] mt-0.5">•</span>
                  <span>Progress is calculated based on successfully onboarded employees</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#2B9EB3] mt-0.5">•</span>
                  <span>Contact admin if you need target adjustments</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
