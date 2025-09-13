"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from "react-icons/fa";
import {
  GamingBackground,
  StarIcon,
  TrophyIcon,
  PowerUpIcon,
  ControllerIcon,
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

  const footerIcons = [StarIcon, TrophyIcon, PowerUpIcon, ControllerIcon];

  return (
    <GamingBackground variant="pixel" className="py-12">
      <footer className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Brand */}
            <div>
              <div className="text-xl font-pixel font-bold text-green-400 neon-text mb-4">
                &lt;/&gt; Developer
              </div>
              <p className="text-gray-300 mb-4 font-sans leading-relaxed">
                {t("footer.description")}
              </p>
              <div className="flex space-x-4">
                {socialLinks.map((link, index) => {
                  const IconComponent = link.icon;
                  const GamingIcon = footerIcons[index % footerIcons.length];
                  return (
                    <a
                      key={link.name}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-green-400 transition-colors gaming-hover"
                      aria-label={link.name}
                    >
                      <div className="relative">
                        <IconComponent className="text-xl" />
                        <GamingIcon className="absolute -top-1 -right-1 w-3 h-3 text-pink-400 animate-neon-pulse" />
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-pixel font-bold text-green-400 neon-text mb-4">
                {t("footer.quickLinks")}
              </h3>
              <ul className="space-y-2">
                {[
                  { name: "About", href: "#about" },
                  { name: "Skills", href: "#skills" },
                  { name: "Projects", href: "#projects" },
                  { name: "Contact", href: "#contact" },
                ].map((link, index) => {
                  const GamingIcon = footerIcons[index % footerIcons.length];
                  return (
                    <li key={link.name}>
                      <button
                        onClick={() => {
                          const element = document.querySelector(link.href);
                          if (element) {
                            element.scrollIntoView({ behavior: "smooth" });
                          }
                        }}
                        className="text-gray-300 hover:text-cyan-400 transition-colors font-pixel font-bold flex items-center gaming-hover"
                      >
                        <GamingIcon className="w-4 h-4 mr-2 text-green-400" />
                        {link.name}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-pixel font-bold text-green-400 neon-text mb-4">
                {t("footer.getInTouch")}
              </h3>
              <div className="space-y-2 text-gray-300 font-sans">
                <p className="flex items-center">
                  <StarIcon className="w-4 h-4 mr-2 text-cyan-400" />
                  {t("footer.contactInfo.email")}
                </p>
                <p className="flex items-center">
                  <TrophyIcon className="w-4 h-4 mr-2 text-pink-400" />
                  {t("footer.contactInfo.location")}
                </p>
                <p className="flex items-center">
                  <PowerUpIcon className="w-4 h-4 mr-2 text-yellow-400" />
                  {t("footer.contactInfo.availability")}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-green-400/30 mt-8 pt-8 text-center">
            <p className="text-gray-400 font-pixel">
              {t("footer.copyright").replace("{year}", currentYear.toString())}
            </p>
            <div className="flex justify-center mt-4 space-x-2">
              {footerIcons.map((Icon, index) => (
                <Icon
                  key={index}
                  className="w-4 h-4 text-green-400 animate-neon-pulse"
                  style={{ animationDelay: `${index * 0.5}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      </footer>
    </GamingBackground>
  );
};
