import 'dart:developer';
import 'package:dio/dio.dart';
import '../../../../core/error/exceptions.dart';
import '../../../../core/query/query_client.dart';
import '../../../../core/injection/injection_container.dart';
import '../../../../core/stores/auth_store.dart';
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
  Future<ProjectEntity> createProject(Map<String, dynamic> projectData);
  Future<ProjectEntity> updateProject(String id, Map<String, dynamic> projectData);
  Future<void> deleteProject(String id);
  Future<List<ProjectEntity>> updateProjectOrder(List<Map<String, dynamic>> projectOrders);
  Future<void> incrementProjectViewCount(String id);
  Future<void> incrementProjectLikeCount(String id);
}

class ProjectsRemoteDataSourceImpl implements ProjectsRemoteDataSource {
  final QueryClientManager queryClientManager;
  final String baseUrl;

  ProjectsRemoteDataSourceImpl({
    required this.queryClientManager,
    required this.baseUrl,
  });

  Dio get _dio => queryClientManager.dio;

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
      // Build query parameters exactly like the frontend
      final queryParams = <String, String>{};

      // Convert page to offset (frontend uses offset, not page)
      if (page != null) {
        final offset = (page - 1) * (limit ?? 10);
        queryParams['offset'] = offset.toString();
      }
      if (limit != null) queryParams['limit'] = limit.toString();
      if (featured != null) queryParams['featured'] = featured.toString();
      if (visible != null) queryParams['visible'] = visible.toString();
      if (technologies != null && technologies.isNotEmpty) {
        queryParams['technologies'] = technologies.join(',');
      }
      if (search != null && search.isNotEmpty) queryParams['search'] = search;

      log('🔍 Projects API Request: /admin/projects');
      log('🔍 Query Parameters: $queryParams');

      final response = await _dio.get(
        '/admin/projects',
        queryParameters: queryParams,
      );

      log('📡 Projects API Response Status: ${response.statusCode}');
      log('📡 Projects API Response Headers: ${response.headers}');
      log('📡 Projects API Response Body: ${response.data.toString().substring(0, response.data.toString().length > 500 ? 500 : response.data.toString().length)}...');

