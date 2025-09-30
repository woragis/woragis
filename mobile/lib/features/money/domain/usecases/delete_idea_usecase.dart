import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../repositories/money_repository.dart';

class DeleteIdeaUseCase {
  final MoneyRepository repository;

  DeleteIdeaUseCase(this.repository);

  Future<Either<Failure, void>> call(String id) async {
    return await repository.deleteIdea(id);
  }
}
