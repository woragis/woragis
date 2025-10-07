import 'dart:developer';
import 'package:dio/dio.dart';
import '../../../../core/error/exceptions.dart';
import '../../domain/entities/idea_entity.dart';
import '../../domain/entities/ai_chat_entity.dart';
import '../models/idea_model.dart';
import '../models/ai_chat_model.dart';

abstract class MoneyRemoteDataSourceDio {
  // Ideas
  Future<List<IdeaEntity>> getIdeas({
    int? page,
    int? limit,
    bool? featured,
    bool? visible,
    bool? public,
    String? search,
    String? sortBy,
    String? sortOrder,
  });

  Future<IdeaEntity> getIdeaById(String id);
  Future<IdeaEntity> getIdeaBySlug(String slug);
  Future<IdeaEntity> createIdea({
    required String title,
    required String slug,
    required String document,
    String? description,
    required bool featured,
    required bool visible,
    required bool public,
    required int order,
  });
  Future<IdeaEntity> updateIdea({
    required String id,
    String? title,
    String? slug,
    String? document,
    String? description,
    bool? featured,
    bool? visible,
    bool? public,
    int? order,
  });
  Future<void> deleteIdea(String id);

  // AI Chats
  Future<List<AiChatEntity>> getAiChats({
    int? page,
    int? limit,
    String? ideaNodeId,
    String? agent,
    bool? archived,
    bool? visible,
    String? search,
    String? sortBy,
    String? sortOrder,
  });

  Future<AiChatEntity> getAiChatById(String id);
  Future<AiChatEntity> createAiChat({
    required String title,
    String? ideaNodeId,
    required String agent,
    String? model,
    String? systemPrompt,
    required double temperature,
    int? maxTokens,
    required bool visible,
    required bool archived,
  });
  Future<AiChatEntity> updateAiChat({
    required String id,
    String? title,
    String? ideaNodeId,
    String? agent,
    String? model,
    String? systemPrompt,
    double? temperature,
    int? maxTokens,
    bool? visible,
    bool? archived,
  });
  Future<void> deleteAiChat(String id);
  Future<AiChatEntity> sendMessage({
    required String chatId,
    required String message,
  });
  Future<List<ChatMessageEntity>> getChatMessages(String chatId);
}

class MoneyRemoteDataSourceDioImpl implements MoneyRemoteDataSourceDio {
  final Dio _dio;

  MoneyRemoteDataSourceDioImpl({required Dio dio}) : _dio = dio;

