import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/ai_chat_entity.dart';
import '../repositories/money_repository.dart';

class GetAiChatsUseCase {
  final MoneyRepository repository;

  GetAiChatsUseCase(this.repository);

  Future<Either<Failure, List<AiChatEntity>>> call({
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
    return await repository.getAiChats(
      page: page,
      limit: limit,
      ideaNodeId: ideaNodeId,
      agent: agent,
      archived: archived,
      visible: visible,
      search: search,
      sortBy: sortBy,
      sortOrder: sortOrder,
    );
  }
}
