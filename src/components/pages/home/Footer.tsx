"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from "react-icons/fa";
import {
  ValorantBackground,
  AbstractShapes,
  CodeIcon,
  RocketIcon,
  SparklesIcon,
  ShieldIcon,
  ZapIcon,
  TargetIcon,
} from "../../ui";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  const socialLinks = [
    { name: "GitHub", href: "https://github.com/yourusername", icon: FaGithub },
    {
      name: "LinkedIn",
      href: "https://linkedin.com/in/yourprofile",
      icon: FaLinkedin,
    },
    {
      name: "Twitter",
      href: "https://twitter.com/yourusername",
      icon: FaTwitter,
    },
    { name: "Email", href: "mailto:hello@example.com", icon: FaEnvelope },
  ];

  const footerIcons = [
    CodeIcon,
    RocketIcon,
    SparklesIcon,
    ShieldIcon,
    ZapIcon,
    TargetIcon,
  ];

  return (
    <ValorantBackground variant="minimal" className="py-12">
      <footer className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <CodeIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xl font-bold gradient-text">
                  {t("logo")}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                {t("footer.description")}
              </p>
              <div className="flex space-x-4">
                {socialLinks.map((link, index) => {
                  const IconComponent = link.icon;
                  const AbstractIcon = footerIcons[index % footerIcons.length];
                  return (
                    <a
                      key={link.name}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors hover-lift"
                      aria-label={link.name}
                    >
                      <div className="relative">
                        <IconComponent className="text-xl" />
                        <AbstractIcon className="absolute -top-1 -right-1 w-3 h-3 text-purple-600 dark:text-purple-400" />
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                {t("footer.quickLinks")}
              </h3>
              <ul className="space-y-2">
                {[
                  { name: "About", href: "#about" },
                  { name: "Skills", href: "#skills" },
                  { name: "Projects", href: "#projects" },
                  { name: "Contact", href: "#contact" },
                ].map((link, index) => {
                  const AbstractIcon = footerIcons[index % footerIcons.length];
                  return (
                    <li key={link.name}>
                      <button
                        onClick={() => {
                          const element = document.querySelector(link.href);
                          if (element) {
                            element.scrollIntoView({ behavior: "smooth" });
                          }
                        }}
                        className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center hover-lift"
                      >
                        <AbstractIcon className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" />
                        {link.name}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                {t("footer.getInTouch")}
              </h3>
              <div className="space-y-2 text-slate-600 dark:text-slate-300">
                <p className="flex items-center">
                  <RocketIcon className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" />
                  {t("footer.contactInfo.email")}
                </p>
                <p className="flex items-center">
                  <SparklesIcon className="w-4 h-4 mr-2 text-purple-600 dark:text-purple-400" />
                  {t("footer.contactInfo.location")}
                </p>
                <p className="flex items-center">
                  <ShieldIcon className="w-4 h-4 mr-2 text-pink-600 dark:text-pink-400" />
                  {t("footer.contactInfo.availability")}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-700 mt-8 pt-8 text-center">
            <p className="text-slate-500 dark:text-slate-400">
              {t("footer.copyright").replace("{year}", currentYear.toString())}
            </p>
            <div className="flex justify-center mt-4 space-x-2">
              {footerIcons.map((Icon, index) => (
                <Icon
                  key={index}
                  className="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-pulse"
                  style={{ animationDelay: `${index * 0.5}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      </footer>
    </ValorantBackground>
  );
};
