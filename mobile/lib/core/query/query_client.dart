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
      onError: (error, handler) async {
        // Handle 401 errors with token refresh attempt
        if (error.response?.statusCode == 401) {
          final originalRequest = error.requestOptions;
          
          // Skip refresh for auth endpoints (except /auth/me)
          if (originalRequest.path.contains('/auth/') && !originalRequest.path.contains('/auth/me')) {
            handler.next(error);
            return;
          }
          
          // Skip refresh for mobile endpoints (they use API key)
          if (originalRequest.path.contains('/mobile/')) {
            handler.next(error);
            return;
          }
          
          // Attempt token refresh
          final refreshToken = _authStore?.state.refreshToken;
          if (refreshToken != null && _authStore != null) {
            try {
              // Create a new Dio instance to avoid infinite loops
              final refreshDio = Dio(_dio.options);
              
              // Try to refresh the token
              final refreshResponse = await refreshDio.post(
                '/auth/refresh',
                data: {'refreshToken': refreshToken},
              );
              
              if (refreshResponse.statusCode == 200) {
                final newAccessToken = refreshResponse.data['accessToken'];
                final newRefreshToken = refreshResponse.data['refreshToken'];
                final expiresAt = DateTime.now().add(
                  Duration(seconds: refreshResponse.data['expiresIn'] ?? 3600),
                );
                
                // Update the auth store with new tokens
                _authStore!.updateTokens(
                  accessToken: newAccessToken,
                  refreshToken: newRefreshToken,
                  expiresAt: expiresAt,
                );
                
                // Retry the original request with new token
                originalRequest.headers['Authorization'] = 'Bearer $newAccessToken';
                final retryResponse = await _dio.fetch(originalRequest);
                handler.resolve(retryResponse);
                return;
              }
            } catch (refreshError) {
              // Refresh failed, trigger logout
              _authStore?.logout();
            }
          } else {
            // No refresh token available, trigger logout
            _authStore?.logout();
          }
        } else if (error.response?.statusCode == 403) {
          // Handle 403 Forbidden - user doesn't have permission
          // Could show a specific error message here
        }
        
        handler.next(error);
      },
    ));
  }

  void dispose() {
    _dio.close();
  }
}
