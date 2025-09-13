"use client";

import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Section,
  Container,
  Card,
  Button,
  ValorantBackground,
  AbstractShapes,
  CodeIcon,
  RocketIcon,
  SparklesIcon,
  ShieldIcon,
  ZapIcon,
  TargetIcon,
} from "../../ui";
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
      color: "text-indigo-600 dark:text-indigo-400",
    },
    {
      icon: FaLinkedin,
      title: t("contact.methods.linkedin.title"),
      description: t("contact.methods.linkedin.description"),
      value: t("contact.methods.linkedin.value"),
      action: "https://linkedin.com/in/yourprofile",
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: FaGithub,
      title: t("contact.methods.github.title"),
      description: t("contact.methods.github.description"),
      value: t("contact.methods.github.value"),
      action: "https://github.com/yourusername",
      color: "text-slate-600 dark:text-slate-400",
    },
    {
      icon: FaTwitter,
      title: t("contact.methods.twitter.title"),
      description: t("contact.methods.twitter.description"),
      value: t("contact.methods.twitter.value"),
      action: "https://twitter.com/yourusername",
      color: "text-cyan-600 dark:text-cyan-400",
    },
  ];

  const contactIcons = [
    CodeIcon,
    RocketIcon,
    SparklesIcon,
    ShieldIcon,
    ZapIcon,
    TargetIcon,
  ];

  return (
    <ValorantBackground variant="minimal" className="py-20">
      <Section
        id="contact"
        title={t("contact.title")}
        subtitle={t("contact.subtitle")}
      >
        <Container>
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                {t("contact.conversationTitle")}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-8 text-lg leading-relaxed">
                {t("contact.conversationDescription")}
              </p>

              <div className="grid sm:grid-cols-2 gap-6">
                {contactMethods.map((method, index) => {
                  const IconComponent = method.icon;
                  const AbstractIcon =
                    contactIcons[index % contactIcons.length];
                  return (
                    <Card
                      key={index}
                      variant="glass"
                      className="text-center hover-lift hover-glow"
                    >
                      <div className="flex flex-col items-center">
                        <div className={`text-3xl mb-3 ${method.color}`}>
                          <IconComponent />
                        </div>
                        <AbstractIcon className="w-6 h-6 text-purple-600 dark:text-purple-400 mb-2" />
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                          {method.title}
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                          {method.description}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => window.open(method.action, "_blank")}
                        >
                          {method.value}
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            <div>
              <Card variant="modern" className="hover-lift">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                  {t("contact.sendMessageTitle")}
                </h3>

                {submitStatus === "success" && (
                  <div className="mb-4 p-4 glass-morphism text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-center">
                      <ShieldIcon className="w-5 h-5 mr-2" />
                      {t("contact.form.successMessage")}
                    </div>
                  </div>
                )}

                {submitStatus === "error" && (
                  <div className="mb-4 p-4 glass-morphism text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-center">
                      <ZapIcon className="w-5 h-5 mr-2" />
                      {t("contact.form.errorMessage")}
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
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
                      className="modern-input w-full"
                      placeholder={t("contact.form.namePlaceholder")}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
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
                      className="modern-input w-full"
                      placeholder={t("contact.form.emailPlaceholder")}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
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
                      className="modern-input w-full resize-none"
                      placeholder={t("contact.form.messagePlaceholder")}
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="gradient"
                    size="lg"
                    className="w-full hover-lift"
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
    </ValorantBackground>
  );
};
