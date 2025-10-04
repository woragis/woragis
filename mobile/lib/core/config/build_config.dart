import 'package:flutter/foundation.dart';

/// Build-time configuration that gets injected during build
class BuildConfig {
  // Private constructor to prevent instantiation
  BuildConfig._();

  // These values will be injected at build time
  static const String _apiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://localhost:3000/api',
  );

  static const String _apiKey = String.fromEnvironment(
    'API_KEY',
    defaultValue: 'mobile-key-1',
  );

  static const String _apiKeyHeader = String.fromEnvironment(
    'API_KEY_HEADER',
    defaultValue: 'X-API-Key',
  );

  static const String _environment = String.fromEnvironment(
    'ENVIRONMENT',
    defaultValue: 'development',
  );

  // Getters
  static String get apiBaseUrl => _apiBaseUrl;
  static String get apiKey => _apiKey;
  static String get apiKeyHeader => _apiKeyHeader;
  static String get environment => _environment;
  static bool get isProduction => environment == 'production';
  static bool get isDevelopment => environment == 'development';

  /// Print build configuration (for debugging)
  static void printConfig() {
    if (kDebugMode) {
      print('=== Build Configuration ===');
      print('Environment: $environment');
      print('API Base URL: $apiBaseUrl');
      print('API Key: $apiKey');
      print('API Key Header: $apiKeyHeader');
      print('==========================');
    }
  }
}
