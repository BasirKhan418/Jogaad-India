import React from "react";
import { Career } from "@/utils/admin/useCareersData";
import { IconEdit, IconTrash, IconToggleLeft, IconToggleRight, IconMapPin, IconBriefcase, IconClock } from "@tabler/icons-react";
import { formatDistanceToNow } from "date-fns";

interface CareersTableProps {
  careers: Career[];
  onEdit: (career: Career) => void;
  onDelete: (career: Career) => void;
  onToggleStatus: (career: Career) => void;
  actionLoading: boolean;
}

const CareersTable: React.FC<CareersTableProps> = ({
  careers,
  onEdit,
  onDelete,
  onToggleStatus,
  actionLoading,
}) => {
  if (careers.length === 0) {
    return (
      <div className="text-center py-12 bg-neutral-50 dark:bg-neutral-800 rounded-lg border-2 border-dashed border-neutral-300 dark:border-neutral-600">
        <div className="text-neutral-400 dark:text-neutral-500 mb-2">
          <IconBriefcase className="w-12 h-12 mx-auto mb-3 opacity-50" />
        </div>
        <p className="text-neutral-600 dark:text-neutral-400 text-lg font-medium">
          No careers found
        </p>
        <p className="text-neutral-500 dark:text-neutral-500 text-sm mt-1">
          Create your first career posting to get started
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-700">
      <table className="w-full">
        <thead className="bg-neutral-100 dark:bg-neutral-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
              Role & Department
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
              Location & Mode
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
              Experience
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
              Employment Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
              Created
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-neutral-900 divide-y divide-neutral-200 dark:divide-neutral-700">
          {careers.map((career) => (
            <tr key={career._id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {career.role}
                  </span>
                  {career.department && (
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      {career.department}
                    </span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1 text-sm text-neutral-700 dark:text-neutral-300">
                    <IconMapPin className="w-3 h-3" />
                    {career.location}
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium w-fit ${
                    career.mode === 'remote' 
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                      : career.mode === 'hybrid'
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                      : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                  }`}>
                    {career.mode}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-neutral-700 dark:text-neutral-300">
                  {career.experience}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                  career.employmentType === 'full-time'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                    : career.employmentType === 'part-time'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                    : career.employmentType === 'contract'
                    ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
                    : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300'
                }`}>
                  {career.employmentType || 'full-time'}
                </span>
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => onToggleStatus(career)}
                  disabled={actionLoading}
                  className="group flex items-center gap-2"
                >
                  {career.isActive ? (
                    <IconToggleRight className="w-8 h-8 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform" />
                  ) : (
                    <IconToggleLeft className="w-8 h-8 text-neutral-400 dark:text-neutral-500 group-hover:scale-110 transition-transform" />
                  )}
                  <span className={`text-xs font-medium ${
                    career.isActive 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-neutral-500 dark:text-neutral-400'
                  }`}>
                    {career.isActive ? 'Active' : 'Inactive'}
                  </span>
                </button>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                  <IconClock className="w-3 h-3" />
                  {formatDistanceToNow(new Date(career.createdAt), { addSuffix: true })}
                </div>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEdit(career)}
                    disabled={actionLoading}
                    className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 transition-colors disabled:opacity-50"
                    title="Edit career"
                  >
                    <IconEdit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(career)}
                    disabled={actionLoading}
                    className="p-2 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 transition-colors disabled:opacity-50"
                    title="Delete career"
                  >
                    <IconTrash className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CareersTable;
