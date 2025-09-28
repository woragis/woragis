// API Constants
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    RESEND_VERIFICATION: '/auth/resend-verification',
  },
  PROJECTS: {
    BASE: '/admin/projects',
    PUBLIC: '/projects',
    ORDER: '/admin/projects/order',
    TOGGLE_VISIBILITY: (id: string) => `/admin/projects/${id}/toggle-visibility`,
    TOGGLE_FEATURED: (id: string) => `/admin/projects/${id}/toggle-featured`,
    LANGUAGES: (id: string) => `/admin/projects/${id}/languages`,
    FRAMEWORKS: (id: string) => `/admin/projects/${id}/frameworks`,
  },
  LANGUAGES: {
    BASE: '/admin/languages',
    PUBLIC: '/languages',
    ORDER: '/admin/languages/order',
    POPULAR: '/admin/languages/popular',
    PROJECT_COUNT: (id: string) => `/admin/languages/${id}/project-count`,
    PROFICIENCY_DISTRIBUTION: (id: string) => `/admin/languages/${id}/proficiency-distribution`,
  },
  FRAMEWORKS: {
    BASE: '/admin/frameworks',
    PUBLIC: '/frameworks',
    ORDER: '/admin/frameworks/order',
    POPULAR: '/admin/frameworks/popular',
    PROJECT_COUNT: (id: string) => `/admin/frameworks/${id}/project-count`,
    VERSION_DISTRIBUTION: (id: string) => `/admin/frameworks/${id}/version-distribution`,
    PROFICIENCY_DISTRIBUTION: (id: string) => `/admin/frameworks/${id}/proficiency-distribution`,
  },
  SETTINGS: {
    BASE: '/admin/settings',
    BULK: '/admin/settings/bulk',
    MANY: '/admin/settings/many',
    PROJECTS_PER_PAGE: '/admin/settings/projects-per-page',
    SITE_TITLE: '/admin/settings/site-title',
    SITE_DESCRIPTION: '/admin/settings/site-description',
    CONTACT_EMAIL: '/admin/settings/contact-email',
    THEME: '/admin/settings/theme',
    MAINTENANCE_MODE: '/admin/settings/maintenance-mode',
  },
  BLOG: {
    BASE: '/admin/blog',
    PUBLIC: '/blog',
    TAGS: '/admin/blog-tags',
    TAGS_PUBLIC: '/blog-tags',
    TAGS_ORDER: '/admin/blog-tags/order',
    TAGS_POPULAR: '/admin/blog-tags/popular',
    TAGS_WITH_COUNT: '/admin/blog-tags/with-count',
  },
  EXPERIENCE: {
    BASE: '/admin/experience',
    PUBLIC: '/experience',
  },
  TESTIMONIALS: {
    BASE: '/admin/testimonials',
    PUBLIC: '/testimonials',
  },
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Default Values
export const DEFAULTS = {
  API_TIMEOUT: 10000,
  QUERY_STALE_TIME: 60 * 1000, // 1 minute
  TOKEN_REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes
  MAX_RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const;
