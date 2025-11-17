"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp } from 'lucide-react';
import { useFieldExecAnalytics } from '@/utils/fieldexecutive/useFieldExecAnalytics';


export const FieldExecAnalyticsCard: React.FC = () => {
  const { analytics, loading, error } = useFieldExecAnalytics();

  if (loading) {
    return <AnalyticsLoadingSkeleton />;
  }

  if (error) {
    return <AnalyticsError error={error} />;
  }

  if (!analytics) {
    return null;
  }

  const progressPercentage = analytics.assignTarget > 0
    ? Math.round((analytics.currentTarget / analytics.assignTarget) * 100)
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Assigned Target Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-gradient-to-br from-[#2B9EB3]/10 to-[#0A3D62]/10 rounded-xl">
            <Target className="w-6 h-6 text-[#2B9EB3]" />
          </div>
          <span className="text-xs font-semibold text-[#2B9EB3] bg-[#2B9EB3]/10 px-3 py-1 rounded-full">
            This Month
          </span>
        </div>
        <h3 className="text-slate-600 text-sm font-medium mb-1">Assigned Target</h3>
        <p className="text-4xl font-bold text-[#0A3D62] mb-2">
          {analytics.assignTarget}
        </p>
        <p className="text-xs text-slate-500">
          Total employees to onboard this month
        </p>
      </motion.div>

      {/* Current Progress Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
            progressPercentage >= 100
              ? 'text-green-600 bg-green-50'
              : progressPercentage >= 50
              ? 'text-amber-600 bg-amber-50'
              : 'text-slate-600 bg-slate-100'
          }`}>
            {progressPercentage}%
          </span>
        </div>
        <h3 className="text-slate-600 text-sm font-medium mb-1">Current Progress</h3>
        <p className="text-4xl font-bold text-[#0A3D62] mb-2">
          {analytics.currentTarget}
        </p>
        <div className="mt-3">
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progressPercentage, 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full rounded-full ${
                progressPercentage >= 100
                  ? 'bg-gradient-to-r from-green-500 to-green-600'
                  : 'bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62]'
              }`}
            />
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {analytics.assignTarget - analytics.currentTarget > 0
              ? `${analytics.assignTarget - analytics.currentTarget} more to reach target`
              : 'Target achieved! 🎉'}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

/**
 * Loading Skeleton Component
 */
const AnalyticsLoadingSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {[1, 2].map((i) => (
      <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-slate-200 rounded-xl" />
          <div className="w-16 h-6 bg-slate-200 rounded-full" />
        </div>
        <div className="h-4 bg-slate-200 rounded w-24 mb-2" />
        <div className="h-10 bg-slate-200 rounded w-20 mb-2" />
        <div className="h-3 bg-slate-200 rounded w-32" />
      </div>
    ))}
  </div>
);

/**
 * Error Display Component
 */
const AnalyticsError: React.FC<{ error: string }> = ({ error }) => (
  <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-red-100 rounded-lg">
        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div>
        <p className="font-semibold text-red-900">Failed to load analytics</p>
        <p className="text-sm text-red-600">{error}</p>
      </div>
    </div>
  </div>
);
