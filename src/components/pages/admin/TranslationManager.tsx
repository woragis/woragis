"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationStats, useTranslationStatus } from "@/hooks/useTranslations";
import { languageNames, languageFlags } from "@/contexts/LanguageContext";
import type { SupportedLanguage, TranslationStatus } from "@/types";

interface TranslationManagerProps {
  contentType: "blog" | "project" | "experience" | "education" | "testimonial";
  contentId: string;
  contentTitle: string;
}

export const TranslationManager: React.FC<TranslationManagerProps> = ({
  contentType,
  contentId,
  contentTitle,
}) => {
  const { language } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>("en");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  const { stats, isLoading: statsLoading } = useTranslationStats();
  const { status, isLoading: statusLoading, refetch: refetchStatus } = useTranslationStatus(
    contentType,
    contentId
  );

  const supportedLanguages: SupportedLanguage[] = ["en", "es", "pt", "it", "fr", "ja", "zh", "ko"];

  const loadTranslationData = useCallback(async (lang: SupportedLanguage) => {
    try {
      const response = await fetch(`/api/translations/${contentType}/${contentId}?lang=${lang}`);
      if (response.ok) {
        const result = await response.json();
        if (result.data?.content) {
          setFormData(result.data.content);
        }
      }
    } catch (error) {
      console.error("Failed to load translation data:", error);
    }
  }, [contentType, contentId]);

  useEffect(() => {
    if (status) {
      const currentStatus = status.find((s: TranslationStatus) => s.languageCode === selectedLanguage);
      if (currentStatus) {
        // Load existing translation data if available
        loadTranslationData(selectedLanguage);
      } else {
        // Reset form for new translation
        setFormData({});
      }
    }
  }, [selectedLanguage, status, loadTranslationData]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const url = `/api/translations/${contentType}/${contentId}`;
      const method = formData.id ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          languageCode: selectedLanguage,
          ...formData,
        }),
      });

      if (response.ok) {
        setIsEditing(false);
        refetchStatus();
        // Show success message
      } else {
        const error = await response.json();
        console.error("Failed to save translation:", error);
      }
    } catch (error) {
      console.error("Failed to save translation:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const getFormFields = () => {
    switch (contentType) {
      case "blog":
        return [
          { key: "title", label: "Title", type: "text", required: true },
          { key: "excerpt", label: "Excerpt", type: "textarea", required: true },
          { key: "content", label: "Content", type: "textarea", required: true, rows: 10 },
        ];
      case "project":
        return [
          { key: "title", label: "Title", type: "text", required: true },
          { key: "description", label: "Description", type: "textarea", required: true },
          { key: "longDescription", label: "Long Description", type: "textarea", rows: 5 },
          { key: "content", label: "Content", type: "textarea", rows: 10 },
        ];
      case "experience":
        return [
          { key: "title", label: "Title", type: "text", required: true },
          { key: "company", label: "Company", type: "text", required: true },
          { key: "period", label: "Period", type: "text", required: true },
          { key: "location", label: "Location", type: "text", required: true },
          { key: "description", label: "Description", type: "textarea", required: true },
          { key: "achievements", label: "Achievements", type: "array", required: true },
        ];
      case "education":
        return [
          { key: "degree", label: "Degree", type: "text", required: true },
          { key: "school", label: "School", type: "text", required: true },
          { key: "year", label: "Year", type: "text", required: true },
          { key: "description", label: "Description", type: "textarea" },
        ];
      case "testimonial":
        return [
          { key: "name", label: "Name", type: "text", required: true },
          { key: "role", label: "Role", type: "text", required: true },
          { key: "company", label: "Company", type: "text", required: true },
          { key: "content", label: "Content", type: "textarea", required: true, rows: 5 },
        ];
      default:
        return [];
    }
  };

  const renderFormField = (field: any) => {
    const value = formData[field.key] || "";

    switch (field.type) {
      case "textarea":
        return (
          <textarea
            key={field.key}
            value={value}
            onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
            placeholder={`Enter ${field.label.toLowerCase()}...`}
            rows={field.rows || 3}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required={field.required}
          />
        );
      case "array":
        const arrayValue = Array.isArray(value) ? value : [];
        return (
          <div key={field.key} className="space-y-2">
            {arrayValue.map((item: string, index: number) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const newArray = [...arrayValue];
                    newArray[index] = e.target.value;
                    setFormData({ ...formData, [field.key]: newArray });
                  }}
                  placeholder={`Achievement ${index + 1}`}
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newArray = arrayValue.filter((_, i) => i !== index);
                    setFormData({ ...formData, [field.key]: newArray });
                  }}
                  className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                setFormData({ ...formData, [field.key]: [...arrayValue, ""] });
              }}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Add Achievement
            </button>
          </div>
        );
      default:
        return (
          <input
            key={field.key}
            type={field.type}
            value={value}
            onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
            placeholder={`Enter ${field.label.toLowerCase()}...`}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required={field.required}
          />
        );
    }
  };

  if (statusLoading) {
    return <div className="p-4">Loading translation status...</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Translation Manager
        </h2>
        <div className="text-sm text-gray-600">
          Managing: <span className="font-semibold">{contentTitle}</span>
        </div>
      </div>

      {/* Language Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Language
        </label>
        <div className="grid grid-cols-4 gap-2">
          {supportedLanguages.map((lang) => {
            const langStatus = status?.find((s: TranslationStatus) => s.languageCode === lang);
            const isComplete = langStatus?.isComplete;
            const isSelected = selectedLanguage === lang;

            return (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  isSelected
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                } ${isComplete ? "bg-green-50" : "bg-yellow-50"}`}
              >
                <div className="text-2xl mb-1">{languageFlags[lang]}</div>
                <div className="text-sm font-medium">{languageNames[lang]}</div>
                <div className="text-xs text-gray-500">
                  {isComplete ? "Complete" : "Incomplete"}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Translation Status */}
      {status && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Translation Status</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Completion:</span>{" "}
              {status.filter((s: TranslationStatus) => s.isComplete).length} / {status.length} languages
            </div>
            <div>
              <span className="font-medium">Last Updated:</span>{" "}
              {status.find((s: TranslationStatus) => s.languageCode === selectedLanguage)?.lastUpdated
                ? new Date(status.find((s: TranslationStatus) => s.languageCode === selectedLanguage)!.lastUpdated!).toLocaleDateString()
                : "Never"}
            </div>
          </div>
        </div>
      )}

      {/* Translation Form */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {languageNames[selectedLanguage]} Translation
          </h3>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Translation"}
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                {status?.find((s: TranslationStatus) => s.languageCode === selectedLanguage)?.isComplete
                  ? "Edit Translation"
                  : "Create Translation"}
              </button>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
            {getFormFields().map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {renderFormField(field)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
