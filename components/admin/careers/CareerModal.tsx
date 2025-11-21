import React, { useState, useEffect } from "react";
import { Career, CareerFormData } from "@/utils/admin/useCareersData";
import { IconX, IconPlus, IconTrash } from "@tabler/icons-react";

interface CareerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CareerFormData) => Promise<void>;
  title: string;
  career?: Career | null;
  actionLoading: boolean;
}

const CareerModal: React.FC<CareerModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  career,
  actionLoading,
}) => {
  const [formData, setFormData] = useState<CareerFormData>({
    role: "",
    experience: "",
    requirements: [""],
    description: "",
    location: "",
    mode: "remote",
    applyUrl: "",
    salary: "",
    department: "",
    employmentType: "full-time",
    skills: [""],
    benefits: [""],
    isActive: true,
    applicationDeadline: "",
  });

  useEffect(() => {
    if (career) {
      setFormData({
        role: career.role,
        experience: career.experience,
        requirements: career.requirements,
        description: career.description,
        location: career.location,
        mode: career.mode,
        applyUrl: career.applyUrl,
        salary: career.salary || "",
        department: career.department || "",
        employmentType: career.employmentType || "full-time",
        skills: career.skills && career.skills.length > 0 ? career.skills : [""],
        benefits: career.benefits && career.benefits.length > 0 ? career.benefits : [""],
        isActive: career.isActive,
        applicationDeadline: career.applicationDeadline 
          ? new Date(career.applicationDeadline).toISOString().slice(0, 16)
          : "",
      });
    } else {
      setFormData({
        role: "",
        experience: "",
        requirements: [""],
        description: "",
        location: "",
        mode: "remote",
        applyUrl: "",
        salary: "",
        department: "",
        employmentType: "full-time",
        skills: [""],
        benefits: [""],
        isActive: true,
        applicationDeadline: "",
      });
    }
  }, [career, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty strings from arrays
    const cleanedData: any = {
      ...formData,
      requirements: formData.requirements.filter(r => r.trim() !== ""),
      skills: formData.skills?.filter(s => s.trim() !== ""),
      benefits: formData.benefits?.filter(b => b.trim() !== ""),
    };

    // Remove empty optional string fields
    if (!cleanedData.salary || cleanedData.salary.trim() === "") {
      delete cleanedData.salary;
    }
    if (!cleanedData.department || cleanedData.department.trim() === "") {
      delete cleanedData.department;
    }

    // Convert applicationDeadline to ISO string if present, otherwise remove it
    if (cleanedData.applicationDeadline && cleanedData.applicationDeadline.trim() !== "") {
      cleanedData.applicationDeadline = new Date(cleanedData.applicationDeadline).toISOString();
    } else {
      delete cleanedData.applicationDeadline;
    }

    // Remove empty arrays for optional fields
    if (!cleanedData.skills || cleanedData.skills.length === 0) {
      delete cleanedData.skills;
    }
    if (!cleanedData.benefits || cleanedData.benefits.length === 0) {
      delete cleanedData.benefits;
    }

    await onSubmit(cleanedData);
  };

  const handleArrayFieldChange = (
    field: "requirements" | "skills" | "benefits",
    index: number,
    value: string
  ) => {
    const newArray = [...(formData[field] || [])];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const handleAddArrayField = (field: "requirements" | "skills" | "benefits") => {
    setFormData({
      ...formData,
      [field]: [...(formData[field] || []), ""],
    });
  };

  const handleRemoveArrayField = (
    field: "requirements" | "skills" | "benefits",
    index: number
  ) => {
    const newArray = (formData[field] || []).filter((_, i) => i !== index);
    setFormData({
      ...formData,
      [field]: newArray.length > 0 ? newArray : [""],
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between bg-gradient-to-r from-[#F9A825]/10 to-[#2B9EB3]/10">
          <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            disabled={actionLoading}
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="px-6 py-6 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Role <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B9EB3] dark:bg-neutral-800 dark:text-white"
                  required
                  placeholder="e.g., Senior Software Engineer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Department
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B9EB3] dark:bg-neutral-800 dark:text-white"
                  placeholder="e.g., Engineering"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Experience <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B9EB3] dark:bg-neutral-800 dark:text-white"
                  required
                  placeholder="e.g., 3-5 years"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Salary
                </label>
                <input
                  type="text"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B9EB3] dark:bg-neutral-800 dark:text-white"
                  placeholder="e.g., ₹10-15 LPA"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B9EB3] dark:bg-neutral-800 dark:text-white"
                  required
                  placeholder="e.g., Mumbai, India"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Mode <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.mode}
                  onChange={(e) => setFormData({ ...formData, mode: e.target.value as any })}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B9EB3] dark:bg-neutral-800 dark:text-white"
                  required
                >
                  <option value="remote">Remote</option>
                  <option value="offline">Offline</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Employment Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.employmentType}
                  onChange={(e) => setFormData({ ...formData, employmentType: e.target.value as any })}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B9EB3] dark:bg-neutral-800 dark:text-white"
                  required
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Application Deadline
                </label>
                <input
                  type="datetime-local"
                  value={formData.applicationDeadline}
                  onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B9EB3] dark:bg-neutral-800 dark:text-white"
                />
              </div>
            </div>

            {/* Apply URL */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Apply URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={formData.applyUrl}
                onChange={(e) => setFormData({ ...formData, applyUrl: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B9EB3] dark:bg-neutral-800 dark:text-white"
                required
                placeholder="https://forms.google.com/..."
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B9EB3] dark:bg-neutral-800 dark:text-white"
                rows={4}
                required
                placeholder="Detailed job description..."
              />
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Requirements <span className="text-red-500">*</span>
              </label>
              {formData.requirements.map((req, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={req}
                    onChange={(e) => handleArrayFieldChange("requirements", index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B9EB3] dark:bg-neutral-800 dark:text-white"
                    placeholder={`Requirement ${index + 1}`}
                  />
                  {formData.requirements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveArrayField("requirements", index)}
                      className="p-2 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400"
                    >
                      <IconTrash className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddArrayField("requirements")}
                className="flex items-center gap-2 px-3 py-1 text-sm text-[#2B9EB3] hover:bg-[#2B9EB3]/10 rounded-lg transition-colors"
              >
                <IconPlus className="w-4 h-4" />
                Add Requirement
              </button>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Skills
              </label>
              {formData.skills?.map((skill, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => handleArrayFieldChange("skills", index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B9EB3] dark:bg-neutral-800 dark:text-white"
                    placeholder={`Skill ${index + 1}`}
                  />
                  {(formData.skills?.length || 0) > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveArrayField("skills", index)}
                      className="p-2 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400"
                    >
                      <IconTrash className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddArrayField("skills")}
                className="flex items-center gap-2 px-3 py-1 text-sm text-[#2B9EB3] hover:bg-[#2B9EB3]/10 rounded-lg transition-colors"
              >
                <IconPlus className="w-4 h-4" />
                Add Skill
              </button>
            </div>

            {/* Benefits */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Benefits
              </label>
              {formData.benefits?.map((benefit, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={benefit}
                    onChange={(e) => handleArrayFieldChange("benefits", index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B9EB3] dark:bg-neutral-800 dark:text-white"
                    placeholder={`Benefit ${index + 1}`}
                  />
                  {(formData.benefits?.length || 0) > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveArrayField("benefits", index)}
                      className="p-2 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400"
                    >
                      <IconTrash className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddArrayField("benefits")}
                className="flex items-center gap-2 px-3 py-1 text-sm text-[#2B9EB3] hover:bg-[#2B9EB3]/10 rounded-lg transition-colors"
              >
                <IconPlus className="w-4 h-4" />
                Add Benefit
              </button>
            </div>

            {/* Active Status */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 text-[#2B9EB3] bg-gray-100 border-gray-300 rounded focus:ring-[#2B9EB3] dark:focus:ring-[#2B9EB3] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Active (Visible to public)
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-700 flex justify-end gap-3 bg-neutral-50 dark:bg-neutral-800">
            <button
              type="button"
              onClick={onClose}
              disabled={actionLoading}
              className="px-6 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#F9A825] to-[#2B9EB3] text-white font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
            >
              {actionLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                career ? "Update Career" : "Create Career"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CareerModal;
