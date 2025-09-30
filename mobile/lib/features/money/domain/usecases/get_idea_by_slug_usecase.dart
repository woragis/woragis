import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/idea_entity.dart';
import '../repositories/money_repository.dart';

class GetIdeaBySlugUseCase {
  final MoneyRepository repository;

  GetIdeaBySlugUseCase(this.repository);

  Future<Either<Failure, IdeaEntity>> call(String slug) async {
    return await repository.getIdeaBySlug(slug);
  }
}
