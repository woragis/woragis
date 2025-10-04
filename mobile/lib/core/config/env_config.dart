import 'dart:developer';

import 'package:flutter_dotenv/flutter_dotenv.dart';

/// Environment configuration class that loads variables from .env file
/// Falls back to build-time environment variables for production builds
class EnvConfig {
  // Private constructor to prevent instantiation
  EnvConfig._();

  // API Configuration
  static String get apiBaseUrl {
    try {
      return dotenv.get(
        'API_BASE_URL', 
        fallback: const String.fromEnvironment('API_BASE_URL', defaultValue: 'http://localhost:3000/api'),
      );
    } catch (e) {
      return const String.fromEnvironment('API_BASE_URL', defaultValue: 'http://localhost:3000/api');
    }
  }
  
  static int get apiTimeout {
    try {
      return int.parse(dotenv.get('API_TIMEOUT', fallback: '30000'));
    } catch (e) {
      return 30000;
    }
  }

  // API Key Authentication (for mobile app access)
  static String get apiKey {
    try {
      return dotenv.get(
        'API_KEY', 
        fallback: const String.fromEnvironment('API_KEY', defaultValue: 'mobile-key-1'),
      );
    } catch (e) {
      return const String.fromEnvironment('API_KEY', defaultValue: 'mobile-key-1');
    }
  }
  
  static String get apiKeyHeader {
    try {
      return dotenv.get(
        'API_KEY_HEADER', 
        fallback: const String.fromEnvironment('API_KEY_HEADER', defaultValue: 'X-API-Key'),
      );
    } catch (e) {
      return const String.fromEnvironment('API_KEY_HEADER', defaultValue: 'X-API-Key');
    }
  }

  // Authentication
  static String get authTokenKey {
    try {
      return dotenv.get('AUTH_TOKEN_KEY', fallback: 'auth_token');
    } catch (e) {
      return 'auth_token';
    }
  }
  
  static String get refreshTokenKey {
    try {
      return dotenv.get('REFRESH_TOKEN_KEY', fallback: 'refresh_token');
    } catch (e) {
      return 'refresh_token';
    }
  }
  
  static String get userDataKey {
    try {
      return dotenv.get('USER_DATA_KEY', fallback: 'user_data');
    } catch (e) {
      return 'user_data';
    }
  }

  // App Configuration
  static String get appName {
    try {
      return dotenv.get('APP_NAME', fallback: 'Woragis');
    } catch (e) {
      return 'Woragis';
    }
  }
  
  static String get appVersion {
    try {
      return dotenv.get('APP_VERSION', fallback: '1.0.0');
    } catch (e) {
      return '1.0.0';
    }
  }
  
  static String get appBuildNumber {
    try {
      return dotenv.get('APP_BUILD_NUMBER', fallback: '1');
    } catch (e) {
      return '1';
    }
  }

  // Environment
  static String get environment {
    try {
      return dotenv.get('ENVIRONMENT', fallback: 'development');
    } catch (e) {
      return 'development';
    }
  }
  
  static bool get debugMode {
    try {
      return dotenv.get('DEBUG_MODE', fallback: 'true').toLowerCase() == 'true';
    } catch (e) {
      return true;
    }
  }
  
  static bool get isProduction => environment == 'production';
  static bool get isDevelopment => environment == 'development';

  // Storage Configuration
  static String get storageType {
    try {
      return dotenv.get('STORAGE_TYPE', fallback: 'local');
    } catch (e) {
      return 'local';
    }
  }
  
  static String get uploadEndpoint {
    try {
      return dotenv.get('UPLOAD_ENDPOINT', fallback: '/uploads');
    } catch (e) {
      return '/uploads';
    }
  }

  // Offline Configuration
  static bool get offlineCacheEnabled {
    try {
      return dotenv.get('OFFLINE_CACHE_ENABLED', fallback: 'true').toLowerCase() == 'true';
    } catch (e) {
      return true;
    }
  }
  
  static int get offlineCacheSizeMB {
    try {
      return int.parse(dotenv.get('OFFLINE_CACHE_SIZE_MB', fallback: '100'));
    } catch (e) {
      return 100;
    }
  }
  
  static int get offlineCacheDurationDays {
    try {
      return int.parse(dotenv.get('OFFLINE_CACHE_DURATION_DAYS', fallback: '7'));
    } catch (e) {
      return 7;
    }
  }

  // Query Configuration
  static int get queryStaleTimeMinutes {
    try {
      return int.parse(dotenv.get('QUERY_STALE_TIME_MINUTES', fallback: '5'));
    } catch (e) {
      return 5;
    }
  }
  
  static int get queryCacheTimeMinutes {
    try {
      return int.parse(dotenv.get('QUERY_CACHE_TIME_MINUTES', fallback: '10'));
    } catch (e) {
      return 10;
    }
  }
  
  static int get queryRetryAttempts {
    try {
      return int.parse(dotenv.get('QUERY_RETRY_ATTEMPTS', fallback: '3'));
    } catch (e) {
      return 3;
    }
  }

  // Notifications
  static bool get notificationsEnabled {
    try {
      return dotenv.get('NOTIFICATIONS_ENABLED', fallback: 'true').toLowerCase() == 'true';
    } catch (e) {
      return true;
    }
  }
  
