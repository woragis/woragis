# Auth Domain - Presentation Layer

This directory contains the presentation layer for the authentication domain, including pages, BLoC, and routing configuration.

## Structure

```
presentation/
├── bloc/
│   └── auth_bloc.dart          # Authentication BLoC with events and states
├── pages/
│   ├── auth_wrapper.dart       # Auth wrapper and splash screen
│   ├── login_page.dart         # Login form with validation
│   ├── register_page.dart      # Registration form with validation
│   ├── profile_page.dart       # User profile view and edit
│   ├── change_password_page.dart # Change password form
│   └── pages.dart              # Export file for all pages
├── queries/
│   └── auth_queries.dart       # Utility functions for direct use case calls
├── router/
│   └── auth_routes.dart        # Route configuration examples
└── README.md                   # This file
```

## Features

### 🔐 Authentication Pages

1. **Login Page** (`login_page.dart`)
   - Email and password input with validation
   - Loading states and error handling
   - Navigation to register page
   - Form validation with proper error messages

2. **Register Page** (`register_page.dart`)
   - Complete registration form with all user fields
   - Password confirmation validation
   - Optional first/last name fields
   - Username validation (alphanumeric + underscore only)

3. **Profile Page** (`profile_page.dart`)
   - View and edit user profile information
   - Profile picture support (placeholder for image picker)
   - Account information display
   - Change password and logout actions
   - Edit mode with form validation

4. **Change Password Page** (`change_password_page.dart`)
   - Current password verification
   - New password with confirmation
   - Password requirements display
   - Secure password visibility toggles

5. **Auth Wrapper** (`auth_wrapper.dart`)
   - Splash screen with app branding
   - Authentication state management
   - Automatic navigation based on auth status
   - AuthGuard component for protecting routes

### 🎯 BLoC Integration

The auth BLoC (`auth_bloc.dart`) handles all authentication states:

**Events:**
- `LoginRequested` - User login attempt
- `RegisterRequested` - User registration attempt
- `GetCurrentUserRequested` - Fetch current user data
- `LogoutRequested` - User logout
- `RefreshTokenRequested` - Token refresh
- `ChangePasswordRequested` - Password change
- `UpdateProfileRequested` - Profile update

**States:**
- `AuthInitial` - Initial state
- `AuthLoading` - Loading state for async operations
- `AuthAuthenticated` - User is authenticated with user data
- `AuthUnauthenticated` - User is not authenticated
- `AuthError` - Error state with error message

### 🛣️ Routing

Example route configuration is provided in `auth_routes.dart`:

```dart
// Public auth routes
final authRoutes = [
  GoRoute(path: '/login', builder: (context, state) => const LoginPage()),
  GoRoute(path: '/register', builder: (context, state) => const RegisterPage()),
  // ... more routes
];

// Protected routes using AuthGuard
final protectedRoutes = [
  GoRoute(
    path: '/profile',
    builder: (context, state) => const AuthGuard(child: ProfilePage()),
  ),
];
```

## Usage

### 1. Setup BLoC Provider

```dart
// In your main app
BlocProvider<AuthBloc>(
  create: (context) => createAuthBloc(),
  child: MyApp(),
)
```

### 2. Use AuthGuard for Protected Routes

```dart
GoRoute(
  path: '/protected-page',
  builder: (context, state) => const AuthGuard(
    requireAuth: true, // Default is true
    child: ProtectedPage(),
  ),
)
```

### 3. Listen to Auth State Changes

```dart
BlocListener<AuthBloc, AuthState>(
  listener: (context, state) {
    if (state is AuthAuthenticated) {
      // Navigate to home
      context.go('/home');
    } else if (state is AuthUnauthenticated) {
      // Navigate to login
      context.go('/login');
    }
  },
  child: YourWidget(),
)
```

### 4. Trigger Auth Actions

```dart
// Login
context.read<AuthBloc>().add(LoginRequested(
  email: email,
  password: password,
));

// Logout
context.read<AuthBloc>().add(LogoutRequested());

// Update Profile
context.read<AuthBloc>().add(UpdateProfileRequested(
  firstName: firstName,
  lastName: lastName,
));
```

## Form Validation

All forms include comprehensive validation:

- **Email**: Valid email format required
- **Password**: Minimum 6 characters
- **Username**: 3+ characters, alphanumeric + underscore only
- **Password Confirmation**: Must match new password
- **Current Password**: Required for password changes

## Error Handling

- Network errors are caught and displayed as user-friendly messages
- Form validation errors are shown inline
- Loading states prevent multiple submissions
- Success feedback for completed actions

## Styling

- Material Design 3 components
- Consistent spacing and typography
- Loading indicators and progress feedback
- Error states with appropriate colors
- Responsive layout for different screen sizes

## Dependencies

- `flutter_bloc` - State management
- `go_router` - Navigation
- `equatable` - State comparison
- Domain layer use cases and entities

## Future Enhancements

- [ ] Image picker integration for profile pictures
- [ ] Biometric authentication support
- [ ] Social login integration
- [ ] Email verification flow
- [ ] Password reset functionality
- [ ] Two-factor authentication
- [ ] Remember me functionality
- [ ] Offline authentication support
