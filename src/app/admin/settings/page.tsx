"use client";

import React, { useState, useEffect } from "react";
import {
  useBiography,
  useUpdateBiography,
  useSocialMedia,
  useUpdateSocialMedia,
  useContactInfo,
  useUpdateContactInfo,
  useSiteSettings,
  useUpdateSiteSettings,
} from "@/hooks/useSettings";
import { MarkdownEditor } from "@/components/ui";
import { 
  Card, 
  Button, 
  Container, 
  EmptyState 
} from "@/components/ui";
import {
  User,
  Globe,
  Mail,
  Phone,
  MapPin,
  Upload,
  Trash2,
  Save,
  X,
  Edit3,
  Image as ImageIcon,
  Link as LinkIcon,
  Settings as SettingsIcon,
} from "lucide-react";
import type {
  Biography,
  NewBiography,
  SocialMedia,
  NewSocialMedia,
  ContactInfo,
  NewContactInfo,
  SiteSettings,
  NewSiteSettings,
} from "@/types";

export default function SettingsAdminPage() {
  // Individual hooks for each settings section
  const { data: biography, isLoading: biographyLoading } = useBiography();
  const { data: socialMedia, isLoading: socialLoading } = useSocialMedia();
  const { data: contactInfo, isLoading: contactLoading } = useContactInfo();
  const { data: siteSettings, isLoading: siteLoading } = useSiteSettings();

  const updateBiography = useUpdateBiography();
  const updateSocialMedia = useUpdateSocialMedia();
  const updateContactInfo = useUpdateContactInfo();
  const updateSiteSettings = useUpdateSiteSettings();

  const [formData, setFormData] = useState<{
    biography: Partial<NewBiography>;
    social: Partial<NewSocialMedia>;
    contact: Partial<NewContactInfo>;
    site: Partial<NewSiteSettings>;
  }>({
    biography: {},
    social: {},
    contact: {},
    site: {},
  });
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "biography" | "social" | "contact" | "site"
  >("biography");

  useEffect(() => {
    setFormData({
      biography: biography || {},
      social: socialMedia || {},
      contact: contactInfo || {},
      site: siteSettings || {},
    });
  }, [biography, socialMedia, contactInfo, siteSettings]);

  const handleInputChange = (
    section: "biography" | "social" | "contact" | "site",
    field: string,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    try {
      // Update each section individually
      if (Object.keys(formData.biography).length > 0) {
        await updateBiography.mutateAsync(formData.biography);
      }
      if (Object.keys(formData.social).length > 0) {
        await updateSocialMedia.mutateAsync(formData.social);
      }
      if (Object.keys(formData.contact).length > 0) {
        await updateContactInfo.mutateAsync(formData.contact);
      }
      if (Object.keys(formData.site).length > 0) {
        await updateSiteSettings.mutateAsync(formData.site);
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  };

  const handleCancel = () => {
    setFormData({
      biography: biography || {},
      social: socialMedia || {},
      contact: contactInfo || {},
      site: siteSettings || {},
    });
    setIsEditing(false);
  };

  const isLoading =
    biographyLoading || socialLoading || contactLoading || siteLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
        <Container>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Settings
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Manage your profile, social media, contact information, and site settings
            </p>
          </div>

          {/* Action Buttons Skeleton */}
          <div className="flex justify-center space-x-3 mb-8">
            <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          </div>

          {/* Tab Navigation Skeleton */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
            <div className="flex space-x-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center space-x-2 py-2">
                  <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Settings Content Skeleton */}
          <Card className="p-6 animate-pulse">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center mb-6">
                <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded mr-2"></div>
                <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i}>
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                ))}
              </div>

              {/* Textarea */}
              <div>
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-24 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>

              {/* Checkbox */}
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded mr-2"></div>
                <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </Card>
        </Container>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
        <Container>
          <EmptyState
            title="No Settings Data"
            description="Unable to load settings data. Please try again later."
          />
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
      <Container>
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center">
              <SettingsIcon className="w-10 h-10 mr-3 text-blue-600" />
              Settings
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Manage your profile, social media, contact information, and site settings
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-3 mb-8">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="flex items-center space-x-2"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </Button>
                <Button
                  onClick={handleSave}
                  className="flex items-center space-x-2"
                  disabled={
                    updateBiography.isPending ||
                    updateSocialMedia.isPending ||
                    updateContactInfo.isPending ||
                    updateSiteSettings.isPending
                  }
                >
                  <Save className="w-4 h-4" />
                  <span>
                    {updateBiography.isPending ||
                    updateSocialMedia.isPending ||
                    updateContactInfo.isPending ||
                    updateSiteSettings.isPending
                      ? "Saving..."
                      : "Save Changes"}
                  </span>
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Settings</span>
              </Button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: "biography", label: "Biography", icon: User },
              { id: "social", label: "Social Media", icon: LinkIcon },
              { id: "contact", label: "Contact Info", icon: Mail },
              { id: "site", label: "Site Settings", icon: Globe },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Biography Tab */}
          {activeTab === "biography" && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Biography Settings
              </h2>

              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Featured Biography
                    </label>
                    <input
                      type="text"
                      value={formData.biography.featuredBiography || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "biography",
                          "featuredBiography",
                          e.target.value
                        )
                      }
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
                      placeholder="Short description for hero section"
                    />
                  </div>
                </div>

                {/* Full Biography with Markdown Editor */}
                <MarkdownEditor
                  value={formData.biography.fullBiography || ""}
                  onChange={(value) =>
                    handleInputChange("biography", "fullBiography", value)
                  }
                  label="Full Biography"
                  description="Write your detailed biography using Markdown. This will be displayed on the about page."
                  placeholder="Write your biography here using Markdown syntax..."
                />

                {/* Visibility Toggle */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="biography_visible"
                    checked={formData.biography.visible}
                    onChange={(e) =>
                      handleInputChange(
                        "biography",
                        "visible",
                        e.target.checked
                      )
                    }
                    disabled={!isEditing}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded disabled:opacity-50"
                  />
                  <label
                    htmlFor="biography_visible"
                    className="ml-2 block text-sm text-gray-900 dark:text-white"
                  >
                    Make biography visible to public
                  </label>
                </div>
              </div>
            </Card>
          )}

          {/* Social Media Tab */}
          {activeTab === "social" && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <LinkIcon className="w-5 h-5 mr-2" />
                Social Media Links
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    key: "github",
                    label: "GitHub",
                    placeholder: "https://github.com/username",
                  },
                  {
                    key: "linkedin",
                    label: "LinkedIn",
                    placeholder: "https://linkedin.com/in/username",
                  },
                  {
                    key: "twitter",
                    label: "Twitter",
                    placeholder: "https://twitter.com/username",
                  },
                  {
                    key: "instagram",
                    label: "Instagram",
                    placeholder: "https://instagram.com/username",
                  },
                  {
                    key: "youtube",
                    label: "YouTube",
                    placeholder: "https://youtube.com/@username",
                  },
                  {
                    key: "discord",
                    label: "Discord",
                    placeholder: "https://discord.gg/invite",
                  },
                  {
                    key: "telegram",
                    label: "Telegram",
                    placeholder: "https://t.me/username",
                  },
                  {
                    key: "website",
                    label: "Personal Website",
                    placeholder: "https://yourwebsite.com",
                  },
                ].map((social) => (
                  <div key={social.key}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {social.label}
                    </label>
                    <input
                      type="url"
                      value={String(
                        formData.social[social.key as keyof NewSocialMedia] ||
                          ""
                      )}
                      onChange={(e) =>
                        handleInputChange("social", social.key, e.target.value)
                      }
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
                      placeholder={social.placeholder}
                    />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Contact Information Tab */}
          {activeTab === "contact" && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                Contact Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.contact.email || ""}
                    onChange={(e) =>
                      handleInputChange("contact", "email", e.target.value)
                    }
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.contact.phone || ""}
                    onChange={(e) =>
                      handleInputChange("contact", "phone", e.target.value)
                    }
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={formData.contact.address || ""}
                    onChange={(e) =>
                      handleInputChange("contact", "address", e.target.value)
                    }
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
                    placeholder="123 Main Street, Apt 4B"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.contact.city || ""}
                    onChange={(e) =>
                      handleInputChange("contact", "city", e.target.value)
                    }
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
                    placeholder="New York"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    value={formData.contact.country || ""}
                    onChange={(e) =>
                      handleInputChange("contact", "country", e.target.value)
                    }
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
                    placeholder="United States"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Timezone
                  </label>
                  <input
                    type="text"
                    value={formData.contact.timezone || ""}
                    onChange={(e) =>
                      handleInputChange("contact", "timezone", e.target.value)
                    }
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
                    placeholder="America/New_York"
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Site Settings Tab */}
          {activeTab === "site" && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                Site Settings
              </h2>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Site Title
                    </label>
                    <input
                      type="text"
                      value={formData.site.title || ""}
                      onChange={(e) =>
                        handleInputChange("site", "title", e.target.value)
                      }
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
                      placeholder="Your Portfolio"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Default Theme
                    </label>
                    <select
                      value={formData.site.theme || "system"}
                      onChange={(e) =>
                        handleInputChange("site", "theme", e.target.value)
                      }
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="system">System</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Site Description
                  </label>
                  <textarea
                    value={formData.site.description || ""}
                    onChange={(e) =>
                      handleInputChange("site", "description", e.target.value)
                    }
                    disabled={!isEditing}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
                    placeholder="A brief description of your portfolio site"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Projects Per Page
                    </label>
                    <input
                      type="number"
                      value={formData.site.projectsPerPage || 6}
                      onChange={(e) =>
                        handleInputChange(
                          "site",
                          "projectsPerPage",
                          parseInt(e.target.value)
                        )
                      }
                      disabled={!isEditing}
                      min="1"
                      max="50"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Default Language
                    </label>
                    <input
                      type="text"
                      value={formData.site.language || "en"}
                      onChange={(e) =>
                        handleInputChange("site", "language", e.target.value)
                      }
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
                      placeholder="en"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="maintenance_mode"
                    checked={formData.site.maintenanceMode}
                    onChange={(e) =>
                      handleInputChange(
                        "site",
                        "maintenanceMode",
                        e.target.checked
                      )
                    }
                    disabled={!isEditing}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded disabled:opacity-50"
                  />
                  <label
                    htmlFor="maintenance_mode"
                    className="ml-2 block text-sm text-gray-900 dark:text-white"
                  >
                    Enable maintenance mode
                  </label>
                </div>
              </div>
            </Card>
          )}
        </div>
      </Container>
    </div>
  );
}
