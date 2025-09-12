"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ClientOnly } from "@/components/ClientOnly";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  const { theme } = useTheme();

  return (
    <QueryClientProvider client={queryClient}>
      <div
        className={`min-h-screen transition-colors duration-200 ${
          theme === "dark"
            ? "bg-gray-900 text-white"
            : "bg-gray-50 text-gray-900"
        }`}
      >
        <nav
          className={`shadow-sm border-b transition-colors duration-200 ${
            theme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1
                  className={`text-xl font-semibold transition-colors duration-200 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Admin Dashboard
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <a
                  href="/admin/projects"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    theme === "dark"
                      ? "text-gray-300 hover:text-white hover:bg-gray-700"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  Projects
                </a>
                <a
                  href="/admin/tags"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    theme === "dark"
                      ? "text-gray-300 hover:text-white hover:bg-gray-700"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  Tags
                </a>
                <a
                  href="/admin/categories"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    theme === "dark"
                      ? "text-gray-300 hover:text-white hover:bg-gray-700"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  Categories
                </a>
                <a
                  href="/admin/languages"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    theme === "dark"
                      ? "text-gray-300 hover:text-white hover:bg-gray-700"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  Languages
                </a>
                <a
                  href="/admin/frameworks"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    theme === "dark"
                      ? "text-gray-300 hover:text-white hover:bg-gray-700"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  Frameworks
                </a>
                <a
                  href="/admin/settings"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    theme === "dark"
                      ? "text-gray-300 hover:text-white hover:bg-gray-700"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  Settings
                </a>
                <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-gray-300 dark:border-gray-600">
                  <ClientOnly
                    fallback={
                      <div className="w-24 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    }
                  >
                    <LanguageSwitcher />
                  </ClientOnly>
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
