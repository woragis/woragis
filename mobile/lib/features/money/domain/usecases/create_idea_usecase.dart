import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/idea_entity.dart';
import '../repositories/money_repository.dart';

class CreateIdeaUseCase {
  final MoneyRepository repository;

  CreateIdeaUseCase(this.repository);

  Future<Either<Failure, IdeaEntity>> call({
    required String title,
    required String slug,
    required String document,
    String? description,
    required bool featured,
    required bool visible,
    required bool public,
    required int order,
  }) async {
    return await repository.createIdea(
      title: title,
      slug: slug,
      document: document,
      description: description,
      featured: featured,
      visible: visible,
      public: public,
      order: order,
    );
  }
}
