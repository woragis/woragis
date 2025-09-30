import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/ai_chat_entity.dart';
import '../repositories/money_repository.dart';

class UpdateAiChatUseCase {
  final MoneyRepository repository;

  UpdateAiChatUseCase(this.repository);

  Future<Either<Failure, AiChatEntity>> call({
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
    return await repository.updateAiChat(
      id: id,
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
