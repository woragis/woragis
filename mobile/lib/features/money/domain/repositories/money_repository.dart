import 'package:dartz/dartz.dart';
import '../entities/idea_entity.dart';
import '../entities/ai_chat_entity.dart';
import '../../../../core/error/failures.dart';

abstract class MoneyRepository {
  // Idea methods
  Future<Either<Failure, List<IdeaEntity>>> getIdeas({
    int? page,
    int? limit,
    bool? featured,
    bool? visible,
    bool? public,
    String? search,
    String? sortBy,
    String? sortOrder,
  });

  Future<Either<Failure, IdeaEntity>> getIdeaById(String id);
  Future<Either<Failure, IdeaEntity>> getIdeaBySlug(String slug);

  Future<Either<Failure, IdeaEntity>> createIdea({
    required String title,
    required String slug,
    required String document,
    String? description,
    required bool featured,
    required bool visible,
    required bool public,
    required int order,
  });

  Future<Either<Failure, IdeaEntity>> updateIdea({
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

  Future<Either<Failure, void>> deleteIdea(String id);

  // AI Chat methods
  Future<Either<Failure, List<AiChatEntity>>> getAiChats({
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

  Future<Either<Failure, AiChatEntity>> getAiChatById(String id);

  Future<Either<Failure, AiChatEntity>> createAiChat({
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

  Future<Either<Failure, AiChatEntity>> updateAiChat({
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

  Future<Either<Failure, void>> deleteAiChat(String id);

  // AI Chat message methods
  Future<Either<Failure, AiChatEntity>> sendMessage({
    required String chatId,
    required String message,
  });

  Future<Either<Failure, List<ChatMessageEntity>>> getChatMessages(String chatId);

  // Offline/Cache methods
  Future<Either<Failure, List<IdeaEntity>>> getCachedIdeas();
  Future<Either<Failure, void>> cacheIdeas(List<IdeaEntity> ideas);
  Future<Either<Failure, List<AiChatEntity>>> getCachedAiChats();
  Future<Either<Failure, void>> cacheAiChats(List<AiChatEntity> aiChats);
}
