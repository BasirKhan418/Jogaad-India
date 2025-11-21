import React from "react";
import { Career } from "@/utils/admin/useCareersData";
import { IconAlertTriangle, IconX } from "@tabler/icons-react";

interface DeleteCareerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  career: Career | null;
  actionLoading: boolean;
}

const DeleteCareerModal: React.FC<DeleteCareerModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  career,
  actionLoading,
}) => {
  if (!isOpen || !career) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between bg-red-50 dark:bg-red-900/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30">
              <IconAlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-100">
              Delete Career
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            disabled={actionLoading}
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <p className="text-neutral-700 dark:text-neutral-300 mb-4">
            Are you sure you want to delete this career posting? This action cannot be undone.
          </p>
          
          <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700">
            <div className="mb-2">
              <span className="text-sm text-neutral-500 dark:text-neutral-400">Role:</span>
              <p className="text-neutral-900 dark:text-neutral-100 font-semibold">{career.role}</p>
            </div>
            {career.department && (
              <div className="mb-2">
                <span className="text-sm text-neutral-500 dark:text-neutral-400">Department:</span>
                <p className="text-neutral-900 dark:text-neutral-100">{career.department}</p>
              </div>
            )}
            <div>
              <span className="text-sm text-neutral-500 dark:text-neutral-400">Location:</span>
              <p className="text-neutral-900 dark:text-neutral-100">{career.location}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-700 flex justify-end gap-3 bg-neutral-50 dark:bg-neutral-800">
          <button
            onClick={onClose}
            disabled={actionLoading}
            className="px-6 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={actionLoading}
            className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {actionLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Deleting...
              </>
            ) : (
              "Delete Career"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCareerModal;
