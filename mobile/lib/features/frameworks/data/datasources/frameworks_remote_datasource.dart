import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../../../core/error/exceptions.dart';
import '../../domain/entities/framework_entity.dart';
import '../models/framework_model.dart';

abstract class FrameworksRemoteDataSource {
  Future<List<FrameworkEntity>> getFrameworks({
    int? page,
    int? limit,
    bool? visible,
    bool? public,
    String? type,
    String? search,
    String? sortBy,
    String? sortOrder,
  });

  Future<FrameworkEntity> getFrameworkById(String id);
  Future<FrameworkEntity> getFrameworkBySlug(String slug);
  
  Future<FrameworkEntity> createFramework({
    required String name,
    required String slug,
    String? description,
    String? icon,
    String? color,
    String? url,
    String? type,
    String? proficiencyLevel,
    required int order,
    required bool visible,
    required bool public,
  });

  Future<FrameworkEntity> updateFramework({
    required String id,
    String? name,
    String? slug,
    String? description,
    String? icon,
    String? color,
    String? url,
    String? type,
    String? proficiencyLevel,
    int? order,
    bool? visible,
    bool? public,
  });

  Future<void> deleteFramework(String id);
  Future<void> updateFrameworkOrder(List<Map<String, dynamic>> frameworkOrders);
  Future<int> getFrameworkProjectCount(String frameworkId);
  Future<List<FrameworkEntity>> getFrameworksWithProjectCount();
}

class FrameworksRemoteDataSourceImpl implements FrameworksRemoteDataSource {
  final http.Client client;
  final String baseUrl;

  FrameworksRemoteDataSourceImpl({
    required this.client,
    required this.baseUrl,
  });
  
