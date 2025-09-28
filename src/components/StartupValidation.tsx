/**
 * Startup Validation Component
 * 
 * This component should be used in development mode to validate connections
 * without crashing the application. In production, use the server-side validation.
 */

"use client";

import { useEffect, useState } from "react";

interface ConnectionStatus {
  database: boolean | null;
  redis: boolean | null;
  loading: boolean;
  error?: string;
}

export function StartupValidation() {
  const [status, setStatus] = useState<ConnectionStatus>({
    database: null,
    redis: null,
    loading: true,
  });

  useEffect(() => {
    async function validateConnections() {
      try {
        const response = await fetch("/api/health");
        const data = await response.json();
        
        setStatus({
          database: data.services.database.status === "up",
          redis: data.services.redis.status === "up",
          loading: false,
        });
      } catch (error) {
        setStatus({
          database: null,
          redis: null,
          loading: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    // Only run in development
    if (process.env.NODE_ENV === "development") {
      validateConnections();
    } else {
      setStatus({ database: true, redis: true, loading: false });
    }
  }, []);

  // Don't render anything in production
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  if (status.loading) {
    return (
      <div className="fixed top-4 right-4 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-2 rounded shadow-lg z-50">
        🔍 Checking connections...
      </div>
    );
  }

  if (status.error) {
    return (
      <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded shadow-lg z-50">
        ❌ Connection check failed: {status.error}
      </div>
    );
  }

  const allConnected = status.database && status.redis;
  
  if (allConnected) {
    return (
      <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded shadow-lg z-50">
        ✅ All connections healthy
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded shadow-lg z-50">
      ⚠️ Connection issues:
      <ul className="text-sm mt-1">
        {!status.database && <li>• Database</li>}
        {!status.redis && <li>• Redis</li>}
      </ul>
      <div className="text-xs mt-2">
        Run: <code className="bg-yellow-200 px-1 rounded">docker-compose up</code>
      </div>
    </div>
  );
}
