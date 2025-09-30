import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/ai_chat_entity.dart';
import '../repositories/money_repository.dart';

class GetAiChatByIdUseCase {
  final MoneyRepository repository;

  GetAiChatByIdUseCase(this.repository);

  Future<Either<Failure, AiChatEntity>> call(String id) async {
    return await repository.getAiChatById(id);
  }
}
