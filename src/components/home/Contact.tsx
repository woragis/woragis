"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Section, Container, Card, Button } from "../ui";

export const Contact: React.FC = () => {
  const { t } = useLanguage();

  const contactMethods = [
    {
      icon: "📧",
      title: t("contact.methods.email.title"),
      description: t("contact.methods.email.description"),
      value: t("contact.methods.email.value"),
      action: "mailto:hello@example.com",
    },
    {
      icon: "💼",
      title: t("contact.methods.linkedin.title"),
      description: t("contact.methods.linkedin.description"),
      value: t("contact.methods.linkedin.value"),
      action: "https://linkedin.com/in/yourprofile",
    },
    {
      icon: "🐙",
      title: t("contact.methods.github.title"),
      description: t("contact.methods.github.description"),
      value: t("contact.methods.github.value"),
      action: "https://github.com/yourusername",
    },
    {
      icon: "🐦",
      title: t("contact.methods.twitter.title"),
      description: t("contact.methods.twitter.description"),
      value: t("contact.methods.twitter.value"),
      action: "https://twitter.com/yourusername",
    },
  ];

  return (
    <Section
      id="contact"
      title={t("contact.title")}
      subtitle={t("contact.subtitle")}
    >
      <Container>
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {t("contact.conversationTitle")}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              {t("contact.conversationDescription")}
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {contactMethods.map((method, index) => (
                <Card key={index} hover className="text-center">
                  <div className="text-3xl mb-3">{method.icon}</div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {method.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    {method.description}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={() => window.open(method.action, "_blank")}
                  >
                    {method.value}
                  </Button>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <Card>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                {t("contact.sendMessageTitle")}
              </h3>
              <form className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    {t("contact.form.name")}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder={t("contact.form.namePlaceholder")}
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    {t("contact.form.email")}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder={t("contact.form.emailPlaceholder")}
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    {t("contact.form.message")}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder={t("contact.form.messagePlaceholder")}
                  />
                </div>
                <Button size="lg" className="w-full">
                  {t("contact.form.sendMessage")}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </Container>
    </Section>
  );
};
