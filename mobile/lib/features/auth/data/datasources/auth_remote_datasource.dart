import 'dart:convert';
import 'dart:developer';
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

  Future<UserEntity> getCurrentUser();

  Future<void> logout();

  Future<AuthResponseEntity> refreshToken({
    required String refreshToken,
  });

  Future<void> changePassword({
    required String currentPassword,
    required String newPassword,
  });

  Future<UserEntity> updateProfile({
    String? firstName,
    String? lastName,
    String? email,
    String? username,
  });
}

class AuthRemoteDataSourceImpl implements AuthRemoteDataSource {
  final http.Client _client = http.Client();
  final String _baseUrl;

  // Simple in-memory cache
  static final Map<String, dynamic> _cache = {};
  static final Map<String, DateTime> _cacheTimestamps = {};
  static const Duration _cacheDuration = Duration(minutes: 5);

  AuthRemoteDataSourceImpl({
    required String baseUrl,
  }) : _baseUrl = baseUrl;

  // Helper method to get cached data or fetch fresh
  Future<T> _getCachedOrFetch<T>(
    String cacheKey,
    Future<T> Function() fetcher,
  ) async {
    final now = DateTime.now();
    
    // Check if we have cached data that's still fresh
    if (_cache.containsKey(cacheKey) && 
        _cacheTimestamps.containsKey(cacheKey) &&
        now.difference(_cacheTimestamps[cacheKey]!).compareTo(_cacheDuration) < 0) {
      log('📦 Using cached data for: $cacheKey');
      return _cache[cacheKey] as T;
    }
    
    // Fetch fresh data
    log('🌐 Fetching fresh data for: $cacheKey');
    final data = await fetcher();
    _cache[cacheKey] = data;
    _cacheTimestamps[cacheKey] = now;
    return data;
  }

  // Helper method to invalidate cache
  void _invalidateCache(String pattern) {
    _cache.removeWhere((key, value) => key.contains(pattern));
    _cacheTimestamps.removeWhere((key, value) => key.contains(pattern));
    log('🗑️ Cache invalidated for pattern: $pattern');
  }

