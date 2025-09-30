import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/idea_entity.dart';
import '../repositories/money_repository.dart';

class GetIdeaByIdUseCase {
  final MoneyRepository repository;

  GetIdeaByIdUseCase(this.repository);

  Future<Either<Failure, IdeaEntity>> call(String id) async {
    return await repository.getIdeaById(id);
  }
}
