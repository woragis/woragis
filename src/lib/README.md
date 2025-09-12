# API Client & Authentication System

This directory contains the API client, authentication system, and related utilities for the portfolio application.

## Architecture

```
API Routes → Services → Repositories → Database
     ↑
API Client (with interceptors)
     ↑
React Components (using hooks)
```

## Components

### API Client (`api-client.ts`)

- Axios-based HTTP client with interceptors
- Automatic request/response transformation
- Error handling and logging
- Support for file uploads and downloads

### Authentication Store (`../stores/auth-store.ts`)

- Zustand-based state management
- Persistent storage with localStorage
- User session management
- Token refresh handling

### Authentication Service (`auth-service.ts`)

- Centralized authentication operations
- Login, logout, registration
- Token refresh and validation
- Password reset functionality

### API Services (`api-service.ts`)

- Service classes for each domain (projects, categories, etc.)
- Type-safe API calls
- Consistent error handling
- Query parameter building

### Authentication Interceptors (`auth-interceptors.ts`)

- Automatic token injection
- Token refresh on expiration
- Error handling for auth failures
- Network error management

### React Hooks (`../hooks/use-api.ts`)

- React Query integration
- Optimistic updates
- Cache invalidation
- Loading and error states

## Usage

### Basic API Calls

```typescript
import { projectApi } from "@/lib/api-service";

// Get all projects
const response = await projectApi.getAllProjects();
if (response.success) {
  console.log(response.data);
}
```

### Using React Hooks

```typescript
import { useProjects, useCreateProject } from "@/hooks/use-api";

function ProjectsList() {
  const { data: projects, isLoading, error } = useProjects();
  const createProject = useCreateProject();

  const handleCreate = async (projectData) => {
    await createProject.mutateAsync(projectData);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {projects?.map((project) => (
        <div key={project.id}>{project.title}</div>
      ))}
    </div>
  );
}
```

### Authentication

```typescript
import { useAuth, useAuthActions } from "@/stores/auth-store";

function LoginComponent() {
  const { user, isAuthenticated, error } = useAuth();
  const { login, logout } = useAuthActions();

  const handleLogin = async (credentials) => {
    try {
      await login(credentials);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  if (isAuthenticated) {
    return <div>Welcome, {user?.name}!</div>;
  }

  return <LoginForm onSubmit={handleLogin} />;
}
```

## Features

### Automatic Token Management

- Tokens are automatically added to requests
- Expired tokens are refreshed automatically
- Failed refresh attempts log out the user

### Error Handling

- Consistent error response format
- Network error detection
- Automatic retry for transient failures

### Type Safety

- Full TypeScript support
- Generated types from API responses
- Compile-time error checking

### Caching

- React Query integration
- Automatic cache invalidation
- Optimistic updates

### Development Tools

- Request/response logging in development
- Error tracking and debugging
- Performance monitoring

## Configuration

### Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### API Client Configuration

```typescript
import { apiClient } from "@/lib/api-client";

// Add custom interceptors
apiClient.addRequestInterceptor(customRequestInterceptor);
apiClient.addResponseInterceptor(customResponseInterceptor);
apiClient.addErrorInterceptor(customErrorInterceptor);
```

## Security

- JWT tokens stored securely in localStorage
- Automatic token refresh prevents session expiration
- CSRF protection through same-origin requests
- Input validation and sanitization
- Rate limiting support

## Testing

The API client and services are designed to be easily testable:

```typescript
// Mock the API client for testing
jest.mock("@/lib/api-client", () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));
```