  @override
  Future<AuthResponseEntity> login({
    required String email,
    required String password,
  }) async {
    try {
      log('🔍 Auth Login API Request: /api/auth/login');

      final uri = Uri.parse('$_baseUrl/api/auth/login');
      final response = await _client.post(
        uri,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: json.encode({
          'email': email,
          'password': password,
        }),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          final authResponse = AuthResponseModel.fromApiJson(data['data']);
          
          // Invalidate user cache on login
          _invalidateCache('current_user');
          
          return authResponse.toEntity();
        } else {
          throw ServerException(data['error'] ?? data['message'] ?? 'Login failed');
        }
      } else {
        throw ServerException('Login failed with status ${response.statusCode}');
      }
    } catch (e) {
      if (e is ServerException || e is NetworkException) {
        rethrow;
      }
      throw ServerException('Unexpected error during login: $e');
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
      log('🔍 Auth Register API Request: /api/auth/register');

      final uri = Uri.parse('$_baseUrl/api/auth/register');
      final response = await _client.post(
        uri,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: json.encode({
          'email': email,
          'username': username,
          'password': password,
          if (firstName != null) 'firstName': firstName,
          if (lastName != null) 'lastName': lastName,
        }),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          final authResponse = AuthResponseModel.fromApiJson(data['data']);
          
          // Invalidate user cache on register
          _invalidateCache('current_user');
          
          return authResponse.toEntity();
        } else {
          throw ServerException(data['error'] ?? data['message'] ?? 'Registration failed');
        }
      } else {
        throw ServerException('Registration failed with status ${response.statusCode}');
      }
    } catch (e) {
      if (e is ServerException || e is NetworkException) {
        rethrow;
      }
      throw ServerException('Unexpected error during registration: $e');
    }
  }

  @override
  Future<UserEntity> getCurrentUser() async {
    const cacheKey = 'current_user';
    
    return _getCachedOrFetch(cacheKey, () async {
      try {
        log('🔍 Auth Get Current User API Request: /api/auth/me');

        final uri = Uri.parse('$_baseUrl/api/auth/me');
        final response = await _client.get(
          uri,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        );

        if (response.statusCode == 200) {
          final data = json.decode(response.body);
          if (data['success'] == true) {
            final user = UserModel.fromApiJson(data['data']);
            return user.toEntity();
          } else {
            throw ServerException(data['error'] ?? data['message'] ?? 'Failed to get current user');
          }
        } else {
          throw ServerException('Failed to get current user with status ${response.statusCode}');
        }
      } catch (e) {
        if (e is ServerException || e is NetworkException) {
          rethrow;
        }
        throw ServerException('Unexpected error getting current user: $e');
      }
    });
  }

  @override
  Future<void> logout() async {
    try {
      log('🔍 Auth Logout API Request: /api/auth/logout');

      final uri = Uri.parse('$_baseUrl/api/auth/logout');
      final response = await _client.post(
        uri,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        // Invalidate all auth-related cache on logout
        _invalidateCache('current_user');
        log('✅ Logout successful');
      } else {
        log('⚠️ Logout failed with status ${response.statusCode}');
      }
    } catch (e) {
      log('❌ Logout error: $e');
      // Don't throw on logout errors - just log them
    }
  }

  @override
  Future<AuthResponseEntity> refreshToken({
    required String refreshToken,
  }) async {
    try {
      log('🔍 Auth Refresh Token API Request: /api/auth/refresh');

      final uri = Uri.parse('$_baseUrl/api/auth/refresh');
      final response = await _client.post(
        uri,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: json.encode({
          'refreshToken': refreshToken,
        }),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          final authResponse = AuthResponseModel.fromApiJson(data['data']);
          
          // Invalidate user cache on token refresh
          _invalidateCache('current_user');
          
          return authResponse.toEntity();
        } else {
          throw ServerException(data['error'] ?? data['message'] ?? 'Token refresh failed');
        }
      } else {
        throw ServerException('Token refresh failed with status ${response.statusCode}');
      }
    } catch (e) {
      if (e is ServerException || e is NetworkException) {
        rethrow;
      }
      throw ServerException('Unexpected error during token refresh: $e');
    }
  }

  @override
  Future<void> changePassword({
    required String currentPassword,
    required String newPassword,
  }) async {
    try {
      log('🔍 Change Password API Request: /api/auth/change-password');

      final uri = Uri.parse('$_baseUrl/api/auth/change-password');
      final response = await _client.post(
        uri,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: jsonEncode({
          'current_password': currentPassword,
          'new_password': newPassword,
        }),
      );

      log('📡 Change Password Response: ${response.statusCode}');

      if (response.statusCode == 200) {
        log('✅ Password changed successfully');
        return;
      } else {
        final errorBody = jsonDecode(response.body);
        throw ServerException(errorBody['message'] ?? 'Failed to change password');
      }
    } catch (e) {
      if (e is ServerException || e is NetworkException) {
        rethrow;
      }
      throw ServerException('Unexpected error during password change: $e');
    }
  }

  @override
  Future<UserEntity> updateProfile({
    String? firstName,
    String? lastName,
    String? email,
    String? username,
  }) async {
    try {
      log('🔍 Update Profile API Request: /api/auth/profile');

      final uri = Uri.parse('$_baseUrl/api/auth/profile');
      final response = await _client.put(
        uri,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: jsonEncode({
          if (firstName != null) 'first_name': firstName,
          if (lastName != null) 'last_name': lastName,
          if (email != null) 'email': email,
          if (username != null) 'username': username,
        }),
      );

      log('📡 Update Profile Response: ${response.statusCode}');

      if (response.statusCode == 200) {
        final userData = jsonDecode(response.body)['data'];
        final user = UserModel.fromJson(userData);
        log('✅ Profile updated successfully: ${user.username}');
        return user;
      } else {
        final errorBody = jsonDecode(response.body);
        throw ServerException(errorBody['message'] ?? 'Failed to update profile');
      }
    } catch (e) {
      if (e is ServerException || e is NetworkException) {
        rethrow;
      }
      throw ServerException('Unexpected error during profile update: $e');
    }
  }
}