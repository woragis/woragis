/**
 * Server-side Startup Validation
 * 
 * This module provides server-side validation that can be used in:
 * - Middleware
 * - Server components
 * - API routes
 * - Build-time validation
 */

import { validateConnectionsOnStartup } from "./env";

let startupValidated = false;
let startupValidationPromise: Promise<void> | null = null;

/**
 * Validate startup once per server instance
 * This prevents multiple validation calls during the same server session
 */
export async function validateServerStartup(): Promise<void> {
  if (startupValidated) {
    return;
  }

  if (startupValidationPromise) {
    return startupValidationPromise;
  }

  startupValidationPromise = validateConnectionsOnStartup();
  
  try {
    await startupValidationPromise;
    startupValidated = true;
  } catch (error) {
    startupValidationPromise = null; // Reset on failure
    throw error;
  }
}

/**
 * Check if startup has been validated
 */
export function isStartupValidated(): boolean {
  return startupValidated;
}

/**
 * Reset startup validation (useful for testing)
 */
export function resetStartupValidation(): void {
  startupValidated = false;
  startupValidationPromise = null;
}
