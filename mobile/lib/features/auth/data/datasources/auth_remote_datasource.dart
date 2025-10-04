import 'package:dio/dio.dart';
import '../../../../core/error/exceptions.dart';
import '../../../../core/query/query_client.dart';
import '../../domain/entities/auth_response_entity.dart';
import '../../domain/entities/user_entity.dart';
import '../models/auth_response_model.dart';
import '../models/user_model.dart';

abstract class AuthRemoteDataSource {
  Future<AuthResponseEntity> login({
    required String email,
    required String password,
  });

  Future<AuthResponseEntity> register({
    required String email,
    required String username,
    required String password,
    String? firstName,
    String? lastName,
  });

  Future<UserEntity> getCurrentUser();

  Future<void> logout();

  Future<AuthResponseEntity> refreshToken({
    required String refreshToken,
  });

  Future<void> forgotPassword({
    required String email,
  });

  Future<void> resetPassword({
    required String token,
    required String password,
  });

  Future<void> changePassword({
    required String currentPassword,
    required String newPassword,
  });

  Future<UserEntity> updateProfile({
    String? firstName,
    String? lastName,
    String? avatar,
  });
}

class AuthRemoteDataSourceImpl implements AuthRemoteDataSource {
  final QueryClientManager queryClientManager;
  final String baseUrl;

  AuthRemoteDataSourceImpl({
    required this.queryClientManager,
    required this.baseUrl,
  });

  Dio get _dio => queryClientManager.dio;

