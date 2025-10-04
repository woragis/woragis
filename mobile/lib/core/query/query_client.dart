import 'package:dio/dio.dart';
import '../config/env_config.dart';
import '../stores/auth_store.dart';

class QueryClientManager {
  late final Dio _dio;
  AuthStoreBloc? _authStore;

  Dio get dio => _dio;

  QueryClientManager() {
    _dio = Dio();
  }

  void setAuthStore(AuthStoreBloc authStore) {
    _authStore = authStore;
  }

  Future<void> initialize() async {
    // Configure Dio with base options
    _dio.options = BaseOptions(
      baseUrl: EnvConfig.apiBaseUrl,
      connectTimeout: Duration(milliseconds: EnvConfig.apiTimeout),
      receiveTimeout: Duration(milliseconds: EnvConfig.apiTimeout),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Add API key header for mobile app authentication
        EnvConfig.apiKeyHeader: EnvConfig.apiKey,
      },
    );

    // Add interceptors
    _dio.interceptors.add(LogInterceptor(
      requestBody: true,
      responseBody: true,
      error: true,
    ));

    // Add auth interceptor
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) {
        // Skip auth headers for auth endpoints (except /auth/me)
        if (options.path.contains('/auth/') && !options.path.contains('/auth/me')) {
          print('🚫 Skipping auth headers for auth endpoint: ${options.path}');
          handler.next(options);
          return;
        }

        // For mobile endpoints, API key is already set in base headers
        if (options.path.contains('/mobile/')) {
          print('📱 Using API key authentication for mobile endpoint: ${options.path}');
          handler.next(options);
          return;
        }

        // For other endpoints, add JWT token if available
        final accessToken = _authStore?.state.accessToken;
        if (accessToken != null && _authStore?.state.hasValidToken == true) {
          options.headers['Authorization'] = 'Bearer $accessToken';
          print('🔐 Added Authorization header for: ${options.path}');
        } else {
          print('🚨 No valid access token found for: ${options.path}');
          if (accessToken != null) {
            print('🚨 Token expired or invalid');
          }
        }
        handler.next(options);
      },
      onError: (error, handler) {
        // Handle common errors
        if (error.response?.statusCode == 401) {
          print('🚨 Unauthorized - token may be invalid or API key missing');
          // Could trigger logout here if needed
        } else if (error.response?.statusCode == 403) {
          print('🚨 Forbidden - insufficient permissions');
        }
        handler.next(error);
      },
    ));
  }

  void dispose() {
    // Clean up resources if needed
  }
}
