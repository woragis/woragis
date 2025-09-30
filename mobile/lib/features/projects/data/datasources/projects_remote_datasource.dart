import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../../../core/error/exceptions.dart';
import '../../domain/entities/project_entity.dart';
import '../models/project_model.dart';

abstract class ProjectsRemoteDataSource {
  Future<List<ProjectEntity>> getProjects({
    int? page,
    int? limit,
    bool? featured,
    bool? visible,
    bool? public,
    List<String>? technologies,
    String? search,
    String? sortBy,
    String? sortOrder,
  });

  Future<ProjectEntity> getProjectById(String id);
  Future<ProjectEntity> getProjectBySlug(String slug);
  Future<ProjectEntity> createProject({
    required String title,
    required String slug,
    required String description,
    String? longDescription,
    String? content,
    String? videoUrl,
    required String image,
    String? githubUrl,
    String? liveUrl,
    required bool featured,
    required int order,
    required bool visible,
    required bool public,
    List<String>? frameworkIds,
  });
  Future<ProjectEntity> updateProject({
    required String id,
    String? title,
    String? slug,
    String? description,
    String? longDescription,
    String? content,
    String? videoUrl,
    String? image,
    String? githubUrl,
    String? liveUrl,
    bool? featured,
    int? order,
    bool? visible,
    bool? public,
    List<String>? frameworkIds,
  });
  Future<void> deleteProject(String id);

  // Project ordering
  Future<void> updateProjectOrder(List<Map<String, dynamic>> projectOrders);

  // Project frameworks relationship
  Future<void> assignFrameworkToProject({required String projectId, required String frameworkId});
  Future<void> removeFrameworkFromProject({required String projectId, required String frameworkId});
  Future<List<String>> getProjectFrameworkIds(String projectId);

  // Statistics
  Future<void> incrementViewCount(String projectId);
  Future<void> incrementLikeCount(String projectId);
}

class ProjectsRemoteDataSourceImpl implements ProjectsRemoteDataSource {
  final http.Client client;
  final String baseUrl;

  ProjectsRemoteDataSourceImpl({
    required this.client,
    required this.baseUrl,
  });