  @override
  Future<AuthResponseEntity> login({
    required String email,
    required String password,
  }) async {
    try {
      final response = await _dio.post(
        '/auth/login',
        data: {
          'email': email,
          'password': password,
        },
      );

      if (response.statusCode == 200) {
        final data = response.data;
        if (data['success'] == true) {
          return AuthResponseModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['error'] ?? data['message'] ?? 'Login failed');
        }
      } else if (response.statusCode == 401) {
        throw AuthenticationException('Invalid credentials');
      } else if (response.statusCode == 422) {
        final data = response.data;
        throw ValidationException(data['error'] ?? data['message'] ?? 'Validation failed');
      } else {
        throw ServerException('Login failed with status ${response.statusCode}');
      }
    } on DioException catch (e) {
      if (e.type == DioExceptionType.connectionTimeout || 
          e.type == DioExceptionType.receiveTimeout ||
          e.type == DioExceptionType.sendTimeout) {
        throw NetworkException('Network timeout occurred');
      } else if (e.response?.statusCode == 401) {
        throw AuthenticationException('Invalid credentials');
      } else if (e.response?.statusCode == 422) {
        final data = e.response?.data;
        throw ValidationException(data['error'] ?? data['message'] ?? 'Validation failed');
      } else {
        throw NetworkException('Network error: ${e.message}');
      }
    } catch (e) {
      if (e is ServerException || e is AuthenticationException || e is ValidationException) {
        rethrow;
      }
      throw ServerException('Unexpected error: $e');
    }
  }

  @override
  Future<AuthResponseEntity> register({
    required String email,
    required String username,
    required String password,
    String? firstName,
    String? lastName,
  }) async {
    try {
      final response = await _dio.post(
        '/auth/register',
        data: {
          'email': email,
          'username': username,
          'password': password,
          if (firstName != null) 'firstName': firstName,
          if (lastName != null) 'lastName': lastName,
        },
      );

      if (response.statusCode == 201) {
        final data = response.data;
        if (data['success'] == true) {
          return AuthResponseModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['error'] ?? data['message'] ?? 'Registration failed');
        }
      } else if (response.statusCode == 422) {
        final data = response.data;
        throw ValidationException(data['error'] ?? data['message'] ?? 'Validation failed');
      } else {
        throw ServerException('Registration failed with status ${response.statusCode}');
      }
    } on DioException catch (e) {
      if (e.type == DioExceptionType.connectionTimeout || 
          e.type == DioExceptionType.receiveTimeout ||
          e.type == DioExceptionType.sendTimeout) {
        throw NetworkException('Network timeout occurred');
      } else if (e.response?.statusCode == 422) {
        final data = e.response?.data;
        throw ValidationException(data['error'] ?? data['message'] ?? 'Validation failed');
      } else {
        throw NetworkException('Network error: ${e.message}');
      }
    } catch (e) {
      if (e is ServerException || e is ValidationException) {
        rethrow;
      }
      throw ServerException('Unexpected error: $e');
    }
  }

  @override
  Future<UserEntity> getCurrentUser() async {
    try {
      print('🔍 Auth API Request: /auth/me');
      final response = await _dio.get('/auth/me');

      print('📡 Auth API Response Status: ${response.statusCode}');

      if (response.statusCode == 200) {
        final data = response.data;
        if (data['success'] == true) {
          return UserModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['error'] ?? data['message'] ?? 'Failed to get user data');
        }
      } else if (response.statusCode == 401) {
        throw AuthenticationException('User not authenticated');
      } else {
        throw ServerException('Failed to get user data with status ${response.statusCode}');
      }
    } on DioException catch (e) {
      if (e.type == DioExceptionType.connectionTimeout || 
          e.type == DioExceptionType.receiveTimeout ||
          e.type == DioExceptionType.sendTimeout) {
        throw NetworkException('Network timeout occurred');
      } else if (e.response?.statusCode == 401) {
        throw AuthenticationException('User not authenticated');
      } else {
        throw NetworkException('Network error: ${e.message}');
      }
    } catch (e) {
      if (e is ServerException || e is NetworkException || e is AuthenticationException) {
        rethrow;
      }
      throw ServerException('Unexpected error: $e');
    }
  }

  @override
  Future<void> logout() async {
    try {
      await _dio.post('/auth/logout');
    } on DioException catch (e) {
      if (e.type == DioExceptionType.connectionTimeout || 
          e.type == DioExceptionType.receiveTimeout ||
          e.type == DioExceptionType.sendTimeout) {
        throw NetworkException('Network timeout occurred');
      } else {
        throw NetworkException('Network error: ${e.message}');
      }
    } catch (e) {
      if (e is NetworkException) {
        rethrow;
      }
      throw ServerException('Unexpected error: $e');
    }
  }

  @override
  Future<AuthResponseEntity> refreshToken({
    required String refreshToken,
  }) async {
    try {
      final response = await _dio.post(
        '/auth/refresh',
        data: {'refreshToken': refreshToken},
      );

      if (response.statusCode == 200) {
        final data = response.data;
        if (data['success'] == true) {
          return AuthResponseModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['error'] ?? data['message'] ?? 'Token refresh failed');
        }
      } else if (response.statusCode == 401) {
        throw AuthenticationException('Invalid refresh token');
      } else {
        throw ServerException('Token refresh failed with status ${response.statusCode}');
      }
    } on DioException catch (e) {
      if (e.type == DioExceptionType.connectionTimeout || 
          e.type == DioExceptionType.receiveTimeout ||
          e.type == DioExceptionType.sendTimeout) {
        throw NetworkException('Network timeout occurred');
      } else if (e.response?.statusCode == 401) {
        throw AuthenticationException('Invalid refresh token');
      } else {
        throw NetworkException('Network error: ${e.message}');
      }
    } catch (e) {
      if (e is ServerException || e is AuthenticationException) {
        rethrow;
      }
      throw ServerException('Unexpected error: $e');
    }
  }

  @override
  Future<void> forgotPassword({
    required String email,
  }) async {
    try {
      final response = await _dio.post(
        '/auth/forgot-password',
        data: {'email': email},
      );

      if (response.statusCode != 200) {
        throw ServerException('Failed to send reset email with status ${response.statusCode}');
      }
    } on DioException catch (e) {
      if (e.type == DioExceptionType.connectionTimeout || 
          e.type == DioExceptionType.receiveTimeout ||
          e.type == DioExceptionType.sendTimeout) {
        throw NetworkException('Network timeout occurred');
      } else {
        throw NetworkException('Network error: ${e.message}');
      }
    } catch (e) {
      if (e is ServerException || e is NetworkException) {
        rethrow;
      }
      throw ServerException('Unexpected error: $e');
    }
  }

  @override
  Future<void> resetPassword({
    required String token,
    required String password,
  }) async {
    try {
      final response = await _dio.post(
        '/auth/reset-password',
        data: {
          'token': token,
          'password': password,
        },
      );

      if (response.statusCode != 200) {
        throw ServerException('Failed to reset password with status ${response.statusCode}');
      }
    } on DioException catch (e) {
      if (e.type == DioExceptionType.connectionTimeout || 
          e.type == DioExceptionType.receiveTimeout ||
          e.type == DioExceptionType.sendTimeout) {
        throw NetworkException('Network timeout occurred');
      } else {
        throw NetworkException('Network error: ${e.message}');
      }
    } catch (e) {
      if (e is ServerException || e is NetworkException) {
        rethrow;
      }
      throw ServerException('Unexpected error: $e');
    }
  }

  @override
  Future<void> changePassword({
    required String currentPassword,
    required String newPassword,
  }) async {
    try {
      final response = await _dio.post(
        '/auth/change-password',
        data: {
          'currentPassword': currentPassword,
          'newPassword': newPassword,
        },
      );

      if (response.statusCode != 200) {
        throw ServerException('Failed to change password with status ${response.statusCode}');
      }
    } on DioException catch (e) {
      if (e.type == DioExceptionType.connectionTimeout || 
          e.type == DioExceptionType.receiveTimeout ||
          e.type == DioExceptionType.sendTimeout) {
        throw NetworkException('Network timeout occurred');
      } else {
        throw NetworkException('Network error: ${e.message}');
      }
    } catch (e) {
      if (e is ServerException || e is NetworkException) {
        rethrow;
      }
      throw ServerException('Unexpected error: $e');
    }
  }

  @override
  Future<UserEntity> updateProfile({
    String? firstName,
    String? lastName,
    String? avatar,
  }) async {
    try {
      final response = await _dio.put(
        '/auth/profile',
        data: {
          if (firstName != null) 'firstName': firstName,
          if (lastName != null) 'lastName': lastName,
          if (avatar != null) 'avatar': avatar,
        },
      );

      if (response.statusCode == 200) {
        final data = response.data;
        if (data['success'] == true) {
          return UserModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['error'] ?? data['message'] ?? 'Profile update failed');
        }
      } else {
        throw ServerException('Profile update failed with status ${response.statusCode}');
      }
    } on DioException catch (e) {
      if (e.type == DioExceptionType.connectionTimeout || 
          e.type == DioExceptionType.receiveTimeout ||
          e.type == DioExceptionType.sendTimeout) {
        throw NetworkException('Network timeout occurred');
      } else {
        throw NetworkException('Network error: ${e.message}');
      }
    } catch (e) {
      if (e is ServerException || e is NetworkException) {
        rethrow;
      }
      throw ServerException('Unexpected error: $e');
    }
  }
}