import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../../../core/error/exceptions.dart';
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

  Future<AuthResponseEntity> refreshToken({
    required String refreshToken,
  });

  Future<void> logout();

  Future<void> changePassword({
    required String currentPassword,
    required String newPassword,
  });

  Future<UserEntity> getCurrentUser();

  Future<UserEntity> updateProfile({
    String? firstName,
    String? lastName,
    String? avatar,
  });
}

class AuthRemoteDataSourceImpl implements AuthRemoteDataSource {
  final http.Client client;
  final String baseUrl;

  AuthRemoteDataSourceImpl({
    required this.client,
    required this.baseUrl,
  });

  @override
  Future<AuthResponseEntity> login({
    required String email,
    required String password,
  }) async {
    try {
      final response = await client.post(
        Uri.parse('$baseUrl/auth/login'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'email': email,
          'password': password,
        }),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return AuthResponseModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['message'] ?? 'Login failed');
        }
      } else if (response.statusCode == 401) {
        throw AuthenticationException('Invalid credentials');
      } else if (response.statusCode == 422) {
        final data = json.decode(response.body);
        throw ValidationException(data['message'] ?? 'Validation failed');
      } else {
        throw ServerException('Login failed with status ${response.statusCode}');
      }
    } on http.ClientException {
      throw NetworkException('Network error occurred');
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
      final response = await client.post(
        Uri.parse('$baseUrl/auth/register'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'email': email,
          'username': username,
          'password': password,
          if (firstName != null) 'firstName': firstName,
          if (lastName != null) 'lastName': lastName,
        }),
      );

      if (response.statusCode == 201) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return AuthResponseModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['message'] ?? 'Registration failed');
        }
      } else if (response.statusCode == 422) {
        final data = json.decode(response.body);
        if (data['message']?.contains('email') == true) {
          throw ConflictException('Email already exists');
        } else if (data['message']?.contains('username') == true) {
          throw ConflictException('Username already exists');
        } else {
          throw ValidationException(data['message'] ?? 'Validation failed');
        }
      } else {
        throw ServerException('Registration failed with status ${response.statusCode}');
      }
    } on http.ClientException {
      throw NetworkException('Network error occurred');
    } catch (e) {
      if (e is ServerException || e is ConflictException || e is ValidationException) {
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
      final response = await client.post(
        Uri.parse('$baseUrl/auth/refresh'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'refreshToken': refreshToken,
        }),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return AuthResponseModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['message'] ?? 'Token refresh failed');
        }
      } else if (response.statusCode == 401) {
        throw AuthenticationException('Invalid refresh token');
      } else {
        throw ServerException('Token refresh failed with status ${response.statusCode}');
      }
    } on http.ClientException {
      throw NetworkException('Network error occurred');
    } catch (e) {
      if (e is ServerException || e is AuthenticationException) {
        rethrow;
      }
      throw ServerException('Unexpected error: $e');
    }
  }

  @override
  Future<void> logout() async {
    try {
      final response = await client.post(
        Uri.parse('$baseUrl/auth/logout'),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode != 200 && response.statusCode != 204) {
        throw ServerException('Logout failed with status ${response.statusCode}');
      }
    } on http.ClientException {
      throw NetworkException('Network error occurred');
    } catch (e) {
      if (e is ServerException) {
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
      final response = await client.post(
        Uri.parse('$baseUrl/auth/change-password'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'currentPassword': currentPassword,
          'newPassword': newPassword,
        }),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] != true) {
          throw ServerException(data['message'] ?? 'Password change failed');
        }
      } else if (response.statusCode == 401) {
        throw AuthenticationException('Invalid current password');
      } else if (response.statusCode == 422) {
        final data = json.decode(response.body);
        throw ValidationException(data['message'] ?? 'Validation failed');
      } else {
        throw ServerException('Password change failed with status ${response.statusCode}');
      }
    } on http.ClientException {
      throw NetworkException('Network error occurred');
    } catch (e) {
      if (e is ServerException || e is AuthenticationException || e is ValidationException) {
        rethrow;
      }
      throw ServerException('Unexpected error: $e');
    }
  }

  @override
  Future<UserEntity> getCurrentUser() async {
    try {
      final response = await client.get(
        Uri.parse('$baseUrl/auth/me'),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return UserModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['message'] ?? 'Failed to get user data');
        }
      } else if (response.statusCode == 401) {
        throw AuthenticationException('User not authenticated');
      } else {
        throw ServerException('Failed to get user data with status ${response.statusCode}');
      }
    } on http.ClientException {
      throw NetworkException('Network error occurred');
    } catch (e) {
      if (e is ServerException || e is AuthenticationException) {
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
      final response = await client.put(
        Uri.parse('$baseUrl/auth/profile'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          if (firstName != null) 'firstName': firstName,
          if (lastName != null) 'lastName': lastName,
          if (avatar != null) 'avatar': avatar,
        }),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return UserModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['message'] ?? 'Profile update failed');
        }
      } else if (response.statusCode == 401) {
        throw AuthenticationException('User not authenticated');
      } else if (response.statusCode == 422) {
        final data = json.decode(response.body);
        throw ValidationException(data['message'] ?? 'Validation failed');
      } else {
        throw ServerException('Profile update failed with status ${response.statusCode}');
      }
    } on http.ClientException {
      throw NetworkException('Network error occurred');
    } catch (e) {
      if (e is ServerException || e is AuthenticationException || e is ValidationException) {
        rethrow;
      }
      throw ServerException('Unexpected error: $e');
    }
  }
}
