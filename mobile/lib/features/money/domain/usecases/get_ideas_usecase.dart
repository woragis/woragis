import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/idea_entity.dart';
import '../repositories/money_repository.dart';

class GetIdeasUseCase {
  final MoneyRepository repository;

  GetIdeasUseCase(this.repository);

  Future<Either<Failure, List<IdeaEntity>>> call(GetIdeasParams params) async {
    return await repository.getIdeas(
      page: params.page,
      limit: params.limit,
      featured: params.featured,
      visible: params.visible,
      public: params.public,
      search: params.search,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
    );
  }
}

class GetIdeasParams {
  final int? page;
  final int? limit;
  final bool? featured;
  final bool? visible;
  final bool? public;
  final String? search;
  final String? sortBy;
  final String? sortOrder;

  GetIdeasParams({
    this.page,
    this.limit,
    this.featured,
    this.visible,
    this.public,
    this.search,
    this.sortBy,
    this.sortOrder,
  });
}
