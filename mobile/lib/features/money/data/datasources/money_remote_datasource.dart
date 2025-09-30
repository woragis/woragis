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
    bool? visible,
    String? search,
    String? sortBy,
    String? sortOrder,
  });

  Future<IdeaEntity> getIdeaById(String id);
  Future<IdeaEntity> createIdea({
    required String title,
    required String description,
    String? category,
    String? targetAudience,
    String? businessModel,
    String? marketSize,
    String? competition,
    String? revenueProjection,
    String? timeline,
    String? resources,
    String? risks,
    String? opportunities,
    String? nextSteps,
    required bool visible,
    required int order,
  });
  Future<IdeaEntity> updateIdea({
    required String id,
    String? title,
    String? description,
    String? category,
    String? targetAudience,
    String? businessModel,
    String? marketSize,
    String? competition,
    String? revenueProjection,
    String? timeline,
    String? resources,
    String? risks,
    String? opportunities,
    String? nextSteps,
    bool? visible,
    int? order,
  });
  Future<void> deleteIdea(String id);

  // AI Chats
  Future<List<AiChatEntity>> getAiChats({
    int? page,
    int? limit,
    String? search,
    String? sortBy,
    String? sortOrder,
  });

  Future<AiChatEntity> getAiChatById(String id);
  Future<AiChatEntity> createAiChat({
    required String title,
    String? description,
    required String initialMessage,
  });
  Future<AiChatEntity> updateAiChat({
    required String id,
    String? title,
    String? description,
  });
  Future<void> deleteAiChat(String id);
  Future<AiChatEntity> sendMessage({
    required String chatId,
    required String message,
  });
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
    bool? visible,
    String? search,
    String? sortBy,
    String? sortOrder,
  }) async {
    try {
      final queryParams = <String, String>{};
      if (page != null) queryParams['page'] = page.toString();
      if (limit != null) queryParams['limit'] = limit.toString();
      if (visible != null) queryParams['visible'] = visible.toString();
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
  Future<IdeaEntity> createIdea({
    required String title,
    required String description,
    String? category,
    String? targetAudience,
    String? businessModel,
    String? marketSize,
    String? competition,
    String? revenueProjection,
    String? timeline,
    String? resources,
    String? risks,
    String? opportunities,
    String? nextSteps,
    required bool visible,
    required int order,
  }) async {
    try {
      final response = await client.post(
        Uri.parse('$baseUrl/money/ideas'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'title': title,
          'description': description,
          if (category != null) 'category': category,
          if (targetAudience != null) 'targetAudience': targetAudience,
          if (businessModel != null) 'businessModel': businessModel,
          if (marketSize != null) 'marketSize': marketSize,
          if (competition != null) 'competition': competition,
          if (revenueProjection != null) 'revenueProjection': revenueProjection,
          if (timeline != null) 'timeline': timeline,
          if (resources != null) 'resources': resources,
          if (risks != null) 'risks': risks,
          if (opportunities != null) 'opportunities': opportunities,
          if (nextSteps != null) 'nextSteps': nextSteps,
          'visible': visible,
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
    String? description,
    String? category,
    String? targetAudience,
    String? businessModel,
    String? marketSize,
    String? competition,
    String? revenueProjection,
    String? timeline,
    String? resources,
    String? risks,
    String? opportunities,
    String? nextSteps,
    bool? visible,
    int? order,
  }) async {
    try {
      final response = await client.put(
        Uri.parse('$baseUrl/money/ideas/$id'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          if (title != null) 'title': title,
          if (description != null) 'description': description,
          if (category != null) 'category': category,
          if (targetAudience != null) 'targetAudience': targetAudience,
          if (businessModel != null) 'businessModel': businessModel,
          if (marketSize != null) 'marketSize': marketSize,
          if (competition != null) 'competition': competition,
          if (revenueProjection != null) 'revenueProjection': revenueProjection,
          if (timeline != null) 'timeline': timeline,
          if (resources != null) 'resources': resources,
          if (risks != null) 'risks': risks,
          if (opportunities != null) 'opportunities': opportunities,
          if (nextSteps != null) 'nextSteps': nextSteps,
          if (visible != null) 'visible': visible,
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
    String? search,
    String? sortBy,
    String? sortOrder,
  }) async {
    try {
      final queryParams = <String, String>{};
      if (page != null) queryParams['page'] = page.toString();
      if (limit != null) queryParams['limit'] = limit.toString();
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
    String? description,
    required String initialMessage,
  }) async {
    try {
      final response = await client.post(
        Uri.parse('$baseUrl/money/ai-chats'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'title': title,
          if (description != null) 'description': description,
          'initialMessage': initialMessage,
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
    String? description,
  }) async {
    try {
      final response = await client.put(
        Uri.parse('$baseUrl/money/ai-chats/$id'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          if (title != null) 'title': title,
          if (description != null) 'description': description,
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
}
