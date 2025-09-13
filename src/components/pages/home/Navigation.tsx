"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button, ThemeToggle, LanguageSwitcher } from "../../ui";
import { ClientOnly } from "../../ClientOnly";
import { useAuthStore } from "@/stores/auth-store";
import { usePathname } from "next/navigation";

export const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: t("navigation.about"), href: "/#about" },
    { name: t("navigation.skills"), href: "/#skills" },
    { name: t("navigation.experience"), href: "/#experience" },
    { name: t("navigation.projects"), href: "/#projects" },
    { name: t("navigation.testimonials"), href: "/#testimonials" },
    { name: t("navigation.blog"), href: "/#blog" },
    { name: t("navigation.contact"), href: "/#contact" },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  const isAdmin = useAuthStore((state) => state.user?.role === "admin");

  if (isAdmin) {
    navItems.push({ name: t("navigation.admin"), href: "/admin" });
  }

  const pathname = usePathname();
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-black/90 backdrop-blur-md shadow-lg shadow-green-500/20 border-b border-green-500/30"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a
              href="/#"
              className="text-xl font-display font-black text-green-400 hover:text-cyan-400 transition-colors neon-text"
            >
              {t("logo")}
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-300 hover:text-green-400 px-3 py-2 text-sm font-pixel font-bold transition-colors hover:animate-neon-pulse"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          {/* Language Switcher, Theme Toggle and CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <ClientOnly
              fallback={
                <div className="w-24 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              }
            >
              <LanguageSwitcher />
            </ClientOnly>
            <ThemeToggle />
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("#contact");
              }}
              className="retro-button px-4 py-2 text-sm"
            >
              {t("getInTouch")}
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-green-400 hover:text-cyan-400 p-2 transition-colors"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 gaming-card rounded-lg mt-2 shadow-lg">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.href);
                  }}
                  className="text-gray-300 hover:text-green-400 block px-3 py-2 text-base font-pixel font-bold w-full text-left transition-colors hover:animate-neon-pulse"
                >
                  {item.name}
                </a>
              ))}
              <div className="pt-4 space-y-3">
                <div className="flex justify-center space-x-2">
                  <ClientOnly
                    fallback={
                      <div className="w-24 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    }
                  >
                    <LanguageSwitcher />
                  </ClientOnly>
                  <ThemeToggle />
                </div>
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("#contact");
                  }}
                  className="retro-button px-4 py-2 text-sm w-full text-center"
                >
                  {t("getInTouch")}
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
