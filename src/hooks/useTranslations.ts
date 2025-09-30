import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { SupportedLanguage, TranslationStatus } from "@/types";

interface UseTranslationOptions {
  fallbackToDefault?: boolean;
  enabled?: boolean;
}

interface UseTranslationResult<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useTranslation<T>(
  contentType: "blog" | "project" | "experience" | "education" | "testimonial",
  contentId: string,
  options: UseTranslationOptions = {}
): UseTranslationResult<T> {
  const { language, getTranslatedContent } = useLanguage();
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    fallbackToDefault = true,
    enabled = true,
  } = options;

  const fetchTranslation = useCallback(async () => {
    if (!enabled || !contentId) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await getTranslatedContent<T>(
        contentType,
        contentId,
        fallbackToDefault
      );
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch translation");
    } finally {
      setIsLoading(false);
    }
  }, [contentType, contentId, fallbackToDefault, enabled, getTranslatedContent]);

  useEffect(() => {
    fetchTranslation();
  }, [fetchTranslation]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchTranslation,
  };
}

// Hook for multiple translations
export function useMultipleTranslations<T>(
  contentType: "blog" | "project" | "experience" | "education" | "testimonial",
  contentIds: string[],
  options: UseTranslationOptions = {}
): UseTranslationResult<T[]> {
  const { language, getTranslatedContent } = useLanguage();
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    fallbackToDefault = true,
    enabled = true,
  } = options;

  const fetchTranslations = useCallback(async () => {
    if (!enabled || !contentIds.length) return;

    setIsLoading(true);
    setError(null);

    try {
      const promises = contentIds.map(id =>
        getTranslatedContent<T>(contentType, id, fallbackToDefault)
      );
      
      const results = await Promise.all(promises);
      const validResults = results.filter((result) => result !== null) as T[];
      setData(validResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch translations");
    } finally {
      setIsLoading(false);
    }
  }, [contentType, contentIds, fallbackToDefault, enabled, getTranslatedContent]);

  useEffect(() => {
    fetchTranslations();
  }, [fetchTranslations]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchTranslations,
  };
}

// Hook for translation statistics
export function useTranslationStats() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/translations");
      if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.statusText}`);
      }

      const result = await response.json();
      setStats(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch translation stats");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats,
  };
}

// Hook for translation status
export function useTranslationStatus(
  contentType: "blog" | "project" | "experience" | "education" | "testimonial",
  contentId: string
) {
  const [status, setStatus] = useState<TranslationStatus[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    if (!contentId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/translations?contentType=${contentType}&contentId=${contentId}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch status: ${response.statusText}`);
      }

      const result = await response.json();
      setStatus(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch translation status");
    } finally {
      setIsLoading(false);
    }
  }, [contentType, contentId]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  return {
    status,
    isLoading,
    error,
    refetch: fetchStatus,
  };
}
