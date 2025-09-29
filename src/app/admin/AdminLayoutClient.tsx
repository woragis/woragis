"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { LanguageSwitcher, ThemeToggle } from "@/components/ui";
import { ClientOnly } from "@/components/ClientOnly";
import { useAuth } from "@/stores/auth-store";
import {
  LayoutDashboard,
  FolderOpen,
  Tag,
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
  ChevronDown,
  ChevronRight,
  UserCircle,
  Music,
  Gamepad2,
  Users,
  Book,
  Tv,
  Guitar,
  Shield,
  Languages,
  Heart,
  Upload,
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
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const {
    user: clientUser,
    logout,
    isAuthenticated,
    isInitialized,
    isLoading,
  } = useAuth();

  // Use server user if available, otherwise fall back to client user
  const user = serverUser || clientUser;

  // Redirect if not authenticated after initialization
  useEffect(() => {
    if (isInitialized && !isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isInitialized, isLoading, router]);

  // Auto-expand navigation items when on tag management pages or about pages
  useEffect(() => {
    if (pathname.includes("/tags")) {
      if (pathname.includes("/blog/tags")) {
        setExpandedItems((prev) => new Set([...prev, "Blog"]));
      }
    } else if (pathname.includes("/about")) {
      setExpandedItems((prev) => new Set([...prev, "About"]));
    }
  }, [pathname]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const toggleExpanded = (itemName: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemName)) {
        newSet.delete(itemName);
      } else {
        newSet.add(itemName);
      }
      return newSet;
    });
  };

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    {
      name: "Projects",
      href: "/admin/projects",
      icon: FolderOpen,
    },
    { name: "Experience", href: "/admin/experience", icon: Briefcase },
    {
      name: "Blog",
      href: "/admin/blog",
      icon: FileText,
      subItems: [{ name: "Manage Tags", href: "/admin/blog/tags", icon: Tag }],
    },
    {
      name: "Testimonials",
      href: "/admin/testimonials",
      icon: MessageSquare,
    },
    { name: "Frameworks", href: "/admin/frameworks", icon: Code },
    { name: "Uploads", href: "/admin/uploads", icon: Upload },
    {
      name: "About",
      href: "/admin/about",
      icon: UserCircle,
      subItems: [
        { name: "Biography", href: "/admin/about/biography", icon: User },
        {
          name: "Music Genres",
          href: "/admin/about/music/genres",
          icon: Music,
        },
        {
          name: "Last Listened Songs",
          href: "/admin/about/music/songs",
          icon: Music,
        },
        { name: "Anime List", href: "/admin/about/anime", icon: Tv },
        { name: "Books", href: "/admin/about/books", icon: Book },
        { name: "Political Views", href: "/admin/about/politics", icon: Users },
        { name: "YouTubers", href: "/admin/about/youtubers", icon: Users },
        { name: "Games", href: "/admin/about/games", icon: Gamepad2 },
        { name: "Instruments", href: "/admin/about/instruments", icon: Guitar },
        {
          name: "Martial Arts",
          href: "/admin/about/martial-arts",
          icon: Shield,
        },
        { name: "Languages", href: "/admin/about/languages", icon: Languages },
        { name: "Hobbies", href: "/admin/about/hobbies", icon: Heart },
      ],
    },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  // Show loading while auth is initializing
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

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
            <div className="px-4 py-4 pb-6 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const hasSubItems = item.subItems && item.subItems.length > 0;
                const isExpanded = expandedItems.has(item.name);

                return (
                  <div key={item.name}>
                    <div className="flex items-center">
                      <Link
                        href={item.href}
                        className={`group flex-1 flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                          isActive(item.href)
                            ? theme === "dark"
                              ? "bg-gray-700 text-white"
                              : "bg-gray-100 text-gray-900"
                            : theme === "dark"
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
                      </Link>
                      {hasSubItems && (
                        <button
                          onClick={() => toggleExpanded(item.name)}
                          className={`p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${
                            theme === "dark" ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </button>
                      )}
                    </div>

                    {/* Sub-items */}
                    {hasSubItems && isExpanded && (
                      <div className="ml-6 mt-1 space-y-1">
                        {item.subItems!.map((subItem) => {
                          const SubIcon = subItem.icon;
                          return (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                                isActive(subItem.href)
                                  ? theme === "dark"
                                    ? "bg-gray-700 text-white"
                                    : "bg-gray-100 text-gray-900"
                                  : theme === "dark"
                                  ? "text-gray-400 hover:text-white hover:bg-gray-700"
                                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                              }`}
                            >
                              <SubIcon
                                className={`mr-3 h-4 w-4 flex-shrink-0 ${
                                  theme === "dark"
                                    ? "text-gray-500 group-hover:text-gray-300"
                                    : "text-gray-400 group-hover:text-gray-500"
                                }`}
                              />
                              {subItem.name}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
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
                    {user?.avatar ? (
                      <Image
                        src={user.avatar}
                        alt={user.name || "User avatar"}
                        width={32}
                        height={32}
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
                      {user?.name}
                    </p>
                    <p
                      className={`text-xs truncate ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {user?.email}
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
                onClick={handleLogout}
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
