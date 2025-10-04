# App Layer - Main Application Structure

This directory contains the main application configuration, routing, and core pages that tie everything together.

## Structure

```
app/
├── config/
│   └── app_config.dart          # App configuration, themes, and BLoC providers
├── pages/
│   └── home_page.dart           # Main dashboard/home page
├── router/
│   └── app_router.dart          # GoRouter configuration
├── app.dart                     # App exports
└── README.md                    # This file
```

## Features

### 🏠 **Home Page** (`home_page.dart`)
- **Dashboard Layout**: Clean, modern dashboard with welcome section
- **User Profile Integration**: Displays user avatar, name, and account info
- **Quick Actions Grid**: Easy access to blog, projects, analytics, and settings
- **Recent Activity**: Placeholder for activity feed
- **Bottom Navigation**: Navigation bar for main app sections
- **Responsive Design**: Works on different screen sizes

### 🛣️ **App Router** (`app_router.dart`)
- **GoRouter Integration**: Modern declarative routing
- **Protected Routes**: AuthGuard integration for authenticated pages
- **Error Handling**: Custom 404 page with navigation back to home
- **Route Structure**:
  - `/` - Root (AuthWrapper)
  - `/login` - Login page
  - `/register` - Registration page
  - `/home` - Protected home page
  - `/profile` - Protected profile page
  - `/change-password` - Protected password change

### ⚙️ **App Configuration** (`app_config.dart`)
- **BLoC Providers**: Centralized provider configuration
- **Theme Configuration**: Light and dark theme support
- **Material Design 3**: Modern UI components
- **Consistent Styling**: Unified button, card, and input styles

## Authentication Flow

The app implements a complete authentication flow:

1. **App Start** → `AuthWrapper` checks authentication status
2. **Not Authenticated** → Redirects to `/login`
3. **Authenticated** → Redirects to `/home`
4. **Protected Routes** → `AuthGuard` ensures authentication

### Authentication States

```dart
// AuthWrapper handles initial routing
AuthWrapper → LoginPage (if not authenticated)
AuthWrapper → HomePage (if authenticated)

// AuthGuard protects specific routes
AuthGuard → ProtectedPage (if authenticated)
AuthGuard → LoginPage (if not authenticated)
```

## Usage

### 1. **App Initialization** (`main.dart`)

```dart
void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await di.init(); // Initialize dependency injection
  runApp(const MainApp());
}
```

### 2. **Navigation Examples**

```dart
// Navigate to home
context.go('/home');

// Navigate to profile
context.go('/profile');

// Navigate to login
context.go('/login');
```

### 3. **Adding New Protected Routes**

```dart
// In app_router.dart
GoRoute(
  path: '/new-protected-page',
  builder: (context, state) => const AuthGuard(
    child: NewProtectedPage(),
  ),
),
```

### 4. **Adding New BLoC Providers**

```dart
// In app_config.dart
static List<BlocProvider> get providers => [
  BlocProvider<AuthBloc>(create: (context) => createAuthBloc()),
  BlocProvider<NewBloc>(create: (context) => createNewBloc()), // Add here
];
```

## Home Page Features

### Dashboard Sections

1. **Welcome Section**
   - User avatar and name display
   - Personalized greeting
   - Account status information

2. **Quick Actions**
   - Blog management (placeholder)
   - Project showcase (placeholder)
   - Analytics dashboard (placeholder)
   - Settings access

3. **Recent Activity**
   - Welcome messages
   - Account setup completion
   - Future: Real activity feed

4. **Bottom Navigation**
   - Home, Blog, Projects, About tabs
   - Navigation to different app sections

## Theme Configuration

### Light Theme
- Blue primary color scheme
- Material Design 3 components
- Consistent spacing and typography

### Dark Theme
- Automatic dark mode support
- System theme detection
- Consistent with light theme structure

## Error Handling

- **404 Pages**: Custom error page for unknown routes
- **Navigation Errors**: Graceful fallback to home
- **Auth Errors**: Handled by AuthGuard and AuthWrapper

## Dependencies

- `go_router` - Navigation and routing
- `flutter_bloc` - State management
- `flutter/material.dart` - UI components
- Auth domain features and BLoC

## Future Enhancements

- [ ] Blog management integration
- [ ] Project showcase integration
- [ ] Analytics dashboard
- [ ] Push notifications
- [ ] Deep linking support
- [ ] Offline mode indicators
- [ ] App version checking
- [ ] Performance monitoring

## Integration Points

The app layer integrates with:

1. **Auth Domain**: Authentication pages and BLoC
2. **Core Layer**: Dependency injection and configuration
3. **Other Domains**: Blog, projects, settings (future)

This creates a cohesive application structure that's maintainable and scalable.
