"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  const socialLinks = [
    { name: "GitHub", href: "https://github.com/yourusername", icon: "🐙" },
    {
      name: "LinkedIn",
      href: "https://linkedin.com/in/yourprofile",
      icon: "💼",
    },
    { name: "Twitter", href: "https://twitter.com/yourusername", icon: "🐦" },
    { name: "Email", href: "mailto:hello@example.com", icon: "📧" },
  ];

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              &lt;/&gt; Developer
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {t("footer.description")}
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  aria-label={link.name}
                >
                  <span className="text-xl">{link.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t("footer.quickLinks")}
            </h3>
            <ul className="space-y-2">
              {[
                { name: "About", href: "#about" },
                { name: "Skills", href: "#skills" },
                { name: "Projects", href: "#projects" },
                { name: "Contact", href: "#contact" },
              ].map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => {
                      const element = document.querySelector(link.href);
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t("footer.getInTouch")}
            </h3>
            <div className="space-y-2 text-gray-600 dark:text-gray-300">
              <p>{t("footer.contactInfo.email")}</p>
              <p>{t("footer.contactInfo.location")}</p>
              <p>{t("footer.contactInfo.availability")}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            {t("footer.copyright").replace("{year}", currentYear.toString())}
          </p>
        </div>
      </div>
    </footer>
  );
};
