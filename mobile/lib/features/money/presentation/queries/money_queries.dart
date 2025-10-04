// Money Queries - Simplified version using BLoC pattern
// The BLoC pattern is already handling most of the logic,
// so we'll keep this file for future query integration if needed

import '../../domain/entities/idea_entity.dart';
import '../../domain/usecases/usecases.dart';
import '../../../../core/injection/injection_container.dart';

class MoneyQueries {
  // These methods can be used as utility functions for direct use case calls
  // when not using BLoC pattern
  
  static Future<List<IdeaEntity>> getIdeas({
    int? page,
    int? limit,
    bool? featured,
    bool? visible,
    bool? public,
    String? search,
    String? sortBy,
    String? sortOrder,
  }) async {
    final useCase = sl<GetIdeasUseCase>();
    final result = await useCase(GetIdeasParams(
      page: page,
      limit: limit,
      featured: featured,
      visible: visible,
      public: public,
      search: search,
      sortBy: sortBy,
      sortOrder: sortOrder,
    ));
    return result.fold(
      (failure) => throw Exception(failure.message),
      (ideas) => ideas,
    );
  }

  // TODO: Add more query methods as use cases are implemented
  // static Future<IdeaEntity> getIdeaById(String id) async { ... }
  // static Future<IdeaEntity> createIdea(CreateIdeaParams params) async { ... }
  // static Future<IdeaEntity> updateIdea(UpdateIdeaParams params) async { ... }
  // static Future<void> deleteIdea(String id) async { ... }
  // static Future<List<AiChatEntity>> getAiChats(GetAiChatsParams params) async { ... }
  // static Future<AiChatEntity> getAiChatById(String id) async { ... }
  // static Future<AiChatEntity> createAiChat(CreateAiChatParams params) async { ... }
  // static Future<void> sendMessage(SendMessageParams params) async { ... }
}
