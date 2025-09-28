// General Utilities
export * from './utils';

// Storage Utilities
export {
  // Cookie utilities
  setCookie,
  getCookie,
  removeCookie,
  getAllCookies,
  areCookiesEnabled,
  // localStorage utilities
  setStorageItem,
  getStorageItem,
  removeStorageItem,
  clearStorage,
  getStorageKeys,
  getStorageLength,
  isStorageAvailable,
  getStorageUsage,
  // Convenience functions
  setAuthToken,
  getAuthToken,
  removeAuthToken,
  setUserPreferences,
  getUserPreferences,
  setAuthCookie,
  getAuthCookie,
  removeAuthCookie,
  // Types
  type CookieOptions,
  type StorageOptions,
} from './storage-utils';

// Error Handling Utilities
export * from './errorHandling';

// Date and Time Utilities
export * from './dateTime';

// String Utilities
export * from './stringUtils';

// Logging Utilities
export * from './logger';

// Performance Utilities
export * from './performance';

// Validation Utilities
export * from './validation';
