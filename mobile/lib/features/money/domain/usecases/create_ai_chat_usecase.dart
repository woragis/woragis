import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/ai_chat_entity.dart';
import '../repositories/money_repository.dart';

class CreateAiChatUseCase {
  final MoneyRepository repository;

  CreateAiChatUseCase(this.repository);

  Future<Either<Failure, AiChatEntity>> call({
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
    return await repository.createAiChat(
      title: title,
      ideaNodeId: ideaNodeId,
      agent: agent,
      model: model,
      systemPrompt: systemPrompt,
      temperature: temperature,
      maxTokens: maxTokens,
      visible: visible,
      archived: archived,
    );
  }
}
