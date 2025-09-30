import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/framework_entity.dart';
import '../repositories/frameworks_repository.dart';

class GetFrameworksUseCase {
  final FrameworksRepository repository;

  GetFrameworksUseCase(this.repository);

  Future<Either<Failure, List<FrameworkEntity>>> call(GetFrameworksParams params) async {
    return await repository.getFrameworks(
      page: params.page,
      limit: params.limit,
      visible: params.visible,
      public: params.public,
      type: params.type,
      search: params.search,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
    );
  }
}

class GetFrameworksParams {
  final int? page;
  final int? limit;
  final bool? visible;
  final bool? public;
  final String? type;
  final String? search;
  final String? sortBy;
  final String? sortOrder;

  GetFrameworksParams({
    this.page,
    this.limit,
    this.visible,
    this.public,
    this.type,
    this.search,
    this.sortBy,
    this.sortOrder,
  });
}
