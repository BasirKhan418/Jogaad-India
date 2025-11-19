"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  IconX, 
  IconTarget, 
  IconTrendingUp, 
  IconCalendar,
  IconUser
} from '@tabler/icons-react';
import { 
  Target, 
  TrendingUp, 
  Calendar, 
  Loader2,
  AlertCircle 
} from 'lucide-react';

interface FieldExecAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  fieldExecEmail: string;
  fieldExecName: string;
}

interface AnalyticsData {
  assignTarget: number;
  currentTarget: number;
}

interface AnalyticsResponse {
  success: boolean;
  message?: string;
  data?: AnalyticsData;
}

/**
 * Employee Analytics Modal Component
 * Displays performance metrics and targets for a specific employee
 * Follows SRP - Single responsibility of displaying analytics
 */
export const FieldExecAnalyticsModal: React.FC<FieldExecAnalyticsModalProps> = ({
  isOpen,
  onClose,
  fieldExecEmail,
  fieldExecName
}) => {
  const [analytics, setAnalytics] = React.useState<AnalyticsData | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch analytics data when modal opens
  React.useEffect(() => {
    if (isOpen && fieldExecEmail) {
      fetchAnalytics();
    }
  }, [isOpen, fieldExecEmail]);

  /**
   * Fetches analytics data from API
   * Follows DRY - Centralized data fetching logic
   */
  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/v1/fielde-analytics?email=${encodeURIComponent(fieldExecEmail)}`);
      const result: AnalyticsResponse = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch analytics');
      }

      if (result.success && result.data) {
        setAnalytics(result.data);
      } else {
        throw new Error(result.message || 'Invalid response format');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load analytics';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Calculate progress metrics
  const progressPercentage = analytics?.assignTarget && analytics.assignTarget > 0
    ? Math.min(Math.round((analytics.currentTarget / analytics.assignTarget) * 100), 100)
    : 0;

  const remaining = analytics 
    ? Math.max(0, analytics.assignTarget - analytics.currentTarget)
    : 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <AnalyticsModalHeader 
          fieldExecName={fieldExecName}
          onClose={onClose}
        />

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState 
              error={error} 
              onRetry={fetchAnalytics}
            />
          ) : analytics ? (
            <AnalyticsContent
              analytics={analytics}
              progressPercentage={progressPercentage}
              remaining={remaining}
            />
          ) : (
            <EmptyState />
          )}
        </div>
      </motion.div>
    </div>
  );
};

/**
 * Modal Header Component
 * SRP - Handles only header rendering
 */
const AnalyticsModalHeader: React.FC<{
  fieldExecName: string;
  onClose: () => void;
}> = ({ fieldExecName, onClose }) => (
  <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-[#F9A825] to-[#2B9EB3] rounded-lg">
          <IconTarget className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            Employee Analytics
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Performance metrics for {fieldExecName}
          </p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
        aria-label="Close modal"
      >
        <IconX className="w-6 h-6" />
      </button>
    </div>
  </div>
);

/**
 * Analytics Content Component
 * SRP - Displays analytics data
 */
const AnalyticsContent: React.FC<{
  analytics: AnalyticsData;
  progressPercentage: number;
  remaining: number;
}> = ({ analytics, progressPercentage, remaining }) => (
  <div className="space-y-6">
    {/* Target Overview Card */}
    <TargetOverviewCard assignTarget={analytics.assignTarget} />

    {/* Progress Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <AchievedCard currentTarget={analytics.currentTarget} />
      <RemainingCard remaining={remaining} />
    </div>

    {/* Progress Bar */}
    <ProgressBar 
      progressPercentage={progressPercentage}
      currentTarget={analytics.currentTarget}
      assignTarget={analytics.assignTarget}
    />

    {/* Additional Info */}
    <InfoCard />
  </div>
);

/**
 * Target Overview Card Component
 * SRP - Displays assigned target
 */
const TargetOverviewCard: React.FC<{ assignTarget: number }> = ({ assignTarget }) => (
  <div className="bg-gradient-to-br from-[#2B9EB3]/10 to-[#0A3D62]/10 rounded-xl p-6 border border-[#2B9EB3]/20">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-3 bg-[#2B9EB3] rounded-lg">
        <Target className="w-6 h-6 text-white" />
      </div>
      <div>
        <h3 className="font-bold text-base text-[#0A3D62] dark:text-white">Assigned Monthly Target</h3>
        <p className="text-sm text-slate-600 dark:text-neutral-400">Target goal for this month</p>
      </div>
    </div>
    <div className="flex items-baseline gap-2">
      <span className="text-5xl font-bold text-[#0A3D62] dark:text-white">{assignTarget}</span>
      <span className="text-lg text-slate-600 dark:text-neutral-400">service providers</span>
    </div>
  </div>
);

/**
 * Achieved Card Component
 * SRP - Displays current achievement
 */
const AchievedCard: React.FC<{ currentTarget: number }> = ({ currentTarget }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
  >
    <div className="flex items-center gap-2 mb-3">
      <TrendingUp className="w-5 h-5 text-green-600" />
      <h4 className="font-semibold text-sm text-slate-700 dark:text-neutral-300">Achieved</h4>
    </div>
    <p className="text-3xl font-bold text-[#0A3D62] dark:text-white mb-1">{currentTarget}</p>
    <p className="text-xs text-slate-500 dark:text-neutral-400">Service providers onboarded</p>
  </motion.div>
);

/**
 * Remaining Card Component
 * SRP - Displays remaining target
 */
const RemainingCard: React.FC<{ remaining: number }> = ({ remaining }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
    className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
  >
    <div className="flex items-center gap-2 mb-3">
      <Target className="w-5 h-5 text-amber-600" />
      <h4 className="font-semibold text-sm text-slate-700 dark:text-neutral-300">Remaining</h4>
    </div>
    <p className="text-3xl font-bold text-[#0A3D62] dark:text-white mb-1">{remaining}</p>
    <p className="text-xs text-slate-500 dark:text-neutral-400">To reach target</p>
  </motion.div>
);

/**
 * Progress Bar Component
 * SRP - Visualizes progress
 */
const ProgressBar: React.FC<{
  progressPercentage: number;
  currentTarget: number;
  assignTarget: number;
}> = ({ progressPercentage, currentTarget, assignTarget }) => {
  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-gradient-to-r from-green-500 to-green-600';
    if (percentage >= 75) return 'bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62]';
    if (percentage >= 50) return 'bg-gradient-to-r from-amber-500 to-amber-600';
    return 'bg-gradient-to-r from-slate-400 to-slate-500';
  };

  const getProgressTextColor = (percentage: number) => {
    if (percentage >= 100) return 'text-green-600';
    if (percentage >= 75) return 'text-[#2B9EB3]';
    if (percentage >= 50) return 'text-amber-600';
    return 'text-slate-600';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-slate-700 dark:text-neutral-300">Overall Progress</span>
        <span className={`text-sm font-bold ${getProgressTextColor(progressPercentage)}`}>
          {progressPercentage}%
        </span>
      </div>
      <div className="w-full bg-slate-200 dark:bg-neutral-700 rounded-full h-3 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full rounded-full ${getProgressColor(progressPercentage)}`}
        />
      </div>
      <p className="text-xs text-slate-500 dark:text-neutral-400 mt-2 text-center">
        {progressPercentage >= 100 
          ? '🎉 Target achieved! Excellent performance!' 
          : `${assignTarget - currentTarget} more service providers needed to reach target`}
      </p>
    </div>
  );
};

