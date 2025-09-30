"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { GraduationCap, Building2, FileText, Globe, Calendar, Award, Hash, Eye } from "lucide-react";
import type { Education, NewEducation, EducationType, DegreeLevel } from "@/types/education";

interface EducationFormProps {
  education?: Education;
  userId: string;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isLoading?: boolean;
  onFormDataChange?: (data: any) => void;
}

export const EducationForm: React.FC<EducationFormProps> = ({
  education,
  userId,
  onSubmit,
  onCancel,
  isLoading = false,
  onFormDataChange,
}) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    title: "",
    institution: "",
    description: "",
    type: "degree" as EducationType,
    degreeLevel: "bachelor" as DegreeLevel,
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
    completionDate: "",
    grade: "",
    credits: 0,
    certificateId: "",
    issuer: "",
    validityPeriod: "",
    pdfDocument: "",
    verificationUrl: "",
    skills: [] as string[],
    order: 0,
    visible: true,
  });

  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    if (education) {
      setFormData({
        title: education.title || "",
        institution: education.institution || "",
        description: education.description || "",
        type: education.type || "degree",
        degreeLevel: education.degreeLevel || "bachelor",
        fieldOfStudy: education.fieldOfStudy || "",
        startDate: education.startDate ? new Date(education.startDate).toISOString().split('T')[0] : "",
        endDate: education.endDate ? new Date(education.endDate).toISOString().split('T')[0] : "",
        completionDate: education.completionDate ? new Date(education.completionDate).toISOString().split('T')[0] : "",
        grade: education.grade || "",
        credits: education.credits || 0,
        certificateId: education.certificateId || "",
        issuer: education.issuer || "",
        validityPeriod: education.validityPeriod || "",
        pdfDocument: education.pdfDocument || "",
        verificationUrl: education.verificationUrl || "",
        skills: Array.isArray(education.skills) ? education.skills : (education.skills ? [education.skills] : []),
        order: education.order || 0,
        visible: education.visible || true,
      });
    }
  }, [education]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : 
        type === "number" ? parseInt(value) || 0 :
        value,
    }));
  };

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", "education-document");

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();
      if (result.success && result.data?.url) {
        setFormData((prev) => ({
          ...prev,
          pdfDocument: result.data.url,
        }));
      }
    } catch (error) {
      console.error("File upload error:", error);
      alert("Failed to upload PDF. Please try again.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        alert("Please select a PDF file.");
        return;
      }
      handleFileUpload(file);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  // Notify parent of form data changes
  useEffect(() => {
    if (onFormDataChange) {
      onFormDataChange({
        ...formData,
        userId,
        startDate: formData.startDate ? new Date(formData.startDate) : null,
        endDate: formData.endDate ? new Date(formData.endDate) : null,
        completionDate: formData.completionDate ? new Date(formData.completionDate) : null,
      });
    }
  }, [formData, userId, onFormDataChange]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  }, [onSubmit]);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
          <GraduationCap className="w-4 h-4 mr-2" />
          {t("admin.education.form.title")} *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          required
          placeholder={t("admin.education.form.titlePlaceholder")}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      {/* Institution */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
          <Building2 className="w-4 h-4 mr-2" />
          {t("admin.education.form.institution")} *
        </label>
        <input
          type="text"
          name="institution"
          value={formData.institution}
          onChange={handleInputChange}
          required
          placeholder={t("admin.education.form.institutionPlaceholder")}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      {/* Type and Degree Level */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t("admin.education.form.type")} *
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="degree">{t("admin.education.types.degree")}</option>
            <option value="certificate">{t("admin.education.types.certificate")}</option>
          </select>
        </div>

        {formData.type === "degree" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("admin.education.form.degreeLevel")} *
            </label>
            <select
              name="degreeLevel"
              value={formData.degreeLevel}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="bachelor">{t("admin.education.degreeLevels.bachelor")}</option>
              <option value="master">{t("admin.education.degreeLevels.master")}</option>
              <option value="doctorate">{t("admin.education.degreeLevels.doctorate")}</option>
              <option value="associate">{t("admin.education.degreeLevels.associate")}</option>
              <option value="diploma">{t("admin.education.degreeLevels.diploma")}</option>
            </select>
          </div>
        )}
      </div>

      {/* Field of Study and Certificate Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Field of Study
          </label>
          <input
            type="text"
            name="fieldOfStudy"
            value={formData.fieldOfStudy}
            onChange={handleInputChange}
            placeholder="e.g., Computer Science, Business Administration"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        {formData.type === "certificate" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Certificate ID
            </label>
            <input
              type="text"
              name="certificateId"
              value={formData.certificateId}
              onChange={handleInputChange}
              placeholder="Certificate number or ID"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        )}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            Start Date
          </label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            End Date
          </label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Completion Date
          </label>
          <input
            type="date"
            name="completionDate"
            value={formData.completionDate}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Grade and Credits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
            <Award className="w-4 h-4 mr-2" />
            Grade
          </label>
          <input
            type="text"
            name="grade"
            value={formData.grade}
            onChange={handleInputChange}
            placeholder="e.g., 3.8 GPA, 85%, A+"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        {formData.type === "degree" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Credits
            </label>
            <input
              type="number"
              name="credits"
              value={formData.credits}
              onChange={handleInputChange}
              min="0"
              placeholder="120"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        )}
      </div>

      {/* Certificate-specific fields */}
      {formData.type === "certificate" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Issuer
            </label>
            <input
              type="text"
              name="issuer"
              value={formData.issuer}
              onChange={handleInputChange}
              placeholder="e.g., Amazon Web Services, Google"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Validity Period
            </label>
            <input
              type="text"
              name="validityPeriod"
              value={formData.validityPeriod}
              onChange={handleInputChange}
              placeholder="e.g., 3 years, Lifetime, Until 2025"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      )}

      {/* PDF Document Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
          <FileText className="w-4 h-4 mr-2" />
          PDF Document
        </label>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
        {formData.pdfDocument && (
          <p className="mt-2 text-sm text-green-600 dark:text-green-400">
            ✓ PDF uploaded: {formData.pdfDocument.split('/').pop()}
          </p>
        )}
      </div>

      {/* Verification URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
          <Globe className="w-4 h-4 mr-2" />
          Verification URL
        </label>
        <input
          type="url"
          name="verificationUrl"
          value={formData.verificationUrl}
          onChange={handleInputChange}
          placeholder="https://verify.example.com/certificate/123"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      {/* Skills */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Skills Gained
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Add a skill"
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
          />
          <Button type="button" onClick={addSkill} variant="outline">
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.skills.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-md text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="ml-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={3}
          placeholder="Additional details about this education record..."
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      {/* Order and Visibility */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Display Order
          </label>
          <input
            type="number"
            name="order"
            value={formData.order}
            onChange={handleInputChange}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="visible"
            checked={formData.visible}
            onChange={handleInputChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
          />
          <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300 flex items-center">
            <Eye className="w-4 h-4 mr-1" />
            Visible
          </label>
        </div>
      </div>
    </div>
  );
};