  @override
  Future<List<FrameworkEntity>> getFrameworks({
    int? page,
    int? limit,
    bool? visible,
    bool? public,
    String? type,
    String? search,
    String? sortBy,
    String? sortOrder,
  }) async {
    try {
      final queryParams = <String, String>{};
      if (page != null) queryParams['page'] = page.toString();
      if (limit != null) queryParams['limit'] = limit.toString();
      if (visible != null) queryParams['visible'] = visible.toString();
      if (public != null) queryParams['public'] = public.toString();
      if (type != null) queryParams['type'] = type;
      if (search != null && search.isNotEmpty) queryParams['search'] = search;
      if (sortBy != null) queryParams['sortBy'] = sortBy;
      if (sortOrder != null) queryParams['sortOrder'] = sortOrder;

      final uri = Uri.parse('$baseUrl/admin/frameworks').replace(queryParameters: queryParams);
      final response = await client.get(uri);

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          final frameworks = (data['data']['frameworks'] as List)
              .map((frameworkJson) => FrameworkModel.fromJson(frameworkJson).toEntity())
              .toList();
          return frameworks;
        } else {
          throw ServerException(data['message'] ?? 'Failed to fetch frameworks');
        }
      } else {
        throw ServerException('Failed to fetch frameworks with status ${response.statusCode}');
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
  Future<FrameworkEntity> getFrameworkById(String id) async {
    try {
      final response = await client.get(Uri.parse('$baseUrl/admin/frameworks/$id'));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return FrameworkModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['message'] ?? 'Failed to fetch framework');
        }
      } else if (response.statusCode == 404) {
        throw NotFoundException('Framework not found');
      } else {
        throw ServerException('Failed to fetch framework with status ${response.statusCode}');
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
  Future<FrameworkEntity> getFrameworkBySlug(String slug) async {
    try {
      final response = await client.get(Uri.parse('$baseUrl/admin/frameworks/slug/$slug'));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return FrameworkModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['message'] ?? 'Failed to fetch framework');
        }
      } else if (response.statusCode == 404) {
        throw NotFoundException('Framework not found');
      } else {
        throw ServerException('Failed to fetch framework with status ${response.statusCode}');
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
  Future<FrameworkEntity> createFramework({
    required String name,
    required String slug,
    String? description,
    String? icon,
    String? color,
    String? url,
    String? type,
    String? proficiencyLevel,
    required int order,
    required bool visible,
    required bool public,
  }) async {
    try {
      final response = await client.post(
        Uri.parse('$baseUrl/admin/frameworks'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'name': name,
          'slug': slug,
          if (description != null) 'description': description,
          if (icon != null) 'icon': icon,
          if (color != null) 'color': color,
          if (url != null) 'url': url,
          if (type != null) 'type': type,
          if (proficiencyLevel != null) 'proficiencyLevel': proficiencyLevel,
          'order': order,
          'visible': visible,
          'public': public,
        }),
      );

      if (response.statusCode == 201) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return FrameworkModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['message'] ?? 'Failed to create framework');
        }
      } else if (response.statusCode == 422) {
        final data = json.decode(response.body);
        throw ValidationException(data['message'] ?? 'Validation failed');
      } else {
        throw ServerException('Failed to create framework with status ${response.statusCode}');
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
  Future<FrameworkEntity> updateFramework({
    required String id,
    String? name,
    String? slug,
    String? description,
    String? icon,
    String? color,
    String? url,
    String? type,
    String? proficiencyLevel,
    int? order,
    bool? visible,
    bool? public,
  }) async {
    try {
      final response = await client.put(
        Uri.parse('$baseUrl/admin/frameworks/$id'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          if (name != null) 'name': name,
          if (slug != null) 'slug': slug,
          if (description != null) 'description': description,
          if (icon != null) 'icon': icon,
          if (color != null) 'color': color,
          if (url != null) 'url': url,
          if (type != null) 'type': type,
          if (proficiencyLevel != null) 'proficiencyLevel': proficiencyLevel,
          if (order != null) 'order': order,
          if (visible != null) 'visible': visible,
          if (public != null) 'public': public,
        }),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return FrameworkModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['message'] ?? 'Failed to update framework');
        }
      } else if (response.statusCode == 404) {
        throw NotFoundException('Framework not found');
      } else if (response.statusCode == 422) {
        final data = json.decode(response.body);
        throw ValidationException(data['message'] ?? 'Validation failed');
      } else {
        throw ServerException('Failed to update framework with status ${response.statusCode}');
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
  Future<void> deleteFramework(String id) async {
    try {
      final response = await client.delete(Uri.parse('$baseUrl/admin/frameworks/$id'));

      if (response.statusCode != 200 && response.statusCode != 204) {
        if (response.statusCode == 404) {
          throw NotFoundException('Framework not found');
        } else {
          throw ServerException('Failed to delete framework with status ${response.statusCode}');
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
  Future<void> updateFrameworkOrder(List<Map<String, dynamic>> frameworkOrders) async {
    try {
      final response = await client.put(
        Uri.parse('$baseUrl/admin/frameworks/order'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'frameworkOrders': frameworkOrders}),
      );

      if (response.statusCode != 200) {
        throw ServerException('Failed to update framework order with status ${response.statusCode}');
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
  Future<int> getFrameworkProjectCount(String frameworkId) async {
    try {
      final response = await client.get(Uri.parse('$baseUrl/admin/frameworks/$frameworkId/project-count'));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return data['data']['count'] as int;
        } else {
          throw ServerException(data['message'] ?? 'Failed to fetch project count');
        }
      } else {
        throw ServerException('Failed to fetch project count with status ${response.statusCode}');
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
  Future<List<FrameworkEntity>> getFrameworksWithProjectCount() async {
    try {
      final response = await client.get(Uri.parse('$baseUrl/admin/frameworks/with-count'));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          final frameworks = (data['data']['frameworks'] as List)
              .map((frameworkJson) => FrameworkModel.fromJson(frameworkJson).toEntity())
              .toList();
          return frameworks;
        } else {
          throw ServerException(data['message'] ?? 'Failed to fetch frameworks with project count');
        }
      } else {
        throw ServerException('Failed to fetch frameworks with project count with status ${response.statusCode}');
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