/**
 * Info Card Component
 * SRP - Displays additional information
 */
const InfoCard: React.FC = () => (
  <div className="bg-slate-50 dark:bg-neutral-800 rounded-xl p-4 border border-slate-200 dark:border-neutral-700">
    <h4 className="font-semibold text-base text-slate-700 dark:text-neutral-300 mb-3 flex items-center gap-2">
      <IconCalendar className="w-5 h-5 text-[#2B9EB3]" />
      About These Metrics
    </h4>
    <ul className="space-y-2 text-sm text-slate-600 dark:text-neutral-400">
      <li className="flex items-start gap-2">
        <span className="text-[#2B9EB3] mt-0.5 font-bold">•</span>
        <span>Targets are assigned monthly based on area coverage and capacity</span>
      </li>
      <li className="flex items-start gap-2">
        <span className="text-[#2B9EB3] mt-0.5 font-bold">•</span>
        <span>Progress includes only active service providers onboarded in the current month</span>
      </li>
      <li className="flex items-start gap-2">
        <span className="text-[#2B9EB3] mt-0.5 font-bold">•</span>
        <span>Analytics are calculated in real-time based on UTC timezone</span>
      </li>
      <li className="flex items-start gap-2">
        <span className="text-[#2B9EB3] mt-0.5 font-bold">•</span>
        <span>Use this data to monitor employee performance and adjust targets</span>
      </li>
    </ul>
  </div>
);

/**
 * Loading State Component
 * SRP - Displays loading indicator
 */
const LoadingState: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-12">
    <Loader2 className="w-12 h-12 text-[#2B9EB3] animate-spin mb-4" />
    <p className="text-neutral-600 dark:text-neutral-400 font-medium">Loading analytics...</p>
    <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-1">Please wait</p>
  </div>
);

/**
 * Error State Component
 * SRP - Displays error message with retry option
 */
const ErrorState: React.FC<{ 
  error: string; 
  onRetry: () => void;
}> = ({ error, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
      <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
    </div>
    <p className="text-red-600 dark:text-red-400 font-medium text-center mb-2">Failed to Load Analytics</p>
    <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center mb-4 max-w-md">{error}</p>
    <button
      onClick={onRetry}
      className="px-4 py-2 bg-gradient-to-r from-[#F9A825] to-[#2B9EB3] text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
    >
      Try Again
    </button>
  </div>
);

/**
 * Empty State Component
 * SRP - Displays when no data is available
 */
const EmptyState: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="w-16 h-16 bg-slate-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4">
      <Target className="w-8 h-8 text-slate-400" />
    </div>
    <p className="text-neutral-600 dark:text-neutral-400 font-medium">No Analytics Data Available</p>
    <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-1">Analytics will appear once targets are set</p>
  </div>
);
