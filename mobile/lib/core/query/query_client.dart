import 'package:dio/dio.dart';

class QueryClientManager {
  late final Dio _dio;

  Dio get dio => _dio;

  QueryClientManager() {
    _dio = Dio();
  }

  Future<void> initialize() async {
    // Configure Dio with base options
    _dio.options = BaseOptions(
      baseUrl: 'http://localhost:3000/api', // This should come from environment
      connectTimeout: const Duration(seconds: 30),
      receiveTimeout: const Duration(seconds: 30),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    );

    // Add interceptors
    _dio.interceptors.add(LogInterceptor(
      requestBody: true,
      responseBody: true,
      error: true,
    ));

    // Add auth interceptor (if needed)
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) {
        // Add auth token if available
        // final token = getAuthToken();
        // if (token != null) {
        //   options.headers['Authorization'] = 'Bearer $token';
        // }
        handler.next(options);
      },
      onError: (error, handler) {
        // Handle common errors
        if (error.response?.statusCode == 401) {
          // Handle unauthorized
        }
        handler.next(error);
      },
    ));
  }

  void dispose() {
    // Clean up resources if needed
  }
}
