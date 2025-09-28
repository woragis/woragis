// Main library exports - organized by functionality

// API Client and Services
export * from './clients';
export * from './api';

// Authentication
export * from './auth';
export { useAuthStore, useAuth, useAuthActions } from '../stores/auth-store';

// Configuration
export * from './config';

// Utilities
export * from './utils';

// Types
export * from './types';

// Constants
export * from './constants';

// Validators
export * from './validators';

// Middleware
export * from './middleware';