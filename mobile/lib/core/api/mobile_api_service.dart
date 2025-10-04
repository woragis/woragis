import 'package:dio/dio.dart';
import '../query/query_client.dart';

/// Service for making API calls to mobile-specific endpoints
class MobileApiService {
  final QueryClientManager _queryClient;

  MobileApiService(this._queryClient);

  /// Test the mobile API endpoint
  Future<Map<String, dynamic>> testMobileApi() async {
    try {
      final response = await _queryClient.dio.get('/mobile/example');
      return response.data;
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  /// Test the public mobile API endpoint
  Future<Map<String, dynamic>> testPublicMobileApi(Map<String, dynamic> data) async {
    try {
      final response = await _queryClient.dio.post('/mobile/example', data: data);
      return response.data;
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  /// Get projects (public endpoint)
  Future<Map<String, dynamic>> getProjects() async {
    try {
      final response = await _queryClient.dio.get('/projects');
      return response.data;
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  /// Get experience data (public endpoint)
  Future<Map<String, dynamic>> getExperience() async {
    try {
      final response = await _queryClient.dio.get('/experience');
      return response.data;
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  /// Get education data (public endpoint)
  Future<Map<String, dynamic>> getEducation() async {
    try {
      final response = await _queryClient.dio.get('/education');
      return response.data;
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  /// Get frameworks data (public endpoint)
  Future<Map<String, dynamic>> getFrameworks() async {
    try {
      final response = await _queryClient.dio.get('/frameworks');
      return response.data;
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  /// Get testimonials data (public endpoint)
  Future<Map<String, dynamic>> getTestimonials() async {
    try {
      final response = await _queryClient.dio.get('/testimonials');
      return response.data;
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  /// Get blog posts (public endpoint)
  Future<Map<String, dynamic>> getBlogPosts() async {
    try {
      final response = await _queryClient.dio.get('/blog');
      return response.data;
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  /// Get health status
  Future<Map<String, dynamic>> getHealth() async {
    try {
      final response = await _queryClient.dio.get('/health');
      return response.data;
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  /// Handle Dio errors and convert to user-friendly messages
  Exception _handleDioError(DioException e) {
    switch (e.type) {
      case DioExceptionType.connectionTimeout:
        return Exception('Connection timeout. Please check your internet connection.');
      case DioExceptionType.sendTimeout:
        return Exception('Request timeout. Please try again.');
      case DioExceptionType.receiveTimeout:
        return Exception('Response timeout. Please try again.');
      case DioExceptionType.badResponse:
        final statusCode = e.response?.statusCode;
        final message = e.response?.data?['error'] ?? 'Unknown error';
        
        switch (statusCode) {
          case 401:
            return Exception('Unauthorized: $message');
          case 403:
            return Exception('Forbidden: $message');
          case 404:
            return Exception('Not found: $message');
          case 500:
            return Exception('Server error: $message');
          default:
            return Exception('HTTP $statusCode: $message');
        }
      case DioExceptionType.cancel:
        return Exception('Request was cancelled');
      case DioExceptionType.connectionError:
        return Exception('Connection error. Please check your internet connection.');
      case DioExceptionType.badCertificate:
        return Exception('Certificate error. Please check your connection.');
      case DioExceptionType.unknown:
        return Exception('Unknown error: ${e.message}');
    }
  }
}
