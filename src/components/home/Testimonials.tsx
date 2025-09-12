"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Section, Container, Card } from "../ui";

export const Testimonials: React.FC = () => {
  const { t } = useLanguage();

  const testimonials = [
    {
      name: t("testimonials.items.client1.name"),
      role: t("testimonials.items.client1.role"),
      company: t("testimonials.items.client1.company"),
      content: t("testimonials.items.client1.content"),
      avatar: "👨‍💼",
      rating: 5,
    },
    {
      name: t("testimonials.items.client2.name"),
      role: t("testimonials.items.client2.role"),
      company: t("testimonials.items.client2.company"),
      content: t("testimonials.items.client2.content"),
      avatar: "👩‍💻",
      rating: 5,
    },
    {
      name: t("testimonials.items.client3.name"),
      role: t("testimonials.items.client3.role"),
      company: t("testimonials.items.client3.company"),
      content: t("testimonials.items.client3.content"),
      avatar: "👨‍🎨",
      rating: 5,
    },
  ];

  return (
    <Section
      id="testimonials"
      title={t("testimonials.title")}
      subtitle={t("testimonials.subtitle")}
    >
      <Container>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} hover className="flex flex-col">
              <div className="flex items-center mb-4">
                <div className="text-4xl mr-4">{testimonial.avatar}</div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>

              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <blockquote className="text-gray-600 dark:text-gray-300 italic flex-grow">
                "{testimonial.content}"
              </blockquote>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
};
