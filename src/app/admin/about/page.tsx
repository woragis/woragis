"use client";

import Link from "next/link";
import {
  Music,
  Tv,
  Book,
  Users,
  Gamepad2,
  Plus,
  Eye,
  Guitar,
  Shield,
  Languages,
  Heart,
} from "lucide-react";
import { AdminPageLayout } from "@/components/pages/admin/AdminPageLayout";

export default function AboutAdminPage() {
  const aboutSections = [
    {
      title: "Music",
      description: "Manage music genres and last listened songs",
      href: "/admin/about/music",
      icon: Music,
      color: "bg-purple-500",
    },
    {
      title: "Anime",
      description: "Manage your anime list and favorites",
      href: "/admin/about/anime",
      icon: Tv,
      color: "bg-pink-500",
    },
    {
      title: "Books",
      description: "Manage your book collection and reading list",
      href: "/admin/about/books",
      icon: Book,
      color: "bg-green-500",
    },
    {
      title: "Politics",
      description: "Manage your political views and opinions",
      href: "/admin/about/politics",
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "YouTubers",
      description: "Manage your favorite YouTubers and channels",
      href: "/admin/about/youtubers",
      icon: Eye,
      color: "bg-red-500",
    },
    {
      title: "Games",
      description: "Manage your gaming preferences and favorites",
      href: "/admin/about/games",
      icon: Gamepad2,
      color: "bg-indigo-500",
    },
    {
      title: "Instruments",
      description: "Manage your musical instruments and learning progress",
      href: "/admin/about/instruments",
      icon: Guitar,
      color: "bg-amber-500",
    },
    {
      title: "Martial Arts",
      description: "Manage your martial arts training and grades",
      href: "/admin/about/martial-arts",
      icon: Shield,
      color: "bg-orange-500",
    },
    {
      title: "Languages",
      description: "Manage your spoken languages and proficiency",
      href: "/admin/about/languages",
      icon: Languages,
      color: "bg-teal-500",
    },
    {
      title: "Hobbies",
      description: "Manage your hobbies and interests",
      href: "/admin/about/hobbies",
      icon: Heart,
      color: "bg-rose-500",
    },
  ];

  return (
    <AdminPageLayout
      title="About Management"
      description="Manage your personal information and interests"
    >
      <div className="space-y-6">
        {/* Biography Management Notice */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Biography Management
              </h3>
              <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                <p>
                  Your biography and featured biography are now managed in the{" "}
                  <Link
                    href="/admin/settings"
                    className="font-medium underline hover:text-blue-600 dark:hover:text-blue-200"
                  >
                    Settings page
                  </Link>
                  . You can update your featured biography (shown on the home
                  page) and full biography there.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* About Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aboutSections.map((section) => {
            const Icon = section.icon;
            return (
              <Link
                key={section.title}
                href={section.href}
                className="group relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div
                      className={`p-3 rounded-lg ${section.color} bg-opacity-10`}
                    >
                      <Icon
                        className={`h-6 w-6 ${section.color.replace(
                          "bg-",
                          "text-"
                        )}`}
                      />
                    </div>
                    <Plus className="h-5 w-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-200">
                      {section.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300">
                      {section.description}
                    </p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 dark:to-gray-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </Link>
            );
          })}
        </div>
      </div>
    </AdminPageLayout>
  );
}
