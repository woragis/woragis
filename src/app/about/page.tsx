"use client";

import { useState, useEffect } from "react";
import type { AboutCore } from "@/types";

export default function AboutPage() {
  const [aboutCore, setAboutCore] = useState<AboutCore | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAboutCore();
  }, []);

  const fetchAboutCore = async () => {
    try {
      const response = await fetch("/api/about/core");
      const data = await response.json();
      if (data.success && data.data) {
        setAboutCore(data.data.about);
      }
    } catch (error) {
      console.error("Failed to fetch about core:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!aboutCore) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">About</h1>
          <p className="mt-4 text-gray-600">No about information available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {aboutCore.name}
              </h1>
              {aboutCore.featuredBiography && (
                <p className="text-xl text-gray-600 leading-relaxed">
                  {aboutCore.featuredBiography}
                </p>
              )}
            </div>

            {aboutCore.biography && (
              <div className="prose prose-lg max-w-none">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  About Me
                </h2>
                <div
                  className="text-gray-700 leading-relaxed whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{
                    __html: aboutCore.biography.replace(/\n/g, "<br>"),
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
