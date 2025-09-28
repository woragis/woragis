# Library Structure

This directory contains the core library functionality for the portfolio application, organized into logical modules for better maintainability and separation of concerns.

## 📁 Directory Structure

```
src/lib/
├── index.ts                 # Main barrel export
├── README.md               # This documentation
├── clients/                # HTTP clients
│   ├── index.ts
│   ├── apiClient.ts        # API client (camelCase)
│   └── queryClient.ts      # Query client provider (camelCase)
├── auth/                   # Authentication
│   ├── index.ts
│   ├── auth-service.ts     # Authentication service
│   ├── auth-middleware.ts  # Authentication middleware
│   ├── auth-interceptors.ts # Authentication interceptors
│   └── api-init.ts         # API client initialization
├── api/                    # API routes & services
│   ├── index.ts
│   ├── api.ts             # Legacy API utility
│   ├── api-service.ts     # API service classes
│   ├── blog/              # Blog API routes
│   ├── blog-tags.ts       # Blog tags API
│   ├── experience.ts      # Experience API
│   ├── testimonials.ts    # Testimonials API
│   └── about/             # About API routes
├── config/                 # Configuration
│   ├── index.ts
│   ├── env.ts             # Environment configuration
│   ├── server-startup.ts  # Server startup utilities
│   ├── startup-validation.ts # Startup validation
│   └── connection-tests.ts # Connection testing
├── utils/                  # Pure utilities
│   ├── index.ts
│   ├── utils.ts           # General utilities (cn function)
│   ├── storage-utils.ts   # Storage utilities
│   ├── errorHandling.ts   # Error handling utilities
│   ├── dateTime.ts        # Date and time utilities
│   ├── stringUtils.ts     # String manipulation utilities
│   ├── logger.ts          # Logging utilities
│   ├── performance.ts     # Performance monitoring
│   └── validation.ts      # Validation utilities
├── types/                  # Shared types
│   └── index.ts
├── constants/              # Application constants
│   └── index.ts
├── validators/             # Validation schemas
│   └── index.ts
└── middleware/             # Reusable middleware
    └── index.ts
```

## 🚀 Usage

### Importing from the Library

```typescript
// Import everything from a specific module
import { authService, AuthService } from '@/lib/auth';
import { env } from '@/lib/config';
import { cn, formatDate, logger } from '@/lib/utils';

// Import specific items
import { apiClient } from '@/lib/clients';
import { projectApi } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';

// Import from main index (recommended for most cases)
import { authService, env, cn, projectApi } from '@/lib';
```

### API Client Usage

```typescript
import { apiClient } from '@/lib/clients';

// Make API calls
const response = await apiClient.get('/projects');
const newProject = await apiClient.post('/admin/projects', projectData);
```

### Authentication

```typescript
import { authService } from '@/lib/auth';

// Login user
const { user, tokens } = await authService.login(credentials);

// Get current user
const currentUser = await authService.getCurrentUser(accessToken);
```

### Utilities

```typescript
import { 
  cn, 
  formatDate, 
  slugify, 
  logger, 
  PerformanceMonitor 
} from '@/lib/utils';

// Class name utility
const className = cn('base-class', { 'active': isActive });

// Date formatting
const formatted = formatDate(new Date(), 'long');

// String utilities
const slug = slugify('My Awesome Title');

// Logging
logger.info('User logged in', { userId: user.id });

// Performance monitoring
PerformanceMonitor.measure('api-call', () => {
  // Your code here
});
```

### Validation

```typescript
import { validateEmail, validatePassword } from '@/lib/utils';
import { loginSchema } from '@/lib/validators';

// Simple validation
const isValid = validateEmail('user@example.com');

// Schema validation
const result = loginSchema.parse(loginData);
```

### Constants

```typescript
import { API_ENDPOINTS, HTTP_STATUS } from '@/lib/constants';

// Use predefined endpoints
const response = await apiClient.get(API_ENDPOINTS.PROJECTS.BASE);

// Use status codes
if (response.status === HTTP_STATUS.OK) {
  // Handle success
}
```

## 🔧 Configuration

### Environment Variables

```typescript
import { env } from '@/lib/config';

// Access environment variables
const dbUrl = env.DATABASE_URL;
const apiUrl = env.NEXT_PUBLIC_API_URL;
```

### Server Startup

```typescript
import { validateStartup } from '@/lib/config';

// Validate environment and connections
await validateStartup();
```

## 🛡️ Security

### Authentication Middleware

```typescript
import { authMiddleware } from '@/lib/auth';

// Protect routes
app.use('/admin', authMiddleware);
```

### Security Headers

```typescript
import { securityHeaders } from '@/lib/middleware';

// Add security headers
app.use(securityHeaders);
```

## 📊 Performance

### Monitoring

```typescript
import { PerformanceMonitor } from '@/lib/utils';

// Measure function execution time
const result = PerformanceMonitor.measure('expensive-operation', () => {
  return expensiveFunction();
});
```

### Logging

```typescript
import { logger, LogLevel } from '@/lib/utils';

// Set log level
logger.setLevel(LogLevel.DEBUG);

// Log with context
logger.error('Database connection failed', { 
  error: error.message,
  retryCount: 3 
});
```

## 🧪 Testing

The library is designed to be easily testable:

```typescript
// Mock the API client
jest.mock('@/lib/clients', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

// Mock utilities
jest.mock('@/lib/utils', () => ({
  cn: jest.fn((...args) => args.join(' ')),
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));
```

## 🔄 Migration Guide

If you're updating from the old structure:

1. **Old imports** → **New imports**:
   ```typescript
   // Old
   import { apiClient } from '@/lib/api-client';
   import { env } from '@/lib/env';
   import { cn } from '@/lib/utils';
   
   // New
   import { apiClient } from '@/lib/clients';
   import { env } from '@/lib/config';
   import { cn } from '@/lib/utils/utils';
   ```

2. **Use barrel exports** when possible:
   ```typescript
   // Recommended
   import { apiClient, env, cn } from '@/lib';
   ```

## 📝 Best Practices

1. **Use barrel exports** for cleaner imports
2. **Import from specific modules** when you need only a few items
3. **Use constants** instead of hardcoded strings
4. **Validate inputs** using the validation utilities
5. **Monitor performance** in production code
6. **Log appropriately** with context information
7. **Handle errors** using the error handling utilities

## 🚀 Future Enhancements

- [ ] Add more validation schemas
- [ ] Implement caching utilities
- [ ] Add more performance monitoring tools
- [ ] Create testing utilities
- [ ] Add internationalization utilities
- [ ] Implement rate limiting utilities