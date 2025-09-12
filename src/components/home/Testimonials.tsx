"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Section, Container, Card, EmptyState } from "../ui";
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
      <Section
        id="testimonials"
        title={t("testimonials.title")}
        subtitle={t("testimonials.subtitle")}
      >
        <Container>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full mr-4"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                    </div>
                  </div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    );
  }

  if (error) {
    return (
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
    );
  }

  if (testimonials.length === 0) {
    return (
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
    );
  }

  return (
    <Section
      id="testimonials"
      title={t("testimonials.title")}
      subtitle={t("testimonials.subtitle")}
    >
      <Container>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} hover className="flex flex-col h-full">
              <div className="p-6 flex flex-col h-full">
                {/* Quote icon */}
                <div className="mb-4">
                  <Quote className="w-8 h-8 text-blue-500 dark:text-blue-400" />
                </div>

                {/* Testimonial content */}
                <blockquote className="text-gray-600 dark:text-gray-300 mb-6 flex-grow">
                  "{testimonial.content}"
                </blockquote>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < testimonial.rating
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                    />
                  ))}
                </div>

                {/* Author info */}
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                    {testimonial.avatar ? (
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      testimonial.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.position} at {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
};
