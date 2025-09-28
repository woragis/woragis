/**
 * localStorage utilities for browser storage management
 * Provides type-safe, error-handled access to browser localStorage
 */

export interface StorageOptions {
  serialize?: boolean; // Whether to JSON.stringify/parse (default: true)
}

/**
 * Set an item in localStorage
 */
export function setStorageItem<T = unknown>(
  key: string,
  value: T,
  options: StorageOptions = {}
): boolean {
  if (typeof window === 'undefined' || !window.localStorage) {
    console.warn('setStorageItem: localStorage is not available');
    return false;
  }

  try {
    const serialized = options.serialize !== false 
      ? JSON.stringify(value)
      : String(value);
    
    window.localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.error('setStorageItem: Failed to set item', error);
    return false;
  }
}

/**
 * Get an item from localStorage
 */
export function getStorageItem<T = unknown>(
  key: string,
  options: StorageOptions = {}
): T | null {
  if (typeof window === 'undefined' || !window.localStorage) {
    console.warn('getStorageItem: localStorage is not available');
    return null;
  }

  try {
    const item = window.localStorage.getItem(key);
    if (item === null) {
      return null;
    }

    return options.serialize !== false 
      ? JSON.parse(item)
      : item as T;
  } catch (error) {
    console.error('getStorageItem: Failed to get item', error);
    return null;
  }
}

/**
 * Remove an item from localStorage
 */
export function removeStorageItem(key: string): boolean {
  if (typeof window === 'undefined' || !window.localStorage) {
    console.warn('removeStorageItem: localStorage is not available');
    return false;
  }

  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('removeStorageItem: Failed to remove item', error);
    return false;
  }
}

/**
 * Clear all items from localStorage
 */
export function clearStorage(): boolean {
  if (typeof window === 'undefined' || !window.localStorage) {
    console.warn('clearStorage: localStorage is not available');
    return false;
  }

  try {
    window.localStorage.clear();
    return true;
  } catch (error) {
    console.error('clearStorage: Failed to clear storage', error);
    return false;
  }
}

/**
 * Get all keys from localStorage
 */
export function getStorageKeys(): string[] {
  if (typeof window === 'undefined' || !window.localStorage) {
    console.warn('getStorageKeys: localStorage is not available');
    return [];
  }

  try {
    return Object.keys(window.localStorage);
  } catch (error) {
    console.error('getStorageKeys: Failed to get keys', error);
    return [];
  }
}

/**
 * Get the number of items in localStorage
 */
export function getStorageLength(): number {
  if (typeof window === 'undefined' || !window.localStorage) {
    console.warn('getStorageLength: localStorage is not available');
    return 0;
  }

  try {
    return window.localStorage.length;
  } catch (error) {
    console.error('getStorageLength: Failed to get length', error);
    return 0;
  }
}

/**
 * Check if localStorage is available
 */
export function isStorageAvailable(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const test = 'localStorage-test';
    window.localStorage.setItem(test, test);
    window.localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get storage usage information (approximate)
 */
export function getStorageUsage(): { used: number; available: number; percentage: number } {
  if (typeof window === 'undefined' || !window.localStorage) {
    return { used: 0, available: 0, percentage: 0 };
  }

  try {
    let used = 0;
    for (const key in window.localStorage) {
      if (window.localStorage.hasOwnProperty(key)) {
        used += window.localStorage[key].length + key.length;
      }
    }

    // Most browsers limit localStorage to ~5-10MB
    const available = 10 * 1024 * 1024; // 10MB estimate
    const percentage = (used / available) * 100;

    return {
      used,
      available,
      percentage: Math.min(percentage, 100),
    };
  } catch (error) {
    console.error('getStorageUsage: Failed to calculate usage', error);
    return { used: 0, available: 0, percentage: 0 };
  }
}

/**
 * Set a token in localStorage with automatic JSON serialization
 */
export function setAuthToken(token: string): boolean {
  return setStorageItem('auth-token', token, { serialize: false });
}

/**
 * Get an auth token from localStorage
 */
export function getAuthToken(): string | null {
  return getStorageItem<string>('auth-token', { serialize: false });
}

/**
 * Remove an auth token from localStorage
 */
export function removeAuthToken(): boolean {
  return removeStorageItem('auth-token');
}

/**
 * Set user preferences in localStorage
 */
export function setUserPreferences(preferences: Record<string, unknown>): boolean {
  return setStorageItem('user-preferences', preferences);
}

/**
 * Get user preferences from localStorage
 */
export function getUserPreferences(): Record<string, unknown> | null {
  return getStorageItem<Record<string, unknown>>('user-preferences');
}
