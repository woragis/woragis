"use client";

import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Section, Container, Card, Button } from "../../ui";
import { FaEnvelope, FaLinkedin, FaGithub, FaTwitter } from "react-icons/fa";

export const Contact: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Simulate form submission - replace with actual form handling
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For demo purposes, we'll just show success
      setSubmitStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: FaEnvelope,
      title: t("contact.methods.email.title"),
      description: t("contact.methods.email.description"),
      value: t("contact.methods.email.value"),
      action: "mailto:hello@example.com",
    },
    {
      icon: FaLinkedin,
      title: t("contact.methods.linkedin.title"),
      description: t("contact.methods.linkedin.description"),
      value: t("contact.methods.linkedin.value"),
      action: "https://linkedin.com/in/yourprofile",
    },
    {
      icon: FaGithub,
      title: t("contact.methods.github.title"),
      description: t("contact.methods.github.description"),
      value: t("contact.methods.github.value"),
      action: "https://github.com/yourusername",
    },
    {
      icon: FaTwitter,
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
              {contactMethods.map((method, index) => {
                const IconComponent = method.icon;
                return (
                  <Card key={index} hover className="text-center">
                    <div className="text-3xl mb-3 text-blue-600 dark:text-blue-400">
                      <IconComponent />
                    </div>
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
                );
              })}
            </div>
          </div>

          <div>
            <Card>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                {t("contact.sendMessageTitle")}
              </h3>

              {submitStatus === "success" && (
                <div className="mb-4 p-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg">
                  {t("contact.form.successMessage")}
                </div>
              )}

              {submitStatus === "error" && (
                <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg">
                  {t("contact.form.errorMessage")}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
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
                    value={formData.name}
                    onChange={handleInputChange}
                    required
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
                    value={formData.email}
                    onChange={handleInputChange}
                    required
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
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder={t("contact.form.messagePlaceholder")}
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? t("contact.form.sending")
                    : t("contact.form.sendMessage")}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </Container>
    </Section>
  );
};