  static bool get pushNotificationsEnabled {
    try {
      return dotenv.get('PUSH_NOTIFICATIONS_ENABLED', fallback: 'false').toLowerCase() == 'true';
    } catch (e) {
      return false;
    }
  }

  // Analytics
  static bool get analyticsEnabled {
    try {
      return dotenv.get('ANALYTICS_ENABLED', fallback: 'false').toLowerCase() == 'true';
    } catch (e) {
      return false;
    }
  }
  
  static bool get analyticsDebugMode {
    try {
      return dotenv.get('ANALYTICS_DEBUG_MODE', fallback: 'false').toLowerCase() == 'true';
    } catch (e) {
      return false;
    }
  }

  // Feature Flags
  static bool get featureBlog {
    try {
      return dotenv.get('FEATURE_BLOG', fallback: 'true').toLowerCase() == 'true';
    } catch (e) {
      return true;
    }
  }
  
  static bool get featureProjects {
    try {
      return dotenv.get('FEATURE_PROJECTS', fallback: 'true').toLowerCase() == 'true';
    } catch (e) {
      return true;
    }
  }
  
  static bool get featureAbout {
    try {
      return dotenv.get('FEATURE_ABOUT', fallback: 'true').toLowerCase() == 'true';
    } catch (e) {
      return true;
    }
  }
  
  static bool get featureMoney {
    try {
      return dotenv.get('FEATURE_MONEY', fallback: 'true').toLowerCase() == 'true';
    } catch (e) {
      return true;
    }
  }
  
  static bool get featureEducation {
    try {
      return dotenv.get('FEATURE_EDUCATION', fallback: 'true').toLowerCase() == 'true';
    } catch (e) {
      return true;
    }
  }
  
  static bool get featureExperience {
    try {
      return dotenv.get('FEATURE_EXPERIENCE', fallback: 'true').toLowerCase() == 'true';
    } catch (e) {
      return true;
    }
  }
  
  static bool get featureFrameworks {
    try {
      return dotenv.get('FEATURE_FRAMEWORKS', fallback: 'true').toLowerCase() == 'true';
    } catch (e) {
      return true;
    }
  }
  
  static bool get featureTestimonials {
    try {
      return dotenv.get('FEATURE_TESTIMONIALS', fallback: 'true').toLowerCase() == 'true';
    } catch (e) {
      return true;
    }
  }
  
  static bool get featureAdmin {
    try {
      return dotenv.get('FEATURE_ADMIN', fallback: 'false').toLowerCase() == 'true';
    } catch (e) {
      return false;
    }
  }

  // UI Configuration
  static String get defaultTheme {
    try {
      return dotenv.get('DEFAULT_THEME', fallback: 'system');
    } catch (e) {
      return 'system';
    }
  }
  
  static String get defaultLanguage {
    try {
      return dotenv.get('DEFAULT_LANGUAGE', fallback: 'en');
    } catch (e) {
      return 'en';
    }
  }
  
  static List<String> get supportedLanguages {
    try {
      return dotenv.get('SUPPORTED_LANGUAGES', fallback: 'en,es,fr,it,ja,ko,pt,zh').split(',');
    } catch (e) {
      return ['en', 'es', 'fr', 'it', 'ja', 'ko', 'pt', 'zh'];
    }
  }

  // Security
  static bool get encryptionEnabled {
    try {
      return dotenv.get('ENCRYPTION_ENABLED', fallback: 'true').toLowerCase() == 'true';
    } catch (e) {
      return true;
    }
  }
  
  static bool get biometricAuthEnabled {
    try {
      return dotenv.get('BIOMETRIC_AUTH_ENABLED', fallback: 'false').toLowerCase() == 'true';
    } catch (e) {
      return false;
    }
  }

  // Development
  static String get logLevel {
    try {
      return dotenv.get('LOG_LEVEL', fallback: 'debug');
    } catch (e) {
      return 'debug';
    }
  }
  
  static bool get networkLogging {
    try {
      return dotenv.get('NETWORK_LOGGING', fallback: 'true').toLowerCase() == 'true';
    } catch (e) {
      return true;
    }
  }

  /// Initialize environment configuration
  /// Must be called before accessing any environment variables
  static Future<void> init() async {
    try {
      await dotenv.load(fileName: '.env');
      log('Environment configuration loaded successfully');
    } catch (e) {
      // .env file not found, will use fallback values
      log('Warning: .env file not found, using fallback values. Error: $e');
    }
  }

  /// Print all configuration values (for debugging)
  static void printConfig() {
    // Check if dotenv is initialized before accessing debugMode
    try {
      if (!debugMode) return;
    } catch (e) {
      // If dotenv is not initialized, skip printing config
      log('Warning: Environment not fully initialized, skipping config print');
      return;
    }
    
    log('=== Environment Configuration ===');
    log('Environment: $environment');
    log('API Base URL: $apiBaseUrl');
    log('API Key: $apiKey');
    log('API Key Header: $apiKeyHeader');
    log('Debug Mode: $debugMode');
    log('Offline Cache: $offlineCacheEnabled');
    log('Feature Flags:');
    log('  - Blog: $featureBlog');
    log('  - Projects: $featureProjects');
    log('  - About: $featureAbout');
    log('  - Money: $featureMoney');
    log('  - Admin: $featureAdmin');
    log('================================');
  }
}

