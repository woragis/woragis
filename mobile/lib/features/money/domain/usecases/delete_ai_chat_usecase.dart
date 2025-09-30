import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../repositories/money_repository.dart';

class DeleteAiChatUseCase {
  final MoneyRepository repository;

  DeleteAiChatUseCase(this.repository);

  Future<Either<Failure, void>> call(String id) async {
    return await repository.deleteAiChat(id);
  }
}
