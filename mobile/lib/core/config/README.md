# Environment Configuration

This directory contains the environment configuration for the Flutter mobile app.

## Setup

1. **Copy the example environment file:**
   ```bash
   cp env.example .env
   ```

2. **Configure your variables:**
   Edit the `.env` file in the `mobile/` directory with your actual values:
   ```env
   API_BASE_URL=http://localhost:3000/api
   API_TIMEOUT=30000
   ENVIRONMENT=development
   ```

## Usage

The `EnvConfig` class provides static getters for all environment variables:

```dart
import 'package:woragis/core/config/env_config.dart';

// API Configuration
final apiUrl = EnvConfig.apiBaseUrl;
final timeout = EnvConfig.apiTimeout;

// Environment
final isDev = EnvConfig.isDevelopment;
final isProd = EnvConfig.isProduction;

// Feature Flags
if (EnvConfig.featureMoney) {
  // Show money features
}
```

## Available Variables

### API Configuration
- `apiBaseUrl` - Base URL for API requests
- `apiTimeout` - Request timeout in milliseconds

### Authentication
- `authTokenKey` - Storage key for auth token
- `refreshTokenKey` - Storage key for refresh token
- `userDataKey` - Storage key for user data

### Environment
- `environment` - Current environment (development/production)
- `debugMode` - Enable debug features
- `isProduction` - Check if running in production
- `isDevelopment` - Check if running in development

### Feature Flags
- `featureBlog` - Enable/disable blog feature
- `featureProjects` - Enable/disable projects feature
- `featureAbout` - Enable/disable about feature
- `featureMoney` - Enable/disable money feature
- `featureEducation` - Enable/disable education feature
- `featureExperience` - Enable/disable experience feature
- `featureFrameworks` - Enable/disable frameworks feature
- `featureTestimonials` - Enable/disable testimonials feature
- `featureAdmin` - Enable/disable admin features

### Query Configuration
- `queryStaleTimeMinutes` - Minutes before cached data becomes stale
- `queryCacheTimeMinutes` - Minutes to keep cached data
- `queryRetryAttempts` - Number of retry attempts for failed requests

### UI Configuration
- `defaultTheme` - Default theme (light/dark/system)
- `defaultLanguage` - Default language code
- `supportedLanguages` - List of supported language codes

### Security
- `encryptionEnabled` - Enable data encryption
- `biometricAuthEnabled` - Enable biometric authentication

## Initialization

The environment config is automatically initialized in `main.dart`:

```dart
void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize environment configuration
  await EnvConfig.init();
  
  // Print config in debug mode
  EnvConfig.printConfig();
  
  runApp(const MainApp());
}
```

## Best Practices

1. **Never commit `.env` files** - The `.env` file is in `.gitignore` to prevent committing sensitive data
2. **Keep `env.example` updated** - When adding new variables, update the example file
3. **Use fallback values** - All getters have fallback values for missing variables
4. **Document new variables** - Add documentation here when adding new environment variables

## Testing

For testing, you can mock environment variables by creating a test `.env` file or by overriding the dotenv values in your tests.

## Production

For production builds:

1. Create a production `.env` file with production values
2. Set `ENVIRONMENT=production`
3. Set `DEBUG_MODE=false`
4. Configure your actual API URL
5. Disable development-only features




