import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/ai_chat_entity.dart';
import '../repositories/money_repository.dart';

class GetChatMessagesUseCase {
  final MoneyRepository repository;

  GetChatMessagesUseCase(this.repository);

  Future<Either<Failure, List<ChatMessageEntity>>> call(String chatId) async {
    return await repository.getChatMessages(chatId);
  }
}
