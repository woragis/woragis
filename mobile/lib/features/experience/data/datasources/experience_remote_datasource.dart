import 'dart:convert';
import 'dart:developer';
import 'package:http/http.dart' as http;
import '../../../../core/error/exceptions.dart';
import '../../domain/entities/experience_entity.dart';
import '../models/experience_model.dart';

abstract class ExperienceRemoteDataSource {
  Future<List<ExperienceEntity>> getExperienceList({
    int? page,
    int? limit,
    bool? visible,
    String? company,
    String? search,
  });

  Future<ExperienceEntity> getExperienceById(String id);

  Future<ExperienceEntity> createExperience({
    required String title,
    required String company,
    required String description,
    required String startDate,
    required String endDate,
    required bool visible,
    required int order,
  });

  Future<ExperienceEntity> updateExperience({
    required String id,
    String? title,
    String? company,
    String? description,
    String? startDate,
    String? endDate,
    bool? visible,
    int? order,
  });

  Future<void> deleteExperience(String id);

  Future<void> updateExperienceOrder({
    required String id,
    required int order,
  });
}

class ExperienceRemoteDataSourceImpl implements ExperienceRemoteDataSource {
  final http.Client _client = http.Client();
  final String _baseUrl;

  // Simple in-memory cache
  static final Map<String, dynamic> _cache = {};
  static final Map<String, DateTime> _cacheTimestamps = {};
  static const Duration _cacheDuration = Duration(minutes: 5);

  ExperienceRemoteDataSourceImpl({
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
  Future<List<ExperienceEntity>> getExperienceList({
    int? page,
    int? limit,
    bool? visible,
    String? company,
    String? search,
  }) async {
    final cacheKey = 'experience_list_${page}_${limit}_${visible}_${company}_${search}';
    
    return _getCachedOrFetch(cacheKey, () async {
      try {
        final queryParams = <String, dynamic>{};
        if (page != null) queryParams['page'] = page;
        if (limit != null) queryParams['limit'] = limit;
        if (visible != null) queryParams['visible'] = visible;
        if (company != null && company.isNotEmpty) queryParams['company'] = company;
        if (search != null && search.isNotEmpty) queryParams['search'] = search;

        log('🔍 Experience List API Request: /admin/experience');

        final uri = Uri.parse('$_baseUrl/admin/experience').replace(
          queryParameters: queryParams.map((key, value) => MapEntry(key, value.toString())),
        );

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
            final experienceList = (data['data'] as List)
                .map((experienceJson) => ExperienceModel.fromApiJson(experienceJson).toEntity())
                .toList();
            return experienceList;
          } else {
            throw ServerException(data['error'] ?? data['message'] ?? 'Failed to fetch experience list');
          }
        } else {
          throw ServerException('Failed to fetch experience list with status ${response.statusCode}');
        }
      } catch (e) {
        if (e is ServerException || e is NetworkException) {
          rethrow;
        }
        throw ServerException('Unexpected error: $e');
      }
    });
  }

  @override
  Future<ExperienceEntity> getExperienceById(String id) async {
    final cacheKey = 'experience_$id';
    
    return _getCachedOrFetch(cacheKey, () async {
      try {
        log('🔍 Experience by ID API Request: /admin/experience/$id');

        final uri = Uri.parse('$_baseUrl/admin/experience/$id');
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
            final experience = ExperienceModel.fromApiJson(data['data']);
            return experience.toEntity();
          } else {
            throw ServerException(data['error'] ?? data['message'] ?? 'Failed to fetch experience');
          }
        } else {
          throw ServerException('Failed to fetch experience with status ${response.statusCode}');
        }
      } catch (e) {
        if (e is ServerException || e is NetworkException) {
          rethrow;
        }
        throw ServerException('Unexpected error: $e');
      }
    });
  }

  @override
  Future<ExperienceEntity> createExperience({
    required String title,
    required String company,
    required String description,
    required String startDate,
    required String endDate,
    required bool visible,
    required int order,
  }) async {
    try {
      log('🔍 Create Experience API Request: /admin/experience');

      final uri = Uri.parse('$_baseUrl/admin/experience');
      final response = await _client.post(
        uri,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: json.encode({
          'title': title,
          'company': company,
          'description': description,
          'startDate': startDate,
          'endDate': endDate,
          'visible': visible,
          'order': order,
        }),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          final experience = ExperienceModel.fromJson(data['data']);
          
          // Invalidate experience cache
          _invalidateCache('experience_list_');
          
          return experience.toEntity();
        } else {
          throw ServerException(data['error'] ?? data['message'] ?? 'Failed to create experience');
        }
      } else {
        throw ServerException('Failed to create experience with status ${response.statusCode}');
      }
    } catch (e) {
      if (e is ServerException || e is NetworkException) {
        rethrow;
      }
      throw ServerException('Unexpected error: $e');
    }
  }

  @override
  Future<ExperienceEntity> updateExperience({
    required String id,
    String? title,
    String? company,
    String? description,
    String? startDate,
    String? endDate,
    bool? visible,
    int? order,
  }) async {
    try {
      log('🔍 Update Experience API Request: /admin/experience/$id');

      final uri = Uri.parse('$_baseUrl/admin/experience/$id');
      final response = await _client.put(
        uri,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: json.encode({
          if (title != null) 'title': title,
          if (company != null) 'company': company,
          if (description != null) 'description': description,
          if (startDate != null) 'startDate': startDate,
          if (endDate != null) 'endDate': endDate,
          if (visible != null) 'visible': visible,
          if (order != null) 'order': order,
        }),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          final experience = ExperienceModel.fromJson(data['data']);
          
          // Invalidate experience cache
          _invalidateCache('experience_list_');
          _invalidateCache('experience_$id');
          
          return experience.toEntity();
        } else {
          throw ServerException(data['error'] ?? data['message'] ?? 'Failed to update experience');
        }
      } else {
        throw ServerException('Failed to update experience with status ${response.statusCode}');
      }
    } catch (e) {
      if (e is ServerException || e is NetworkException) {
        rethrow;
      }
      throw ServerException('Unexpected error: $e');
    }
  }

  @override
  Future<void> deleteExperience(String id) async {
    try {
      log('🔍 Delete Experience API Request: /admin/experience/$id');

      final uri = Uri.parse('$_baseUrl/admin/experience/$id');
      final response = await _client.delete(
        uri,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        // Invalidate experience cache
        _invalidateCache('experience_list_');
        _invalidateCache('experience_$id');
        
        log('✅ Experience deleted successfully');
      } else {
        throw ServerException('Failed to delete experience with status ${response.statusCode}');
      }
    } catch (e) {
      if (e is ServerException || e is NetworkException) {
        rethrow;
      }
      throw ServerException('Unexpected error: $e');
    }
  }

  @override
  Future<void> updateExperienceOrder({
    required String id,
    required int order,
  }) async {
    try {
      log('🔍 Update Experience Order API Request: /admin/experience/$id/order');

      final uri = Uri.parse('$_baseUrl/admin/experience/$id/order');
      final response = await _client.put(
        uri,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: jsonEncode({
          'order': order,
        }),
      );

      log('📡 Update Experience Order Response: ${response.statusCode}');

      if (response.statusCode == 200) {
        // Invalidate cache for this experience
        _invalidateCache('experience_$id');
        _invalidateCache('experience_list');
        
        log('✅ Experience order updated successfully');
      } else {
        throw ServerException('Failed to update experience order with status ${response.statusCode}');
      }
    } catch (e) {
      if (e is ServerException || e is NetworkException) {
        rethrow;
      }
      throw ServerException('Unexpected error: $e');
    }
  }
}