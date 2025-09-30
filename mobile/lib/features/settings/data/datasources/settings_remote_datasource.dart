import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../../../core/error/exceptions.dart';
import '../../domain/entities/setting_entity.dart';
import '../models/setting_model.dart';

abstract class SettingsRemoteDataSource {
  Future<List<SettingEntity>> getSettings({
    int? page,
    int? limit,
    String? category,
    String? search,
    String? sortBy,
    String? sortOrder,
  });

  Future<SettingEntity> getSettingById(String id);
  Future<SettingEntity> getSettingByKey(String key);
  Future<SettingEntity> createSetting({
    required String key,
    required String value,
    String? category,
    String? description,
    String? type,
    bool? isPublic,
    bool? isEditable,
  });
  Future<SettingEntity> updateSetting({
    required String id,
    String? key,
    String? value,
    String? category,
    String? description,
    String? type,
    bool? isPublic,
    bool? isEditable,
  });
  Future<SettingEntity> updateSettingByKey({
    required String key,
    required String value,
  });
  Future<void> deleteSetting(String id);
  Future<void> deleteSettingByKey(String key);
  Future<List<SettingEntity>> getSettingsByCategory(String category);
  Future<List<SettingEntity>> getPublicSettings();
}

class SettingsRemoteDataSourceImpl implements SettingsRemoteDataSource {
  final http.Client client;
  final String baseUrl;

  SettingsRemoteDataSourceImpl({
    required this.client,
    required this.baseUrl,
  });