  // Ideas Implementation
  @override
  Future<List<IdeaEntity>> getIdeas({
    int? page,
    int? limit,
    bool? featured,
    bool? visible,
    bool? public,
    String? search,
    String? sortBy,
    String? sortOrder,
  }) async {
    try {
      final queryParams = <String, dynamic>{};
      if (page != null) queryParams['page'] = page;
      if (limit != null) queryParams['limit'] = limit;
      if (featured != null) queryParams['featured'] = featured;
      if (visible != null) queryParams['visible'] = visible;
      if (public != null) queryParams['public'] = public;
      if (search != null && search.isNotEmpty) queryParams['search'] = search;
      if (sortBy != null) queryParams['sortBy'] = sortBy;
      if (sortOrder != null) queryParams['sortOrder'] = sortOrder;

      log('🔍 Money Ideas API Request: /money/ideas');
      log('🔍 Query Parameters: $queryParams');

      final response = await _dio.get(
        '/money/ideas',
        queryParameters: queryParams,
      );

      log('📡 Money Ideas API Response Status: ${response.statusCode}');
      log('📡 Money Ideas API Response Headers: ${response.headers}');
      log('📡 Money Ideas API Response Body: ${response.data.toString().substring(0, response.data.toString().length > 500 ? 500 : response.data.toString().length)}...');

      if (response.statusCode == 200) {
        final data = response.data;
        if (data['success'] == true) {
          // Money API returns data directly, not wrapped in 'ideas' key
          final ideas = (data['data'] as List)
              .map((ideaJson) => IdeaModel.fromJson(ideaJson).toEntity())
              .toList();
          return ideas;
        } else {
          throw ServerException(data['error'] ?? data['message'] ?? 'Failed to fetch ideas');
        }
      } else {
        throw ServerException('Failed to fetch ideas with status ${response.statusCode}');
      }
    } on DioException catch (e) {
      log('❌ Money Ideas DioException:');
      log('  - Type: ${e.type}');
      log('  - Status Code: ${e.response?.statusCode}');
      log('  - Message: ${e.message}');
      log('  - Response Data: ${e.response?.data}');
      log('  - Request Headers: ${e.requestOptions.headers}');
      log('  - Request URL: ${e.requestOptions.uri}');
      
      if (e.type == DioExceptionType.connectionTimeout ||
          e.type == DioExceptionType.receiveTimeout ||
          e.type == DioExceptionType.sendTimeout) {
        throw NetworkException('Network timeout occurred');
      } else if (e.response?.statusCode == 401) {
        throw ServerException('Authentication required. Please login again.');
      } else if (e.response?.statusCode == 404) {
        throw NotFoundException('Ideas not found');
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
  Future<IdeaEntity> getIdeaById(String id) async {
    try {
      log('🔍 Money Idea by ID API Request: /money/ideas/$id');

      final response = await _dio.get('/money/ideas/$id');

      if (response.statusCode == 200) {
        final data = response.data;
        if (data['success'] == true) {
          return IdeaModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['error'] ?? data['message'] ?? 'Failed to fetch idea');
        }
      } else if (response.statusCode == 404) {
        throw NotFoundException('Idea not found');
      } else {
        throw ServerException('Failed to fetch idea with status ${response.statusCode}');
      }
    } on DioException catch (e) {
      log('❌ Money Idea by ID DioException:');
      log('  - Type: ${e.type}');
      log('  - Status Code: ${e.response?.statusCode}');
      log('  - Message: ${e.message}');
      log('  - Response Data: ${e.response?.data}');
      log('  - Request Headers: ${e.requestOptions.headers}');
      log('  - Request URL: ${e.requestOptions.uri}');
      
      if (e.type == DioExceptionType.connectionTimeout ||
          e.type == DioExceptionType.receiveTimeout ||
          e.type == DioExceptionType.sendTimeout) {
        throw NetworkException('Network timeout occurred');
      } else if (e.response?.statusCode == 401) {
        throw ServerException('Authentication required. Please login again.');
      } else if (e.response?.statusCode == 404) {
        throw NotFoundException('Idea not found');
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
  Future<IdeaEntity> getIdeaBySlug(String slug) async {
    try {
      log('🔍 Money Idea by Slug API Request: /money/ideas/slug/$slug');

      final response = await _dio.get('/money/ideas/slug/$slug');

      if (response.statusCode == 200) {
        final data = response.data;
        if (data['success'] == true) {
          return IdeaModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['error'] ?? data['message'] ?? 'Failed to fetch idea');
        }
      } else if (response.statusCode == 404) {
        throw NotFoundException('Idea not found');
      } else {
        throw ServerException('Failed to fetch idea with status ${response.statusCode}');
      }
    } on DioException catch (e) {
      log('❌ Money Idea by Slug DioException:');
      log('  - Type: ${e.type}');
      log('  - Status Code: ${e.response?.statusCode}');
      log('  - Message: ${e.message}');
      log('  - Response Data: ${e.response?.data}');
      log('  - Request Headers: ${e.requestOptions.headers}');
      log('  - Request URL: ${e.requestOptions.uri}');
      
      if (e.type == DioExceptionType.connectionTimeout ||
          e.type == DioExceptionType.receiveTimeout ||
          e.type == DioExceptionType.sendTimeout) {
        throw NetworkException('Network timeout occurred');
      } else if (e.response?.statusCode == 401) {
        throw ServerException('Authentication required. Please login again.');
      } else if (e.response?.statusCode == 404) {
        throw NotFoundException('Idea not found');
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
  Future<IdeaEntity> createIdea({
    required String title,
    required String slug,
    required String document,
    String? description,
    required bool featured,
    required bool visible,
    required bool public,
    required int order,
  }) async {
    try {
      log('🔍 Money Create Idea API Request: /money/ideas');

      final response = await _dio.post(
        '/money/ideas',
        data: {
          'title': title,
          'slug': slug,
          'document': document,
          if (description != null) 'description': description,
          'featured': featured,
          'visible': visible,
          'public': public,
          'order': order,
        },
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = response.data;
        if (data['success'] == true) {
          return IdeaModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['error'] ?? data['message'] ?? 'Failed to create idea');
        }
      } else if (response.statusCode == 422) {
        final data = response.data;
        throw ValidationException(data['error'] ?? data['message'] ?? 'Validation failed');
      } else {
        throw ServerException('Failed to create idea with status ${response.statusCode}');
      }
    } on DioException catch (e) {
      log('❌ Money Create Idea DioException:');
      log('  - Type: ${e.type}');
      log('  - Status Code: ${e.response?.statusCode}');
      log('  - Message: ${e.message}');
      log('  - Response Data: ${e.response?.data}');
      log('  - Request Headers: ${e.requestOptions.headers}');
      log('  - Request URL: ${e.requestOptions.uri}');
      
      if (e.type == DioExceptionType.connectionTimeout ||
          e.type == DioExceptionType.receiveTimeout ||
          e.type == DioExceptionType.sendTimeout) {
        throw NetworkException('Network timeout occurred');
      } else if (e.response?.statusCode == 401) {
        throw ServerException('Authentication required. Please login again.');
      } else if (e.response?.statusCode == 404) {
        throw NotFoundException('Idea not found');
      } else if (e.response?.statusCode == 422) {
        final data = e.response?.data;
        throw ValidationException(data?['error'] ?? data?['message'] ?? 'Validation failed');
      } else {
        throw ServerException('Network error: ${e.message}');
      }
    } catch (e) {
      if (e is ServerException || e is NetworkException || e is NotFoundException || e is ValidationException) {
        rethrow;
      }
      throw ServerException('Unexpected error: $e');
    }
  }

  @override
  Future<IdeaEntity> updateIdea({
    required String id,
    String? title,
    String? slug,
    String? document,
    String? description,
    bool? featured,
    bool? visible,
    bool? public,
    int? order,
  }) async {
    try {
      log('🔍 Money Update Idea API Request: /money/ideas/$id');

      final response = await _dio.patch(
        '/money/ideas/$id',
        data: {
          if (title != null) 'title': title,
          if (slug != null) 'slug': slug,
          if (document != null) 'document': document,
          if (description != null) 'description': description,
          if (featured != null) 'featured': featured,
          if (visible != null) 'visible': visible,
          if (public != null) 'public': public,
          if (order != null) 'order': order,
        },
      );

      if (response.statusCode == 200) {
        final data = response.data;
        if (data['success'] == true) {
          return IdeaModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['error'] ?? data['message'] ?? 'Failed to update idea');
        }
      } else if (response.statusCode == 404) {
        throw NotFoundException('Idea not found');
      } else if (response.statusCode == 422) {
        final data = response.data;
        throw ValidationException(data['error'] ?? data['message'] ?? 'Validation failed');
      } else {
        throw ServerException('Failed to update idea with status ${response.statusCode}');
      }
    } on DioException catch (e) {
      log('❌ Money Update Idea DioException:');
      log('  - Type: ${e.type}');
      log('  - Status Code: ${e.response?.statusCode}');
      log('  - Message: ${e.message}');
      log('  - Response Data: ${e.response?.data}');
      log('  - Request Headers: ${e.requestOptions.headers}');
      log('  - Request URL: ${e.requestOptions.uri}');
      
      if (e.type == DioExceptionType.connectionTimeout ||
          e.type == DioExceptionType.receiveTimeout ||
          e.type == DioExceptionType.sendTimeout) {
        throw NetworkException('Network timeout occurred');
      } else if (e.response?.statusCode == 401) {
        throw ServerException('Authentication required. Please login again.');
      } else if (e.response?.statusCode == 404) {
        throw NotFoundException('Idea not found');
      } else if (e.response?.statusCode == 422) {
        final data = e.response?.data;
        throw ValidationException(data?['error'] ?? data?['message'] ?? 'Validation failed');
      } else {
        throw ServerException('Network error: ${e.message}');
      }
    } catch (e) {
      if (e is ServerException || e is NetworkException || e is NotFoundException || e is ValidationException) {
        rethrow;
      }
      throw ServerException('Unexpected error: $e');
    }
  }

  @override
  Future<void> deleteIdea(String id) async {
    try {
      log('🔍 Money Delete Idea API Request: /money/ideas/$id');

      final response = await _dio.delete('/money/ideas/$id');

      if (response.statusCode != 200 && response.statusCode != 204) {
        if (response.statusCode == 404) {
          throw NotFoundException('Idea not found');
        } else {
          throw ServerException('Failed to delete idea with status ${response.statusCode}');
        }
      }
    } on DioException catch (e) {
      log('❌ Money Delete Idea DioException:');
      log('  - Type: ${e.type}');
      log('  - Status Code: ${e.response?.statusCode}');
      log('  - Message: ${e.message}');
      log('  - Response Data: ${e.response?.data}');
      log('  - Request Headers: ${e.requestOptions.headers}');
      log('  - Request URL: ${e.requestOptions.uri}');
      
      if (e.type == DioExceptionType.connectionTimeout ||
          e.type == DioExceptionType.receiveTimeout ||
          e.type == DioExceptionType.sendTimeout) {
        throw NetworkException('Network timeout occurred');
      } else if (e.response?.statusCode == 401) {
        throw ServerException('Authentication required. Please login again.');
      } else if (e.response?.statusCode == 404) {
        throw NotFoundException('Idea not found');
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

  // AI Chats Implementation
  @override
  Future<List<AiChatEntity>> getAiChats({
    int? page,
    int? limit,
    String? ideaNodeId,
    String? agent,
    bool? archived,
    bool? visible,
    String? search,
    String? sortBy,
    String? sortOrder,
  }) async {
    try {
      final queryParams = <String, dynamic>{};
      if (page != null) queryParams['page'] = page;
      if (limit != null) queryParams['limit'] = limit;
      if (ideaNodeId != null) queryParams['ideaNodeId'] = ideaNodeId;
      if (agent != null) queryParams['agent'] = agent;
      if (archived != null) queryParams['archived'] = archived;
      if (visible != null) queryParams['visible'] = visible;
      if (search != null && search.isNotEmpty) queryParams['search'] = search;
      if (sortBy != null) queryParams['sortBy'] = sortBy;
      if (sortOrder != null) queryParams['sortOrder'] = sortOrder;

      log('🔍 Money AI Chats API Request: /money/ai-chats');
      log('🔍 Query Parameters: $queryParams');

      final response = await _dio.get(
        '/money/ai-chats',
        queryParameters: queryParams,
      );

      log('📡 Money AI Chats API Response Status: ${response.statusCode}');
      log('📡 Money AI Chats API Response Headers: ${response.headers}');
      log('📡 Money AI Chats API Response Body: ${response.data.toString().substring(0, response.data.toString().length > 500 ? 500 : response.data.toString().length)}...');

      if (response.statusCode == 200) {
        final data = response.data;
        if (data['success'] == true) {
          // Money API returns data directly, not wrapped in 'chats' key
          final chats = (data['data'] as List)
              .map((chatJson) => AiChatModel.fromJson(chatJson).toEntity())
              .toList();
          return chats;
        } else {
          throw ServerException(data['error'] ?? data['message'] ?? 'Failed to fetch AI chats');
        }
      } else {
        throw ServerException('Failed to fetch AI chats with status ${response.statusCode}');
      }
    } on DioException catch (e) {
      log('❌ Money AI Chats DioException:');
      log('  - Type: ${e.type}');
      log('  - Status Code: ${e.response?.statusCode}');
      log('  - Message: ${e.message}');
      log('  - Response Data: ${e.response?.data}');
      log('  - Request Headers: ${e.requestOptions.headers}');
      log('  - Request URL: ${e.requestOptions.uri}');
      
      if (e.type == DioExceptionType.connectionTimeout ||
          e.type == DioExceptionType.receiveTimeout ||
          e.type == DioExceptionType.sendTimeout) {
        throw NetworkException('Network timeout occurred');
      } else if (e.response?.statusCode == 401) {
        throw ServerException('Authentication required. Please login again.');
      } else if (e.response?.statusCode == 404) {
        throw NotFoundException('AI chats not found');
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
  Future<AiChatEntity> getAiChatById(String id) async {
    try {
      log('🔍 Money AI Chat by ID API Request: /money/ai-chats/$id');

      final response = await _dio.get('/money/ai-chats/$id');

      if (response.statusCode == 200) {
        final data = response.data;
        if (data['success'] == true) {
          return AiChatModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['error'] ?? data['message'] ?? 'Failed to fetch AI chat');
        }
      } else if (response.statusCode == 404) {
        throw NotFoundException('AI chat not found');
      } else {
        throw ServerException('Failed to fetch AI chat with status ${response.statusCode}');
      }
    } on DioException catch (e) {
      log('❌ Money AI Chat by ID DioException:');
      log('  - Type: ${e.type}');
      log('  - Status Code: ${e.response?.statusCode}');
      log('  - Message: ${e.message}');
      log('  - Response Data: ${e.response?.data}');
      log('  - Request Headers: ${e.requestOptions.headers}');
      log('  - Request URL: ${e.requestOptions.uri}');
      
      if (e.type == DioExceptionType.connectionTimeout ||
          e.type == DioExceptionType.receiveTimeout ||
          e.type == DioExceptionType.sendTimeout) {
        throw NetworkException('Network timeout occurred');
      } else if (e.response?.statusCode == 401) {
        throw ServerException('Authentication required. Please login again.');
      } else if (e.response?.statusCode == 404) {
        throw NotFoundException('AI chat not found');
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
  Future<AiChatEntity> createAiChat({
    required String title,
    String? ideaNodeId,
    required String agent,
    String? model,
    String? systemPrompt,
    required double temperature,
    int? maxTokens,
    required bool visible,
    required bool archived,
  }) async {
    try {
      log('🔍 Money Create AI Chat API Request: /money/ai-chats');

      final response = await _dio.post(
        '/money/ai-chats',
        data: {
          'title': title,
          if (ideaNodeId != null) 'ideaNodeId': ideaNodeId,
          'agent': agent,
          if (model != null) 'model': model,
          if (systemPrompt != null) 'systemPrompt': systemPrompt,
          'temperature': temperature,
          if (maxTokens != null) 'maxTokens': maxTokens,
          'visible': visible,
          'archived': archived,
        },
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = response.data;
        if (data['success'] == true) {
          return AiChatModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['error'] ?? data['message'] ?? 'Failed to create AI chat');
        }
      } else if (response.statusCode == 422) {
        final data = response.data;
        throw ValidationException(data['error'] ?? data['message'] ?? 'Validation failed');
      } else {
        throw ServerException('Failed to create AI chat with status ${response.statusCode}');
      }
    } on DioException catch (e) {
      log('❌ Money Create AI Chat DioException:');
      log('  - Type: ${e.type}');
      log('  - Status Code: ${e.response?.statusCode}');
      log('  - Message: ${e.message}');
      log('  - Response Data: ${e.response?.data}');
      log('  - Request Headers: ${e.requestOptions.headers}');
      log('  - Request URL: ${e.requestOptions.uri}');
      
      if (e.type == DioExceptionType.connectionTimeout ||
          e.type == DioExceptionType.receiveTimeout ||
          e.type == DioExceptionType.sendTimeout) {
        throw NetworkException('Network timeout occurred');
      } else if (e.response?.statusCode == 401) {
        throw ServerException('Authentication required. Please login again.');
      } else if (e.response?.statusCode == 404) {
        throw NotFoundException('AI chat not found');
      } else if (e.response?.statusCode == 422) {
        final data = e.response?.data;
        throw ValidationException(data?['error'] ?? data?['message'] ?? 'Validation failed');
      } else {
        throw ServerException('Network error: ${e.message}');
      }
    } catch (e) {
      if (e is ServerException || e is NetworkException || e is NotFoundException || e is ValidationException) {
        rethrow;
      }
      throw ServerException('Unexpected error: $e');
    }
  }

  @override
  Future<AiChatEntity> updateAiChat({
    required String id,
    String? title,
    String? ideaNodeId,
    String? agent,
    String? model,
    String? systemPrompt,
    double? temperature,
    int? maxTokens,
    bool? visible,
    bool? archived,
  }) async {
    try {
      log('🔍 Money Update AI Chat API Request: /money/ai-chats/$id');

      final response = await _dio.patch(
        '/money/ai-chats/$id',
        data: {
          if (title != null) 'title': title,
          if (ideaNodeId != null) 'ideaNodeId': ideaNodeId,
          if (agent != null) 'agent': agent,
          if (model != null) 'model': model,
          if (systemPrompt != null) 'systemPrompt': systemPrompt,
          if (temperature != null) 'temperature': temperature,
          if (maxTokens != null) 'maxTokens': maxTokens,
          if (visible != null) 'visible': visible,
          if (archived != null) 'archived': archived,
        },
      );

      if (response.statusCode == 200) {
        final data = response.data;
        if (data['success'] == true) {
          return AiChatModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['error'] ?? data['message'] ?? 'Failed to update AI chat');
        }
      } else if (response.statusCode == 404) {
        throw NotFoundException('AI chat not found');
      } else if (response.statusCode == 422) {
        final data = response.data;
        throw ValidationException(data['error'] ?? data['message'] ?? 'Validation failed');
      } else {
        throw ServerException('Failed to update AI chat with status ${response.statusCode}');
      }
    } on DioException catch (e) {
      log('❌ Money Update AI Chat DioException:');
      log('  - Type: ${e.type}');
      log('  - Status Code: ${e.response?.statusCode}');
      log('  - Message: ${e.message}');
      log('  - Response Data: ${e.response?.data}');
      log('  - Request Headers: ${e.requestOptions.headers}');
      log('  - Request URL: ${e.requestOptions.uri}');
      
      if (e.type == DioExceptionType.connectionTimeout ||
          e.type == DioExceptionType.receiveTimeout ||
          e.type == DioExceptionType.sendTimeout) {
        throw NetworkException('Network timeout occurred');
      } else if (e.response?.statusCode == 401) {
        throw ServerException('Authentication required. Please login again.');
      } else if (e.response?.statusCode == 404) {
        throw NotFoundException('AI chat not found');
      } else if (e.response?.statusCode == 422) {
        final data = e.response?.data;
        throw ValidationException(data?['error'] ?? data?['message'] ?? 'Validation failed');
      } else {
        throw ServerException('Network error: ${e.message}');
      }
    } catch (e) {
      if (e is ServerException || e is NetworkException || e is NotFoundException || e is ValidationException) {
        rethrow;
      }
      throw ServerException('Unexpected error: $e');
    }
  }

  @override
  Future<void> deleteAiChat(String id) async {
    try {
      log('🔍 Money Delete AI Chat API Request: /money/ai-chats/$id');

      final response = await _dio.delete('/money/ai-chats/$id');

      if (response.statusCode != 200 && response.statusCode != 204) {
        if (response.statusCode == 404) {
          throw NotFoundException('AI chat not found');
        } else {
          throw ServerException('Failed to delete AI chat with status ${response.statusCode}');
        }
      }
    } on DioException catch (e) {
      log('❌ Money Delete AI Chat DioException:');
      log('  - Type: ${e.type}');
      log('  - Status Code: ${e.response?.statusCode}');
      log('  - Message: ${e.message}');
      log('  - Response Data: ${e.response?.data}');
      log('  - Request Headers: ${e.requestOptions.headers}');
      log('  - Request URL: ${e.requestOptions.uri}');
      
      if (e.type == DioExceptionType.connectionTimeout ||
          e.type == DioExceptionType.receiveTimeout ||
          e.type == DioExceptionType.sendTimeout) {
        throw NetworkException('Network timeout occurred');
      } else if (e.response?.statusCode == 401) {
        throw ServerException('Authentication required. Please login again.');
      } else if (e.response?.statusCode == 404) {
        throw NotFoundException('AI chat not found');
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
  Future<AiChatEntity> sendMessage({
    required String chatId,
    required String message,
  }) async {
    try {
      log('🔍 Money Send Message API Request: /money/ai-chats/$chatId/messages');

      final response = await _dio.post(
        '/money/ai-chats/$chatId/messages',
        data: {
          'message': message,
        },
      );

      if (response.statusCode == 200) {
        final data = response.data;
        if (data['success'] == true) {
          return AiChatModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['error'] ?? data['message'] ?? 'Failed to send message');
        }
      } else if (response.statusCode == 404) {
        throw NotFoundException('AI chat not found');
      } else if (response.statusCode == 422) {
        final data = response.data;
        throw ValidationException(data['error'] ?? data['message'] ?? 'Validation failed');
      } else {
        throw ServerException('Failed to send message with status ${response.statusCode}');
      }
    } on DioException catch (e) {
      log('❌ Money Send Message DioException:');
      log('  - Type: ${e.type}');
      log('  - Status Code: ${e.response?.statusCode}');
      log('  - Message: ${e.message}');
      log('  - Response Data: ${e.response?.data}');
      log('  - Request Headers: ${e.requestOptions.headers}');
      log('  - Request URL: ${e.requestOptions.uri}');
      
      if (e.type == DioExceptionType.connectionTimeout ||
          e.type == DioExceptionType.receiveTimeout ||
          e.type == DioExceptionType.sendTimeout) {
        throw NetworkException('Network timeout occurred');
      } else if (e.response?.statusCode == 401) {
        throw ServerException('Authentication required. Please login again.');
      } else if (e.response?.statusCode == 404) {
        throw NotFoundException('AI chat not found');
      } else if (e.response?.statusCode == 422) {
        final data = e.response?.data;
        throw ValidationException(data?['error'] ?? data?['message'] ?? 'Validation failed');
      } else {
        throw ServerException('Network error: ${e.message}');
      }
    } catch (e) {
      if (e is ServerException || e is NetworkException || e is NotFoundException || e is ValidationException) {
        rethrow;
      }
      throw ServerException('Unexpected error: $e');
    }
  }

  @override
  Future<List<ChatMessageEntity>> getChatMessages(String chatId) async {
    try {
      log('🔍 Money Get Chat Messages API Request: /money/ai-chats/$chatId/messages');

      final response = await _dio.get('/money/ai-chats/$chatId/messages');

      if (response.statusCode == 200) {
        final data = response.data;
        if (data['success'] == true) {
          // For now, return an empty list since we don't have a ChatMessageModel yet
          // TODO: Implement ChatMessageModel and proper deserialization
          return [];
        } else {
          throw ServerException(data['error'] ?? data['message'] ?? 'Failed to fetch messages');
        }
      } else if (response.statusCode == 404) {
        throw NotFoundException('AI chat not found');
      } else {
        throw ServerException('Failed to fetch messages with status ${response.statusCode}');
      }
    } on DioException catch (e) {
      log('❌ Money Get Chat Messages DioException:');
      log('  - Type: ${e.type}');
      log('  - Status Code: ${e.response?.statusCode}');
      log('  - Message: ${e.message}');
      log('  - Response Data: ${e.response?.data}');
      log('  - Request Headers: ${e.requestOptions.headers}');
      log('  - Request URL: ${e.requestOptions.uri}');
      
      if (e.type == DioExceptionType.connectionTimeout ||
          e.type == DioExceptionType.receiveTimeout ||
          e.type == DioExceptionType.sendTimeout) {
        throw NetworkException('Network timeout occurred');
      } else if (e.response?.statusCode == 401) {
        throw ServerException('Authentication required. Please login again.');
      } else if (e.response?.statusCode == 404) {
        throw NotFoundException('AI chat not found');
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
}
