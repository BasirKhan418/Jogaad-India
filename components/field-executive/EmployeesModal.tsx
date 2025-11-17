"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Users, Search, Filter } from 'lucide-react';
import { useFieldExecRecentData } from '@/utils/fieldexecutive/useFieldExecRecentData';
import { getRelativeTime } from '@/utils/fieldexecutive/timeUtils';
import type { EmployeeData } from '@/utils/fieldexecutive/useFieldExecRecentData';

interface EmployeesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EmployeesModal: React.FC<EmployeesModalProps> = ({ open, onOpenChange }) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchQuery, setSearchQuery] = React.useState('');
  const itemsPerPage = 10;
  
  const { employees, loading, fetchMore } = useFieldExecRecentData(itemsPerPage);

  React.useEffect(() => {
    if (open) {
      const start = (currentPage - 1) * itemsPerPage;
      fetchMore(start, itemsPerPage);
    }
  }, [currentPage, open, fetchMore]);

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.phone.includes(searchQuery)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] pb-safe">
        <DialogClose onClose={() => onOpenChange(false)} />
        <DialogHeader>
          <DialogTitle>Manage Employees</DialogTitle>
          <DialogDescription>
            View and manage all employees under your supervision
          </DialogDescription>
        </DialogHeader>

        {/* Search and Filter */}
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B9EB3] focus:border-transparent touch-manipulation"
            />
          </div>
          <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 active:bg-slate-100 transition-colors touch-manipulation">
            <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8 sm:py-12">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-[#2B9EB3]"></div>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Users className="w-7 h-7 sm:w-8 sm:h-8 text-slate-400" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-slate-700 mb-2">
              {searchQuery ? 'No employees found' : 'No employees yet'}
            </h3>
            <p className="text-sm text-slate-500">
              {searchQuery ? 'Try adjusting your search criteria' : 'Start onboarding employees to see them here'}
            </p>
          </div>
        ) : (
          <>
            {/* Employee Stats */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6 bg-slate-50 rounded-xl p-3 sm:p-4">
              <div className="text-center">
                <p className="text-xl sm:text-2xl font-bold text-[#0A3D62]">{employees.length}</p>
                <p className="text-[10px] sm:text-xs text-slate-600">Total</p>
              </div>
              <div className="text-center border-x border-slate-200">
                <p className="text-xl sm:text-2xl font-bold text-green-600">
                  {employees.filter(e => e.isActive).length}
                </p>
                <p className="text-[10px] sm:text-xs text-slate-600">Active</p>
              </div>
              <div className="text-center">
                <p className="text-xl sm:text-2xl font-bold text-[#2B9EB3]">
                  {employees.filter(e => e.isPaid).length}
                </p>
                <p className="text-[10px] sm:text-xs text-slate-600">Paid</p>
              </div>
            </div>

            {/* Employee List */}
            <div className="space-y-2 max-h-[300px] sm:max-h-[400px] overflow-y-auto overscroll-contain">
              {filteredEmployees.map((employee, index) => (
                <EmployeeCard key={employee._id} employee={employee} index={index} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-200">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-[#0A3D62] bg-slate-100 hover:bg-slate-200 active:bg-slate-300 disabled:bg-slate-50 disabled:text-slate-400 rounded-lg transition-colors disabled:cursor-not-allowed touch-manipulation"
              >
                Previous
              </button>
              <span className="text-xs sm:text-sm text-slate-600">Page {currentPage}</span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={employees.length < itemsPerPage}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-[#0A3D62] bg-slate-100 hover:bg-slate-200 active:bg-slate-300 disabled:bg-slate-50 disabled:text-slate-400 rounded-lg transition-colors disabled:cursor-not-allowed touch-manipulation"
              >
                Next
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

const EmployeeCard: React.FC<{ employee: EmployeeData; index: number }> = ({ employee, index }) => {
  return (
    <div className="flex items-center justify-between p-2.5 sm:p-3 bg-white border border-slate-200 rounded-lg active:shadow-md transition-shadow touch-manipulation">
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          {employee.img ? (
            <img
              src={employee.img}
              alt={employee.name}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#2B9EB3] to-[#0A3D62] flex items-center justify-center">
              <span className="text-white font-semibold text-xs">
                {employee.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          {employee.isActive && (
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full border-2 border-white" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5">
            <h4 className="font-semibold text-[#0A3D62] text-xs sm:text-sm truncate">
              {employee.name}
            </h4>
            {employee.isPaid && (
              <span className="text-[9px] sm:text-[10px] font-semibold text-green-600 bg-green-50 px-1 sm:px-1.5 py-0.5 rounded whitespace-nowrap">
                PAID
              </span>
            )}
          </div>
          <p className="text-[10px] sm:text-xs text-slate-600 truncate">{employee.email}</p>
          <p className="text-[10px] sm:text-xs text-slate-500">{employee.phone}</p>
        </div>
      </div>

      {/* Meta Info */}
      <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-2 sm:ml-3">
        <span className="text-[10px] sm:text-xs text-slate-500 whitespace-nowrap">{getRelativeTime(employee.createdAt)}</span>
        <span className={`text-[9px] sm:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap ${
          employee.paymentStatus === 'paid' ? 'bg-green-50 text-green-700' :
          employee.paymentStatus === 'pending' ? 'bg-amber-50 text-amber-700' :
          'bg-red-50 text-red-700'
        }`}>
          {employee.paymentStatus.toUpperCase()}
        </span>
      </div>
    </div>
  );
};
