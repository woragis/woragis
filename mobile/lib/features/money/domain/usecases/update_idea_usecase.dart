import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/idea_entity.dart';
import '../repositories/money_repository.dart';

class UpdateIdeaUseCase {
  final MoneyRepository repository;

  UpdateIdeaUseCase(this.repository);

  Future<Either<Failure, IdeaEntity>> call({
    required String id,
    String? title,
    String? slug,
    String? document,
    String? description,
    bool? featured,
    bool? visible,
    bool? public,
    int? order,
  }) async {
    return await repository.updateIdea(
      id: id,
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
