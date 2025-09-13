# API Response Standardization

This directory contains standardized API response helpers and patterns for consistent API behavior across the application.

## Response Structure

All API responses follow this standardized structure:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T; // Present only on success
  error?: string; // Present only on failure
  message?: string; // Optional success message
  details?: any; // Optional additional details (usually for errors)
}
```

## Response Helpers

### Success Responses

- `successResponse<T>(data, message?, status?)` - Standard success response
- `createdResponse<T>(data, message?)` - 201 Created response
- `updatedResponse<T>(data, message?)` - 200 Updated response
- `deletedResponse(message?)` - 200 Deleted response

### Error Responses

- `errorResponse(error, status, details?)` - Generic error response
- `badRequestResponse(error, details?)` - 400 Bad Request
- `unauthorizedResponse(error)` - 401 Unauthorized
- `forbiddenResponse(error)` - 403 Forbidden
- `notFoundResponse(error)` - 404 Not Found
- `conflictResponse(error)` - 409 Conflict
- `internalServerErrorResponse(error, details?)` - 500 Internal Server Error
- `validationErrorResponse(errors, message?)` - 422 Validation Error

### Utility Functions

- `handleServiceResult<T>(result, message?, status?)` - Converts service results to standardized responses
- `withErrorHandling<T>(handler)` - Wraps handlers with error handling
- `handleAuthError(error?)` - Standardized auth error response

## Route Templates

Pre-built templates for common route patterns:

- `createPublicGetRoute<T>()` - Public GET routes
- `createPublicGetRouteWithParams<T, P>()` - Public GET routes with params
- `createAuthenticatedGetRoute<T>()` - Authenticated GET routes
- `createAuthenticatedPostRoute<T, D>()` - Authenticated POST routes
- `createAuthenticatedPutRoute<T, D>()` - Authenticated PUT routes
- `createAuthenticatedPatchRoute<T, D>()` - Authenticated PATCH routes
- `createAuthenticatedDeleteRoute()` - Authenticated DELETE routes

## Usage Examples

### Basic Route with Error Handling

```typescript
import {
  handleServiceResult,
  withErrorHandling,
} from "@lib/utils/response-helpers";

export const GET = withErrorHandling(async () => {
  const result = await someService.getData();
  return handleServiceResult(result, "Data fetched successfully");
});
```

### Authenticated Route

```typescript
import {
  handleServiceResult,
  withErrorHandling,
  handleAuthError,
} from "@lib/utils/response-helpers";
import { authMiddleware } from "@/lib/auth-middleware";

export const POST = withErrorHandling(async (request: NextRequest) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError(authResult.error);
  }

  const body = await request.json();
  const result = await someService.createData(body, authResult.userId);
  return handleServiceResult(result, "Data created successfully", 201);
});
```

### Using Route Templates

```typescript
import { createAuthenticatedPostRoute } from "@/lib/api/route-templates";

export const POST = createAuthenticatedPostRoute(
  (data, userId) => someService.createData(data, userId),
  "Data created successfully"
);
```

## Migration Guide

To migrate existing routes to the standardized pattern:

1. **Replace direct NextResponse.json calls** with helper functions
2. **Add error handling** with `withErrorHandling`
3. **Use consistent response structure** with `handleServiceResult`
4. **Standardize error messages** and status codes
5. **Add proper TypeScript typing** for request/response data

### Before (Old Pattern)

```typescript
export async function GET(request: NextRequest) {
  try {
    const result = await someService.getData();

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### After (Standardized Pattern)

```typescript
export const GET = withErrorHandling(async () => {
  const result = await someService.getData();
  return handleServiceResult(result, "Data fetched successfully");
});
```

## Benefits

- **Consistency**: All API responses follow the same structure
- **Error Handling**: Centralized error handling and logging
- **Type Safety**: Full TypeScript support with proper typing
- **Maintainability**: Easy to update response patterns across the app
- **Developer Experience**: Clear, predictable API responses
- **Testing**: Easier to test with consistent response structure

## Status Codes

Standard HTTP status codes used:

- `200` - Success (GET, PUT, PATCH)
- `201` - Created (POST)
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Validation Error
- `500` - Internal Server Error
