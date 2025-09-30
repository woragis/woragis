import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/experience_entity.dart';
import '../repositories/experience_repository.dart';

class GetExperienceListUseCase {
  final ExperienceRepository repository;

  GetExperienceListUseCase(this.repository);

  Future<Either<Failure, List<ExperienceEntity>>> call(GetExperienceListParams params) async {
    return await repository.getExperienceList(
      page: params.page,
      limit: params.limit,
      company: params.company,
      visible: params.visible,
      search: params.search,
    );
  }
}

class GetExperienceListParams {
  final int? page;
  final int? limit;
  final String? company;
  final bool? visible;
  final String? search;
  final String? sortBy;
  final String? sortOrder;

  GetExperienceListParams({
    this.page,
    this.limit,
    this.company,
    this.visible,
    this.search,
    this.sortBy,
    this.sortOrder,
  });
}
