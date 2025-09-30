import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../../../core/error/exceptions.dart';
import '../../domain/entities/idea_entity.dart';
import '../../domain/entities/ai_chat_entity.dart';
import '../models/idea_model.dart';
import '../models/ai_chat_model.dart';

abstract class MoneyRemoteDataSource {
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

class MoneyRemoteDataSourceImpl implements MoneyRemoteDataSource {
  final http.Client client;
  final String baseUrl;

  MoneyRemoteDataSourceImpl({
    required this.client,
    required this.baseUrl,
  });

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
      final queryParams = <String, String>{};
      if (page != null) queryParams['page'] = page.toString();
      if (limit != null) queryParams['limit'] = limit.toString();
      if (featured != null) queryParams['featured'] = featured.toString();
      if (visible != null) queryParams['visible'] = visible.toString();
      if (public != null) queryParams['public'] = public.toString();
      if (search != null && search.isNotEmpty) queryParams['search'] = search;
      if (sortBy != null) queryParams['sortBy'] = sortBy;
      if (sortOrder != null) queryParams['sortOrder'] = sortOrder;

      final uri = Uri.parse('$baseUrl/money/ideas').replace(queryParameters: queryParams);
      final response = await client.get(uri);

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          final ideas = (data['data']['ideas'] as List)
              .map((ideaJson) => IdeaModel.fromJson(ideaJson).toEntity())
              .toList();
          return ideas;
        } else {
          throw ServerException(data['message'] ?? 'Failed to fetch ideas');
        }
      } else {
        throw ServerException('Failed to fetch ideas with status ${response.statusCode}');
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
  Future<IdeaEntity> getIdeaById(String id) async {
    try {
      final response = await client.get(Uri.parse('$baseUrl/money/ideas/$id'));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return IdeaModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['message'] ?? 'Failed to fetch idea');
        }
      } else if (response.statusCode == 404) {
        throw NotFoundException('Idea not found');
      } else {
        throw ServerException('Failed to fetch idea with status ${response.statusCode}');
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
  Future<IdeaEntity> getIdeaBySlug(String slug) async {
    try {
      final response = await client.get(Uri.parse('$baseUrl/money/ideas/slug/$slug'));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return IdeaModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['message'] ?? 'Failed to fetch idea');
        }
      } else if (response.statusCode == 404) {
        throw NotFoundException('Idea not found');
      } else {
        throw ServerException('Failed to fetch idea with status ${response.statusCode}');
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
      final response = await client.post(
        Uri.parse('$baseUrl/money/ideas'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'title': title,
          'slug': slug,
          'document': document,
          if (description != null) 'description': description,
          'featured': featured,
          'visible': visible,
          'public': public,
          'order': order,
        }),
      );

      if (response.statusCode == 201) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return IdeaModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['message'] ?? 'Failed to create idea');
        }
      } else if (response.statusCode == 422) {
        final data = json.decode(response.body);
        throw ValidationException(data['message'] ?? 'Validation failed');
      } else {
        throw ServerException('Failed to create idea with status ${response.statusCode}');
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
      final response = await client.put(
        Uri.parse('$baseUrl/money/ideas/$id'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          if (title != null) 'title': title,
          if (slug != null) 'slug': slug,
          if (document != null) 'document': document,
          if (description != null) 'description': description,
          if (featured != null) 'featured': featured,
          if (visible != null) 'visible': visible,
          if (public != null) 'public': public,
          if (order != null) 'order': order,
        }),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return IdeaModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['message'] ?? 'Failed to update idea');
        }
      } else if (response.statusCode == 404) {
        throw NotFoundException('Idea not found');
      } else if (response.statusCode == 422) {
        final data = json.decode(response.body);
        throw ValidationException(data['message'] ?? 'Validation failed');
      } else {
        throw ServerException('Failed to update idea with status ${response.statusCode}');
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
  Future<void> deleteIdea(String id) async {
    try {
      final response = await client.delete(Uri.parse('$baseUrl/money/ideas/$id'));

      if (response.statusCode != 200 && response.statusCode != 204) {
        if (response.statusCode == 404) {
          throw NotFoundException('Idea not found');
        } else {
          throw ServerException('Failed to delete idea with status ${response.statusCode}');
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
      final queryParams = <String, String>{};
      if (page != null) queryParams['page'] = page.toString();
      if (limit != null) queryParams['limit'] = limit.toString();
      if (ideaNodeId != null) queryParams['ideaNodeId'] = ideaNodeId;
      if (agent != null) queryParams['agent'] = agent;
      if (archived != null) queryParams['archived'] = archived.toString();
      if (visible != null) queryParams['visible'] = visible.toString();
      if (search != null && search.isNotEmpty) queryParams['search'] = search;
      if (sortBy != null) queryParams['sortBy'] = sortBy;
      if (sortOrder != null) queryParams['sortOrder'] = sortOrder;

      final uri = Uri.parse('$baseUrl/money/ai-chats').replace(queryParameters: queryParams);
      final response = await client.get(uri);

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          final chats = (data['data']['chats'] as List)
              .map((chatJson) => AiChatModel.fromJson(chatJson).toEntity())
              .toList();
          return chats;
        } else {
          throw ServerException(data['message'] ?? 'Failed to fetch AI chats');
        }
      } else {
        throw ServerException('Failed to fetch AI chats with status ${response.statusCode}');
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
  Future<AiChatEntity> getAiChatById(String id) async {
    try {
      final response = await client.get(Uri.parse('$baseUrl/money/ai-chats/$id'));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return AiChatModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['message'] ?? 'Failed to fetch AI chat');
        }
      } else if (response.statusCode == 404) {
        throw NotFoundException('AI chat not found');
      } else {
        throw ServerException('Failed to fetch AI chat with status ${response.statusCode}');
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
      final response = await client.post(
        Uri.parse('$baseUrl/money/ai-chats'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'title': title,
          if (ideaNodeId != null) 'ideaNodeId': ideaNodeId,
          'agent': agent,
          if (model != null) 'model': model,
          if (systemPrompt != null) 'systemPrompt': systemPrompt,
          'temperature': temperature,
          if (maxTokens != null) 'maxTokens': maxTokens,
          'visible': visible,
          'archived': archived,
        }),
      );

      if (response.statusCode == 201) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return AiChatModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['message'] ?? 'Failed to create AI chat');
        }
      } else if (response.statusCode == 422) {
        final data = json.decode(response.body);
        throw ValidationException(data['message'] ?? 'Validation failed');
      } else {
        throw ServerException('Failed to create AI chat with status ${response.statusCode}');
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
      final response = await client.put(
        Uri.parse('$baseUrl/money/ai-chats/$id'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          if (title != null) 'title': title,
          if (ideaNodeId != null) 'ideaNodeId': ideaNodeId,
          if (agent != null) 'agent': agent,
          if (model != null) 'model': model,
          if (systemPrompt != null) 'systemPrompt': systemPrompt,
          if (temperature != null) 'temperature': temperature,
          if (maxTokens != null) 'maxTokens': maxTokens,
          if (visible != null) 'visible': visible,
          if (archived != null) 'archived': archived,
        }),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return AiChatModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['message'] ?? 'Failed to update AI chat');
        }
      } else if (response.statusCode == 404) {
        throw NotFoundException('AI chat not found');
      } else if (response.statusCode == 422) {
        final data = json.decode(response.body);
        throw ValidationException(data['message'] ?? 'Validation failed');
      } else {
        throw ServerException('Failed to update AI chat with status ${response.statusCode}');
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
  Future<void> deleteAiChat(String id) async {
    try {
      final response = await client.delete(Uri.parse('$baseUrl/money/ai-chats/$id'));

      if (response.statusCode != 200 && response.statusCode != 204) {
        if (response.statusCode == 404) {
          throw NotFoundException('AI chat not found');
        } else {
          throw ServerException('Failed to delete AI chat with status ${response.statusCode}');
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
  Future<AiChatEntity> sendMessage({
    required String chatId,
    required String message,
  }) async {
    try {
      final response = await client.post(
        Uri.parse('$baseUrl/money/ai-chats/$chatId/messages'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'message': message,
        }),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return AiChatModel.fromJson(data['data']).toEntity();
        } else {
          throw ServerException(data['message'] ?? 'Failed to send message');
        }
      } else if (response.statusCode == 404) {
        throw NotFoundException('AI chat not found');
      } else if (response.statusCode == 422) {
        final data = json.decode(response.body);
        throw ValidationException(data['message'] ?? 'Validation failed');
      } else {
        throw ServerException('Failed to send message with status ${response.statusCode}');
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
  Future<List<ChatMessageEntity>> getChatMessages(String chatId) async {
    try {
      final response = await client.get(Uri.parse('$baseUrl/money/ai-chats/$chatId/messages'));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          // For now, return an empty list since we don't have a ChatMessageModel yet
          // TODO: Implement ChatMessageModel and proper deserialization
          return [];
        } else {
          throw ServerException(data['message'] ?? 'Failed to fetch messages');
        }
      } else if (response.statusCode == 404) {
        throw NotFoundException('AI chat not found');
      } else {
        throw ServerException('Failed to fetch messages with status ${response.statusCode}');
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
}