      if (response.statusCode == 200) {
        final data = response.data;
        if (data['success'] == true) {
          // Frontend returns data directly, not wrapped in 'projects' key
          final projects = (data['data'] as List)
              .map((projectJson) => ProjectModel.fromJson(projectJson).toEntity())
              .toList();
          return projects;
        } else {
          throw ServerException(data['error'] ?? data['message'] ?? 'Failed to fetch projects');
        }
      } else {
        log('🚨 Projects API Error: ${response.statusCode} - ${response.data}');
        throw ServerException('Failed to fetch projects with status ${response.statusCode}');
      }
    } on DioException catch (e) {
      if (e.type == DioExceptionType.connectionTimeout ||
          e.type == DioExceptionType.receiveTimeout ||
          e.type == DioExceptionType.sendTimeout) {
        throw NetworkException('Network timeout occurred');
      } else if (e.response?.statusCode == 401) {
        throw ServerException('Authentication required. Please login again.');
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
  Future<ProjectEntity> getProjectById(String id) async {
    // UNIQUE_IDENTIFIER_FOR_GET_PROJECT_BY_ID
    try {
      log('🔍 Project by ID API Request: /admin/projects/$id');
      
      // Debug: Check auth state before making request
      final authStore = sl<AuthStoreBloc>();
      final currentState = authStore.state;
      log('🔍 Auth state before request:');
      log('  - accessToken: ${currentState.accessToken != null ? 'Present (${currentState.accessToken!.substring(0, 20)}...)' : 'NULL'}');
      log('  - hasValidToken: ${currentState.hasValidToken}');
      log('  - isAuthenticated: ${currentState.isAuthenticated}');

      final response = await _dio.get('/admin/projects/$id');

      if (response.statusCode == 200) {
        final data = response.data;
        if (data['success'] == true) {
          return ProjectModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['error'] ?? data['message'] ?? 'Failed to fetch project');
        }
      } else if (response.statusCode == 404) {
        throw NotFoundException('Project not found');
      } else {
        throw ServerException('Failed to fetch project with status ${response.statusCode}');
      }
    } on DioException catch (e) {
      log('❌ Project by ID DioException:');
      log('  - Type: ${e.type}');
      log('  - Status Code: ${e.response?.statusCode}');
      log('  - Message: ${e.message}');
      log('  - Response Data: ${e.response?.data}');
      log('  - Request Headers: ${e.requestOptions.headers}');
      log('  - Request URL: ${e.requestOptions.uri}');
      log('');
      if (e.type == DioExceptionType.connectionTimeout ||
          e.type == DioExceptionType.receiveTimeout ||
          e.type == DioExceptionType.sendTimeout) {
        throw NetworkException('Network timeout occurred');
      } else if (e.response?.statusCode == 401) {
        throw ServerException('Authentication required. Please login again.');
      } else if (e.response?.statusCode == 404) {
        throw NotFoundException('Project not found');
      } else {
        throw ServerException('Network error: ${e.message}');
      }
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
      final response = await _dio.get('/admin/projects/slug/$slug');

      if (response.statusCode == 200) {
        final data = response.data;
        if (data['success'] == true) {
          return ProjectModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['error'] ?? data['message'] ?? 'Failed to fetch project');
        }
      } else if (response.statusCode == 404) {
        throw NotFoundException('Project not found');
      } else {
        throw ServerException('Failed to fetch project with status ${response.statusCode}');
      }
    } on DioException catch (e) {
      if (e.type == DioExceptionType.connectionTimeout ||
          e.type == DioExceptionType.receiveTimeout ||
          e.type == DioExceptionType.sendTimeout) {
        throw NetworkException('Network timeout occurred');
      } else if (e.response?.statusCode == 401) {
        throw ServerException('Authentication required. Please login again.');
      } else if (e.response?.statusCode == 404) {
        throw NotFoundException('Project not found');
      } else {
        throw ServerException('Network error: ${e.message}');
      }
    } catch (e) {
      if (e is ServerException || e is NetworkException || e is NotFoundException) {
        rethrow;
      }
      throw ServerException('Unexpected error: $e');
    }
  }

  @override
  Future<ProjectEntity> createProject(Map<String, dynamic> projectData) async {
    try {
      final response = await _dio.post(
        '/admin/projects',
        data: projectData,
      );

      if (response.statusCode == 201) {
        final data = response.data;
        if (data['success'] == true) {
          return ProjectModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['error'] ?? data['message'] ?? 'Failed to create project');
        }
      } else if (response.statusCode == 422) {
        final data = response.data;
        throw ValidationException(data['error'] ?? data['message'] ?? 'Validation failed');
      } else {
        throw ServerException('Failed to create project with status ${response.statusCode}');
      }
    } on DioException catch (e) {
      if (e.type == DioExceptionType.connectionTimeout ||
          e.type == DioExceptionType.receiveTimeout ||
          e.type == DioExceptionType.sendTimeout) {
        throw NetworkException('Network timeout occurred');
      } else if (e.response?.statusCode == 401) {
        throw ServerException('Authentication required. Please login again.');
      } else if (e.response?.statusCode == 422) {
        final data = e.response?.data;
        throw ValidationException(data['error'] ?? data['message'] ?? 'Validation failed');
      } else {
        throw ServerException('Network error: ${e.message}');
      }
    } catch (e) {
      if (e is ServerException || e is ValidationException) {
        rethrow;
      }
      throw ServerException('Unexpected error: $e');
    }
  }

  @override
  Future<ProjectEntity> updateProject(String id, Map<String, dynamic> projectData) async {
    try {
      final response = await _dio.put(
        '/admin/projects/$id',
        data: projectData,
      );

      if (response.statusCode == 200) {
        final data = response.data;
        if (data['success'] == true) {
          return ProjectModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['error'] ?? data['message'] ?? 'Failed to update project');
        }
      } else if (response.statusCode == 404) {
        throw NotFoundException('Project not found');
      } else if (response.statusCode == 422) {
        final data = response.data;
        throw ValidationException(data['error'] ?? data['message'] ?? 'Validation failed');
      } else {
        throw ServerException('Failed to update project with status ${response.statusCode}');
      }
    } on DioException catch (e) {
      if (e.type == DioExceptionType.connectionTimeout ||
          e.type == DioExceptionType.receiveTimeout ||
          e.type == DioExceptionType.sendTimeout) {
        throw NetworkException('Network timeout occurred');
      } else if (e.response?.statusCode == 401) {
        throw ServerException('Authentication required. Please login again.');
      } else if (e.response?.statusCode == 404) {
        throw NotFoundException('Project not found');
      } else if (e.response?.statusCode == 422) {
        final data = e.response?.data;
        throw ValidationException(data['error'] ?? data['message'] ?? 'Validation failed');
      } else {
        throw ServerException('Network error: ${e.message}');
      }
    } catch (e) {
      if (e is ServerException || e is ValidationException || e is NotFoundException) {
        rethrow;
      }
      throw ServerException('Unexpected error: $e');
    }
  }

  @override
  Future<void> deleteProject(String id) async {
    try {
      final response = await _dio.delete('/admin/projects/$id');

      if (response.statusCode == 200) {
        final data = response.data;
        if (data['success'] == true) {
          return;
        } else {
          throw ServerException(data['error'] ?? data['message'] ?? 'Failed to delete project');
        }
      } else if (response.statusCode == 404) {
        throw NotFoundException('Project not found');
      } else {
        throw ServerException('Failed to delete project with status ${response.statusCode}');
      }
    } on DioException catch (e) {
      if (e.type == DioExceptionType.connectionTimeout ||
          e.type == DioExceptionType.receiveTimeout ||
          e.type == DioExceptionType.sendTimeout) {
        throw NetworkException('Network timeout occurred');
      } else if (e.response?.statusCode == 401) {
        throw ServerException('Authentication required. Please login again.');
      } else if (e.response?.statusCode == 404) {
        throw NotFoundException('Project not found');
      } else {
        throw ServerException('Network error: ${e.message}');
      }
    } catch (e) {
      if (e is ServerException || e is NotFoundException) {
        rethrow;
      }
      throw ServerException('Unexpected error: $e');
    }
  }

  @override
  Future<List<ProjectEntity>> updateProjectOrder(List<Map<String, dynamic>> projectOrders) async {
    try {
      final response = await _dio.put(
        '/admin/projects/order',
        data: {'projects': projectOrders},
      );

      if (response.statusCode == 200) {
        final data = response.data;
        if (data['success'] == true) {
          final projects = (data['data'] as List)
              .map((projectJson) => ProjectModel.fromJson(projectJson).toEntity())
              .toList();
          return projects;
        } else {
          throw ServerException(data['error'] ?? data['message'] ?? 'Failed to update project order');
        }
      } else if (response.statusCode == 422) {
        final data = response.data;
        throw ValidationException(data['error'] ?? data['message'] ?? 'Validation failed');
      } else {
        throw ServerException('Failed to update project order with status ${response.statusCode}');
      }
    } on DioException catch (e) {
      if (e.type == DioExceptionType.connectionTimeout ||
          e.type == DioExceptionType.receiveTimeout ||
          e.type == DioExceptionType.sendTimeout) {
        throw NetworkException('Network timeout occurred');
      } else if (e.response?.statusCode == 401) {
        throw ServerException('Authentication required. Please login again.');
      } else if (e.response?.statusCode == 422) {
        final data = e.response?.data;
        throw ValidationException(data['error'] ?? data['message'] ?? 'Validation failed');
      } else {
        throw ServerException('Network error: ${e.message}');
      }
    } catch (e) {
      if (e is ServerException || e is ValidationException) {
        rethrow;
      }
      throw ServerException('Unexpected error: $e');
    }
  }

  @override
  Future<void> incrementProjectViewCount(String id) async {
    try {
      final response = await _dio.post('/admin/projects/$id/view');

      if (response.statusCode == 200) {
        final data = response.data;
        if (data['success'] == true) {
          return;
        } else {
          throw ServerException(data['error'] ?? data['message'] ?? 'Failed to increment view count');
        }
      } else if (response.statusCode == 404) {
        throw NotFoundException('Project not found');
      } else {
        throw ServerException('Failed to increment view count with status ${response.statusCode}');
      }
    } on DioException catch (e) {
      if (e.type == DioExceptionType.connectionTimeout ||
          e.type == DioExceptionType.receiveTimeout ||
          e.type == DioExceptionType.sendTimeout) {
        throw NetworkException('Network timeout occurred');
      } else if (e.response?.statusCode == 401) {
        throw ServerException('Authentication required. Please login again.');
      } else if (e.response?.statusCode == 404) {
        throw NotFoundException('Project not found');
      } else {
        throw ServerException('Network error: ${e.message}');
      }
    } catch (e) {
      if (e is ServerException || e is NotFoundException) {
        rethrow;
      }
      throw ServerException('Unexpected error: $e');
    }
  }

  @override
  Future<void> incrementProjectLikeCount(String id) async {
    try {
      final response = await _dio.post('/admin/projects/$id/like');

      if (response.statusCode == 200) {
        final data = response.data;
        if (data['success'] == true) {
          return;
        } else {
          throw ServerException(data['error'] ?? data['message'] ?? 'Failed to increment like count');
        }
      } else if (response.statusCode == 404) {
        throw NotFoundException('Project not found');
      } else {
        throw ServerException('Failed to increment like count with status ${response.statusCode}');
      }
    } on DioException catch (e) {
      if (e.type == DioExceptionType.connectionTimeout ||
          e.type == DioExceptionType.receiveTimeout ||
          e.type == DioExceptionType.sendTimeout) {
        throw NetworkException('Network timeout occurred');
      } else if (e.response?.statusCode == 401) {
        throw ServerException('Authentication required. Please login again.');
      } else if (e.response?.statusCode == 404) {
        throw NotFoundException('Project not found');
      } else {
        throw ServerException('Network error: ${e.message}');
      }
    } catch (e) {
      if (e is ServerException || e is NotFoundException) {
        rethrow;
      }
      throw ServerException('Unexpected error: $e');
    }
  }
}