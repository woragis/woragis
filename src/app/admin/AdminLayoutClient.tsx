"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ClientOnly } from "@/components/ClientOnly";
import { useAuth } from "@/stores/auth-store";
import {
  LayoutDashboard,
  FolderOpen,
  Tag,
  Folder,
  Globe,
  Code,
  Settings,
  Menu,
  X,
  Home,
  MessageSquare,
  FileText,
  Briefcase,
  LogOut,
  User,
} from "lucide-react";

interface AdminLayoutClientProps {
  children: React.ReactNode;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
    avatar?: string;
  };
}

export function AdminLayoutClient({
  children,
  user: serverUser,
}: AdminLayoutClientProps) {
  const { theme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user: clientUser, logout } = useAuth();

  // Use server user if available, otherwise fall back to client user
  const user = serverUser || clientUser;

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Projects", href: "/admin/projects", icon: FolderOpen },
    { name: "Experience", href: "/admin/experience", icon: Briefcase },
    { name: "Blog", href: "/admin/blog", icon: FileText },
    { name: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
    { name: "Tags", href: "/admin/tags", icon: Tag },
    { name: "Categories", href: "/admin/categories", icon: Folder },
    { name: "Languages", href: "/admin/languages", icon: Globe },
    { name: "Frameworks", href: "/admin/frameworks", icon: Code },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    // <AuthGuard> // Temporarily disabled
    <div
      className={`min-h-screen transition-colors duration-200 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div
          className={`flex h-full flex-col shadow-lg ${
            theme === "dark"
              ? "bg-gray-800 border-r border-gray-700"
              : "bg-white border-r border-gray-200"
          }`}
        >
          {/* Sidebar header */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
            <h1
              className={`text-xl font-semibold transition-colors duration-200 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Admin Panel
            </h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
            <div className="px-4 py-4 pb-6 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      theme === "dark"
                        ? "text-gray-300 hover:text-white hover:bg-gray-700"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <Icon
                      className={`mr-3 h-5 w-5 flex-shrink-0 ${
                        theme === "dark"
                          ? "text-gray-400 group-hover:text-gray-300"
                          : "text-gray-500 group-hover:text-gray-500"
                      }`}
                    />
                    {item.name}
                  </a>
                );
              })}
            </div>
          </nav>

          {/* Sidebar footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
            {/* User info */}
            {user && (
              <div
                className={`p-3 rounded-md ${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      theme === "dark" ? "bg-indigo-600" : "bg-indigo-500"
                    }`}
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <User className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium truncate ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {user.name}
                    </p>
                    <p
                      className={`text-xs truncate ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <ClientOnly
                fallback={
                  <div className="w-24 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                }
              >
                <LanguageSwitcher />
              </ClientOnly>
              <ThemeToggle />
            </div>

            <div className="space-y-2">
              <Link
                href="/"
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  theme === "dark"
                    ? "text-gray-300 hover:text-white hover:bg-gray-700"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <Home className="mr-3 h-5 w-5" />
                Back to Site
              </Link>

              <button
                onClick={logout}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  theme === "dark"
                    ? "text-gray-300 hover:text-white hover:bg-gray-700"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <LogOut className="mr-3 h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Mobile header */}
        <div
          className={`sticky top-0 z-10 flex h-16 items-center gap-x-4 border-b px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:hidden ${
            theme === "dark"
              ? "border-gray-700 bg-gray-800"
              : "border-gray-200 bg-white"
          }`}
        >
          <button
            type="button"
            className={`-m-2.5 p-2.5 lg:hidden ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div
            className={`flex-1 text-sm font-semibold leading-6 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Admin Dashboard
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
    // </AuthGuard> // Temporarily disabled
  );
}
