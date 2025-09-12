"use client";

import React from "react";
import { Section, Container, Card, Button } from "../ui";

export const Contact: React.FC = () => {
  const contactMethods = [
    {
      icon: "📧",
      title: "Email",
      description: "Get in touch via email",
      value: "hello@example.com",
      action: "mailto:hello@example.com",
    },
    {
      icon: "💼",
      title: "LinkedIn",
      description: "Connect with me professionally",
      value: "linkedin.com/in/yourprofile",
      action: "https://linkedin.com/in/yourprofile",
    },
    {
      icon: "🐙",
      title: "GitHub",
      description: "Check out my code",
      value: "github.com/yourusername",
      action: "https://github.com/yourusername",
    },
    {
      icon: "🐦",
      title: "Twitter",
      description: "Follow me for updates",
      value: "@yourusername",
      action: "https://twitter.com/yourusername",
    },
  ];

  return (
    <Section
      id="contact"
      title="Get In Touch"
      subtitle="Let's work together to bring your ideas to life"
    >
      <Container>
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Let's Start a Conversation
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              I'm always interested in new opportunities and exciting projects.
              Whether you have a question, want to collaborate, or just want to
              say hi, I'd love to hear from you!
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
                Send me a message
              </h3>
              <form className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Tell me about your project..."
                  />
                </div>
                <Button size="lg" className="w-full">
                  Send Message
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </Container>
    </Section>
  );
};