  @override
  Future<List<SettingEntity>> getSettings({
    int? page,
    int? limit,
    String? category,
    String? search,
    String? sortBy,
    String? sortOrder,
  }) async {
    try {
      final queryParams = <String, String>{};
      if (page != null) queryParams['page'] = page.toString();
      if (limit != null) queryParams['limit'] = limit.toString();
      if (category != null) queryParams['category'] = category;
      if (search != null && search.isNotEmpty) queryParams['search'] = search;
      if (sortBy != null) queryParams['sortBy'] = sortBy;
      if (sortOrder != null) queryParams['sortOrder'] = sortOrder;

      final uri = Uri.parse('$baseUrl/settings').replace(queryParameters: queryParams);
      final response = await client.get(uri);

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          final settings = (data['data']['settings'] as List)
              .map((settingJson) => SettingModel.fromJson(settingJson).toEntity())
              .toList();
          return settings;
        } else {
          throw ServerException(data['message'] ?? 'Failed to fetch settings');
        }
      } else {
        throw ServerException('Failed to fetch settings with status ${response.statusCode}');
      }
    } on http.ClientException {
      throw NetworkException('Network error occurred');
    } catch (e) {
      if (e is ServerException || e is NetworkException) {
        rethrow;
      }
      throw ServerException('Unexpected error: $e');
    }
  }

  @override
  Future<SettingEntity> getSettingById(String id) async {
    try {
      final response = await client.get(Uri.parse('$baseUrl/settings/$id'));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return SettingModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['message'] ?? 'Failed to fetch setting');
        }
      } else if (response.statusCode == 404) {
        throw NotFoundException('Setting not found');
      } else {
        throw ServerException('Failed to fetch setting with status ${response.statusCode}');
      }
    } on http.ClientException {
      throw NetworkException('Network error occurred');
    } catch (e) {
      if (e is ServerException || e is NetworkException || e is NotFoundException) {
        rethrow;
      }
      throw ServerException('Unexpected error: $e');
    }
  }

  @override
  Future<SettingEntity> getSettingByKey(String key) async {
    try {
      final response = await client.get(Uri.parse('$baseUrl/settings/key/$key'));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return SettingModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['message'] ?? 'Failed to fetch setting');
        }
      } else if (response.statusCode == 404) {
        throw NotFoundException('Setting not found');
      } else {
        throw ServerException('Failed to fetch setting with status ${response.statusCode}');
      }
    } on http.ClientException {
      throw NetworkException('Network error occurred');
    } catch (e) {
      if (e is ServerException || e is NetworkException || e is NotFoundException) {
        rethrow;
      }
      throw ServerException('Unexpected error: $e');
    }
  }

  @override
  Future<SettingEntity> createSetting({
    required String key,
    required String value,
    String? category,
    String? description,
    String? type,
    bool? isPublic,
    bool? isEditable,
  }) async {
    try {
      final response = await client.post(
        Uri.parse('$baseUrl/settings'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'key': key,
          'value': value,
          if (category != null) 'category': category,
          if (description != null) 'description': description,
          if (type != null) 'type': type,
          if (isPublic != null) 'isPublic': isPublic,
          if (isEditable != null) 'isEditable': isEditable,
        }),
      );

      if (response.statusCode == 201) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return SettingModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['message'] ?? 'Failed to create setting');
        }
      } else if (response.statusCode == 422) {
        final data = json.decode(response.body);
        throw ValidationException(data['message'] ?? 'Validation failed');
      } else {
        throw ServerException('Failed to create setting with status ${response.statusCode}');
      }
    } on http.ClientException {
      throw NetworkException('Network error occurred');
    } catch (e) {
      if (e is ServerException || e is NetworkException || e is ValidationException) {
        rethrow;
      }
      throw ServerException('Unexpected error: $e');
    }
  }

  @override
  Future<SettingEntity> updateSetting({
    required String id,
    String? key,
    String? value,
    String? category,
    String? description,
    String? type,
    bool? isPublic,
    bool? isEditable,
  }) async {
    try {
      final response = await client.put(
        Uri.parse('$baseUrl/settings/$id'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          if (key != null) 'key': key,
          if (value != null) 'value': value,
          if (category != null) 'category': category,
          if (description != null) 'description': description,
          if (type != null) 'type': type,
          if (isPublic != null) 'isPublic': isPublic,
          if (isEditable != null) 'isEditable': isEditable,
        }),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return SettingModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['message'] ?? 'Failed to update setting');
        }
      } else if (response.statusCode == 404) {
        throw NotFoundException('Setting not found');
      } else if (response.statusCode == 422) {
        final data = json.decode(response.body);
        throw ValidationException(data['message'] ?? 'Validation failed');
      } else {
        throw ServerException('Failed to update setting with status ${response.statusCode}');
      }
    } on http.ClientException {
      throw NetworkException('Network error occurred');
    } catch (e) {
      if (e is ServerException || e is NetworkException || e is NotFoundException || e is ValidationException) {
        rethrow;
      }
      throw ServerException('Unexpected error: $e');
    }
  }

  @override
  Future<SettingEntity> updateSettingByKey({
    required String key,
    required String value,
  }) async {
    try {
      final response = await client.put(
        Uri.parse('$baseUrl/settings/key/$key'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'value': value,
        }),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return SettingModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['message'] ?? 'Failed to update setting');
        }
      } else if (response.statusCode == 404) {
        throw NotFoundException('Setting not found');
      } else if (response.statusCode == 422) {
        final data = json.decode(response.body);
        throw ValidationException(data['message'] ?? 'Validation failed');
      } else {
        throw ServerException('Failed to update setting with status ${response.statusCode}');
      }
    } on http.ClientException {
      throw NetworkException('Network error occurred');
    } catch (e) {
      if (e is ServerException || e is NetworkException || e is NotFoundException || e is ValidationException) {
        rethrow;
      }
      throw ServerException('Unexpected error: $e');
    }
  }

  @override
  Future<void> deleteSetting(String id) async {
    try {
      final response = await client.delete(Uri.parse('$baseUrl/settings/$id'));

      if (response.statusCode != 200 && response.statusCode != 204) {
        if (response.statusCode == 404) {
          throw NotFoundException('Setting not found');
        } else {
          throw ServerException('Failed to delete setting with status ${response.statusCode}');
        }
      }
    } on http.ClientException {
      throw NetworkException('Network error occurred');
    } catch (e) {
      if (e is ServerException || e is NetworkException || e is NotFoundException) {
        rethrow;
      }
      throw ServerException('Unexpected error: $e');
    }
  }

  @override
  Future<void> deleteSettingByKey(String key) async {
    try {
      final response = await client.delete(Uri.parse('$baseUrl/settings/key/$key'));

      if (response.statusCode != 200 && response.statusCode != 204) {
        if (response.statusCode == 404) {
          throw NotFoundException('Setting not found');
        } else {
          throw ServerException('Failed to delete setting with status ${response.statusCode}');
        }
      }
    } on http.ClientException {
      throw NetworkException('Network error occurred');
    } catch (e) {
      if (e is ServerException || e is NetworkException || e is NotFoundException) {
        rethrow;
      }
      throw ServerException('Unexpected error: $e');
    }
  }

  @override
  Future<List<SettingEntity>> getSettingsByCategory(String category) async {
    try {
      final response = await client.get(Uri.parse('$baseUrl/settings/category/$category'));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          final settings = (data['data'] as List)
              .map((settingJson) => SettingModel.fromJson(settingJson).toEntity())
              .toList();
          return settings;
        } else {
          throw ServerException(data['message'] ?? 'Failed to fetch settings by category');
        }
      } else {
        throw ServerException('Failed to fetch settings by category with status ${response.statusCode}');
      }
    } on http.ClientException {
      throw NetworkException('Network error occurred');
    } catch (e) {
      if (e is ServerException || e is NetworkException) {
        rethrow;
      }
      throw ServerException('Unexpected error: $e');
    }
  }

  @override
  Future<List<SettingEntity>> getPublicSettings() async {
    try {
      final response = await client.get(Uri.parse('$baseUrl/settings/public'));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          final settings = (data['data'] as List)
              .map((settingJson) => SettingModel.fromJson(settingJson).toEntity())
              .toList();
          return settings;
        } else {
          throw ServerException(data['message'] ?? 'Failed to fetch public settings');
        }
      } else {
        throw ServerException('Failed to fetch public settings with status ${response.statusCode}');
      }
    } on http.ClientException {
      throw NetworkException('Network error occurred');
    } catch (e) {
      if (e is ServerException || e is NetworkException) {
        rethrow;
      }
      throw ServerException('Unexpected error: $e');
    }
  }
}
