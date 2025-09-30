import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/ai_chat_entity.dart';
import '../repositories/money_repository.dart';

class SendMessageUseCase {
  final MoneyRepository repository;

  SendMessageUseCase(this.repository);

  Future<Either<Failure, AiChatEntity>> call({
    required String chatId,
    required String message,
  }) async {
    return await repository.sendMessage(
      chatId: chatId,
      message: message,
    );
  }
}
