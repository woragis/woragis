"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePublicBiography } from "@/hooks/about/useBiography";
import {
  Section,
  Container,
  Card,
  ValorantBackground,
  AbstractShapes,
  CodeIcon,
  RocketIcon,
  SparklesIcon,
  ShieldIcon,
  ZapIcon,
  TargetIcon,
} from "../../ui";
import { Button } from "../../ui/Button";
import { ArrowRight, User, Briefcase } from "lucide-react";

export const About: React.FC = () => {
  const { t } = useLanguage();
  const { data: biography, isLoading } = usePublicBiography();

  const stats = [
    { label: t("about.stats.yearsExperience"), value: "5+", icon: RocketIcon },
    { label: t("about.stats.projectsCompleted"), value: "50+", icon: CodeIcon },
    { label: t("about.stats.technologies"), value: "15+", icon: SparklesIcon },
    { label: t("about.stats.happyClients"), value: "30+", icon: ShieldIcon },
  ];

  return (
    <ValorantBackground variant="abstract" className="py-20">
      <Section
        id="about"
        title={t("about.title")}
        subtitle={t("about.subtitle")}
      >
        <Container>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                {isLoading ? (
                  <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                ) : (
                  t("heading")
                )}
              </h3>

              {/* Featured Biography */}
              {!isLoading && biography?.featuredBiography && (
                <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300 uppercase tracking-wide">
                      About Me
                    </span>
                  </div>
                  <p className="text-slate-800 dark:text-slate-200">
                    {biography.featuredBiography}
                  </p>
                </div>
              )}

              {/* Loading state for biography */}
              {isLoading && (
                <div className="mb-6 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24 mb-2"></div>
                  <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                </div>
              )}

              {/* Biography Description */}
              {isLoading ? (
                <div className="space-y-4">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 animate-pulse"></div>
                </div>
              ) : biography?.fullBiography ? (
                <div className="space-y-6 text-slate-600 dark:text-slate-300">
                  <div
                    className="text-lg leading-relaxed prose prose-slate dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: biography.fullBiography,
                    }}
                  />
                </div>
              ) : (
                <div className="space-y-6 text-slate-600 dark:text-slate-300">
                  <p className="text-lg leading-relaxed">{t("description1")}</p>
                  <p className="text-lg leading-relaxed">{t("description2")}</p>
                  <p className="text-lg leading-relaxed">{t("description3")}</p>
                </div>
              )}

              {/* Learn More About Me Button */}
              <div className="mt-8">
                <Link href="/about">
                  <Button
                    size="lg"
                    className="group relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0"
                  >
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5" />
                      <span>Learn More About Me</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Button>
                </Link>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">
                  Discover my interests, hobbies, and personal journey
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <Card
                    key={index}
                    variant="glass"
                    className="text-center hover-lift hover-glow"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 glass-morphism rounded-full flex items-center justify-center mb-4">
                        <IconComponent className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2 gradient-text">
                        {stat.value}
                      </div>
                      <div className="text-slate-600 dark:text-slate-300 text-sm font-medium">
                        {stat.label}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </Container>
      </Section>
    </ValorantBackground>
  );
};
