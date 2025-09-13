"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Section,
  Container,
  Card,
  EmptyState,
  GamingBackground,
  StarIcon,
  TrophyIcon,
  PowerUpIcon,
} from "../../ui";
import { usePublicFeaturedTestimonials } from "@/hooks/usePublicTestimonials";
import { Star, Quote } from "lucide-react";

export const Testimonials: React.FC = () => {
  const { t } = useLanguage();
  const {
    data: testimonials = [],
    isLoading,
    error,
  } = usePublicFeaturedTestimonials(3);

  if (isLoading) {
    return (
      <GamingBackground variant="cyber" className="py-20">
        <Section
          id="testimonials"
          title={t("testimonials.title")}
          subtitle={t("testimonials.subtitle")}
        >
          <Container>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, index) => (
                <Card key={index} variant="gaming" className="animate-pulse">
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 gaming-card rounded-full mr-4"></div>
                      <div className="flex-1">
                        <div className="h-4 gaming-card rounded mb-2"></div>
                        <div className="h-3 gaming-card rounded w-2/3"></div>
                      </div>
                    </div>
                    <div className="h-4 gaming-card rounded mb-2"></div>
                    <div className="h-4 gaming-card rounded mb-2"></div>
                    <div className="h-4 gaming-card rounded w-3/4"></div>
                  </div>
                </Card>
              ))}
            </div>
          </Container>
        </Section>
      </GamingBackground>
    );
  }

  if (error) {
    return (
      <GamingBackground variant="cyber" className="py-20">
        <Section
          id="testimonials"
          title={t("testimonials.title")}
          subtitle={t("testimonials.subtitle")}
        >
          <Container>
            <EmptyState
              title="Unable to Load Testimonials"
              description="There was an error loading the testimonials. Please try again later."
            />
          </Container>
        </Section>
      </GamingBackground>
    );
  }

  if (testimonials.length === 0) {
    return (
      <GamingBackground variant="cyber" className="py-20">
        <Section
          id="testimonials"
          title={t("testimonials.title")}
          subtitle={t("testimonials.subtitle")}
        >
          <Container>
            <EmptyState
              title="No Testimonials Yet"
              description="Testimonials will appear here once they are added to the portfolio."
            />
          </Container>
        </Section>
      </GamingBackground>
    );
  }

  const testimonialIcons = [StarIcon, TrophyIcon, PowerUpIcon];

  return (
    <GamingBackground variant="cyber" className="py-20">
      <Section
        id="testimonials"
        title={t("testimonials.title")}
        subtitle={t("testimonials.subtitle")}
      >
        <Container>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => {
              const IconComponent =
                testimonialIcons[index % testimonialIcons.length];
              return (
                <Card
                  key={testimonial.id}
                  variant="gaming"
                  className="flex flex-col h-full gaming-hover pixel-hover"
                >
                  <div className="p-6 flex flex-col h-full">
                    {/* Quote icon */}
                    <div className="mb-4 flex items-center justify-between">
                      <Quote className="w-8 h-8 text-cyan-400" />
                      <IconComponent className="w-6 h-6 text-green-400 animate-neon-pulse" />
                    </div>

                    {/* Testimonial content */}
                    <blockquote className="text-gray-300 mb-6 flex-grow font-sans leading-relaxed">
                      &ldquo;{testimonial.content}&rdquo;
                    </blockquote>

                    {/* Rating */}
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < testimonial.rating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-600"
                          }`}
                        />
                      ))}
                    </div>

                    {/* Author info */}
                    <div className="flex items-center">
                      <div className="w-12 h-12 gaming-card rounded-full flex items-center justify-center text-green-400 font-pixel font-bold text-lg mr-4 gaming-pulse">
                        {testimonial.avatar ? (
                          <img
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            className="w-full h-full rounded-full object-cover filter contrast-110 brightness-110"
                          />
                        ) : (
                          testimonial.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <h4 className="font-pixel font-bold text-green-400 neon-text">
                          {testimonial.name}
                        </h4>
                        <p className="text-sm text-cyan-400 font-pixel">
                          {testimonial.position} at {testimonial.company}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </Container>
      </Section>
    </GamingBackground>
  );
};
