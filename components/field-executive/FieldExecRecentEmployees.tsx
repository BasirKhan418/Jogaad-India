"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useFieldExecRecentData } from '@/utils/fieldexecutive/useFieldExecRecentData';
import { isWithin12Hours, getRelativeTime, formatDateTime } from '@/utils/fieldexecutive/timeUtils';
import type { EmployeeData } from '@/utils/fieldexecutive/useFieldExecRecentData';

export const FieldExecRecentEmployees: React.FC = () => {
  const [showAll, setShowAll] = useState(false);
  const { employees, loading, error } = useFieldExecRecentData(5);

  if (loading && !showAll) {
    return <RecentEmployeesLoadingSkeleton />;
  }

  if (error) {
    return <RecentEmployeesError error={error} />;
  }

  return (
    <div className="bg-white rounded-xl p-5 shadow-md border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#2B9EB3]/10 rounded-lg">
            <Users className="w-5 h-5 text-[#2B9EB3]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#0A3D62]">Recent Employees</h2>
            <p className="text-xs text-slate-600">Latest onboarded employees</p>
          </div>
        </div>
        {!showAll && employees.length > 0 && (
          <Link
            href="/field-executive/employees"
            className="text-sm font-semibold text-[#2B9EB3] hover:text-[#0A3D62] transition-colors"
          >
            View All →
          </Link>
        )}
      </div>

      {employees.length === 0 ? (
        <EmptyState />
      ) : showAll ? (
        <PaginatedEmployeeList onBack={() => setShowAll(false)} />
      ) : (
        <EmployeeList employees={employees} />
      )}
    </div>
  );
};

/**
 * Employee List Component (Top 5)
 */
const EmployeeList: React.FC<{ employees: EmployeeData[] }> = ({ employees }) => {
  const router = useRouter();

  const handleEdit = (employeeId: string) => {
    // Navigate to employee edit page
    router.push(`/field-executive/edit-employee?id=${employeeId}`);
  };

  return (
    <div className="space-y-3">
      {employees.map((employee, index) => (
        <motion.div
          key={employee._id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Employee Avatar */}
            <div className="relative flex-shrink-0">
              {employee.img ? (
                <img
                  src={employee.img}
                  alt={employee.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2B9EB3] to-[#0A3D62] flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {employee.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              {/* Active Status Badge */}
              {employee.isActive && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>

            {/* Employee Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-[#0A3D62] truncate">
                  {employee.name}
                </h3>
                {employee.isPaid && (
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    Paid
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-600 truncate">{employee.email}</p>
              <p className="text-xs text-slate-500 mt-1">
                Added {getRelativeTime(employee.createdAt)}
              </p>
            </div>
          </div>

          {/* Edit Button - Show only if within 12 hours */}
          {isWithin12Hours(employee.createdAt) && (
            <button
              onClick={() => handleEdit(employee._id)}
              className="flex-shrink-0 p-2 bg-[#2B9EB3] hover:bg-[#0A3D62] text-white rounded-lg transition-colors ml-4"
              title={`Edit within ${formatDateTime(employee.createdAt)}`}
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
        </motion.div>
      ))}
    </div>
  );
};

/**
 * Paginated Employee List Component
 */
const PaginatedEmployeeList: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { employees, loading, fetchMore } = useFieldExecRecentData(itemsPerPage);

  React.useEffect(() => {
    const start = (currentPage - 1) * itemsPerPage;
    fetchMore(start, itemsPerPage);
  }, [currentPage, fetchMore]);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (employees.length === itemsPerPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div>
      <button
        onClick={onBack}
        className="mb-4 text-sm font-semibold text-[#2B9EB3] hover:text-[#0A3D62] transition-colors flex items-center gap-1"
      >
        ← Back to Recent
      </button>

      {loading ? (
        <RecentEmployeesLoadingSkeleton />
      ) : (
        <>
          <EmployeeList employees={employees} />

          {/* Pagination Controls */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:bg-slate-50 disabled:text-slate-400 text-[#0A3D62] rounded-lg font-semibold transition-colors disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Page {currentPage}</span>
            </div>

            <button
              onClick={handleNext}
              disabled={employees.length < itemsPerPage}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:bg-slate-50 disabled:text-slate-400 text-[#0A3D62] rounded-lg font-semibold transition-colors disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

/**
 * Empty State Component
 */
const EmptyState: React.FC = () => (
  <div className="text-center py-12">
    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <Users className="w-8 h-8 text-slate-400" />
    </div>
    <h3 className="text-lg font-semibold text-slate-700 mb-2">No employees yet</h3>
    <p className="text-sm text-slate-500">
      Start onboarding employees to see them here
    </p>
  </div>
);

/**
 * Loading Skeleton Component
 */
const RecentEmployeesLoadingSkeleton: React.FC = () => (
  <div className="space-y-3">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl animate-pulse">
        <div className="w-12 h-12 bg-slate-200 rounded-full" />
        <div className="flex-1">
          <div className="h-4 bg-slate-200 rounded w-32 mb-2" />
          <div className="h-3 bg-slate-200 rounded w-48 mb-1" />
          <div className="h-3 bg-slate-200 rounded w-24" />
        </div>
      </div>
    ))}
  </div>
);

/**
 * Error Display Component
 */
const RecentEmployeesError: React.FC<{ error: string }> = ({ error }) => (
  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-red-100 rounded-lg">
        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div>
        <p className="font-semibold text-red-900">Failed to load employees</p>
        <p className="text-sm text-red-600">{error}</p>
      </div>
    </div>
  </div>
);
