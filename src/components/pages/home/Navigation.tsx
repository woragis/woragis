"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ThemeToggle, LanguageSwitcher, Button } from "@/components/ui";
import { CodeIcon } from "@/components/ui/AbstractIcons";
import { usePathname } from "next/navigation";
import Link from "next/link";

export const Navigation: React.FC = () => {
  const { t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { name: t("nav.about"), href: "#about" },
    { name: t("nav.skills"), href: "#skills" },
    { name: t("nav.experience"), href: "#experience" },
    { name: t("nav.projects"), href: "#projects" },
    { name: t("nav.contact"), href: "#contact" },
  ];

  const pathname = usePathname();
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 animate-fade-in ${
        isScrolled
          ? "glass-morphism backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            className="flex-shrink-0 animate-fade-in"
            style={{ animationDelay: "100ms", animationFillMode: "both" }}
          >
            <Link
              href="/"
              className="flex items-center space-x-2 text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 hover:scale-105"
            >
              <CodeIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400 transition-transform duration-200 hover:rotate-12" />
              <span className="text-xl font-bold gradient-text transition-all duration-200">
                {t("logo")}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item, index) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.href);
                  }}
                  className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg hover:scale-105 animate-fade-in"
                  style={{
                    animationDelay: `${200 + index * 100}ms`,
                    animationFillMode: "both",
                  }}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <div
              className="animate-fade-in"
              style={{ animationDelay: "600ms", animationFillMode: "both" }}
            >
              <LanguageSwitcher />
            </div>
            <div
              className="animate-fade-in"
              style={{ animationDelay: "700ms", animationFillMode: "both" }}
            >
              <ThemeToggle />
            </div>
            <div
              className="animate-fade-in"
              style={{ animationDelay: "800ms", animationFillMode: "both" }}
            >
              <Button
                variant="modern"
                size="sm"
                className="w-48"
                onClick={() => scrollToSection("#contact")}
              >
                {t("getInTouch")}
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div
            className="md:hidden animate-fade-in"
            style={{ animationDelay: "200ms", animationFillMode: "both" }}
          >
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 hover:scale-110"
            >
              <svg
                className="h-6 w-6 transition-transform duration-200"
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

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden animate-fade-in">
            <div className="glass-morphism rounded-lg mt-2 p-4 space-y-2">
              {navItems.map((item, index) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.href);
                  }}
                  className="block text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 text-base font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 hover:scale-105 animate-fade-in"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: "both",
                  }}
                >
                  {item.name}
                </a>
              ))}
              <div
                className="pt-4 border-t border-slate-200 dark:border-slate-700 animate-fade-in"
                style={{ animationDelay: "500ms", animationFillMode: "both" }}
              >
                <div className="flex items-center justify-between">
                  <LanguageSwitcher />
                  <ThemeToggle />
                </div>
                <Button
                  variant="modern"
                  size="sm"
                  className="w-full mt-4"
                  onClick={() => scrollToSection("#contact")}
                >
                  {t("getInTouch")}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
