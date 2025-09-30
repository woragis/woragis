import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/education_entity.dart';
import '../repositories/education_repository.dart';

class GetEducationListUseCase {
  final EducationRepository repository;

  GetEducationListUseCase(this.repository);

  Future<Either<Failure, List<EducationEntity>>> call(GetEducationListParams params) async {
    return await repository.getEducationList(
      page: params.page,
      limit: params.limit,
      type: params.type,
      institution: params.institution,
      visible: params.visible,
      search: params.search,
    );
  }
}

class GetEducationListParams {
  final int? page;
  final int? limit;
  final String? type;
  final String? institution;
  final bool? visible;
  final String? search;
  final String? sortBy;
  final String? sortOrder;

  GetEducationListParams({
    this.page,
    this.limit,
    this.type,
    this.institution,
    this.visible,
    this.search,
    this.sortBy,
    this.sortOrder,
  });
}
