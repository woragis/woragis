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
          handler.next(options);
          return;
        }

        // For mobile endpoints, API key is already set in base headers
        if (options.path.contains('/mobile/')) {
          handler.next(options);
          return;
        }

        // For other endpoints, add JWT token if available
        final accessToken = _authStore?.state.accessToken;
        final hasValidToken = _authStore?.state.hasValidToken ?? false;
        if (accessToken != null && hasValidToken) {
          options.headers['Authorization'] = 'Bearer $accessToken';
        }
        handler.next(options);
      },
      onError: (error, handler) {
        // Handle common errors
        if (error.response?.statusCode == 401) {
          // Could trigger logout here if needed
        } else if (error.response?.statusCode == 403) {
        }
        handler.next(error);
      },
    ));
  }

  void dispose() {
    _dio.close();
  }
}
