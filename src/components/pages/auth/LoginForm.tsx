"use client";

import { useState } from "react";
import { useAuth } from "@/stores/auth-store";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { LoginCredentials } from "@/stores/auth-store";

export function LoginForm() {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const { login, error, clearError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    clearError();

    try {
      await login(credentials);
    } catch (error) {
      // Error is handled by the store
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <Card variant="glass" className="backdrop-blur-xl animate-fade-in-up">
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg animate-fade-in">
          <div className="flex items-center">
            <svg
              className="h-5 w-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 animate-fade-in"
        style={{ animationDelay: "100ms", animationFillMode: "both" }}
      >
        <div
          className="space-y-2 animate-fade-in"
          style={{ animationDelay: "200ms", animationFillMode: "both" }}
        >
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors duration-200"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
            className="modern-input w-full transition-all duration-200 hover:shadow-md focus:shadow-lg"
          />
        </div>

        <div
          className="space-y-2 animate-fade-in"
          style={{ animationDelay: "300ms", animationFillMode: "both" }}
        >
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors duration-200"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
            className="modern-input w-full transition-all duration-200 hover:shadow-md focus:shadow-lg"
          />
        </div>

        <div
          className="flex items-center justify-between animate-fade-in"
          style={{ animationDelay: "400ms", animationFillMode: "both" }}
        >
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={credentials.rememberMe}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-600 rounded transition-all duration-200 hover:scale-110"
            />
            <label
              htmlFor="rememberMe"
              className="ml-2 block text-sm text-slate-600 dark:text-slate-400 transition-colors duration-200"
            >
              Remember me
            </label>
          </div>
          <a
            href="#"
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium transition-colors duration-200 hover:scale-105"
          >
            Forgot password?
          </a>
        </div>

        <Button
          type="submit"
          variant="gradient"
          size="lg"
          disabled={isLoading}
          className="w-full animate-fade-in"
          style={{ animationDelay: "500ms", animationFillMode: "both" }}
        >
          {isLoading ? (
            <div className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Signing in...
            </div>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>
    </Card>
  );
}