  @override
  Future<List<ProjectEntity>> getProjects({
    int? page,
    int? limit,
    bool? featured,
    bool? visible,
    bool? public,
    List<String>? technologies,
    String? search,
    String? sortBy,
    String? sortOrder,
  }) async {
    try {
      final queryParams = <String, String>{};
      if (page != null) queryParams['page'] = page.toString();
      if (limit != null) queryParams['limit'] = limit.toString();
      if (featured != null) queryParams['featured'] = featured.toString();
      if (visible != null) queryParams['visible'] = visible.toString();
      if (public != null) queryParams['public'] = public.toString();
      if (technologies != null && technologies.isNotEmpty) {
        queryParams['technologies'] = technologies.join(',');
      }
      if (search != null && search.isNotEmpty) queryParams['search'] = search;
      if (sortBy != null) queryParams['sortBy'] = sortBy;
      if (sortOrder != null) queryParams['sortOrder'] = sortOrder;

      final uri = Uri.parse('$baseUrl/admin/projects').replace(queryParameters: queryParams);
      final response = await client.get(uri);

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          final projects = (data['data']['projects'] as List)
              .map((projectJson) => ProjectModel.fromJson(projectJson).toEntity())
              .toList();
          return projects;
        } else {
          throw ServerException(data['message'] ?? 'Failed to fetch projects');
        }
      } else {
        throw ServerException('Failed to fetch projects with status ${response.statusCode}');
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
  Future<ProjectEntity> getProjectById(String id) async {
    try {
      final response = await client.get(Uri.parse('$baseUrl/admin/projects/$id'));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return ProjectModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['message'] ?? 'Failed to fetch project');
        }
      } else if (response.statusCode == 404) {
        throw NotFoundException('Project not found');
      } else {
        throw ServerException('Failed to fetch project with status ${response.statusCode}');
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
  Future<ProjectEntity> getProjectBySlug(String slug) async {
    try {
      final response = await client.get(Uri.parse('$baseUrl/admin/projects/slug/$slug'));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return ProjectModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['message'] ?? 'Failed to fetch project');
        }
      } else if (response.statusCode == 404) {
        throw NotFoundException('Project not found');
      } else {
        throw ServerException('Failed to fetch project with status ${response.statusCode}');
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
  Future<ProjectEntity> createProject({
    required String title,
    required String slug,
    required String description,
    String? longDescription,
    String? content,
    String? videoUrl,
    required String image,
    String? githubUrl,
    String? liveUrl,
    required bool featured,
    required int order,
    required bool visible,
    required bool public,
    List<String>? frameworkIds,
  }) async {
    try {
      final response = await client.post(
        Uri.parse('$baseUrl/admin/projects'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'title': title,
          'slug': slug,
          'description': description,
          if (longDescription != null) 'longDescription': longDescription,
          if (content != null) 'content': content,
          if (videoUrl != null) 'videoUrl': videoUrl,
          'image': image,
          if (githubUrl != null) 'githubUrl': githubUrl,
          if (liveUrl != null) 'liveUrl': liveUrl,
          'featured': featured,
          'order': order,
          'visible': visible,
          'public': public,
          if (frameworkIds != null) 'frameworks': frameworkIds,
        }),
      );

      if (response.statusCode == 201) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return ProjectModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['message'] ?? 'Failed to create project');
        }
      } else if (response.statusCode == 422) {
        final data = json.decode(response.body);
        throw ValidationException(data['message'] ?? 'Validation failed');
      } else {
        throw ServerException('Failed to create project with status ${response.statusCode}');
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
  Future<ProjectEntity> updateProject({
    required String id,
    String? title,
    String? slug,
    String? description,
    String? longDescription,
    String? content,
    String? videoUrl,
    String? image,
    String? githubUrl,
    String? liveUrl,
    bool? featured,
    int? order,
    bool? visible,
    bool? public,
    List<String>? frameworkIds,
  }) async {
    try {
      final response = await client.put(
        Uri.parse('$baseUrl/admin/projects/$id'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          if (title != null) 'title': title,
          if (slug != null) 'slug': slug,
          if (description != null) 'description': description,
          if (longDescription != null) 'longDescription': longDescription,
          if (content != null) 'content': content,
          if (videoUrl != null) 'videoUrl': videoUrl,
          if (image != null) 'image': image,
          if (githubUrl != null) 'githubUrl': githubUrl,
          if (liveUrl != null) 'liveUrl': liveUrl,
          if (featured != null) 'featured': featured,
          if (order != null) 'order': order,
          if (visible != null) 'visible': visible,
          if (public != null) 'public': public,
          if (frameworkIds != null) 'frameworks': frameworkIds,
        }),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return ProjectModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['message'] ?? 'Failed to update project');
        }
      } else if (response.statusCode == 404) {
        throw NotFoundException('Project not found');
      } else if (response.statusCode == 422) {
        final data = json.decode(response.body);
        throw ValidationException(data['message'] ?? 'Validation failed');
      } else {
        throw ServerException('Failed to update project with status ${response.statusCode}');
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
  Future<void> deleteProject(String id) async {
    try {
      final response = await client.delete(Uri.parse('$baseUrl/admin/projects/$id'));

      if (response.statusCode != 200 && response.statusCode != 204) {
        if (response.statusCode == 404) {
          throw NotFoundException('Project not found');
        } else {
          throw ServerException('Failed to delete project with status ${response.statusCode}');
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
  Future<void> updateProjectOrder(List<Map<String, dynamic>> projectOrders) async {
    try {
      final response = await client.put(
        Uri.parse('$baseUrl/admin/projects/order'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'projectOrders': projectOrders,
        }),
      );

      if (response.statusCode != 200) {
        throw ServerException('Failed to update project order with status ${response.statusCode}');
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
  Future<void> assignFrameworkToProject({required String projectId, required String frameworkId}) async {
    try {
      final response = await client.post(
        Uri.parse('$baseUrl/admin/projects/$projectId/frameworks'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'frameworkId': frameworkId}),
      );

      if (response.statusCode != 200 && response.statusCode != 201) {
        throw ServerException('Failed to assign framework to project with status ${response.statusCode}');
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
  Future<void> removeFrameworkFromProject({required String projectId, required String frameworkId}) async {
    try {
      final response = await client.delete(
        Uri.parse('$baseUrl/admin/projects/$projectId/frameworks/$frameworkId'),
      );

      if (response.statusCode != 200 && response.statusCode != 204) {
        throw ServerException('Failed to remove framework from project with status ${response.statusCode}');
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
  Future<List<String>> getProjectFrameworkIds(String projectId) async {
    try {
      final response = await client.get(Uri.parse('$baseUrl/admin/projects/$projectId/frameworks'));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return List<String>.from(data['data']);
        } else {
          throw ServerException(data['message'] ?? 'Failed to fetch project frameworks');
        }
      } else {
        throw ServerException('Failed to fetch project frameworks with status ${response.statusCode}');
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
  Future<void> incrementViewCount(String projectId) async {
    try {
      final response = await client.post(
        Uri.parse('$baseUrl/admin/projects/$projectId/view'),
      );

      if (response.statusCode != 200) {
        throw ServerException('Failed to increment view count with status ${response.statusCode}');
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
  Future<void> incrementLikeCount(String projectId) async {
    try {
      final response = await client.post(
        Uri.parse('$baseUrl/admin/projects/$projectId/like'),
      );

      if (response.statusCode != 200) {
        throw ServerException('Failed to increment like count with status ${response.statusCode}');
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
